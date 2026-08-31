package config

import (
	"log"
	"os"
	"github.com/joho/godotenv"
)

type Config struct {
	DBHost          string
	DBPort          string
	DBUser          string
	DBPassword      string
	DBName          string
	DBSSLMode       string
	DBTimeZone      string
	AppPort         string
	AppEnv          string
	JWTSecret       string
	JWTExpireHours  string
}

var AppConfig *Config

func LoadConfig() {
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️ No .env file found, using system environment variables")
	}

	AppConfig = &Config{
		DBHost:         getEnv("DB_HOST", "localhost"),
		DBPort:         getEnv("DB_PORT", "5432"),
		DBUser:         getEnv("DB_USER", "postgres"),
		DBPassword:     getEnv("DB_PASSWORD", "pnacore@123"),
		DBName:         getEnv("DB_NAME", "pnacoredb"),
		DBSSLMode:      getEnv("DB_SSLMODE", "disable"),
		DBTimeZone:     getEnv("DB_TIMEZONE", "UTC"),
		AppPort:        getEnv("APP_PORT", "8080"),
		AppEnv:         getEnv("APP_ENV", "development"),
		JWTSecret:      getEnv("JWT_SECRET", "mYsUp3rS3cr3tK3y@2026!GoProject#SecureKey$XyZ"),
		JWTExpireHours: getEnv("JWT_EXPIRE_HOURS", "24"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
