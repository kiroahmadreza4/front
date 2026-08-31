package routes

import (
	"github.com/gin-gonic/gin"
	"my-go-second-project/middlewares"
	"my-go-second-project/database"
	"my-go-second-project/internal/handler"
	"my-go-second-project/internal/repository"
	"my-go-second-project/internal/service"
)

func AssetRoutes(rg *gin.RouterGroup) {
	// استفاده از database.DB
	db := database.DB
	
	// Repository
	assetRepo := repository.NewAssetRepository(db)
	
	// Service
	assetService := service.NewAssetService(assetRepo, db)
	
	// Handler
	assetHandler := handler.NewAssetHandler(assetService)
	
	// Routes
	assetGroup := rg.Group("/assets")
	assetGroup.Use(middlewares.AuthMiddleware())
	{
		assetGroup.POST("/", assetHandler.Create)
		assetGroup.GET("/:id", assetHandler.GetByID)
		assetGroup.GET("/", assetHandler.GetAll)
		assetGroup.PUT("/:id", assetHandler.Update)
		assetGroup.DELETE("/:id", assetHandler.Delete)
		assetGroup.GET("/by-type/:typeId", assetHandler.GetByTypeID)
		assetGroup.GET("/by-category/:categoryId", assetHandler.GetByCategoryID)
	}
}