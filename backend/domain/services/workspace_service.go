package services

import (
	"context"
	"task_estimate_app/backend/domain/repository"
)

type WorkspaceService struct {
	Repo repository.WorkspaceRepository
}

func NewWorkspaceService(repo repository.WorkspaceRepository) *WorkspaceService {
	return &WorkspaceService{Repo: repo}
}

func (s *WorkspaceService) IsNameUnique(ctx context.Context, name string) (bool, error) {
	ws, err := s.Repo.FindByName(ctx, name)
	if err != nil {
		return false, err
	}
	return ws == nil, nil
}
