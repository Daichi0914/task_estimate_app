import React from 'react';
import { Layout } from '../../components/layout/layout';
import { Card } from '../../components/ui/card';

export default function SettingsPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">ユーザー設定</h1>
          <p className="text-gray-600 mt-2">アカウント情報やアプリケーションの設定を管理できます</p>
        </div>

        <div className="grid gap-6">
          {/* プロフィール設定 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">プロフィール</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ユーザー名
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ユーザー名を入力"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="メールアドレスを入力"
                />
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                保存
              </button>
            </div>
          </Card>

          {/* アプリケーション設定 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">アプリケーション設定</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">ダークモード</h3>
                  <p className="text-sm text-gray-600">ダークテーマを使用する</p>
                </div>
                <button className="w-12 h-6 bg-gray-200 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">通知</h3>
                  <p className="text-sm text-gray-600">プッシュ通知を受け取る</p>
                </div>
                <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                </button>
              </div>
            </div>
          </Card>

          {/* アカウント管理 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">アカウント管理</h2>
            <div className="space-y-4">
              <button className="text-red-600 hover:text-red-700 font-medium">
                アカウントを削除
              </button>
              <button className="text-gray-600 hover:text-gray-700 font-medium">
                ログアウト
              </button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
