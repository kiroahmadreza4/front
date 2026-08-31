// internal/handler/userHandler.go
package handler

import (
	"net/http"
	"my-go-second-project/internal/models"
	"my-go-second-project/internal/service"
	"my-go-second-project/utils"
	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService *service.UserService
}

func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

func (h *UserHandler) GetAll(c *gin.Context) {
	users, err := h.userService.GetAll()
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to get users", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Users retrieved successfully", users)
}

func (h *UserHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	user, err := h.userService.GetByID(id)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "User not found", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "User retrieved successfully", user)
}

func (h *UserHandler) GetProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "Unauthorized", "User not found in context")
		return
	}

	user, err := h.userService.GetByID(userID.(string))
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "User not found", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "Profile retrieved successfully", user)
}

func (h *UserHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}
	user.ID = id

	if err := h.userService.Update(&user); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Update failed", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "User updated successfully", user)
}

func (h *UserHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	if err := h.userService.Delete(id); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Delete failed", err.Error())
		return
	}
	utils.SuccessResponse(c, http.StatusOK, "User deleted successfully", nil)
}