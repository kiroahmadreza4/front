package middlewares

import (
	"log"
	"time"
	"github.com/gin-gonic/gin"
)

// LoggerMiddleware لاگ‌گیری تمام درخواست‌ها
func LoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		startTime := time.Now()

		c.Next()

		duration := time.Since(startTime)
		log.Printf(
			"[%s] %s %s %d %s",
			c.Request.Method,
			c.Request.URL.Path,
			c.ClientIP(),
			c.Writer.Status(),
			duration,
		)
	}
}