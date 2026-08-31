package routes

import (
	"my-go-second-project/database"
	"my-go-second-project/internal/handler"
	"my-go-second-project/internal/repository"
	"my-go-second-project/internal/service"
	"my-go-second-project/middlewares"

	"github.com/gin-gonic/gin"
)

func CredentialRoutes(rg *gin.RouterGroup) {
	db := database.DB
	credentialRepo := repository.NewCredentialRepository(db)
	credentialService := service.NewCredentialService(credentialRepo)
	credentialHandler := handler.NewCredentialHandler(credentialService)

	credentialGroup := rg.Group("/credentials")
	credentialGroup.Use(middlewares.AuthMiddleware())
	{
		credentialGroup.POST("/", credentialHandler.Create)
		credentialGroup.GET("/", credentialHandler.GetAll)
		credentialGroup.GET(":id", credentialHandler.GetByID)
		credentialGroup.PUT(":id", credentialHandler.Update)
		credentialGroup.DELETE(":id", credentialHandler.Delete)
	}
}
