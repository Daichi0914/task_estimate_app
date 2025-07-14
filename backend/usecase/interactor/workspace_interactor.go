package interactor

import (
	"context"
	"errors"
	"task_estimate_app/backend/domain/entity"
	"task_estimate_app/backend/domain/repository"
	"task_estimate_app/backend/domain/services"
	"task_estimate_app/backend/usecase/dto"

	"github.com/google/uuid"
)

type WorkspaceInteractor struct {
	WorkspaceRepo    repository.WorkspaceRepository
	WorkspaceService *services.WorkspaceService
}

func NewWorkspaceInteractor(repo repository.WorkspaceRepository, service *services.WorkspaceService) *WorkspaceInteractor {
	return &WorkspaceInteractor{WorkspaceRepo: repo, WorkspaceService: service}
}

func (i *WorkspaceInteractor) CreateWorkspace(ctx context.Context, input *dto.CreateWorkspaceInput) (*dto.WorkspaceOutput, error) {
	unique, err := i.WorkspaceService.IsNameUnique(ctx, input.Name)
	if err != nil {
		return nil, err
	}
	if !unique {
		return nil, errors.New("workspace name already exists")
	}
	id := uuid.New().String()
	workspace := &entity.Workspace{
		ID:   id,
		Name: input.Name,
	}
	if err := i.WorkspaceRepo.Create(ctx, workspace); err != nil {
		return nil, err
	}
	return &dto.WorkspaceOutput{
		ID:   workspace.ID,
		Name: workspace.Name,
	}, nil
}

func (i *WorkspaceInteractor) UpdateWorkspace(ctx context.Context, id string, name string) error {
	ws, err := i.WorkspaceRepo.FindByID(ctx, id)
	if err != nil {
		return err
	}
	if ws == nil {
		return errors.New("workspace not found")
	}
	ws.Name = name
	return i.WorkspaceRepo.Update(ctx, ws)
}

func (i *WorkspaceInteractor) DeleteWorkspace(ctx context.Context, id string) error {
	ws, err := i.WorkspaceRepo.FindByID(ctx, id)
	if err != nil {
		return err
	}
	if ws == nil {
		return errors.New("workspace not found")
	}
	return i.WorkspaceRepo.Delete(ctx, id)
}
