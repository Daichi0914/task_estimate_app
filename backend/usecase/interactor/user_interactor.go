package interactor

import (
	"context"
	"errors"

	"task_estimate_app/backend/domain/repository"
	"task_estimate_app/backend/domain/services"
	"task_estimate_app/backend/usecase/dto"
)

var (
	ErrUserNotFound = errors.New("user not found")
)

type UserInteractor struct {
	userRepo    repository.UserRepository
	userService services.UserServiceInterface
}

func NewUserInteractor(
	userRepo repository.UserRepository,
	userService services.UserServiceInterface,
) *UserInteractor {
	return &UserInteractor{
		userRepo:    userRepo,
		userService: userService,
	}
}

func (i *UserInteractor) GetUser(ctx context.Context, input *dto.GetUserInput) (*dto.UserOutput, error) {
	// リポジトリからユーザーを取得
	user, err := i.userRepo.FindByID(ctx, input.ID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, ErrUserNotFound
	}

	// ドメインオブジェクトをDTOに変換して返却
	return dto.NewUserOutput(user), nil
}

func (i *UserInteractor) GetUsers(ctx context.Context) (*dto.UsersOutput, error) {
	// リポジトリからすべてのユーザーを取得
	users, err := i.userRepo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	// ドメインオブジェクトをDTOに変換して返却
	return dto.NewUsersOutput(users), nil
}

func (i *UserInteractor) CreateAccount(ctx context.Context, input *dto.CreateAccountInput) (*dto.UserOutput, error) {
	// ユーザーサービスを使用してアカウントを作成
	user, err := i.userService.CreateAccount(ctx, input.Email, input.Password)
	if err != nil {
		return nil, err
	}

	// ドメインオブジェクトをDTOに変換して返却
	return dto.NewUserOutput(user), nil
}
