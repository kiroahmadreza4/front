package service

import (
	"context"
	"errors"
	"github.com/google/uuid"
	"my-go-second-project/internal/models"
	"my-go-second-project/internal/repository"
)

type AssetCategoryService struct {
	repo *repository.AssetCategoryRepository
}

func NewAssetCategoryService(repo *repository.AssetCategoryRepository) *AssetCategoryService {
	return &AssetCategoryService{repo: repo}
}

func (s *AssetCategoryService) GetByTypeID(typeID string) ([]models.AssetCategory, error) {
	if _, err := uuid.Parse(typeID); err != nil {
		return nil, errors.New("invalid type_id format")
	}
	return s.repo.GetByTypeID(typeID)
}

func (s *AssetCategoryService) GetByID(id string) (*models.AssetCategory, error) {
	if _, err := uuid.Parse(id); err != nil {
		return nil, errors.New("invalid id format")
	}
	return s.repo.GetByID(id)
}

func (s *AssetCategoryService) Create(ctx context.Context, category *models.AssetCategory) error {
	if category.Name == "" {
		return errors.New("name is required")
	}
	if category.TypeID == "" {
		return errors.New("type_id is required")
	}
	if _, err := uuid.Parse(category.TypeID); err != nil {
		return errors.New("invalid type_id format")
	}
	return s.repo.Create(ctx, category)
}

func (s *AssetCategoryService) Update(category *models.AssetCategory) error {
	if category.ID == "" {
		return errors.New("id is required")
	}
	if _, err := uuid.Parse(category.ID); err != nil {
		return errors.New("invalid id format")
	}
	return s.repo.Update(category)
}

func (s *AssetCategoryService) Delete(id string) error {
	if _, err := uuid.Parse(id); err != nil {
		return errors.New("invalid id format")
	}
	return s.repo.Delete(id)
}

func (s *AssetCategoryService) GetAllActive() ([]models.AssetCategory, error) {
	return s.repo.GetAllActive()
}