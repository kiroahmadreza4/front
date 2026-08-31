package repository

import (
	"gorm.io/gorm"
	"my-go-second-project/internal/models"
)

type AssetRepository struct {
	db *gorm.DB
}

func NewAssetRepository(db *gorm.DB) *AssetRepository {
	return &AssetRepository{db: db}
}

func (r *AssetRepository) Create(asset *models.Asset) error {
	return r.db.Create(asset).Error
}

func (r *AssetRepository) GetByID(id string) (*models.Asset, error) {
	var asset models.Asset
	err := r.db.
		Preload("Type").
		Preload("Category").
		First(&asset, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &asset, nil
}

func (r *AssetRepository) GetAll() ([]models.Asset, error) {

	var assets []models.Asset
	err := r.db.
		Where("is_deleted = ?", false).
		Preload("Type").
		Preload("Category").
		Find(&assets).Error
	return assets, err
}

func (r *AssetRepository) Update(asset *models.Asset) error {
	return r.db.Save(asset).Error
}

func (r *AssetRepository) Delete(id string) error {
	return r.db.Model(&models.Asset{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": gorm.Expr("NOW()"),
		}).Error
}

func (r *AssetRepository) GetByTypeID(typeID string) ([]models.Asset, error) {
	var assets []models.Asset
	err := r.db.
		Where("type_id = ?", typeID).
		Preload("Category").
		Find(&assets).Error
	return assets, err
}

func (r *AssetRepository) GetByCategoryID(categoryID string) ([]models.Asset, error) {
	var assets []models.Asset
	err := r.db.
		Where("category_id = ?", categoryID).
		Preload("Type").
		Find(&assets).Error
	return assets, err
}