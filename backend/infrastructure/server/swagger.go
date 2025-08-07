//go:build swagger

package server

import (
	"log"

	httpSwagger "github.com/swaggo/http-swagger"
)

// init はswagger有効時にサーバー設定をフックする
func init() {
	setupSwaggerHook = setupSwaggerImpl
}

// setupSwaggerImpl はSwagger UIを設定する実装
func setupSwaggerImpl(s *Server) {
	s.router.PathPrefix("/swagger/").Handler(httpSwagger.Handler(
		httpSwagger.URL("/swagger/doc.json"),
	))
	log.Println("Swagger UI enabled at /swagger/")
}
