package entity

import (
	"time"
)

type User struct {
	ID           string
	Email        string
	PasswordHash string
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

func (u *User) ChangeEmail(email string) {
	u.Email = email
	u.UpdatedAt = time.Now()
}

func (u *User) SetPasswordHash(passwordHash string) {
	u.PasswordHash = passwordHash
	u.UpdatedAt = time.Now()
}

// NewUserWithPassword はパスワード付きのユーザーエンティティを生成します
func NewUserWithPassword(id, email, passwordHash string) *User {
	now := time.Now()
	return &User{
		ID:           id,
		Email:        email,
		PasswordHash: passwordHash,
		CreatedAt:    now,
		UpdatedAt:    now,
	}
}
