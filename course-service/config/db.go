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

	database.AutoMigrate(&entity.Course{})

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
	courses := []entity.Course{
		{Code: "CS101", Name: "Introduction to Computer Science", TeacherID: 4},
		{Code: "CS201", Name: "Data Structures and Algorithms", TeacherID: 3},
		{Code: "CS301", Name: "Database Systems", TeacherID: 3},
		{Code: "CS401", Name: "Software Engineering", TeacherID: 2},
	}

	for _, course := range courses {
		db.FirstOrCreate(&course, entity.Course{Code: course.Code})
	}
}
