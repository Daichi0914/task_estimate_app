"use client"

import { UserListCard } from "@/components/user/userListCard"
import { useUsers } from "@/hooks/useUsers"

export function UserList() {
  const { users, loading, error } = useUsers();

  if (loading) {
    return (
      <UserListCard>
        <div className="text-center text-gray-500 py-8">
          読み込み中...
        </div>
      </UserListCard>
    );
  }

  if (error) {
    return (
      <UserListCard>
        <div className="text-center text-red-500 py-8">
          {error}
        </div>
      </UserListCard>
    );
  }

  return (
    <UserListCard>
      <div className="flex flex-col gap-3 px-2 py-2">
        {users.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            ユーザーが存在しません
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center px-4 py-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <div>
                <div className="font-bold text-base text-gray-900 mb-0.5">{user.name}</div>
                <div className="text-xs text-gray-500 mb-0.5">{user.email}</div>
              </div>
              <div className="text-xs text-gray-400 text-right min-w-[100px]">
                作成日:<br />{new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </UserListCard>
  )
}
