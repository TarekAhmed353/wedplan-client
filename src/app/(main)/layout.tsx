import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getSession } from "@/lib/session";

export default async function MainLayout({ children }: LayoutProps<"/">) {
  const session = await getSession();
  const user = session
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }
    : null;

  return (
    <>
      <Navbar user={user} />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
