package config

import (
	"errors"
	"fmt"
	"log"
	"os"

	"github.com/cpe-nuntawut/assignment-6-unging2jeng/entity"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectDatabase() {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		getEnv("DB_HOST", "teacher-db"),
		getEnv("DB_USER", "user"),
		getEnv("DB_PASSWORD", "password"),
		getEnv("DB_NAME", "teacherdb"),
		getEnv("DB_PORT", "5432"),
	)

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	database.AutoMigrate(&entity.Role{}, &entity.Teacher{})

	db = database
	fmt.Println("Connected to teacher_db successfully")
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

func SetupDatabase() {
	seedRoles()
	SeedDataTeacher()
}

func seedRoles() {
	roles := []string{"Admin", "Instructor"}
	for _, role := range roles {
		db.FirstOrCreate(&entity.Role{}, entity.Role{Role: role})
	}
}

func SeedDataTeacher() {
	hashedPasswordAdmin, err := HashPassword("admin")
	if err != nil {
		log.Fatalf("Failed to hash admin password: %v", err)
	}
	hashedPassword, err := HashPassword("1234")
	if err != nil {
		log.Fatalf("Failed to hash teacher password: %v", err)
	}

	var adminRole, instructorRole entity.Role
	db.First(&adminRole, "role = ?", "Admin")
	db.First(&instructorRole, "role = ?", "Instructor")

	teachers := []entity.Teacher{
		{
			Title:     "",
			FirstName: "SUT",
			LastName:  "admin",
			Username:  "admin",
			Password:  hashedPasswordAdmin,
			RoleID:    adminRole.ID,
		},
		{
			Title:     "ผู้ช่วยศาสตราจารย์ ดร.",
			FirstName: "ศรัญญา",
			LastName:  "กาญจนวัฒนา",
			Username:  "S1234",
			Password:  hashedPassword,
			RoleID:    instructorRole.ID,
		},
		{
			Title:     "ผู้ช่วยศาสตราจารย์ ดร.",
			FirstName: "นันทวุฒิ",
			LastName:  "คะอังกุ",
			Username:  "A1234",
			Password:  hashedPassword,
			RoleID:    instructorRole.ID,
		},
		{
			Title:     "อาจารย์ ดร.",
			FirstName: "วิชัย",
			LastName:  "ศรีสุรักษ์",
			Username:  "B1234",
			Password:  hashedPassword,
			RoleID:    instructorRole.ID,
		},
	}

	for _, teacher := range teachers {
		var existing entity.Teacher
		err := db.Where("username = ?", teacher.Username).First(&existing).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			if err := db.Create(&teacher).Error; err != nil {
				log.Printf("Error creating teacher %s: %v\n", teacher.Username, err)
			} else {
				log.Printf("Teacher %s created successfully.\n", teacher.Username)
			}
		} else if err != nil {
			log.Printf("DB error checking teacher %s: %v\n", teacher.Username, err)
		} else {
			log.Printf("Teacher %s already exists.\n", teacher.Username)
		}
	}
}
