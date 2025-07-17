package dto

type CreateWorkspaceInput struct {
	Name   string `json:"name"`
	UserID string `json:"user_id"`
}

type WorkspaceOutput struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type WorkspacesOutput struct {
	Data []*WorkspaceOutput `json:"data"`
}

type UpdateWorkspaceInput struct {
	Name string `json:"name"`
}

type WorkspaceOrderUpdateInput struct {
	Orders []WorkspaceOrder `json:"orders"`
}

type WorkspaceOrder struct {
	WorkspaceID string `json:"workspace_id"`
	SortOrder   int    `json:"sort_order"`
}
