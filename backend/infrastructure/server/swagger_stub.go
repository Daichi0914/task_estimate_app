//go:build !swagger

package server

// init はswagger無効時の空フック
func init() {
	setupSwaggerHook = setupSwaggerStub
}

// setupSwaggerStub はSwaggerが無効な場合の空実装
func setupSwaggerStub(s *Server) {
	// Swagger無効時は何もしない
}
