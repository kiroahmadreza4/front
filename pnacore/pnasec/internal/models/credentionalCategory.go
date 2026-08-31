// internal/models/credential_category.go
package models

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// CredentialCategory مدل دسته‌بندی اعتبارنامه
type CredentialCategory struct {
	ID          string         `gorm:"type:uuid;primaryKey" json:"id"`
	Name        string         `gorm:"size:100;not null;unique;index" json:"name"`
	Description string         `gorm:"size:500" json:"description"`
	Icon        string         `gorm:"size:50" json:"icon"`
	Color       string         `gorm:"size:20" json:"color"`
	IsActive    bool           `gorm:"default:true;index" json:"is_active"`
	IsDeleted   bool           `gorm:"default:false;index" json:"is_deleted"`
	CreatedBy   string         `gorm:"size:255" json:"created_by"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	// ارتباطات
	Types []CredentialType `gorm:"foreignKey:CategoryID" json:"types,omitempty"`
}

func (CredentialCategory) TableName() string {
	return "credential_categories"
}

func (cc *CredentialCategory) BeforeCreate(tx *gorm.DB) error {
	if cc.ID == "" {
		cc.ID = uuid.New().String()
	}
	if userID, ok := tx.Statement.Context.Value("user_id").(string); ok {
		cc.CreatedBy = userID
	}
	return nil
}