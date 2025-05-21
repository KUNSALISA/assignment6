package entity

import (
	"time"

	"gorm.io/gorm"
)

type Attendance struct {
	gorm.Model
	ID        uint      `gorm:"primaryKey"`
	StudentID uint      `json:"student_id"`
	CourseID  uint      `json:"course_id"`
	Date      time.Time `json:"date"`

	StatusID uint   `json:"status_id"`
	Status   Status `json:"role"`
}

type Status struct {
	gorm.Model
	Status      string       `json:"status"`
	Attendances []Attendance `json:"attendances"`
}
