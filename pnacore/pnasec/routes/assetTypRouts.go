package routes

import (
	"github.com/gin-gonic/gin"
	"my-go-second-project/middlewares"
	"my-go-second-project/database"
	"my-go-second-project/internal/handler"
	"my-go-second-project/internal/repository"
	"my-go-second-project/internal/service"
)

func AssetTypeRoutes(rg *gin.RouterGroup) {
	// استفاده از database.DB
	db := database.DB
	
	// Repository
	assetTypeRepo := repository.NewAssetTypeRepository(db)
	
	// Service
	assetTypeService := service.NewAssetTypeService(assetTypeRepo)
	if assetTypeService == nil {

		return
	}
	// Handler
	assetTypeHandler := handler.NewAssetTypeHandler(assetTypeService)
	
	// Routes
	assetTypeGroup := rg.Group("/asset-types")
	assetTypeGroup.Use(middlewares.AuthMiddleware())
	{
		assetTypeGroup.GET("/", assetTypeHandler.GetAll)
		assetTypeGroup.GET("/:id", assetTypeHandler.GetByID)
		assetTypeGroup.POST("/", assetTypeHandler.Create)
		assetTypeGroup.PUT("/:id", assetTypeHandler.Update)
		assetTypeGroup.DELETE("/:id", assetTypeHandler.Delete)
	}
}