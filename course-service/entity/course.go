package entity

import (
	"gorm.io/gorm"
)

type Course struct {
	gorm.Model
	ID         uint   `gorm:"primaryKey"`
	Code       string `json:"code"`
	Name       string `json:"name"`
	TeacherID  uint   `json:"teacher_id"`
}