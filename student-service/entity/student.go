package entity

import (
	"gorm.io/gorm"
)

type Student struct {
	gorm.Model
	ID        uint   `gorm:"primaryKey" json:"id"`
	StudentID string `json:"studentId"` // ตรงกับชื่อฟิลด์ใน frontend
	Name      string `json:"name"`      // ชื่อเต็มตามรูปแบบที่ frontend ใช้
	// ความสัมพันธ์กับ Attendance - นักศึกษาหนึ่งคนมีการเข้าเรียนได้หลายรายการ
}