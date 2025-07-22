package entity

import (
	"time"
)

type User struct {
	ID           string
	Name         string
	Email        string
	PasswordHash string
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

func NewUser(id, name, email string) *User {
	now := time.Now()
	return &User{
		ID:           id,
		Name:         name,
		Email:        email,
		PasswordHash: "",
		CreatedAt:    now,
		UpdatedAt:    now,
	}
}

func (u *User) ChangeName(name string) {
	u.Name = name
	u.UpdatedAt = time.Now()
}

func (u *User) ChangeEmail(email string) {
	u.Email = email
	u.UpdatedAt = time.Now()
}
