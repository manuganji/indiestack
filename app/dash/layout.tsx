import { getHostName, getUserOnServer } from "@/lib/serverUtils";
import SideBar from "./SideBar";
import { AuthProvider } from "@/components/auth/SessionProvider";
import { redirect } from "next/navigation";
import { SIGN_IN_PATH } from "@/constants";

export const preferredRegion = "home";

export default async function DashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const domain = getHostName();
  const isRoot = domain == process.env.ROOT_DOMAIN;
  const user = await getUserOnServer();
  if (!user) {
    redirect(SIGN_IN_PATH);
  }
  return (
    <div className="flex flex-row">
      <SideBar isRoot={isRoot} />
      <AuthProvider user={user}>{children}</AuthProvider>
    </div>
  );
}
