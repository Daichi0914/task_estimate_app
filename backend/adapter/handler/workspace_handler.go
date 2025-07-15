package handler

import (
	"encoding/json"
	"net/http"
	"task_estimate_app/backend/adapter/middleware"
	"task_estimate_app/backend/usecase/dto"
	"task_estimate_app/backend/usecase/interactor"

	"github.com/gorilla/mux"
)

type WorkspaceHandler struct {
	WorkspaceInteractor *interactor.WorkspaceInteractor
}

func NewWorkspaceHandler(interactor *interactor.WorkspaceInteractor) *WorkspaceHandler {
	return &WorkspaceHandler{WorkspaceInteractor: interactor}
}

func (h *WorkspaceHandler) CreateWorkspace(w http.ResponseWriter, r *http.Request) {
	handler := middleware.NewResponseHandler(w)
	var input dto.CreateWorkspaceInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		handler.SendBadRequest("invalid request body")
		return
	}
	output, err := h.WorkspaceInteractor.CreateWorkspace(r.Context(), &input)
	if err != nil {
		handler.SendInternalServerError()
		return
	}
	handler.SendSuccess(http.StatusCreated, output)
}

func (h *WorkspaceHandler) GetWorkspaces(w http.ResponseWriter, r *http.Request) {
	handler := middleware.NewResponseHandler(w)
	workspaces, err := h.WorkspaceInteractor.WorkspaceRepo.FindAll(r.Context())
	if err != nil {
		handler.SendInternalServerError()
		return
	}
	handler.SendSuccess(http.StatusOK, map[string]interface{}{"data": workspaces})
}

func (h *WorkspaceHandler) GetWorkspace(w http.ResponseWriter, r *http.Request) {
	handler := middleware.NewResponseHandler(w)
	vars := mux.Vars(r)
	id := vars["id"]
	ws, err := h.WorkspaceInteractor.WorkspaceRepo.FindByID(r.Context(), id)
	if err != nil {
		handler.SendInternalServerError()
		return
	}
	if ws == nil {
		handler.SendNotFound("workspace not found")
		return
	}
	handler.SendSuccess(http.StatusOK, ws)
}

func (h *WorkspaceHandler) UpdateWorkspace(w http.ResponseWriter, r *http.Request) {
	handler := middleware.NewResponseHandler(w)
	vars := mux.Vars(r)
	id := vars["id"]
	var input struct {
		Name string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		handler.SendBadRequest("invalid request body")
		return
	}
	if err := h.WorkspaceInteractor.UpdateWorkspace(r.Context(), id, input.Name); err != nil {
		if err.Error() == "workspace not found" {
			handler.SendNotFound(err.Error())
			return
		}
		handler.SendInternalServerError()
		return
	}
	handler.SendSuccess(http.StatusNoContent, nil)
}

func (h *WorkspaceHandler) DeleteWorkspace(w http.ResponseWriter, r *http.Request) {
	handler := middleware.NewResponseHandler(w)
	vars := mux.Vars(r)
	id := vars["id"]
	if err := h.WorkspaceInteractor.DeleteWorkspace(r.Context(), id); err != nil {
		if err.Error() == "workspace not found" {
			handler.SendNotFound(err.Error())
			return
		}
		handler.SendInternalServerError()
		return
	}
	handler.SendSuccess(http.StatusNoContent, nil)
}
