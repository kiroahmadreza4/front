// internal/service/authService.go
package service

import (
	"errors"
	"strconv"
	"time"
	
	"my-go-second-project/config"
	"my-go-second-project/internal/models"
	"my-go-second-project/internal/repository"
	
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	userRepo *repository.UserRepository
}

func NewAuthService(userRepo *repository.UserRepository) *AuthService {
	return &AuthService{
		userRepo: userRepo,
	}
}

type Claims struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

type LoginInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type RegisterInput struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required,min=6"`
	Age      int    `json:"age"`
}

type AuthResponse struct {
	Token string       `json:"token"`
	User  *models.User `json:"user"`
}

func (s *AuthService) Register(input RegisterInput) (*AuthResponse, error) {
	// بررسی وجود کاربر
	existing, _ := s.userRepo.FindByEmail(input.Email)
	if existing != nil {
		return nil, errors.New("email already exists")
	}

	// هش کردن پسورد
	hashed, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("failed to process password")
	}

	// ایجاد کاربر جدید
	newUser := &models.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: string(hashed),
		Age:      input.Age,
		IsActive: true,
	}

	if err := s.userRepo.Create(newUser); err != nil {
		return nil, errors.New("failed to create user")
	}

	// تولید توکن
	token, err := s.generateToken(newUser)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{Token: token, User: newUser}, nil
}

func (s *AuthService) Login(input LoginInput) (*AuthResponse, error) {
	// پیدا کردن کاربر
	existingUser, err := s.userRepo.FindByEmail(input.Email)
	if err != nil || existingUser == nil {
		return nil, errors.New("invalid email or password")
	}

	// بررسی فعال بودن کاربر
	if !existingUser.IsActive {
		return nil, errors.New("account is deactivated")
	}

	// بررسی پسورد
	if err := bcrypt.CompareHashAndPassword([]byte(existingUser.Password), []byte(input.Password)); err != nil {
		return nil, errors.New("invalid email or password")
	}

	// تولید توکن
	token, err := s.generateToken(existingUser)
	if err != nil {
		return nil, err
	}

	return &AuthResponse{Token: token, User: existingUser}, nil
}

func (s *AuthService) generateToken(u *models.User) (string, error) {
	secret := config.AppConfig.JWTSecret
	if secret == "" {
		return "", errors.New("JWT secret is not configured")
	}

	hours, err := strconv.Atoi(config.AppConfig.JWTExpireHours)
	if err != nil {
		hours = 24
	}

	claims := Claims{
		UserID: u.ID,
		Email:  u.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(hours) * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

func ValidateToken(tokenStr string) (*Claims, error) {
	secret := config.AppConfig.JWTSecret

	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(secret), nil
	})

	if err != nil {
		return nil, errors.New("invalid or expired token")
	}

	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, errors.New("invalid token claims")
	}

	return claims, nil
}