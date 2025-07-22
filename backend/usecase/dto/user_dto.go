package dto

import (
	"time"

	"task_estimate_app/backend/domain/entity"
)

type CreateAccountInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type GetUserInput struct {
	ID string `json:"id"`
}

type UserOutput struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func NewUserOutput(user *entity.User) *UserOutput {
	return &UserOutput{
		ID:        user.ID,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}
}

type UsersOutput struct {
	Users []*UserOutput `json:"users"`
}

func NewUsersOutput(users []*entity.User) *UsersOutput {
	userOutputs := make([]*UserOutput, len(users))
	for i, user := range users {
		userOutputs[i] = NewUserOutput(user)
	}
	return &UsersOutput{
		Users: userOutputs,
	}
}

type LoginRequestDTO struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponseDTO struct {
	Token  string `json:"token"`
	UserID string `json:"user_id"`
}
