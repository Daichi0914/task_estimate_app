package server

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gorilla/mux"
	httpSwagger "github.com/swaggo/http-swagger"
	"task_estimate_app/backend/adapter/router"
	"task_estimate_app/backend/infrastructure/config"
)

// Server はHTTPサーバーを表す
type Server struct {
	cfg    *config.Config
	router *mux.Router
}

// NewServer は新しいサーバーインスタンスを作成する
func NewServer(cfg *config.Config, r *router.Router) *Server {
	server := &Server{
		cfg:    cfg,
		router: r.Setup(),
	}
	
	// 環境設定に応じてSwagger UIを有効化
	if server.isSwaggerEnabled() {
		server.setupSwagger()
	}
	
	return server
}

// Start はサーバーを開始する
func (s *Server) Start() error {
	addr := fmt.Sprintf(":%s", s.cfg.ServerPort)
	log.Printf("Server starting on %s", addr)
	return http.ListenAndServe(addr, s.router)
}

// isSwaggerEnabled はSwaggerが有効かどうかを判定する
func (s *Server) isSwaggerEnabled() bool {
	return strings.ToLower(os.Getenv("ENABLE_SWAGGER")) == "true"
}

// setupSwagger はSwagger UIを設定する
func (s *Server) setupSwagger() {
	s.router.PathPrefix("/swagger/").Handler(httpSwagger.Handler(
		httpSwagger.URL("/swagger/doc.json"),
	))
	log.Println("Swagger UI enabled at /swagger/")
}