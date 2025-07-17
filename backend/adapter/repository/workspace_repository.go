package repository

import (
	"context"
	"database/sql"
	"task_estimate_app/backend/domain/entity"
	"task_estimate_app/backend/usecase/dto"
)

type WorkspaceRepository struct {
	DB *sql.DB
}

func NewWorkspaceRepository(db *sql.DB) *WorkspaceRepository {
	return &WorkspaceRepository{DB: db}
}

func (r *WorkspaceRepository) Create(ctx context.Context, workspace *entity.Workspace) error {
	_, err := r.DB.ExecContext(ctx, `INSERT INTO workspaces (id, name) VALUES (?, ?)`, workspace.ID, workspace.Name)
	return err
}

func (r *WorkspaceRepository) FindByID(ctx context.Context, id string) (*entity.Workspace, error) {
	row := r.DB.QueryRowContext(ctx, `SELECT id, name FROM workspaces WHERE id = ?`, id)
	var ws entity.Workspace
	if err := row.Scan(&ws.ID, &ws.Name); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &ws, nil
}

func (r *WorkspaceRepository) FindAll(ctx context.Context) ([]*entity.Workspace, error) {
	rows, err := r.DB.QueryContext(ctx, `SELECT id, name FROM workspaces`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var workspaces []*entity.Workspace
	for rows.Next() {
		var ws entity.Workspace
		if err := rows.Scan(&ws.ID, &ws.Name); err != nil {
			return nil, err
		}
		workspaces = append(workspaces, &ws)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return workspaces, nil
}

func (r *WorkspaceRepository) Update(ctx context.Context, workspace *entity.Workspace) error {
	_, err := r.DB.ExecContext(ctx, `UPDATE workspaces SET name = ? WHERE id = ?`, workspace.Name, workspace.ID)
	return err
}

func (r *WorkspaceRepository) Delete(ctx context.Context, id string) error {
	_, err := r.DB.ExecContext(ctx, `DELETE FROM workspaces WHERE id = ?`, id)
	return err
}

func (r *WorkspaceRepository) FindByName(ctx context.Context, name string) (*entity.Workspace, error) {
	row := r.DB.QueryRowContext(ctx, `SELECT id, name FROM workspaces WHERE name = ?`, name)
	var ws entity.Workspace
	if err := row.Scan(&ws.ID, &ws.Name); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &ws, nil
}

func (r *WorkspaceRepository) FindByUserID(ctx context.Context, userID string) ([]*entity.Workspace, error) {
	rows, err := r.DB.QueryContext(ctx, `
		SELECT w.id, w.name
		FROM user_workspaces uw
		JOIN workspaces w ON uw.workspace_id = w.id
		WHERE uw.user_id = ?
		ORDER BY uw.sort_order ASC, uw.created_at ASC
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var workspaces []*entity.Workspace
	for rows.Next() {
		var ws entity.Workspace
		if err := rows.Scan(&ws.ID, &ws.Name); err != nil {
			return nil, err
		}
		workspaces = append(workspaces, &ws)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return workspaces, nil
}

func (r *WorkspaceRepository) AddUserWorkspace(ctx context.Context, userID, workspaceID string, sortOrder int) error {
	_, err := r.DB.ExecContext(ctx, `INSERT INTO user_workspaces (user_id, workspace_id, sort_order) VALUES (?, ?, ?)`, userID, workspaceID, sortOrder)
	return err
}

func (r *WorkspaceRepository) UpdateWorkspaceOrders(ctx context.Context, userID string, orders []dto.WorkspaceOrder) error {
	tx, err := r.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	stmt, err := tx.PrepareContext(ctx, `UPDATE user_workspaces SET sort_order = ? WHERE user_id = ? AND workspace_id = ?`)
	if err != nil {
		tx.Rollback()
		return err
	}
	defer stmt.Close()
	for _, order := range orders {
		if _, err := stmt.ExecContext(ctx, order.SortOrder, userID, order.WorkspaceID); err != nil {
			tx.Rollback()
			return err
		}
	}
	return tx.Commit()
}
