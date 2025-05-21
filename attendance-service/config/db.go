package config

import (
	"fmt"
	"log"
	"os"
	"time"

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
		getEnv("DB_HOST", "course-db"),
		getEnv("DB_USER", "user"),
		getEnv("DB_PASSWORD", "password"),
		getEnv("DB_NAME", "coursedb"),
		getEnv("DB_PORT", "5432"),
	)

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	database.AutoMigrate(&entity.Attendance{}, &entity.Status{})

	db = database
	fmt.Println("Connected to course_db successfully")
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

func SetupDatabase() {
	seedStatus()
	SeedData()
}

func seedStatus() {
	status := []string{"มาเรียน", "ป่วย", "ลา", "ขาด"}
	for _, s := range status {
		db.FirstOrCreate(&entity.Status{}, entity.Status{Status: s})
	}
}

func SeedData() {
	var statuses []entity.Status
	DB().Find(&statuses)

	statusMap := make(map[string]uint)
	for _, s := range statuses {
		statusMap[s.Status] = s.ID
	}

	date := time.Date(2024, 5, 1, 0, 0, 0, 0, time.Local)

	attendances := []entity.Attendance{
		{StudentID: 1, CourseID: 1, Date: date.Add(time.Hour * 9), StatusID: statusMap["มาเรียน"]},
		{StudentID: 1, CourseID: 2, Date: date.Add(time.Hour * 13), StatusID: statusMap["สาย"]},
		{StudentID: 1, CourseID: 3, Date: date.Add(time.Hour * 10), StatusID: statusMap["ขาด"]},
		{StudentID: 1, CourseID: 4, Date: date.Add(time.Hour * 14), StatusID: statusMap["มาเรียน"]},

		{StudentID: 2, CourseID: 1, Date: date.Add(time.Hour * 9), StatusID: statusMap["ป่วย"]},
		{StudentID: 2, CourseID: 2, Date: date.Add(time.Hour * 13), StatusID: statusMap["มาเรียน"]},
		{StudentID: 2, CourseID: 3, Date: date.Add(time.Hour * 10), StatusID: statusMap["มาเรียน"]},
		{StudentID: 2, CourseID: 4, Date: date.Add(time.Hour * 14), StatusID: statusMap["สาย"]},

		{StudentID: 3, CourseID: 1, Date: date.Add(time.Hour * 9), StatusID: statusMap["ขาด"]},
		{StudentID: 3, CourseID: 2, Date: date.Add(time.Hour * 13), StatusID: statusMap["ขาด"]},
		{StudentID: 3, CourseID: 3, Date: date.Add(time.Hour * 10), StatusID: statusMap["มาเรียน"]},
		{StudentID: 3, CourseID: 4, Date: date.Add(time.Hour * 14), StatusID: statusMap["ป่วย"]},
	}

	for _, a := range attendances {
		DB().Create(&a)
	}
}
