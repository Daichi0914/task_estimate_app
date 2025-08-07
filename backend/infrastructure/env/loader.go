package env

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"
)

// LoadFile は指定された環境に対応する.envファイルを読み込む
func LoadFile(env string) {
	// プロジェクトルート（backend/の親ディレクトリ）から.envファイルを読み込む
	envFile := fmt.Sprintf("../.env.%s", env)
	
	if err := godotenv.Load(envFile); err != nil {
		// 環境ファイルが見つからない場合は警告のみ（CI環境では正常）
		log.Printf("Using system environment (no %s found)", envFile)
	} else {
		log.Printf("Environment loaded: %s", envFile)
	}
}