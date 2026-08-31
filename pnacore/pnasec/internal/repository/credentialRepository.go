package repository

import (
	"my-go-second-project/internal/models"

	"gorm.io/gorm"
)

type CredentialRepository struct {
	db *gorm.DB
}

func NewCredentialRepository(db *gorm.DB) *CredentialRepository {
	return &CredentialRepository{db: db}
}

func (r *CredentialRepository) Create(credential *models.Credential) error {
	return r.db.Create(credential).Error
}

func (r *CredentialRepository) GetAll() ([]models.Credential, error) {
	var credentials []models.Credential
	err := r.db.Where("is_deleted = ?", false).Order("created_at desc").Find(&credentials).Error
	return credentials, err
}

func (r *CredentialRepository) GetByID(id string) (*models.Credential, error) {
	var credential models.Credential
	err := r.db.Where("id = ? AND is_deleted = ?", id, false).First(&credential).Error
	if err != nil {
		return nil, err
	}
	return &credential, nil
}

func (r *CredentialRepository) Update(credential *models.Credential) error {
	return r.db.Save(credential).Error
}

func (r *CredentialRepository) Delete(id string) error {
	return r.db.Model(&models.Credential{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"is_deleted": true,
			"deleted_at": gorm.Expr("NOW()"),
		}).Error
}
