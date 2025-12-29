
import "@/lib/fontawesome";
import TopAlert from "@/components/ui/TopAlert";
import AuthProvider from "@/providers/AuthProvider";
import SocketProvider from "@/providers/SocketProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

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
           <ClientLayout>{children}</ClientLayout>
          </SocketProvider>
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
