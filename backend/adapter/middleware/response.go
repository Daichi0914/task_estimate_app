package middleware

import (
	"net/http"
)

// ErrorResponse はエラーレスポンスの構造体です
type ErrorResponse struct {
	Error string `json:"error"`
}

// ResponseHandler はレスポンス処理を共通化する構造体です
type ResponseHandler struct {
	writer http.ResponseWriter
}

// NewResponseHandler は新しいResponseHandlerを生成します
func NewResponseHandler(w http.ResponseWriter) *ResponseHandler {
	return &ResponseHandler{
		writer: w,
	}
}

// SendError はエラーレスポンスを送信します
func (h *ResponseHandler) SendError(statusCode int, message string) {
	resp := NewJSONResponse(h.writer)
	resp.Encode(statusCode, ErrorResponse{Error: message})
}

// SendInternalServerError は内部サーバーエラーを送信します
func (h *ResponseHandler) SendInternalServerError() {
	h.SendError(http.StatusInternalServerError, "internal server error")
}

// SendBadRequest はバッドリクエストエラーを送信します
func (h *ResponseHandler) SendBadRequest(message string) {
	h.SendError(http.StatusBadRequest, message)
}

// SendNotFound はNot Foundエラーを送信します
func (h *ResponseHandler) SendNotFound(message string) {
	h.SendError(http.StatusNotFound, message)
}

// SendSuccess は成功レスポンスを送信します
func (h *ResponseHandler) SendSuccess(statusCode int, data interface{}) {
	resp := NewJSONResponse(h.writer)
	resp.Encode(statusCode, data)
} 