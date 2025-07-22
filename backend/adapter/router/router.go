package router

import (
	"net/http"

	"github.com/gorilla/mux"

	"task_estimate_app/backend/adapter/handler"
	"task_estimate_app/backend/adapter/middleware"
)

// Router はアプリケーションのルーターを設定します
type Router struct {
	userHandler      *handler.UserHandler
	workspaceHandler *handler.WorkspaceHandler
}

// NewRouter はRouterを生成します
func NewRouter(userHandler *handler.UserHandler, workspaceHandler *handler.WorkspaceHandler) *Router {
	return &Router{
		userHandler:      userHandler,
		workspaceHandler: workspaceHandler,
	}
}

// Setup はルーターの設定を行います
func (r *Router) Setup() *mux.Router {
	router := mux.NewRouter()

	// CORSミドルウェアを適用
	router.Use(middleware.CORS)

	// APIのバージョンプレフィックス
	api := router.PathPrefix("/api/v1").Subrouter()

	// ユーザー関連のエンドポイント
	api.HandleFunc("/users", r.userHandler.GetUsers).Methods(http.MethodGet, http.MethodOptions)
	api.HandleFunc("/users/{id}", r.userHandler.GetUser).Methods(http.MethodGet, http.MethodOptions)

	// 認証関連のエンドポイント
	api.HandleFunc("/signup", r.userHandler.CreateAccount).Methods(http.MethodPost, http.MethodOptions)
	api.HandleFunc("/login", r.userHandler.LoginHandler).Methods(http.MethodPost, http.MethodOptions)

	// ワークスペース関連のエンドポイント
	api.HandleFunc("/workspaces", r.workspaceHandler.CreateWorkspace).Methods(http.MethodPost, http.MethodOptions)
	api.HandleFunc("/workspaces", r.workspaceHandler.GetWorkspaces).Methods(http.MethodGet, http.MethodOptions)
	api.HandleFunc("/workspaces/{id}", r.workspaceHandler.GetWorkspace).Methods(http.MethodGet, http.MethodOptions)
	api.HandleFunc("/workspaces/{id}", r.workspaceHandler.UpdateWorkspace).Methods(http.MethodPut, http.MethodOptions)
	api.HandleFunc("/workspaces/{id}", r.workspaceHandler.DeleteWorkspace).Methods(http.MethodDelete, http.MethodOptions)
	api.HandleFunc("/workspaces/order", r.workspaceHandler.UpdateWorkspaceOrder).Methods(http.MethodPatch, http.MethodOptions)

	// ヘルスチェック
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}).Methods(http.MethodGet)

	return router
}
