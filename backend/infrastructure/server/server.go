package server

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"task_estimate_app/backend/adapter/router"
	"task_estimate_app/backend/infrastructure/config"
)

// setupSwaggerHook はSwagger設定のフック関数
var setupSwaggerHook func(*Server)

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
	
	if setupSwaggerHook != nil {
		setupSwaggerHook(server)
	}
	
	return server
}

// Start はサーバーを開始する
func (s *Server) Start() error {
	addr := fmt.Sprintf(":%s", s.cfg.ServerPort)
	log.Printf("Server starting on %s", addr)
	return http.ListenAndServe(addr, s.router)
}
