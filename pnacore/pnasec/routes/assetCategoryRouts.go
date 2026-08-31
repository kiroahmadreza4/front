package routes

import (
	"github.com/gin-gonic/gin"
	"my-go-second-project/middlewares"
	"my-go-second-project/database"
	"my-go-second-project/internal/handler"
	"my-go-second-project/internal/repository"
	"my-go-second-project/internal/service"
)

func AssetCategoryRoutes(rg *gin.RouterGroup) {
	// استفاده از database.DB
	db := database.DB
	
	// Repository
	assetCategoryRepo := repository.NewAssetCategoryRepository(db)
	
	// Service
	assetCategoryService := service.NewAssetCategoryService(assetCategoryRepo)
	
	// Handler
	assetCategoryHandler := handler.NewAssetCategoryHandler(assetCategoryService)
	
	// Routes
	assetCategoryGroup := rg.Group("/asset-categories")
	assetCategoryGroup.Use(middlewares.AuthMiddleware())
	{
		assetCategoryGroup.GET("/by-type/:typeId", assetCategoryHandler.GetByTypeID)
		assetCategoryGroup.GET("/:id", assetCategoryHandler.GetByID)
		assetCategoryGroup.GET("/", assetCategoryHandler.GetAllActive)
		assetCategoryGroup.POST("/", assetCategoryHandler.Create)
		assetCategoryGroup.PUT("/:id", assetCategoryHandler.Update)
		assetCategoryGroup.DELETE("/:id", assetCategoryHandler.Delete)
	}
}