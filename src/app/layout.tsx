
"use client";
import { useAuthInitializer } from "@/hooks/useAuthInitializer";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  useAuthInitializer();

  return (
    <html lang="en">
      <body>
   
          {children}
      
      </body>
    </html>
  );
}