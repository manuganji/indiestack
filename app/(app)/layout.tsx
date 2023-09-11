import { AuthProvider } from "@/components/auth/SessionProvider";
import { getUserOnServer } from "../(auth)/session/route";

// closer to the database
export const preferredRegion = "home";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserOnServer();
  return <AuthProvider user={user}>{children}</AuthProvider>;
}
