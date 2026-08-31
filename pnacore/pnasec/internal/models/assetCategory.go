package models

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// AssetCategory مدل دسته‌بندی دارایی
type AssetCategory struct {
	ID          string         `gorm:"type:uuid;primaryKey" json:"id"`
	Name        string         `gorm:"size:100;not null;index" json:"name"`
	Description string         `gorm:"size:500" json:"description"`
	TypeID      string         `gorm:"type:uuid;not null;index" json:"type_id"`
	// ParentID    *string        `gorm:"type:uuid;index" json:"parent_id"`
	Icon        string         `gorm:"size:50" json:"icon"`
	Color       string         `gorm:"size:20" json:"color"`
	IsActive    bool           `gorm:"default:true;index" json:"is_active"`
	IsDeleted   bool           `gorm:"default:false;index" json:"is_deleted"`
	CreatedBy   string         `gorm:"size:255" json:"created_by"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	// ارتباطات
	Type   *AssetType     `gorm:"foreignKey:TypeID;references:ID" json:"type,omitempty"`
	//Parent *AssetCategory `gorm:"foreignKey:ParentID;references:ID" json:"parent,omitempty"`
	Assets []Asset        `gorm:"foreignKey:CategoryID" json:"assets,omitempty"`
}

func (AssetCategory) TableName() string {
	return "asset_categories"
}

func (ac *AssetCategory) BeforeCreate(tx *gorm.DB) error {
	if ac.ID == "" {
		ac.ID = uuid.New().String()
	}
	ac.CreatedBy = tx.Statement.Context.Value("user_id").(string)
	return nil
}