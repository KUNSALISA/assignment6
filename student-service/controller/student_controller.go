package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/cpe-nuntawut/assignment-6-unging2jeng/config"
	"github.com/cpe-nuntawut/assignment-6-unging2jeng/entity"
)

// GetStudents ดึงข้อมูลนักศึกษาทั้งหมด
func GetStudents(c *gin.Context) {
	var students []entity.Student

	if err := config.DB().Find(&students).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, students)
}

// GetStudentByID ดึงข้อมูลนักศึกษาตาม ID
func GetStudentByID(c *gin.Context) {
	id := c.Param("id")
	var student entity.Student

	if err := config.DB().First(&student, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลนักศึกษา"})
		return
	}

	c.JSON(http.StatusOK, student)
}

// CreateStudent สร้างข้อมูลนักศึกษาใหม่
func CreateStudent(c *gin.Context) {
	var student entity.Student

	if err := c.ShouldBindJSON(&student); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ตรวจสอบว่ามีนักศึกษาที่มี StudentID ซ้ำหรือไม่
	var existingStudent entity.Student
	if err := config.DB().Where("student_id = ?", student.StudentID).First(&existingStudent).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "รหัสนักศึกษานี้มีอยู่ในระบบแล้ว"})
		return
	}

	if err := config.DB().Create(&student).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, student)
}

// UpdateStudent อัปเดตข้อมูลนักศึกษา
func UpdateStudent(c *gin.Context) {
	id := c.Param("id")
	var student entity.Student

	if err := config.DB().First(&student, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลนักศึกษา"})
		return
	}

	var updateData entity.Student
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัปเดตข้อมูล
	student.StudentID = updateData.StudentID
	student.Name = updateData.Name

	// ตรวจสอบว่ามีนักศึกษาที่มี StudentID ซ้ำหรือไม่ (ยกเว้นนักศึกษาคนนี้)
	if student.StudentID != updateData.StudentID {
		var existingStudent entity.Student
		if err := config.DB().Where("student_id = ? AND id != ?", updateData.StudentID, id).First(&existingStudent).Error; err == nil {
			c.JSON(http.StatusConflict, gin.H{"error": "รหัสนักศึกษานี้มีอยู่ในระบบแล้ว"})
			return
		}
	}

	if err := config.DB().Save(&student).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, student)
}

// DeleteStudent ลบข้อมูลนักศึกษา
func DeleteStudent(c *gin.Context) {
	id := c.Param("id")
	var student entity.Student

	if err := config.DB().First(&student, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลนักศึกษา"})
		return
	}

	if err := config.DB().Delete(&student).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ลบข้อมูลไม่สำเร็จ"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ลบข้อมูลเรียบร้อยแล้ว"})
}