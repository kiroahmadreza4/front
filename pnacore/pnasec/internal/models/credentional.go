// internal/models/credential.go
package models

import (
	"strings"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Credential مدل اعتبارنامه
type Credential struct {
	ID          string  `gorm:"type:uuid;primaryKey" json:"id"`
	Name        string  `gorm:"size:255;not null;index" json:"name"`
	Description string  `gorm:"size:1000" json:"description"`

	// ارتباطات با UUID (اختیاری برای سازگاری با فرانت)
	CategoryID *string `gorm:"type:uuid;index" json:"category_id"`
	TypeID     *string `gorm:"type:uuid;index" json:"type_id"`

	// اطلاعات اعتبارنامه (حساس)
	Username    string `gorm:"size:255" json:"username"`
	Password    string `gorm:"size:500" json:"password"`
	PrivateKey  string `gorm:"type:text" json:"private_key"`
	Certificate string `gorm:"type:text" json:"certificate"`
	APIKey      string `gorm:"size:500" json:"api_key"`
	Token       string `gorm:"size:500" json:"token"`

	// اطلاعات اتصال
	Host   string `gorm:"size:255" json:"host"`
	Port   int    `gorm:"default:0" json:"port"`
	Domain string `gorm:"size:255" json:"domain"`

	// وضعیت
	IsActive        bool       `gorm:"default:true;index" json:"is_active"`
	IsDeleted       bool       `gorm:"default:false;index" json:"is_deleted"`
	LastValidatedAt *time.Time `json:"last_validated_at"`
	LastUsedAt      *time.Time `json:"last_used_at"`

	// Audit fields
	CreatedBy string         `gorm:"size:255" json:"created_by"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	// فیلدهای سازگار برای فرانت
	Category string `gorm:"-" json:"category,omitempty"`
	Type     string `gorm:"-" json:"type"`
}

func (Credential) TableName() string {
	return "credentials"
}

func (c *Credential) BeforeCreate(tx *gorm.DB) error {
	if c.ID == "" {
		c.ID = uuid.New().String()
	}
	if userID, ok := tx.Statement.Context.Value("user_id").(string); ok {
		c.CreatedBy = userID
	}
	if c.Port == 0 {
		c.Port = 22
	}
	if c.CategoryID != nil && strings.TrimSpace(*c.CategoryID) == "" {
		c.CategoryID = nil
	}
	if c.TypeID != nil && strings.TrimSpace(*c.TypeID) == "" {
		c.TypeID = nil
	}
	return nil
}
