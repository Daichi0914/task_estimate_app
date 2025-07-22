"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const { signup, loading, error, clearError } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    clearError();

    if (password !== confirmPassword) {
      setValidationError("パスワードが一致しません");
      return;
    }

    if (password.length < 6) {
      setValidationError("パスワードは6文字以上で入力してください");
      return;
    }

    await signup({ email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">新規登録</h1>
        <div className="mb-4">
          <label className="block mb-1">メールアドレス</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">パスワード</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <div>
          <label className="block mb-1">パスワード（確認）</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <div className="h-4 text-xs mt-2 text-red-500">{error || validationError}</div>
        <button
          type="submit"
          className="w-full bg-black text-white mt-6 py-2 rounded hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
          disabled={loading}
        >
          {loading ? "登録中..." : "登録"}
        </button>
        <div className="mt-4 text-xs text-center">
          <span className="text-gray-600">既にアカウントをお持ちの方は</span>
          <a href="/login" className="text-blue-600 hover:text-blue-800 ml-1 underline">
            ログイン
          </a>
        </div>
      </form>
    </div>
  );
} 
