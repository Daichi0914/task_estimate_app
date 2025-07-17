-- user_workspacesテーブルにワークスペース並び順カラムを追加
ALTER TABLE user_workspaces ADD COLUMN sort_order INT NOT NULL DEFAULT 0; 