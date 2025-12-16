import TopAlert from "@/components/ui/TopAlert";
import AuthProvider from "@/providers/AuthProvider";
import "./globals.css";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  


  return (
    <html lang="en">
      <body>
      <AuthProvider>
        <TopAlert />
        {children}
      </AuthProvider>
      </body>
    </html>
  );
}