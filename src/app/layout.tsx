
import "@/lib/fontawesome";
import TopAlert from "@/components/ui/TopAlert";
import AuthProvider from "@/providers/AuthProvider";
import SocketProvider from "@/providers/SocketProvider";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <SocketProvider>
            <TopAlert />
            {children}
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
