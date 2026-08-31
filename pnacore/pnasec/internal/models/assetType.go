package models

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// AssetType مدل نوع دارایی
type AssetType struct {
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
	Categories []AssetCategory `gorm:"foreignKey:TypeID" json:"categories,omitempty"`
	Assets     []Asset         `gorm:"foreignKey:TypeID" json:"assets,omitempty"`
}

func (AssetType) TableName() string {
	return "asset_types"
}

func (at *AssetType) BeforeCreate(tx *gorm.DB) error {
	if at.ID == "" {
		at.ID = uuid.New().String()
	}
	at.CreatedBy = tx.Statement.Context.Value("user_id").(string)
		
	return nil
}