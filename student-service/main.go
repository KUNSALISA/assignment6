package main

import (
	"net/http"

	"github.com/cpe-nuntawut/assignment-6-unging2jeng/config"
	"github.com/cpe-nuntawut/assignment-6-unging2jeng/controller"
	"github.com/gin-gonic/gin"
	ginprometheus "github.com/zsais/go-gin-prometheus"
)

const PORT = "5002"

func main() {
	config.ConnectDatabase()
	config.SetupDatabase()

	r := gin.Default()
	
	// เพิ่ม Prometheus middleware
	p := ginprometheus.NewPrometheus("student_service")
	p.Use(r)
	
	r.Use(CORSMiddleware())

	r.POST("/students", controllers.CreateStudent)
	r.GET("/students", controllers.GetStudents)
	r.GET("/students/:id", controllers.GetStudentByID)
	r.PUT("/students/:id", controllers.UpdateStudent)
	r.DELETE("/students/:id", controllers.DeleteStudent)

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