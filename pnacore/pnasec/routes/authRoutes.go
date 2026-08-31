// routes/authRoutes.go
package routes

import (
	"github.com/gin-gonic/gin"
	"my-go-second-project/database"
	"my-go-second-project/internal/handler"
	"my-go-second-project/internal/repository"
	"my-go-second-project/internal/service"
)

func AuthRoutes(rg *gin.RouterGroup) {
	// Repository
	userRepo := repository.NewUserRepository(database.DB)
	
	// Service
	authService := service.NewAuthService(userRepo)
	
	// Handler
	authHandler := handler.NewAuthHandler(authService)
	
	// Routes (public - no auth needed)
	authGroup := rg.Group("/auth")
	{
		authGroup.POST("/register", authHandler.Register)
		authGroup.POST("/login", authHandler.Login)
	}
}