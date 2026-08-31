package service

import (
	"errors"
	"my-go-second-project/internal/models"
	"my-go-second-project/internal/repository"
	"strings"

	"github.com/google/uuid"
)

type CredentialService struct {
	repo *repository.CredentialRepository
}

func NewCredentialService(repo *repository.CredentialRepository) *CredentialService {
	return &CredentialService{repo: repo}
}

func sanitizeCredentialUUIDs(credential *models.Credential) {
	if credential == nil {
		return
	}

	if credential.CategoryID != nil && strings.TrimSpace(*credential.CategoryID) == "" {
		credential.CategoryID = nil
	}
	if credential.TypeID != nil && strings.TrimSpace(*credential.TypeID) == "" {
		credential.TypeID = nil
	}
}

func (s *CredentialService) Create(credential *models.Credential) error {
	sanitizeCredentialUUIDs(credential)

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
	sanitizeCredentialUUIDs(credential)

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
