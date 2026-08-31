package handler

import (
	"my-go-second-project/internal/models"
	"my-go-second-project/internal/service"
	"my-go-second-project/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CredentialHandler struct {
	service *service.CredentialService
}

func NewCredentialHandler(service *service.CredentialService) *CredentialHandler {
	return &CredentialHandler{service: service}
}

func (h *CredentialHandler) Create(c *gin.Context) {
	var credential models.Credential
	if err := c.ShouldBindJSON(&credential); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}

	if err := h.service.Create(&credential); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Creation failed", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Credential created successfully", credential)
}

func (h *CredentialHandler) GetAll(c *gin.Context) {
	credentials, err := h.service.GetAll()
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to get credentials", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Credentials retrieved successfully", credentials)
}

func (h *CredentialHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	credential, err := h.service.GetByID(id)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Credential not found", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Credential retrieved successfully", credential)
}

func (h *CredentialHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var credential models.Credential
	if err := c.ShouldBindJSON(&credential); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}
	credential.ID = id

	if err := h.service.Update(&credential); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Update failed", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Credential updated successfully", credential)
}

func (h *CredentialHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	if err := h.service.Delete(id); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Delete failed", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Credential deleted successfully", nil)
}
