package handler

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"

	"task_estimate_app/backend/adapter/middleware"
	"task_estimate_app/backend/domain/services"
	"task_estimate_app/backend/usecase/dto"
	"task_estimate_app/backend/usecase/interactor"
)

// UserInteractorInterface はユーザーインタラクターのインターフェースを定義します
type UserInteractorInterface interface {
	GetUser(ctx context.Context, input *dto.GetUserInput) (*dto.UserOutput, error)
	GetUsers(ctx context.Context) (*dto.UsersOutput, error)
	CreateUser(ctx context.Context, input *dto.CreateUserInput) (*dto.UserOutput, error)
}

// UserHandler はユーザー関連のHTTPリクエストを処理します
type UserHandler struct {
	userInteractor UserInteractorInterface
}

// NewUserHandler はUserHandlerを生成します
func NewUserHandler(userInteractor UserInteractorInterface) *UserHandler {
	return &UserHandler{
		userInteractor: userInteractor,
	}
}

// GetUser はユーザー情報を取得するハンドラーです
func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["id"]

	ctx := r.Context()
	input := &dto.GetUserInput{
		ID: userID,
	}

	output, err := h.userInteractor.GetUser(ctx, input)
	if err != nil {
		handler := middleware.NewResponseHandler(w)
		if err == interactor.ErrUserNotFound {
			handler.SendNotFound("user not found")
			return
		}
		handler.SendInternalServerError()
		return
	}

	// 名前のUTF-8検証と正規化
	if output != nil {
		output.Name = middleware.SanitizeString(output.Name)
	}
	
	handler := middleware.NewResponseHandler(w)
	handler.SendSuccess(http.StatusOK, output)
}

// GetUsers はユーザー一覧を取得するハンドラーです
func (h *UserHandler) GetUsers(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	output, err := h.userInteractor.GetUsers(ctx)
	if err != nil {
		handler := middleware.NewResponseHandler(w)
		handler.SendInternalServerError()
		return
	}

	// 各ユーザーの名前のUTF-8検証と正規化
	if output != nil && output.Users != nil {
		for _, user := range output.Users {
			if user != nil {
				user.Name = middleware.SanitizeString(user.Name)
			}
		}
	}
	
	handler := middleware.NewResponseHandler(w)
	handler.SendSuccess(http.StatusOK, output)
}

// CreateUser は新規ユーザーを作成するハンドラーです
func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var input dto.CreateUserInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		handler := middleware.NewResponseHandler(w)
		handler.SendBadRequest("invalid request body")
		return
	}

	// 入力データの正規化
	input.Name = middleware.SanitizeString(input.Name)
	
	ctx := r.Context()
	output, err := h.userInteractor.CreateUser(ctx, &input)
	if err != nil {
		handler := middleware.NewResponseHandler(w)
		// エラーの種類によって適切なステータスコードを返す
		if err == services.ErrEmailAlreadyExists {
			handler.SendBadRequest("email already exists")
			return
		}
		handler.SendInternalServerError()
		return
	}

	handler := middleware.NewResponseHandler(w)
	handler.SendSuccess(http.StatusCreated, output)
}
