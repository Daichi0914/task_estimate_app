package handler

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"

	"log"
	"task_estimate_app/backend/adapter/middleware"
	domainRepo "task_estimate_app/backend/domain/repository"
	"task_estimate_app/backend/domain/services"
	"task_estimate_app/backend/usecase/dto"
	"task_estimate_app/backend/usecase/interactor"
)

type UserInteractorInterface interface {
	GetUser(ctx context.Context, input *dto.GetUserInput) (*dto.UserOutput, error)
	GetUsers(ctx context.Context) (*dto.UsersOutput, error)
	CreateUser(ctx context.Context, input *dto.CreateUserInput) (*dto.UserOutput, error)
}

type UserHandler struct {
	userInteractor UserInteractorInterface
	userRepo       domainRepo.UserRepository
	userService    services.UserServiceInterface
}

func NewUserHandler(userInteractor UserInteractorInterface, userRepo domainRepo.UserRepository, userService services.UserServiceInterface) *UserHandler {
	return &UserHandler{
		userInteractor: userInteractor,
		userRepo:       userRepo,
		userService:    userService,
	}
}

// @Summary      ユーザー取得
// @Description  指定したIDのユーザー情報を取得
// @Produce      json
// @Param        id path string true "ユーザーID"
// @Success      200 {object} dto.UserOutput
// @Failure      404 {string} string "user not found"
// @Router       /users/{id} [get]
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

// @Summary      ユーザー一覧取得
// @Description  全ユーザーの一覧を取得
// @Produce      json
// @Success      200 {object} dto.UsersOutput
// @Router       /users [get]
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

// @Summary      ユーザー作成
// @Description  新しいユーザーを作成
// @Accept       json
// @Produce      json
// @Param        user body dto.CreateUserInput true "ユーザー作成情報"
// @Success      201 {object} dto.UserOutput
// @Failure      400 {string} string "invalid request body or email already exists"
// @Router       /users [post]
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

// @Summary      ログイン
// @Description  ユーザーのログイン
// @Accept       json
// @Produce      json
// @Param        login body dto.LoginRequestDTO true "ログイン情報"
// @Success      200 {object} dto.LoginResponseDTO
// @Failure      401 {string} string "invalid credentials"
// @Router       /login [post]
func (h *UserHandler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	var req dto.LoginRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("[LoginHandler] JSON decode error: %v", err)
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}
	ctx := context.Background()
	user, err := h.userService.Authenticate(ctx, req.Email, req.Password)
	if err != nil {
		log.Printf("[LoginHandler] Auth error: %v (email=%s)", err, req.Email)
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}
	token, err := services.GenerateJWT(user.ID)
	if err != nil {
		log.Printf("[LoginHandler] JWT error: %v", err)
		http.Error(w, "failed to generate token", http.StatusInternalServerError)
		return
	}
	res := dto.LoginResponseDTO{Token: token}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(res); err != nil {
		log.Printf("[LoginHandler] Response encode error: %v", err)
	}
}
