// @title           Task Estimate API
// @version         1.0
// @description     This is the API documentation for Task Estimate App.
// @host            localhost:8080
// @BasePath        /api/v1
package main

import (
	"fmt"
	"log"
	"net/http"

	"task_estimate_app/backend/adapter/handler"
	"task_estimate_app/backend/adapter/repository"
	"task_estimate_app/backend/adapter/router"
	"task_estimate_app/backend/domain/services"
	"task_estimate_app/backend/infrastructure/bootstrap"
	"task_estimate_app/backend/infrastructure/config"
	"task_estimate_app/backend/usecase/interactor"

	_ "task_estimate_app/backend/docs"

	httpSwagger "github.com/swaggo/http-swagger"
)

func main() {
	// 設定の読み込み
	cfg, err := config.NewConfig()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// データベース接続の初期化
	db := bootstrap.InitDB(cfg)
	defer db.Close()

	// リポジトリの初期化
	userRepo := repository.NewUserRepository(db)
	workspaceRepo := repository.NewWorkspaceRepository(db)

	// ドメインサービスの初期化
	userService := services.NewUserService(userRepo)
	workspaceService := services.NewWorkspaceService(workspaceRepo)

	// ユースケースの初期化
	userInteractor := interactor.NewUserInteractor(userRepo, userService)
	workspaceInteractor := interactor.NewWorkspaceInteractor(workspaceRepo, workspaceService)

	// ハンドラーの初期化
	userHandler := handler.NewUserHandler(userInteractor, userRepo, userService)
	workspaceHandler := handler.NewWorkspaceHandler(workspaceInteractor)

	// ルーターの設定
	r := router.NewRouter(userHandler, workspaceHandler)
	router := r.Setup()

	// Swagger UIエンドポイント追加
	router.PathPrefix("/swagger/").Handler(httpSwagger.Handler(
		httpSwagger.URL("/swagger/doc.json"),
	))

	// サーバーの起動
	addr := fmt.Sprintf(":%s", cfg.ServerPort)
	log.Printf("Server starting on %s", addr)
	if err := http.ListenAndServe(addr, router); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
