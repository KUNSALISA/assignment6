package config

import (
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
		getEnv("DB_HOST", "student-db"),
		getEnv("DB_USER", "user"),
		getEnv("DB_PASSWORD", "password"),
		getEnv("DB_NAME", "studentdb"),
		getEnv("DB_PORT", "5432"),
	)

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	database.AutoMigrate(&entity.Student{})

	db = database
	fmt.Println("Connected to student_db successfully")
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

func SetupDatabase() {
	students := []entity.Student{
		{
			StudentID: "B6524869",
			Name:      "นายต่อตระกูล  สืบค้า",
		},
		{
			StudentID: "B6525873",
			Name:      "นางสาวศลิษา  อัตวีระพัฒน์",
		},
		{
			StudentID: "B6525972",
			Name:      "นางสาวณิชากร  จันทร์ยุทา",
		},
	}

	for _, student := range students {
		var existingStudent entity.Student
		result := db.Where("student_id = ?", student.StudentID).First(&existingStudent)
		if result.RowsAffected == 0 {
			db.Create(&student)
		}
	}
}
