package models

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Asset مدل دارایی
type Asset struct {
	ID          string         `gorm:"type:uuid;primaryKey" json:"id"`
	Name        string         `gorm:"size:255;not null;index" json:"name"`
	Description string         `gorm:"size:1000" json:"description"`
	IPAddress   string         `gorm:"type:inet;unique;not null;index" json:"ip_address"`
	Hostname    string         `gorm:"size:255;index" json:"hostname"`
	MACAddress  string         `gorm:"size:17" json:"mac_address"`
	Domain      string         `gorm:"size:255;index" json:"domain"`
	Location    string         `gorm:"size:255" json:"location"`
	OS          string         `gorm:"size:100;index" json:"os"`
	OSVersion   string         `gorm:"size:100" json:"os_version"`
	Kernel      string         `gorm:"size:100" json:"kernel"`
	Architecture string        `gorm:"size:50" json:"architecture"`
	
	// ارتباطات با UUID
	CategoryID  *string        `gorm:"type:uuid;index" json:"category_id"`
	TypeID      *string        `gorm:"type:uuid;index" json:"type_id"`
	
	Source      string         `gorm:"size:50;default:manual" json:"source"`
	Criticality string         `gorm:"size:20;default:medium;index" json:"criticality"`
	Environment string         `gorm:"size:50;default:production;index" json:"environment"`
	Owner       string         `gorm:"size:255;index" json:"owner"`
	Department  string         `gorm:"size:255;index" json:"department"`
	Status      string         `gorm:"size:50;default:active;index" json:"status"`
	Health      string         `gorm:"size:50;default:healthy;index" json:"health"`
	CredentialID *string       `gorm:"type:uuid;index" json:"credential_id"`
	
	VulnerabilityCount int     `gorm:"default:0" json:"vulnerability_count"`
	CriticalVulnCount  int     `gorm:"default:0" json:"critical_vuln_count"`
	HighVulnCount      int     `gorm:"default:0" json:"high_vuln_count"`
	MediumVulnCount    int     `gorm:"default:0" json:"medium_vuln_count"`
	LowVulnCount       int     `gorm:"default:0" json:"low_vuln_count"`
	ComplianceStatus   string  `gorm:"size:50;default:pending;index" json:"compliance_status"`
	ComplianceScore    int     `gorm:"default:0" json:"compliance_score"`
	
	LastScannedAt   *time.Time `json:"last_scanned_at"`
	LastDiscoveryAt *time.Time `json:"last_discovery_at"`
	LastSeenAt      *time.Time `json:"last_seen_at"`
	DiscoveredAt    *time.Time `json:"discovered_at"`
	IsDeleted   	bool       `gorm:"default:false;index" json:"is_deleted"`
	CreatedBy       string     `gorm:"size:255" json:"created_by"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`

	// ارتباطات
	Category *AssetCategory `gorm:"foreignKey:CategoryID;references:ID" json:"category,omitempty"`
	Type     *AssetType     `gorm:"foreignKey:TypeID;references:ID" json:"type,omitempty"`
}

func (Asset) TableName() string {
	return "assets"
}

func (a *Asset) BeforeCreate(tx *gorm.DB) error {
	if a.ID == "" {
		a.ID = uuid.New().String()
	}
	if userID, ok := tx.Statement.Context.Value("user_id").(string); ok {
		a.CreatedBy = userID
	}
	return nil
}