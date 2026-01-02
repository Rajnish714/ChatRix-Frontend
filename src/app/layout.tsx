
import "@/lib/fontawesome";
import TopAlert from "@/components/ui/feedback/TopAlert";
import AuthProvider from "@/providers/AuthProvider";
import SocketProvider from "@/providers/SocketProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import "./globals.css";
import ClientLayout from "@/components/ui/layout/ClientLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <TopAlert />
           <ClientLayout>{children}<p className="absolute bottom-1 left-1 text-[10px] text-gray-400 leading-none">
  Built by Rajnish • © 2026 Chattrix
</p></ClientLayout>
          </SocketProvider>
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
