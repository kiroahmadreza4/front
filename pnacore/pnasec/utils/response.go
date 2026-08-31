package utils

import (
	"github.com/gin-gonic/gin"
)

// Response ساختار پاسخ استاندارد
type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// SuccessResponse پاسخ موفقیت‌آمیز
func SuccessResponse(c *gin.Context, status int, message string, data interface{}) {
	c.JSON(status, Response{
		Success: true,
		Message: message,
		Data:    data,
	})
}

// ErrorResponse پاسخ خطا
func ErrorResponse(c *gin.Context, status int, message string, error string) {
	c.JSON(status, Response{
		Success: false,
		Message: message,
		Error:   error,
	})
}

// MessageResponse پاسخ با پیام
func MessageResponse(c *gin.Context, status int, message string) {
	c.JSON(status, Response{
		Success: true,
		Message: message,
	})
}