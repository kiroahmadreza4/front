// internal/handler/assetCategoryHandler.go
package handler

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"my-go-second-project/internal/models"
	"my-go-second-project/internal/service"
	"my-go-second-project/utils"
)

type AssetCategoryHandler struct {
	service *service.AssetCategoryService
}

func NewAssetCategoryHandler(service *service.AssetCategoryService) *AssetCategoryHandler {
	return &AssetCategoryHandler{service: service}
}

func (h *AssetCategoryHandler) GetByTypeID(c *gin.Context) {
	typeID := c.Param("typeId")
	categories, err := h.service.GetByTypeID(typeID)
	if err != nil {
		// اصلاح: 4 پارامتر
		utils.ErrorResponse(c, http.StatusBadRequest, "Failed to get categories by type", err.Error())
		return
	}
	// اصلاح: 4 پارامتر
	utils.SuccessResponse(c, http.StatusOK, "Categories retrieved successfully", categories)
}

func (h *AssetCategoryHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	category, err := h.service.GetByID(id)
	if err != nil {
		// اصلاح: 4 پارامتر
		utils.ErrorResponse(c, http.StatusNotFound, "Category not found", err.Error())
		return
	}
	// اصلاح: 4 پارامتر
	utils.SuccessResponse(c, http.StatusOK, "Category retrieved successfully", category)
}

func (h *AssetCategoryHandler) Create(c *gin.Context) {
	var category models.AssetCategory
	if err := c.ShouldBindJSON(&category); err != nil {
		// اصلاح: 4 پارامتر
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}
	ctx := c.Request.Context()
	if err := h.service.Create(ctx, &category); err != nil {
		// اصلاح: 4 پارامتر
		utils.ErrorResponse(c, http.StatusBadRequest, "Creation failed", err.Error())
		return
	}
	// اصلاح: 4 پارامتر
	utils.SuccessResponse(c, http.StatusCreated, "Category created successfully", category)
}

func (h *AssetCategoryHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var category models.AssetCategory
	if err := c.ShouldBindJSON(&category); err != nil {
		// اصلاح: 4 پارامتر
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}
	category.ID = id

	if err := h.service.Update(&category); err != nil {
		// اصلاح: 4 پارامتر
		utils.ErrorResponse(c, http.StatusBadRequest, "Update failed", err.Error())
		return
	}
	// اصلاح: 4 پارامتر
	utils.SuccessResponse(c, http.StatusOK, "Category updated successfully", category)
}

func (h *AssetCategoryHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	if err := h.service.Delete(id); err != nil {
		// اصلاح: 4 پارامتر
		utils.ErrorResponse(c, http.StatusBadRequest, "Delete failed", err.Error())
		return
	}
	// اصلاح: 4 پارامتر
	utils.SuccessResponse(c, http.StatusOK, "Category deleted successfully", nil)
}

func (h *AssetCategoryHandler) GetAllActive(c *gin.Context) {
	categories, err := h.service.GetAllActive()
	if err != nil {
		// اصلاح: 4 پارامتر
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to get categories", err.Error())
		return
	}
	// اصلاح: 4 پارامتر
	utils.SuccessResponse(c, http.StatusOK, "Categories retrieved successfully", categories)
}