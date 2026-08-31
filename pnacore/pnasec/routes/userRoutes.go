// routes/userRoutes.go
package routes

import (
	"github.com/gin-gonic/gin"
	"my-go-second-project/database"
	"my-go-second-project/internal/handler"
	"my-go-second-project/internal/repository"
	"my-go-second-project/internal/service"
	"my-go-second-project/middlewares"
)

func UserRoutes(rg *gin.RouterGroup) {
	// Repository
	userRepo := repository.NewUserRepository(database.DB)
	
	// Service
	userService := service.NewUserService(userRepo)
	
	// Handler
	userHandler := handler.NewUserHandler(userService)
	
	// Routes (protected - need auth)
	userGroup := rg.Group("/users")
	userGroup.Use(middlewares.AuthMiddleware())
	{
		userGroup.GET("/", userHandler.GetAll)
		userGroup.GET("/:id", userHandler.GetByID)
		userGroup.PUT("/:id", userHandler.Update)
		userGroup.DELETE("/:id", userHandler.Delete)
		userGroup.GET("/profile", userHandler.GetProfile)
	}
}