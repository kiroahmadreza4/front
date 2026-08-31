package service

import (
	"errors"
	"my-go-second-project/internal/models"
	"my-go-second-project/internal/repository"

	"github.com/google/uuid"
)

type CredentialService struct {
	repo *repository.CredentialRepository
}

func NewCredentialService(repo *repository.CredentialRepository) *CredentialService {
	return &CredentialService{repo: repo}
}

func (s *CredentialService) Create(credential *models.Credential) error {
	if credential.Name == "" {
		return errors.New("name is required")
	}
	if credential.Username == "" {
		return errors.New("username is required")
	}
	if credential.Password == "" {
		return errors.New("password is required")
	}
	return s.repo.Create(credential)
}

func (s *CredentialService) GetAll() ([]models.Credential, error) {
	return s.repo.GetAll()
}

func (s *CredentialService) GetByID(id string) (*models.Credential, error) {
	if _, err := uuid.Parse(id); err != nil {
		return nil, errors.New("invalid id format")
	}
	return s.repo.GetByID(id)
}

func (s *CredentialService) Update(credential *models.Credential) error {
	if credential.ID == "" {
		return errors.New("id is required")
	}
	if _, err := uuid.Parse(credential.ID); err != nil {
		return errors.New("invalid id format")
	}
	return s.repo.Update(credential)
}

func (s *CredentialService) Delete(id string) error {
	if _, err := uuid.Parse(id); err != nil {
		return errors.New("invalid id format")
	}
	return s.repo.Delete(id)
}
