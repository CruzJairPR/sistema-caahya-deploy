import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import SessionTimeoutProvider from "./components/sessionTimeoutProvider";
import { AuthProvider } from "./context/AuthContext";
import ApiInterceptor from "./components/ApiInterceptor";
import Providers from "./components/Providers";
import { NotificationProvider } from "./context/NotificationContext";
import { AlertasCampanaProvider } from "./context/AlertasCampanaContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema CAAHyA",
  description: "Control de Información del Consejo Académico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >
        <AppRouterCacheProvider>
          <CssBaseline />
          <AuthProvider>
            <ApiInterceptor>
              <SessionTimeoutProvider>
                <Providers>
                  <NotificationProvider>
                    <AlertasCampanaProvider>{children}</AlertasCampanaProvider>
                  </NotificationProvider>
                </Providers>
              </SessionTimeoutProvider>
            </ApiInterceptor>
          </AuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
