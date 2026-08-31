package repository

import (
	"gorm.io/gorm"
	"context"
	"my-go-second-project/internal/models"
)

type AssetTypeRepository struct {
	db *gorm.DB
}

func NewAssetTypeRepository(db *gorm.DB) *AssetTypeRepository {
	return &AssetTypeRepository{db: db}
}

func (r *AssetTypeRepository) GetAllActive() ([]models.AssetType, error) {
	var types []models.AssetType
	err := r.db.
		Where("is_active = ? AND is_deleted = ?", true, false).
		Order("name").
		Find(&types).Error
	return types, err
}

func (r *AssetTypeRepository) GetByID(id string) (*models.AssetType, error) {
	var assetType models.AssetType
	err := r.db.
		Preload("Categories").
		First(&assetType, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &assetType, nil
}

func (r *AssetTypeRepository) Create(ctx context.Context, assetType *models.AssetType) error {
	err := r.db.WithContext(ctx).Create(assetType).Error
	return err
}

func (r *AssetTypeRepository) Update(assetType *models.AssetType) error {
	return r.db.Save(assetType).Error
}

func (r *AssetTypeRepository) Delete(id string) error {
	// به‌روزرسانی فیلدهای IsDeleted و DeletedAt
	return r.db.Model(&models.AssetType{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": gorm.Expr("NOW()"),
		}).Error

}