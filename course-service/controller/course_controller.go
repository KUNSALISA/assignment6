package controller

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/cpe-nuntawut/assignment-6-unging2jeng/config"
	"github.com/cpe-nuntawut/assignment-6-unging2jeng/entity"

	"github.com/gin-gonic/gin"
)

// แนะนำให้แยก package `dto` หรืออยู่ใน `entity` ก็ได้

type TeacherBrief struct {
	ID        uint   `json:"id"`
	Title     string `json:"title"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type CourseWithTeacher struct {
	ID        uint         `json:"id"`
	Code      string       `json:"code"`
	Name      string       `json:"name"`
	TeacherID uint         `json:"teacher_id"`
	Teacher   TeacherBrief `json:"teacher"`
}

func GetAllCoursesWithTeachers(c *gin.Context) {
	var courses []entity.Course
	db := config.DB()

	if err := db.Find(&courses).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var result []CourseWithTeacher
	for _, course := range courses {
		teacher, err := fetchTeacher(course.TeacherID)
		if err != nil {
			// ถ้าดึงไม่ได้ ให้ใส่ struct ว่าง
			teacher = TeacherBrief{}
		}
		result = append(result, CourseWithTeacher{
			ID:        course.ID,
			Code:      course.Code,
			Name:      course.Name,
			TeacherID: course.TeacherID,
			Teacher:   teacher,
		})
	}

	c.JSON(http.StatusOK, result)
}

func fetchTeacher(id uint) (TeacherBrief, error) {
	url := fmt.Sprintf("http://localhost:5001/teachers/%d", id)
	resp, err := http.Get(url)
	if err != nil {
		return TeacherBrief{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return TeacherBrief{}, fmt.Errorf("teacher not found")
	}

	var teacher TeacherBrief
	if err := json.NewDecoder(resp.Body).Decode(&teacher); err != nil {
		return TeacherBrief{}, err
	}

	return teacher, nil
}

func GetAllCourses(c *gin.Context) {
	var courses []entity.Course

	db := config.DB()
	results := db.Preload("Teacher").Find(&courses)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, courses)
}

func GetCourse(c *gin.Context) {
	id := c.Param("id")
	var course entity.Course

	db := config.DB()

	results := db.Preload("Teacher").First(&course, id)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	if course.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}

	c.JSON(http.StatusOK, course)
}

func UpdateCourse(c *gin.Context) {
	id := c.Param("id")
	var course entity.Course

	db := config.DB()
	result := db.First(&course, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&course); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&course)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func DeleteCourse(c *gin.Context) {
	id := c.Param("id")

	db := config.DB()
	if tx := db.Exec("DELETE FROM courses WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

func CreateCourse(c *gin.Context) {
	var course entity.Course

	if err := c.ShouldBindJSON(&course); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	db := config.DB()
	result := db.Create(&course)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": course.ID, "message": "Created successful"})
}
