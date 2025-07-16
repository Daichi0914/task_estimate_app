## Getting Started
1. `.env.copy`を複製し、`.env`ファイルにリネーム
2. `.env`の環境変数に任意の値を入れる
3. `make build`コマンドでプロジェクトをbuild（Docker Desktopダウンロード必須）
4. `make up-dev`コマンドで開発環境立ち上げ

## API一覧（Swagger）
コンテナ立ち上げ後、以下にアクセス
http://localhost:8080/swagger/index.html

## Project Structure
```
task_estimate_app/
├── backend/                      # Go製のバックエンド（クリーンアーキテクチャ）
│   ├── cmd/                      # エントリーポイント（main.goのみ）
│   │   └── api/                  # API起動用のmainパッケージ
│   ├── domain/                   # ドメイン層：ビジネスエンティティとコアロジック
│   │   ├── entity/               # ビジネスエンティティの定義
│   │   └── repository/           # リポジトリのインターフェース定義
│   ├── usecase/                  # ユースケース層：アプリケーションのビジネスロジック
│   │   ├── dto/                  # ユースケース層のデータ転送オブジェクト
│   │   └── interactor/           # ユースケースの具体的な実装
│   ├── adapter/                  # アダプター層：外部とのインターフェース
│   │   ├── handler/              # HTTPリクエストの処理（エンドポイントの実装）
│   │   ├── router/               # エンドポイントルーティングの設定
│   │   └── repository/           # リポジトリの具体的な実装
│   ├── infrastructure/           # インフラストラクチャ層：外部サービスとのやりとり
│   │   ├── bootstrap/            # 初期化処理（DB接続、環境変数の読み込みなど）
│   │   ├── config/               # 設定に関する処理（環境変数の読み取りなど）
│   │   └── db/                   # データベースに関する処理
│   │       ├── migration/        # マイグレーションファイル群
│   │       └── seed/             # シードデータ群
│   ├── go.mod                    # Goモジュールの設定ファイル（依存関係の管理など）
│   └── tmp/                      # 一時ファイル置き場（airによるビルド結果など）
├── frontend/                     # Next.js製のフロントエンド（クリーンアーキテクチャ）
│   ├── src/                      # ソースコード
│   │   ├── app/                  # Next.js App Router（ページとレイアウト）
│   │   │   ├── layout.tsx        # ルートレイアウト
│   │   │   ├── page.tsx          # ホームページ
│   │   │   ├── settings/         # 設定ページ
│   │   │   └── users/            # ユーザー管理ページ
│   │   ├── components/           # Reactコンポーネント
│   │   │   ├── ui/               # 共通UIコンポーネント（ボタン、フォーム、カードなど）
│   │   │   ├── layout/           # レイアウトコンポーネント（ヘッダー、レイアウト）
│   │   │   ├── workspace/        # ワークスペース関連コンポーネント
│   │   │   └── user/             # ユーザー関連コンポーネント
│   │   ├── hooks/                # カスタムReactフック
│   │   │   ├── useWorkspace.ts   # ワークスペース管理フック
│   │   │   ├── useDragAndDrop.ts # ドラッグ&ドロップフック
│   │   │   └── useCurrentPage.ts # 現在ページ管理フック
│   │   ├── jotai/                # Jotai状態管理
│   │   │   ├── atoms/            # 状態定義
│   │   │   ├── selectors/        # 状態セレクター
│   │   │   └── effects/          # 副作用処理
│   │   ├── types/                # TypeScript型定義
│   │   ├── provider/             # Reactコンテキストプロバイダー
│   │   ├── lib/                  # ユーティリティライブラリ
│   │   ├── styles/               # スタイルシート
│   │   └── utils/                # ユーティリティ関数
│   ├── public/                   # 静的ファイル（favicon.icoなど）
│   ├── __tests__/                # テストファイル
│   ├── package.json              # npm依存関係とスクリプト
│   ├── tailwind.config.ts        # Tailwind CSS設定
│   ├── tsconfig.json             # TypeScript設定
│   ├── next.config.ts            # Next.js設定
│   ├── jest.config.js            # Jestテスト設定
│   ├── eslint.config.mjs         # ESLint設定
│   ├── components.json           # shadcn/ui設定
│   └── Dockerfile                # フロントエンド用Docker設定
├── docker-compose.yml            # Docker Compose設定
├── Makefile                      # 開発用コマンド集
└── README.md                     # プロジェクト説明書
```
