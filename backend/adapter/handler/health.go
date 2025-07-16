package handler

import (
	"fmt"
	"net/http"
)

// @Summary      ヘルスチェック
// @Description  サーバーの稼働確認用
// @Produce      plain
// @Success      200 {string} string "ok"
// @Router       /health [get]
func HealthCheck(w http.ResponseWriter, r *http.Request) {
	_, _ = fmt.Fprint(w, "ok")
}
