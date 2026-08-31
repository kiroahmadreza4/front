package main

import (
	"log"
	"my-go-second-project/config"
	"my-go-second-project/database"
	// "my-go-second-project/internal/models"
	"my-go-second-project/routes"
)

func main() {
	// Load config
	config.LoadConfig()
	
	// Connect to database
	database.Connect()
	defer database.Close()
	
	// Check connection
	if !database.IsConnected() {
		log.Fatal("❌ Database is not connected")
	}
	
	// // Auto migrate
	// if err := database.DB.AutoMigrate(
	// 	&models.Asset{},
	// 	&models.AssetType{},
	// 	&models.AssetCategory{},
	// ); err != nil {
	// 	log.Fatal("❌ Failed to migrate database:", err)
	// }
	
	// log.Println("✅ Database migration completed")
	
	// Setup router
	router := routes.SetupRouter()
	
	// Run server
	log.Println("🚀 Server starting on :8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatal("❌ Failed to start server:", err)
	}
}