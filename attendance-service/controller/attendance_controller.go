package controller

import (
	"github.com/cpe-nuntawut/assignment-6-unging2jeng/config"
	"github.com/cpe-nuntawut/assignment-6-unging2jeng/entity"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func GetAllAttendances(c *gin.Context) {
	var attendances []entity.Attendance
	
	db := config.DB()
	results := db.Find(&attendances)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	
	c.JSON(http.StatusOK, attendances)
}

func GetAttendance(c *gin.Context) {
	id := c.Param("id")
	var attendance entity.Attendance
	
	db := config.DB()
	results := db.First(&attendance, id)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	
	if attendance.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	
	c.JSON(http.StatusOK, attendance)
}

func UpdateAttendance(c *gin.Context) {
	id := c.Param("id")
	var attendance entity.Attendance
	
	db := config.DB()
	result := db.First(&attendance, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}
	
	if err := c.ShouldBindJSON(&attendance); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}
	
	result = db.Save(&attendance)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func DeleteAttendance(c *gin.Context) {
	id := c.Param("id")
	
	db := config.DB()
	if tx := db.Exec("DELETE FROM attendances WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

func MarkAttendance(c *gin.Context) {
	var attendanceData struct {
		CourseID   uint     `json:"course_id" binding:"required"`
		Date       string   `json:"date" binding:"required"` // Format: "2006-01-02"
		StudentIDs []uint   `json:"student_ids" binding:"required"`
		Statuses   []string `json:"statuses" binding:"required"` // Present, Absent, Late
	}

	if err := c.ShouldBindJSON(&attendanceData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if len(attendanceData.StudentIDs) != len(attendanceData.Statuses) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Student IDs and statuses must have the same length"})
		return
	}

	// Parse date
	date, err := time.Parse("2006-01-02", attendanceData.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD"})
		return
	}

	db := config.DB()
	tx := db.Begin()

	for i, studentID := range attendanceData.StudentIDs {
		// ค้นหา Status จาก string
		var status entity.Status
		if err := tx.Where("status = ?", attendanceData.Statuses[i]).First(&status).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status: " + attendanceData.Statuses[i]})
			return
		}

		// ค้นหา attendance record เดิม
		var existingAttendance entity.Attendance
		result := tx.Where("student_id = ? AND course_id = ? AND date = ?", studentID, attendanceData.CourseID, date).First(&existingAttendance)

		if result.Error == nil {
			// ถ้ามีอยู่แล้ว -> update
			existingAttendance.StatusID = status.ID
			existingAttendance.Status = status

			if err := tx.Save(&existingAttendance).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update attendance"})
				return
			}
		} else {
			// ถ้าไม่มี -> create ใหม่
			newAttendance := entity.Attendance{
				StudentID: studentID,
				CourseID:  attendanceData.CourseID,
				Date:      date,
				StatusID:  status.ID,
				Status:    status,
			}

			if err := tx.Create(&newAttendance).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create attendance"})
				return
			}
		}
	}

	tx.Commit()
	c.JSON(http.StatusOK, gin.H{"message": "Attendance marked successfully"})
}


// GetAttendanceByCourse retrieves all attendance records for a specific course
func GetAttendanceByCourse(c *gin.Context) {
	courseID := c.Param("course_id")
	var attendances []entity.Attendance
	
	db := config.DB()
	results := db.Where("course_id = ?", courseID).Find(&attendances)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	
	c.JSON(http.StatusOK, attendances)
}

// GetAttendanceByStudent retrieves all attendance records for a specific student
func GetAttendanceByStudent(c *gin.Context) {
	studentID := c.Param("student_id")
	var attendances []entity.Attendance
	
	db := config.DB()
	results := db.Where("student_id = ?", studentID).Find(&attendances)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	
	c.JSON(http.StatusOK, attendances)
}