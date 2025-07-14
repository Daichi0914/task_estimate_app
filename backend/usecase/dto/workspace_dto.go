package dto

type CreateWorkspaceInput struct {
	Name string `json:"name"`
}

type WorkspaceOutput struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}
