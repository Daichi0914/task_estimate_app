'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const { login, loading, error, clearError } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fromSignup = searchParams.get('fromSignup');
    if (fromSignup === 'true') {
      setSuccess('アカウント作成が完了しました！\nログインしてください');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login({ email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
        {success && <div className="mb-4 text-green-600 text-center whitespace-pre-line">{success}</div>}
        <div className="mb-4">
          <label className="block mb-1">メールアドレス</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div>
          <label className="block mb-1">パスワード</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="h-4 text-xs mt-2 text-red-500">{error}</div>
        <button
          type="submit"
          className="w-full bg-black text-white mt-6 py-2 rounded hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
          disabled={loading}
        >
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
        <div className="mt-4 text-xs text-center">
          <span className="text-gray-600">アカウントをお持ちでない方は</span>
          <a href="/signup" className="text-blue-600 hover:text-blue-800 ml-1 underline">
            新規登録
          </a>
        </div>
      </form>
    </div>
  );
}
