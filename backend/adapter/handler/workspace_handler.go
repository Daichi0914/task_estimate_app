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

// @Summary      ワークスペース作成
// @Description  新しいワークスペースを作成
// @Accept       json
// @Produce      json
// @Param        workspace body dto.CreateWorkspaceInput true "ワークスペース作成情報"
// @Success      201 {object} dto.WorkspaceOutput
// @Failure      400 {string} string "リクエストボディが無効です"
// @Router       /workspaces [post]
func (h *WorkspaceHandler) CreateWorkspace(w http.ResponseWriter, r *http.Request) {
	handler := middleware.NewResponseHandler(w)
	var input dto.CreateWorkspaceInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		handler.SendBadRequest("リクエストボディが無効です")
		return
	}
	userID := r.Header.Get("X-USER-ID")
	if userID == "" {
		handler.SendBadRequest("ユーザーIDが必要です（X-USER-IDヘッダー）")
		return
	}
	input.UserID = userID
	output, err := h.WorkspaceInteractor.CreateWorkspace(r.Context(), &input)
	if err != nil {
		if err.Error() == "workspace name already exists" {
			handler.SendError(http.StatusConflict, "同じ名前のワークスペースは作成できません")
			return
		}
		handler.SendInternalServerError()
		return
	}
	handler.SendSuccess(http.StatusCreated, output)
}

// @Summary      ワークスペース一覧取得
// @Description  全ワークスペースの一覧を取得
// @Produce      json
// @Success      200 {object} dto.WorkspacesOutput
// @Router       /workspaces [get]
func (h *WorkspaceHandler) GetWorkspaces(w http.ResponseWriter, r *http.Request) {
	handler := middleware.NewResponseHandler(w)
	userID := r.Header.Get("X-USER-ID")
	if userID == "" {
		handler.SendBadRequest("ユーザーIDが必要です（X-USER-IDヘッダー）")
		return
	}
	output := h.WorkspaceInteractor.GetWorkspacesByUserID(r.Context(), userID)
	handler.SendSuccess(http.StatusOK, output)
}

// @Summary      ワークスペース取得
// @Description  指定したIDのワークスペース情報を取得
// @Produce      json
// @Param        id path string true "ワークスペースID"
// @Success      200 {object} dto.WorkspaceOutput
// @Failure      404 {string} string "ワークスペースが見つかりません"
// @Router       /workspaces/{id} [get]
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
		handler.SendNotFound("ワークスペースが見つかりません")
		return
	}
	handler.SendSuccess(http.StatusOK, ws)
}

// @Summary      ワークスペース更新
// @Description  指定したIDのワークスペース名を更新
// @Accept       json
// @Produce      json
// @Param        id path string true "ワークスペースID"
// @Param        workspace body dto.UpdateWorkspaceInput true "ワークスペース名"
// @Success      204 {string} string "No Content"
// @Failure      404 {string} string "ワークスペースが見つかりません"
// @Router       /workspaces/{id} [put]
func (h *WorkspaceHandler) UpdateWorkspace(w http.ResponseWriter, r *http.Request) {
	handler := middleware.NewResponseHandler(w)
	vars := mux.Vars(r)
	id := vars["id"]
	var input dto.UpdateWorkspaceInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		handler.SendBadRequest("リクエストボディが無効です")
		return
	}
	if err := h.WorkspaceInteractor.UpdateWorkspace(r.Context(), id, input.Name); err != nil {
		if err.Error() == "workspace not found" {
			handler.SendNotFound("ワークスペースが見つかりません")
			return
		}
		handler.SendInternalServerError()
		return
	}
	handler.SendSuccess(http.StatusNoContent, nil)
}

// @Summary      ワークスペース削除
// @Description  指定したIDのワークスペースを削除
// @Produce      json
// @Param        id path string true "ワークスペースID"
// @Success      204 {string} string "No Content"
// @Failure      404 {string} string "ワークスペースが見つかりません"
// @Router       /workspaces/{id} [delete]
func (h *WorkspaceHandler) DeleteWorkspace(w http.ResponseWriter, r *http.Request) {
	handler := middleware.NewResponseHandler(w)
	vars := mux.Vars(r)
	id := vars["id"]
	if err := h.WorkspaceInteractor.DeleteWorkspace(r.Context(), id); err != nil {
		if err.Error() == "workspace not found" {
			handler.SendNotFound("ワークスペースが見つかりません")
			return
		}
		handler.SendInternalServerError()
		return
	}
	handler.SendSuccess(http.StatusNoContent, nil)
}

// @Summary      ワークスペース並び順保存
// @Description  ワークスペースの並び順を一括保存
// @Accept       json
// @Produce      json
// @Param        order body dto.WorkspaceOrderUpdateInput true "ワークスペース並び順"
// @Success      204 {string} string "No Content"
// @Failure      400 {string} string "リクエストボディが無効です"
// @Router       /workspaces/order [patch]
func (h *WorkspaceHandler) UpdateWorkspaceOrder(w http.ResponseWriter, r *http.Request) {
	handler := middleware.NewResponseHandler(w)
	userID := r.Header.Get("X-USER-ID")
	if userID == "" {
		handler.SendBadRequest("ユーザーIDが必要です（X-USER-IDヘッダー）")
		return
	}
	var input dto.WorkspaceOrderUpdateInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		handler.SendBadRequest("リクエストボディが無効です")
		return
	}
	if err := h.WorkspaceInteractor.UpdateWorkspaceOrder(r.Context(), userID, input.Orders); err != nil {
		handler.SendInternalServerError()
		return
	}
	handler.SendSuccess(http.StatusNoContent, nil)
}
