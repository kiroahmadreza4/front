// middlewares/auth.go
package middlewares

import (
	"context"
	"net/http"
	"strings"
	"my-go-second-project/internal/service"
	"my-go-second-project/utils"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Unauthorized", "Authorization header is required")
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Unauthorized", "Invalid authorization format. Use Bearer token")
			c.Abort()
			return
		}

		claims, err := service.ValidateToken(parts[1])
		if err != nil {
			utils.ErrorResponse(c, http.StatusUnauthorized, "Unauthorized", err.Error())
			c.Abort()
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("email", claims.Email)
		ctx := context.WithValue(c.Request.Context(), "user_id", claims.UserID)
		c.Request = c.Request.WithContext(ctx)

		c.Next()
	}
}