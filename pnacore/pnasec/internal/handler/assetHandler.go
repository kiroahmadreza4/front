package handler

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"my-go-second-project/internal/models"
	"my-go-second-project/internal/service"
	"my-go-second-project/utils"
)

type AssetHandler struct {
	service *service.AssetService
}

func NewAssetHandler(service *service.AssetService) *AssetHandler {
	return &AssetHandler{service: service}
}

func (h *AssetHandler) Create(c *gin.Context) {
	var asset models.Asset
	if err := c.ShouldBindJSON(&asset); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}

	if err := h.service.Create(&asset); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Creation failed", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Asset created successfully", asset)
}

func (h *AssetHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	asset, err := h.service.GetByID(id)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Asset not found", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Asset retrieved successfully", asset)
}

func (h *AssetHandler) GetAll(c *gin.Context) {
	assets, err := h.service.GetAll()
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to get assets", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Assets retrieved successfully", assets)
}

func (h *AssetHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var asset models.Asset
	if err := c.ShouldBindJSON(&asset); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}
	asset.ID = id

	if err := h.service.Update(&asset); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Update failed", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Asset updated successfully", asset)
}

func (h *AssetHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	if err := h.service.Delete(id); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Delete failed", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Asset deleted successfully", nil)
}

func (h *AssetHandler) GetByTypeID(c *gin.Context) {
	typeID := c.Param("typeId")
	assets, err := h.service.GetByTypeID(typeID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Failed to get assets by type", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Assets retrieved successfully", assets)
}

func (h *AssetHandler) GetByCategoryID(c *gin.Context) {
	categoryID := c.Param("categoryId")
	assets, err := h.service.GetByCategoryID(categoryID)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Failed to get assets by category", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Assets retrieved successfully", assets)
}