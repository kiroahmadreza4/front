// internal/service/userService.go
package service

import (
	"errors"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"my-go-second-project/internal/models"
	"my-go-second-project/internal/repository"
)

type UserService struct {
	repo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) Create(user *models.User) error {
	// هش کردن پسورد
	hashed, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return errors.New("failed to hash password")
	}
	user.Password = string(hashed)
	
	return s.repo.Create(user)
}

func (s *UserService) GetByID(id string) (*models.User, error) {
	if _, err := uuid.Parse(id); err != nil {
		return nil, errors.New("invalid id format")
	}
	return s.repo.FindByID(id)
}

func (s *UserService) GetByEmail(email string) (*models.User, error) {
	return s.repo.FindByEmail(email)
}

func (s *UserService) GetAll() ([]models.User, error) {
	return s.repo.FindAll()
}

func (s *UserService) Update(user *models.User) error {
	return s.repo.Update(user)
}

func (s *UserService) Delete(id string) error {
	if _, err := uuid.Parse(id); err != nil {
		return errors.New("invalid id format")
	}
	return s.repo.Delete(id)
}

func (s *UserService) VerifyPassword(email, password string) (*models.User, error) {
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid email or password")
	}

	return user, nil
}