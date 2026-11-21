import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function MainLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Navbar user={null} />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
