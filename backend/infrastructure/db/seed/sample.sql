-- サンプルユーザーの追加
INSERT INTO users (id, email, password_hash) VALUES 
('00000000-0000-0000-0000-000000000001', 'user1@example.com', '$2a$10$ilGzwh4vMw9GWgPxiLwDXOZi6g6JCu.f/QgAvbBLT7swuv5J5f1Vi'),
('00000000-0000-0000-0000-000000000002', 'user2@example.com', '$2a$10$ilGzwh4vMw9GWgPxiLwDXOZi6g6JCu.f/QgAvbBLT7swuv5J5f1Vi');

-- サンプルワークスペースの追加
INSERT INTO workspaces (id, name)
VALUES
	('004018bf-9ccf-4066-b4f3-4208ce38d09f', 'ワークスペース１'),
	('03c6f127-7177-44c1-97d8-91137bce16cd', 'ワークスペース4'),
	('4b0fe328-2c0d-4922-a8a2-43b0f68556de', 'ワークスペース2'),
	('8c52786a-7baf-4b91-b471-0a6ccb0f0e40', 'ワークスペース3');

-- サンプルユーザーワークスペースの追加
INSERT INTO user_workspaces (user_id, workspace_id, sort_order)
VALUES
	('00000000-0000-0000-0000-000000000001', '004018bf-9ccf-4066-b4f3-4208ce38d09f', '1'),
	('00000000-0000-0000-0000-000000000001', '4b0fe328-2c0d-4922-a8a2-43b0f68556de', '2'),
	('00000000-0000-0000-0000-000000000001', '8c52786a-7baf-4b91-b471-0a6ccb0f0e40', '3'),
	('00000000-0000-0000-0000-000000000001', '03c6f127-7177-44c1-97d8-91137bce16cd', '4');
