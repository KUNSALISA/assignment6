package entity

import (
	"gorm.io/gorm"
)

type Teacher struct {
	gorm.Model
	Title     string `json:"title"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Username  string `gorm:"unique" json:"username"`
	Password  string `json:"password"`

	RoleID uint `json:"role_id"`
	Role   Role `json:"role"`
}

type Role struct {
	gorm.Model
	Role     string    `json:"role"`
	Teachers []Teacher `json:"teachers"`
}
