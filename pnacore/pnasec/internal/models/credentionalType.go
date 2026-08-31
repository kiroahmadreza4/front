// internal/models/credential_type.go
package models

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// CredentialType مدل نوع اعتبارنامه
type CredentialType struct {
	ID          string         `gorm:"type:uuid;primaryKey" json:"id"`
	Name        string         `gorm:"size:100;not null;unique;index" json:"name"`
	Description string         `gorm:"size:500" json:"description"`
	CategoryID  string         `gorm:"type:uuid;not null;index" json:"category_id"`
	Icon        string         `gorm:"size:50" json:"icon"`
	Color       string         `gorm:"size:20" json:"color"`
	IsActive    bool           `gorm:"default:true;index" json:"is_active"`
	IsDeleted   bool           `gorm:"default:false;index" json:"is_deleted"`
	CreatedBy   string         `gorm:"size:255" json:"created_by"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	// ارتباطات
	Category *CredentialCategory `gorm:"foreignKey:CategoryID;references:ID" json:"category,omitempty"`
}

func (CredentialType) TableName() string {
	return "credential_types"
}

func (ct *CredentialType) BeforeCreate(tx *gorm.DB) error {
	if ct.ID == "" {
		ct.ID = uuid.New().String()
	}
	if userID, ok := tx.Statement.Context.Value("user_id").(string); ok {
		ct.CreatedBy = userID
	}
	return nil
}