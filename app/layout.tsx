import { Poppins } from "next/font/google";
import "./globals.css";
import AuthRedirection from "@/lib/hoc/auth-redirection";
import { AuthSessionProvider } from "@/lib/context/auth-session-context";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins`}>
        <Toaster richColors />
        <AuthSessionProvider>
          <AuthRedirection>{children}</AuthRedirection>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
