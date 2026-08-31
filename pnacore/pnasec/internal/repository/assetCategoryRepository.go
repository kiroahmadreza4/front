package repository

import (
	"context"
	"gorm.io/gorm"
	"my-go-second-project/internal/models"
)

type AssetCategoryRepository struct {
	db *gorm.DB
}

func NewAssetCategoryRepository(db *gorm.DB) *AssetCategoryRepository {
	return &AssetCategoryRepository{db: db}
}

func (r *AssetCategoryRepository) GetByTypeID(typeID string) ([]models.AssetCategory, error) {
	var categories []models.AssetCategory
	err := r.db.
		Where("type_id = ? AND is_active = ?", typeID, true).
		Order("name").
		Find(&categories).Error
	return categories, err
}

func (r *AssetCategoryRepository) GetByID(id string) (*models.AssetCategory, error) {
	var category models.AssetCategory
	err := r.db.
		Preload("Type").
		First(&category, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &category, nil
}

func (r *AssetCategoryRepository) Create(ctx context.Context, category *models.AssetCategory) error {
	err := r.db.WithContext(ctx).Create(category).Error
	return err
}

func (r *AssetCategoryRepository) Update(category *models.AssetCategory) error {
	return r.db.Save(category).Error
}

func (r *AssetCategoryRepository) Delete(id string) error {
	return r.db.Model(&models.AssetCategory{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": gorm.Expr("NOW()"),
		}).Error
}

func (r *AssetCategoryRepository) GetAllActive() ([]models.AssetCategory, error) {
	var categories []models.AssetCategory
	err := r.db.
		Where("is_active = ? AND is_deleted = ?", true, false).
		Order("name").
		Find(&categories).Error
	return categories, err
}