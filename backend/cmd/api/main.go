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

	// ドメインサービスの初期化
	userService := services.NewUserService(userRepo)

	// ユースケースの初期化
	userInteractor := interactor.NewUserInteractor(userRepo, userService)

	// ハンドラーの初期化
	userHandler := handler.NewUserHandler(userInteractor)

	// ルーターの設定
	r := router.NewRouter(userHandler)
	muxRouter := r.Setup()

	// サーバーの起動
	addr := fmt.Sprintf(":%s", cfg.ServerPort)
	log.Printf("Server starting on %s", addr)
	if err := http.ListenAndServe(addr, muxRouter); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
