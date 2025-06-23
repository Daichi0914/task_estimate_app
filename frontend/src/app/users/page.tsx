import { CreateUserForm } from "@/components/user/create-user-form"
import { UserList } from "@/components/user/user-list"
import { Layout } from "@/components/layout/layout"

export default function UsersPage() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">ユーザー管理</h1>
        <div className="flex gap-8">
          <CreateUserForm />
          <UserList />
        </div>
      </div>
    </Layout>
  )
}
