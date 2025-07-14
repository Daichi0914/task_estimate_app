import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserListCardProps {
  children: React.ReactNode;
}

export function UserListCard({ children }: UserListCardProps) {
  return (
    <Card className="w-[600px] mx-auto p-4">
      <CardHeader>
        <CardTitle>ユーザー一覧</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
