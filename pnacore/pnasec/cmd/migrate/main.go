package main

import (
	"log"
	"my-go-second-project/config"
	"my-go-second-project/database"
	"my-go-second-project/internal/models"
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

	// Run migrations
	log.Println("🔄 Starting migration...")

	if err := database.DB.AutoMigrate(
		&models.User{},
		&models.Asset{},
		&models.AssetType{},
		&models.AssetCategory{},
		&models.Credential{},
		&models.CredentialCategory{},
		&models.CredentialType{},
	); err != nil {
		log.Fatal("❌ Migration failed:", err)
	}

	log.Println("✅ Migration completed successfully!")
}
