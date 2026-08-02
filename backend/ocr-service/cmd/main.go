package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "UP",
			"service": "ocr-service",
		})
	})

	fmt.Println("Starting OCR Service in Go on port 8085...")
	if err := r.Run(":8085"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
