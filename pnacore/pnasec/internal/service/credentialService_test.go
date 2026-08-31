package service

import (
	"testing"

	"my-go-second-project/internal/models"
)

func TestSanitizeOptionalUUIDs(t *testing.T) {
	validID := "123e4567-e89b-12d3-a456-426614174000"
	credential := &models.Credential{
		Name:     "Database",
		Username: "admin",
		Password: "secret",
	}

	credential.CategoryID = &validID
	credential.TypeID = nil
	sanitizeCredentialUUIDs(credential)

	if credential.CategoryID == nil || *credential.CategoryID != validID {
		t.Fatalf("expected valid category UUID to remain unchanged")
	}
	if credential.TypeID != nil {
		t.Fatalf("expected nil type UUID to stay nil")
	}

	blankCategory := "   "
	blankType := ""
	credential.CategoryID = &blankCategory
	credential.TypeID = &blankType
	sanitizeCredentialUUIDs(credential)

	if credential.CategoryID != nil {
		t.Fatalf("expected blank category UUID to be cleared")
	}
	if credential.TypeID != nil {
		t.Fatalf("expected blank type UUID to be cleared")
	}
}
