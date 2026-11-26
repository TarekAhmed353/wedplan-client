import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { unstable_rethrow } from "next/navigation";
import { getSession } from "@/lib/session";

async function getSessionSafely() {
  try {
    return await getSession();
  } catch (error) {
    unstable_rethrow(error);
    console.error("Could not load the session for the main layout", error);
    return null;
  }
}

export default async function MainLayout({ children }: LayoutProps<"/">) {
  const session = await getSessionSafely();
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
