package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"golang.org/x/crypto/bcrypt"

	"github.com/cpe-nuntawut/assignment-6-unging2jeng/config"
	"github.com/cpe-nuntawut/assignment-6-unging2jeng/entity"
	"github.com/cpe-nuntawut/assignment-6-unging2jeng/services"
)

type Authen struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type TeacherBrief struct {
	ID        uint   `json:"id"`
	Title     string `json:"title"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

func SignInTeacher(c *gin.Context) {
	var payload Authen
	var teacher entity.Teacher

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB().
		Preload("Role").
		Where("username = ?", payload.Username).
		First(&teacher).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "ไม่พบ Username นี้"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(teacher.Password), []byte(payload.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "รหัสผ่านไม่ถูกต้อง"})
		return
	}

	jwtWrapper := services.JwtWrapper{
		SecretKey:       "SvNQpBN8y3qlVrsGAYYWoJJk56LtzFHx",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}

	signedToken, err := jwtWrapper.GenerateToken(teacher.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถสร้าง token ได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token_type": "Bearer",
		"token":      signedToken,
		"user_id":    teacher.ID,
		"username":   teacher.Username,
		"first_name": teacher.FirstName,
		"last_name":  teacher.LastName,
		"title":      teacher.Title,
		"role":       teacher.Role.Role,
	})
}

func GetTeachers(c *gin.Context) {
	var teachers []entity.Teacher

	if err := config.DB().Preload("Role").Find(&teachers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, teachers)
}

func GetTeacherByID(c *gin.Context) {
	id := c.Param("id")

	var teacher entity.Teacher
	if err := config.DB().First(&teacher, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลครู"})
		return
	}

	// สร้างข้อมูลย่อที่ต้องการส่งกลับ
	teacherBrief := TeacherBrief{
		ID:        teacher.ID,
		Title:     teacher.Title,
		FirstName: teacher.FirstName,
		LastName:  teacher.LastName,
	}

	c.JSON(http.StatusOK, teacherBrief)
}

// func GetTeacherByID(c *gin.Context) {
// 	id := c.Param("id")
// 	var teacher entity.Teacher

// 	if err := config.DB().Preload("Role").First(&teacher, id).Error; err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลครู"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, teacher)
// }

func CreateTeacher(c *gin.Context) {
	var teacher entity.Teacher

	if err := c.ShouldBindJSON(&teacher); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashed, err := config.HashPassword(teacher.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถเข้ารหัสรหัสผ่านได้"})
		return
	}
	teacher.Password = hashed

	if err := config.DB().Create(&teacher).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, teacher)
}

func UpdateTeacher(c *gin.Context) {
	id := c.Param("id")
	var teacher entity.Teacher

	if err := config.DB().First(&teacher, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลครู"})
		return
	}

	var updateData entity.Teacher
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	teacher.Title = updateData.Title
	teacher.FirstName = updateData.FirstName
	teacher.LastName = updateData.LastName
	teacher.Username = updateData.Username
	teacher.RoleID = updateData.RoleID

	if updateData.Password != "" {
		hashed, err := config.HashPassword(updateData.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถเข้ารหัสรหัสผ่านได้"})
			return
		}
		teacher.Password = hashed
	}

	if err := config.DB().Save(&teacher).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, teacher)
}

func DeleteTeacher(c *gin.Context) {
	id := c.Param("id")
	var teacher entity.Teacher

	if err := config.DB().First(&teacher, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบข้อมูลครู"})
		return
	}

	if err := config.DB().Delete(&teacher).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ลบข้อมูลไม่สำเร็จ"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ลบข้อมูลเรียบร้อยแล้ว"})
}
