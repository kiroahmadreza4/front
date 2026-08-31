package service

import (
	"errors"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"my-go-second-project/internal/models"
	"my-go-second-project/internal/repository"
)

type AssetService struct {
	repo   *repository.AssetRepository
	db     *gorm.DB
}

func NewAssetService(repo *repository.AssetRepository, db *gorm.DB) *AssetService {
	return &AssetService{
		repo: repo,
		db:   db,
	}
}

func (s *AssetService) Create(asset *models.Asset) error {
	// اعتبارسنجی Type
	if asset.TypeID != nil {
		if _, err := uuid.Parse(*asset.TypeID); err != nil {
			return errors.New("invalid type_id format")
		}
		var assetType models.AssetType
		if err := s.db.First(&assetType, "id = ?", *asset.TypeID).Error; err != nil {
			return errors.New("asset type not found")
		}
	}

	// اعتبارسنجی Category
	if asset.CategoryID != nil {
		if _, err := uuid.Parse(*asset.CategoryID); err != nil {
			return errors.New("invalid category_id format")
		}
		var category models.AssetCategory
		if err := s.db.First(&category, "id = ?", *asset.CategoryID).Error; err != nil {
			return errors.New("asset category not found")
		}
		
		// بررسی تطابق Category با Type
		if asset.TypeID != nil && category.TypeID != *asset.TypeID {
			return errors.New("category does not belong to the selected type")
		}
	}

	return s.repo.Create(asset)
}

func (s *AssetService) GetByID(id string) (*models.Asset, error) {
	if _, err := uuid.Parse(id); err != nil {
		return nil, errors.New("invalid id format")
	}
	return s.repo.GetByID(id)
}

func (s *AssetService) GetAll() ([]models.Asset, error) {
	return s.repo.GetAll()
}

func (s *AssetService) Update(asset *models.Asset) error {
	if asset.ID == "" {
		return errors.New("id is required")
	}
	if _, err := uuid.Parse(asset.ID); err != nil {
		return errors.New("invalid id format")
	}
	return s.repo.Update(asset)
}

func (s *AssetService) Delete(id string) error {
	if _, err := uuid.Parse(id); err != nil {
		return errors.New("invalid id format")
	}
	return s.repo.Delete(id)
}

func (s *AssetService) GetByTypeID(typeID string) ([]models.Asset, error) {
	if _, err := uuid.Parse(typeID); err != nil {
		return nil, errors.New("invalid type_id format")
	}
	return s.repo.GetByTypeID(typeID)
}

func (s *AssetService) GetByCategoryID(categoryID string) ([]models.Asset, error) {
	if _, err := uuid.Parse(categoryID); err != nil {
		return nil, errors.New("invalid category_id format")
	}
	return s.repo.GetByCategoryID(categoryID)
}