// package main

// import (
// 	"log"
// 	"backend/config"
// 	"backend/controller"
// 	"backend/entity"

// 	"github.com/gin-gonic/gin"
// )

// func main() {
// 	// Initialize database
// 	config.InitDB()
// 	db := config.DB()
	
// 	// Auto migrate the schema
// 	db.AutoMigrate(&entity.Attendance{})

// 	// Set up router
// 	router := gin.Default()

// 	// CORS middleware
// 	router.Use(func(c *gin.Context) {
// 		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
// 		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
// 		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		
// 		if c.Request.Method == "OPTIONS" {
// 			c.AbortWithStatus(204)
// 			return
// 		}
		
// 		c.Next()
// 	})

// 	// Basic CRUD routes
// 	router.GET("/attendances", controller.GetAllAttendances)
// 	router.GET("/attendances/:id", controller.GetAttendance)
// 	router.PUT("/attendances/:id", controller.UpdateAttendance)
// 	router.DELETE("/attendances/:id", controller.DeleteAttendance)
	
// 	// Additional attendance functionality
// 	router.POST("/mark-attendance", controller.MarkAttendance)
// 	router.GET("/attendances/course/:course_id", controller.GetAttendanceByCourse)
// 	router.GET("/attendances/student/:student_id", controller.GetAttendanceByStudent)

// 	// Start server
// 	log.Println("Attendance Service running on port 5004")
// 	router.Run(":5004")
// }

package main

import (
	"net/http"

	"github.com/cpe-nuntawut/assignment-6-unging2jeng/config"
	"github.com/cpe-nuntawut/assignment-6-unging2jeng/controller"
	"github.com/gin-gonic/gin"
	ginprometheus "github.com/zsais/go-gin-prometheus"
)

const PORT = "5004"  // แก้จาก 5003 เป็น 5004

func main() {
	config.ConnectDatabase()
	config.SetupDatabase()

	r := gin.Default()
	
	// เพิ่ม Prometheus middleware
	p := ginprometheus.NewPrometheus("attendance_service")
	p.Use(r)
	
	r.Use(CORSMiddleware())

	r.GET("/attendances", controller.GetAllAttendances)
	r.GET("/attendances/:id", controller.GetAttendance)
	r.PUT("/attendances/:id", controller.UpdateAttendance)
	r.DELETE("/attendances/:id", controller.DeleteAttendance)
	
	// Additional attendance functionality
	r.POST("/mark-attendance", controller.MarkAttendance)
	r.GET("/attendances/course/:course_id", controller.GetAttendanceByCourse)
	r.GET("/attendances/student/:student_id", controller.GetAttendanceByStudent)

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