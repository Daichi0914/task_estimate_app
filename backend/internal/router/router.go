package router

import (
	"github.com/Daichi0914/task_estimate_app/handler"
	"net/http"
)

func New() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", handler.HealthCheck)
	return mux
}
