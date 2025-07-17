package repository

import (
	"context"
	"task_estimate_app/backend/domain/entity"
)

type WorkspaceRepository interface {
	Create(ctx context.Context, workspace *entity.Workspace) error
	FindByID(ctx context.Context, id string) (*entity.Workspace, error)
	FindAll(ctx context.Context) ([]*entity.Workspace, error)
	FindByUserID(ctx context.Context, userID string) ([]*entity.Workspace, error)
	FindByName(ctx context.Context, name string) (*entity.Workspace, error)
	Update(ctx context.Context, workspace *entity.Workspace) error
	AddUserWorkspace(ctx context.Context, userID, workspaceID string) error
	Delete(ctx context.Context, id string) error
}
