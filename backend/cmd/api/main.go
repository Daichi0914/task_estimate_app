// @title           Task Estimate API
// @version         1.0
// @description     This is the API documentation for Task Estimate App.
// @host            localhost:8080
// @BasePath        /api/v1
package main

import (
	"flag"
	"log"

	"task_estimate_app/backend/infrastructure/app"
	_ "task_estimate_app/backend/docs"
)

func main() {
	// コマンドライン引数の解析
	env := flag.String("env", "dev", "Environment (dev, prod, test)")
	flag.Parse()

	// アプリケーションの作成
	application, err := app.New(*env)
	if err != nil {
		log.Fatalf("Failed to create application: %v", err)
	}

	// アプリケーションの実行
	if err := application.Run(); err != nil {
		log.Fatalf("Application failed to run: %v", err)
	}
}
