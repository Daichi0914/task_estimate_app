## Getting Started
1. このリポジトリをフォーク
2. `Settings > General > Template repository Loading`にチェックをつける
![Image](https://github.com/user-attachments/assets/617d2ae4-9248-4e1d-b37a-7d1f48e31ac2)
3. 新規リポジトリ作成時、`Repository template`のリストから当該リポジトリを選択
![Image](https://github.com/user-attachments/assets/b1937b9d-660b-4f1f-8f70-c7361a0766c3)
4. `.env.copy`を複製し、`.env`ファイルにリネーム
5. `.env`の環境変数に任意の値を入れる
6. `make build_up`コマンドでプロジェクトコンテナ立ち上げ（Docker Desktopダウンロード必須）

## Project Structure
```
task_estimate_app/
├── backend/                 # Go製のバックエンド（クリーンアーキテクチャ）
│   ├── cmd/                 # エントリーポイント（main.goのみ）
│   │   └── api/             # API起動用のmainパッケージ
│   ├── domain/              # ドメイン層：ビジネスエンティティとコアロジック
│   │   ├── entity/          # ビジネスエンティティの定義
│   │   └── repository/      # リポジトリのインターフェース定義
│   ├── usecase/             # ユースケース層：アプリケーションのビジネスロジック
│   │   ├── dto/             # ユースケース層のデータ転送オブジェクト
│   │   └── interactor/      # ユースケースの具体的な実装
│   ├── adapter/             # アダプター層：外部とのインターフェース
│   │   ├── handler/         # HTTPリクエストの処理（エンドポイントの実装）
│   │   ├── router/          # エンドポイントルーティングの設定
│   │   └── repository/      # リポジトリの具体的な実装
│   ├── infrastructure/      # インフラストラクチャ層：外部サービスとのやりとり
│   │   ├── bootstrap/       # 初期化処理（DB接続、環境変数の読み込みなど）
│   │   ├── config/          # 設定に関する処理（環境変数の読み取りなど）
│   │   └── db/              # データベースに関する処理
│   │       ├── migration/   # マイグレーションファイル群
│   │       └── seed/        # シードデータ群
│   ├── go.mod               # Goモジュールの設定ファイル（依存関係の管理など）
│   └── tmp/                 # 一時ファイル置き場（airによるビルド結果など）
├── frontend/                # Next.js製のフロントエンド（クリーンアーキテクチャ）
```
