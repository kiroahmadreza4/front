package handler

import (
	"net/http"
	// "context"
	"github.com/gin-gonic/gin"
	"my-go-second-project/internal/models"
	"my-go-second-project/internal/service"
	"my-go-second-project/utils"
)

type AssetTypeHandler struct {
	service *service.AssetTypeService
}

func NewAssetTypeHandler(service *service.AssetTypeService) *AssetTypeHandler {
	return &AssetTypeHandler{service: service}
}

func (h *AssetTypeHandler) GetAll(c *gin.Context) {
	types, err := h.service.GetAllActive()
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to get types", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Types retrieved successfully", types)
}

func (h *AssetTypeHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	assetType, err := h.service.GetByID(id)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Type not found", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Type retrieved successfully", assetType)
}

func (h *AssetTypeHandler) Create(c *gin.Context) {
	var assetType models.AssetType
	if err := c.ShouldBindJSON(&assetType); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}
	
	ctx := c.Request.Context()
	if err := h.service.Create(ctx, &assetType); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Creation failed", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusCreated, "Type created successfully", assetType)
}

func (h *AssetTypeHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var assetType models.AssetType
	if err := c.ShouldBindJSON(&assetType); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}
	assetType.ID = id

	if err := h.service.Update(&assetType); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Update failed", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Type updated successfully", assetType)
}

func (h *AssetTypeHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	if err := h.service.Delete(id); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Delete failed", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Type deleted successfully", nil)
}