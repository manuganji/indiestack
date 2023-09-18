import { AuthProvider } from "@/components/auth/SessionProvider";
import { requireAuth } from "@/lib/checks";
import { getHostName } from "@/lib/serverUtils";
import SideBar from "./SideBar";

export const preferredRegion = "home";

export default async function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const domain = getHostName();
  const isRoot = domain == process.env.ROOT_DOMAIN;
  const user = await requireAuth();
  return (
    <div className="flex flex-row">
      <SideBar isRoot={isRoot} />
      <AuthProvider user={user}>{children}</AuthProvider>
    </div>
  );
}
