package main

import (
	"fmt"
	"my-go-second-project/config"
	"my-go-second-project/database"
	"my-go-second-project/internal/models"

	"golang.org/x/crypto/bcrypt"
)

func main() {
	config.LoadConfig()
	database.Connect()

	name := "admin"
	password := "admin123"
	email := "admin@example.com"

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}

	user := models.User{
		Name:     name,
		Email:    email,
		Password: string(hashedPassword),
		Age:      30,
		IsActive: true,
	}

	result := database.DB.Create(&user)
	if result.Error != nil {
		fmt.Println("❌ خطا:", result.Error)
	} else {
		fmt.Println("✅ کاربر با موفقیت ساخته شد!")
		fmt.Printf("👤 نام: %s\n", name)
		fmt.Printf("📧 ایمیل: %s\n", email)
		fmt.Printf("🔑 رمز عبور: %s\n", password)
	}
}
