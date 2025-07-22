package repository

import (
	"context"
	"database/sql"
	"errors"

	"task_estimate_app/backend/domain/entity"
	domainRepo "task_estimate_app/backend/domain/repository"
)

var (
	ErrDBError = errors.New("database error")
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) domainRepo.UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (r *UserRepository) FindByID(ctx context.Context, id string) (*entity.User, error) {
	query := "SELECT id, email, password_hash, created_at, updated_at FROM users WHERE id = ?"

	var user entity.User
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // ユーザーが見つからない場合
		}
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*entity.User, error) {
	// LOWER関数を使用して大文字小文字を区別せずに検索
	query := "SELECT id, email, password_hash, created_at, updated_at FROM users WHERE LOWER(email) = LOWER(?)"

	var user entity.User
	err := r.db.QueryRowContext(ctx, query, email).Scan(
		&user.ID,
		&user.Email,
		&user.PasswordHash,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // ユーザーが見つからない場合
		}
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) Create(ctx context.Context, user *entity.User) error {
	// IDのバリデーション
	if user.ID == "" {
		return errors.New("user ID cannot be empty")
	}

	query := `INSERT INTO users (id, email, password_hash, created_at, updated_at) 
			  VALUES (?, ?, ?, ?, ?)`

	_, err := r.db.ExecContext(
		ctx,
		query,
		user.ID,
		user.Email,
		user.PasswordHash,
		user.CreatedAt,
		user.UpdatedAt,
	)

	if err != nil {
		return err
	}

	return nil
}

func (r *UserRepository) Update(ctx context.Context, user *entity.User) error {
	query := `UPDATE users 
			  SET email = ?, password_hash = ?, updated_at = ? 
			  WHERE id = ?`

	result, err := r.db.ExecContext(
		ctx,
		query,
		user.Email,
		user.PasswordHash,
		user.UpdatedAt,
		user.ID,
	)

	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("user not found")
	}

	return nil
}

func (r *UserRepository) Delete(ctx context.Context, id string) error {
	query := "DELETE FROM users WHERE id = ?"

	result, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New("user not found")
	}

	return nil
}
