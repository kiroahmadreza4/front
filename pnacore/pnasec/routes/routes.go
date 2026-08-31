package routes

import (
	"my-go-second-project/middlewares"
	"my-go-second-project/utils"

	"github.com/gin-gonic/gin"
)

// SetupRouter تنظیمات اصلی روتینگ
func SetupRouter() *gin.Engine {
	router := gin.Default()

	router.Use(middlewares.LoggerMiddleware())

	// CORS middleware
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Health check
	router.GET("/health", func(c *gin.Context) {
		utils.SuccessResponse(c, 200, "Server is running", gin.H{
			"status":  "OK",
			"version": "1.0.0",
		})
	})

	// Group اصلی API
	api := router.Group("/api/v1")
	{
		AuthRoutes(api)
		UserRoutes(api)
		AssetRoutes(api)
		AssetTypeRoutes(api)
		AssetCategoryRoutes(api)
		CredentialRoutes(api)
	}

	// 404 handler
	router.NoRoute(func(c *gin.Context) {
		utils.ErrorResponse(c, 404, "Endpoint not found", "The requested endpoint does not exist")
	})

	return router
}
