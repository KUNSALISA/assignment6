package main

import (
	"net/http"

	"github.com/cpe-nuntawut/assignment-6-unging2jeng/config"
	"github.com/cpe-nuntawut/assignment-6-unging2jeng/controllers"
	"github.com/cpe-nuntawut/assignment-6-unging2jeng/middleware"
	"github.com/gin-gonic/gin"
	ginprometheus "github.com/zsais/go-gin-prometheus"
)

const PORT = "5001"

func main() {
	config.ConnectDatabase()
	config.SetupDatabase()

	r := gin.Default()
	
	// เพิ่ม Prometheus middleware
	p := ginprometheus.NewPrometheus("teacher_service")
	p.Use(r)
	
	r.Use(CORSMiddleware())

	r.POST("/signin", controllers.SignInTeacher)

	router := r.Group("/")
	{
		router.Use(middleware.Authorizes())
		r.GET("/teacher-all", controllers.GetTeachers)
		r.GET("/teachers/:id", controllers.GetTeacherByID)
		r.POST("/teacher", controllers.CreateTeacher)
		r.PATCH("/teacher-edit/:id", controllers.UpdateTeacher)
		r.DELETE("/teacher-delete/:id", controllers.DeleteTeacher)
	}

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	r.Run(":" + PORT)
}

func CORSMiddleware() gin.HandlerFunc {
	// CORS middleware code (ไม่มีการเปลี่ยนแปลง)
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}