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
	CreateAccount(ctx context.Context, input *dto.CreateAccountInput) (*dto.UserOutput, error)
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
// @Failure      404 {string} string "ユーザーが見つかりません"
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
			handler.SendNotFound("ユーザーが見つかりません")
			return
		}
		handler.SendInternalServerError()
		return
	}

	handler := middleware.NewResponseHandler(w)
	handler.SendSuccess(http.StatusOK, output)
}

// @Summary      アカウント作成
// @Description  新しいアカウントを作成
// @Accept       json
// @Produce      json
// @Param        account body dto.CreateAccountInput true "アカウント作成情報"
// @Success      201 {object} dto.UserOutput
// @Failure      400 {string} string "リクエストボディが無効です or メールアドレスは既に使用されています"
// @Router       /signup [post]
func (h *UserHandler) CreateAccount(w http.ResponseWriter, r *http.Request) {
	var input dto.CreateAccountInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		handler := middleware.NewResponseHandler(w)
		handler.SendBadRequest("リクエストボディが無効です")
		return
	}

	ctx := r.Context()
	output, err := h.userInteractor.CreateAccount(ctx, &input)
	if err != nil {
		handler := middleware.NewResponseHandler(w)
		// エラーの種類によって適切なステータスコードを返す
		if err == services.ErrEmailAlreadyExists {
			handler.SendBadRequest("メールアドレスは既に使用されています")
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
// @Failure      400 {string} string "リクエストが無効です"
// @Failure      401 {string} string "メールアドレスまたはパスワードが正しくありません"
// @Failure      500 {string} string "トークンの生成に失敗しました"
// @Router       /login [post]
func (h *UserHandler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	var req dto.LoginRequestDTO
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("[LoginHandler] JSON decode error: %v", err)
		handler := middleware.NewResponseHandler(w)
		handler.SendBadRequest("リクエストが無効です")
		return
	}
	ctx := context.Background()
	user, err := h.userService.Authenticate(ctx, req.Email, req.Password)
	if err != nil {
		log.Printf("[LoginHandler] Auth error: %v (email=%s)", err, req.Email)
		handler := middleware.NewResponseHandler(w)
		if err == services.ErrUserNotFound {
			handler.SendError(http.StatusUnauthorized, "ユーザーが存在しません")
			return
		}
		handler.SendError(http.StatusUnauthorized, "メールアドレスまたはパスワードが正しくありません")
		return
	}
	token, err := services.GenerateJWT(user.ID)
	if err != nil {
		log.Printf("[LoginHandler] JWT error: %v", err)
		handler := middleware.NewResponseHandler(w)
		handler.SendInternalServerError()
		return
	}
	res := dto.LoginResponseDTO{Token: token, UserID: user.ID}
	handler := middleware.NewResponseHandler(w)
	handler.SendSuccess(http.StatusOK, res)
}
