package service

import (
	"errors"
	"context"
	"github.com/google/uuid"
	"my-go-second-project/internal/models"
	"my-go-second-project/internal/repository"
)

type AssetTypeService struct {
	repo *repository.AssetTypeRepository
}

func NewAssetTypeService(repo *repository.AssetTypeRepository) *AssetTypeService {
	return &AssetTypeService{repo: repo}
}

func (s *AssetTypeService) GetAllActive() ([]models.AssetType, error) {
	return s.repo.GetAllActive()
}

func (s *AssetTypeService) GetByID(id string) (*models.AssetType, error) {
	if _, err := uuid.Parse(id); err != nil {
		return nil, errors.New("invalid id format")
	}
	return s.repo.GetByID(id)
}

func (s *AssetTypeService) Create(ctx context.Context, assetType *models.AssetType) error {
	
	if assetType.Name == "" {
		return errors.New("name is required")
	}
	
	return s.repo.Create(ctx, assetType)
}

func (s *AssetTypeService) Update(assetType *models.AssetType) error {
	if assetType.ID == "" {
		return errors.New("id is required")
	}
	if _, err := uuid.Parse(assetType.ID); err != nil {
		return errors.New("invalid id format")
	}
	return s.repo.Update(assetType)
}

func (s *AssetTypeService) Delete(id string) error {
	if _, err := uuid.Parse(id); err != nil {
		return errors.New("invalid id format")
	}
	return s.repo.Delete(id)
}