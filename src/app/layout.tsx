import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { AppMsalProvider } from '@/lib/app-msal-provider';

export const metadata: Metadata = {
  title: 'AssetHub ยืม-คืน - ระบบยืม-คืนอุปกรณ์ IT',
  description: 'ระบบยืม-คืนอุปกรณ์ IT สำหรับ TRR Group',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="light" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Outfit:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-background font-body-md min-h-screen" suppressHydrationWarning>
        <AppMsalProvider>
          <AuthProvider>
            <div className="flex min-h-screen">
              <SideNavWrapper />
              <div className="flex-1 w-full lg:ml-64 relative">
                {children}
              </div>
            </div>
          </AuthProvider>
        </AppMsalProvider>
      </body>
    </html>
  );
}

// Client component wrapper for SideNav to avoid SSR hydration issues with usePathname
import { SideNav } from '@/components/side-nav';
function SideNavWrapper() {
  return <SideNav />;
}
