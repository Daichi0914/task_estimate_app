import '@/styles/globals.css';
import { ReactNode } from 'react';
import { AppProvider } from '@/provider/AppProvider';
import { AuthGuard } from "@/components/auth/AuthGuard";

export const metadata = {
  title: 'Task Timer',
  description: 'Time tracking app',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <AppProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </AppProvider>
      </body>
    </html>
  );
}
