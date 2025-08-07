package app

import (
	"log"

	"task_estimate_app/backend/infrastructure/bootstrap"
	"task_estimate_app/backend/infrastructure/config"
	"task_estimate_app/backend/infrastructure/di"
	"task_estimate_app/backend/infrastructure/env"
	"task_estimate_app/backend/infrastructure/server"
)

// App はアプリケーション全体を表す
type App struct {
	server *server.Server
}

// New は新しいアプリケーションインスタンスを作成する
func New(environment string) (*App, error) {
	// 環境ファイルの読み込み
	env.LoadFile(environment)

	// 設定の読み込み
	cfg, err := config.NewConfig()
	if err != nil {
		return nil, err
	}

	// データベース接続の初期化
	db := bootstrap.InitDB(cfg)

	// DIコンテナの作成
	container := di.NewContainer(cfg, db)

	// サーバーの作成
	srv := server.NewServer(cfg, container.GetRouter())

	return &App{
		server: srv,
	}, nil
}

// Run はアプリケーションを実行する
func (a *App) Run() error {
	if err := a.server.Start(); err != nil {
		log.Fatalf("Server failed to start: %v", err)
		return err
	}
	return nil
}