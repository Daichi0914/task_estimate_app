package di

import (
	"database/sql"

	"task_estimate_app/backend/adapter/handler"
	"task_estimate_app/backend/adapter/repository"
	"task_estimate_app/backend/adapter/router"
	"task_estimate_app/backend/domain/services"
	"task_estimate_app/backend/infrastructure/config"
	"task_estimate_app/backend/usecase/interactor"
)

// Container はDIコンテナを表す
type Container struct {
	cfg               *config.Config
	db                *sql.DB
	userHandler       *handler.UserHandler
	workspaceHandler  *handler.WorkspaceHandler
	router            *router.Router
}

// NewContainer は新しいDIコンテナを作成する
func NewContainer(cfg *config.Config, db *sql.DB) *Container {
	container := &Container{
		cfg: cfg,
		db:  db,
	}
	
	container.buildDependencies()
	return container
}

// buildDependencies は依存関係を構築する
func (c *Container) buildDependencies() {
	// リポジトリの初期化
	userRepo := repository.NewUserRepository(c.db)
	workspaceRepo := repository.NewWorkspaceRepository(c.db)

	// ドメインサービスの初期化
	userService := services.NewUserService(userRepo)
	workspaceService := services.NewWorkspaceService(workspaceRepo)

	// ユースケースの初期化
	userInteractor := interactor.NewUserInteractor(userRepo, userService)
	workspaceInteractor := interactor.NewWorkspaceInteractor(workspaceRepo, workspaceService)

	// ハンドラーの初期化
	c.userHandler = handler.NewUserHandler(userInteractor, userRepo, userService)
	c.workspaceHandler = handler.NewWorkspaceHandler(workspaceInteractor)

	// ルーターの初期化
	c.router = router.NewRouter(c.userHandler, c.workspaceHandler)
}

// GetRouter はルーターを取得する
func (c *Container) GetRouter() *router.Router {
	return c.router
}

// GetConfig は設定を取得する
func (c *Container) GetConfig() *config.Config {
	return c.cfg
}