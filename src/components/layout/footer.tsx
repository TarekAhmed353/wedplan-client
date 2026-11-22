import Link from "next/link";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa6";
import { Logo } from "@/components/shared/logo";
import { SERVICE_CATEGORIES as categories } from "@/lib/services";

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse services" },
  { href: "/sign-in", label: "Sign in" },
  { href: "/sign-up?role=vendor", label: "Become a vendor" },
];

const contactItems = [
  {
    icon: MailIcon,
    label: "hello@wedplan.com",
    href: "mailto:hello@wedplan.com",
  },
  { icon: PhoneIcon, label: "+880 1700 000000", href: "tel:+8801700000000" },
  { icon: MapPinIcon, label: "Gulshan 2, Dhaka, Bangladesh", href: null },
];

const socialLinks = [
  { href: "https://www.facebook.com", label: "Facebook", icon: FaFacebookF },
  { href: "https://www.instagram.com", label: "Instagram", icon: FaInstagram },
  { href: "https://www.pinterest.com", label: "Pinterest", icon: FaPinterestP },
  { href: "https://www.youtube.com", label: "YouTube", icon: FaYoutube },
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="font-sans text-xs font-semibold tracking-[0.2em] text-primary uppercase">
        {children}
      </h2>
      <span className="mt-2 block h-0.5 w-8 rounded-full bg-gold" />
    </div>
  );
}

const linkClass =
  "text-sm text-muted-foreground transition-colors hover:text-primary";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-4">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Plan your wedding in one place. Find trusted vendors, compare
              prices and book the services you love.
            </p>
            <ul className="mt-6 flex items-center gap-2">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-10 items-center justify-center rounded-full border border-primary/15 bg-background text-primary transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Explore" className="lg:col-span-2">
            <FooterHeading>Explore</FooterHeading>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Categories" className="lg:col-span-3">
            <FooterHeading>Categories</FooterHeading>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/services?category=${encodeURIComponent(category)}`}
                    className={linkClass}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <FooterHeading>Contact us</FooterHeading>
            <ul className="space-y-3">
              {contactItems.map(({ icon: Icon, label, href }) => (
                <li key={label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-4 shrink-0 text-gold" />
                  {href ? (
                    <a href={href} className={linkClass}>
                      {label}
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-primary/10 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {year} WedPlan. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made for couples planning their big day.
          </p>
        </div>
      </div>
    </footer>
  );
}
