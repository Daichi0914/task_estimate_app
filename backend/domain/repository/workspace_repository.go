package repository

import (
	"context"
	"task_estimate_app/backend/domain/entity"
	"task_estimate_app/backend/usecase/dto"
)

type WorkspaceRepository interface {
	Create(ctx context.Context, workspace *entity.Workspace) error
	FindByID(ctx context.Context, id string) (*entity.Workspace, error)
	FindByUserID(ctx context.Context, userID string) ([]*entity.Workspace, error)
	FindByNameAndUserID(ctx context.Context, name, userID string) (*entity.Workspace, error)
	Update(ctx context.Context, workspace *entity.Workspace) error
	AddUserWorkspace(ctx context.Context, userID, workspaceID string, sortOrder int) error
	Delete(ctx context.Context, id string) error
	UpdateWorkspaceOrders(ctx context.Context, userID string, orders []dto.WorkspaceOrder) error
}
