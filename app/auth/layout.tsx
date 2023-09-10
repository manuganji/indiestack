export default async function AuthLayout({
  children,
}: {
  children: JSX.Element;
}): Promise<JSX.Element> {
  return <div className="">{children}</div>;
}
