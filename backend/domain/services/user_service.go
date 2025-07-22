package services

import (
	"context"
	"errors"

	"task_estimate_app/backend/domain/entity"
	"task_estimate_app/backend/domain/repository"

	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrEmailAlreadyExists = errors.New("email already exists")
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrUserNotFound       = errors.New("user not found")
)

const jwtSecret = "your-secret-key" // TODO: 環境変数等で管理
const jwtExpireDuration = time.Hour * 24

// UserServiceInterface はユーザーサービスのインターフェースを定義します
type UserServiceInterface interface {
	ValidateUniqueEmail(ctx context.Context, email string) bool
	Authenticate(ctx context.Context, email, password string) (*entity.User, error)
	CreateAccount(ctx context.Context, email, password string) (*entity.User, error)
}

// UserService はユーザーに関するドメインサービスです
type UserService struct {
	userRepo repository.UserRepository
}

// NewUserService はUserServiceを生成します
func NewUserService(userRepo repository.UserRepository) UserServiceInterface {
	return &UserService{
		userRepo: userRepo,
	}
}

// ValidateUniqueEmail はメールアドレスが一意であるか確認します
// このメソッドは実際の実装では、emailによるユーザー検索を行いますが、
// サンプルとしては単純に常にtrueを返します
func (s *UserService) ValidateUniqueEmail(ctx context.Context, email string) bool {
	// リポジトリからメールアドレスでユーザーを検索
	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		// エラーが発生した場合は、安全側に倒して一意でないとみなす
		return false
	}
	// userがnilの場合、そのメールアドレスのユーザーは存在しないため一意
	return user == nil
}

// Authenticate はメールアドレスとパスワードでユーザー認証を行います
func (s *UserService) Authenticate(ctx context.Context, email, password string) (*entity.User, error) {
	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		return nil, ErrInvalidCredentials
	}
	if user == nil {
		return nil, ErrUserNotFound
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, ErrInvalidCredentials
	}
	return user, nil
}

// CreateAccount は新しいアカウントを作成します
func (s *UserService) CreateAccount(ctx context.Context, email, password string) (*entity.User, error) {
	// メールアドレスの重複チェック
	if !s.ValidateUniqueEmail(ctx, email) {
		return nil, ErrEmailAlreadyExists
	}

	// パスワードのハッシュ化
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// UUIDを生成
	userID := uuid.New().String()

	// ユーザーエンティティの作成
	user := entity.NewUserWithPassword(userID, email, string(hashedPassword))

	// リポジトリに保存
	err = s.userRepo.Create(ctx, user)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// GenerateJWT はユーザーIDを元にJWTトークンを生成します
func GenerateJWT(userID string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(jwtExpireDuration).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtSecret))
}
