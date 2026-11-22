import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How WedPlan collects, uses and protects your information.",
};

const sections = [
  {
    title: "What we collect",
    body: [
      "When you create an account we store your name, email address, account type (customer or vendor) and, if you add one, your profile photo. Vendors can also add a business name.",
      "When you use WedPlan we store the services vendors list, the booking requests customers send (event date, event location and message) and the replies vendors give.",
    ],
  },
  {
    title: "Signing in with Google",
    body: [
      "If you choose Continue with Google, Google shares your name, email address and profile photo with us. We do not get your Google password and we do not read anything else from your Google account.",
    ],
  },
  {
    title: "Payments",
    body: [
      "Premium payments are handled by Stripe. Your card details go straight to Stripe and never reach our servers. We only keep a record of each payment: the amount, the date and whether it succeeded.",
    ],
  },
  {
    title: "Photos",
    body: [
      "Profile and service photos are stored with ImgBB, an image hosting service, so they can be shown on the site.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "We use one sign-in cookie to keep you logged in. We do not use advertising or tracking cookies.",
    ],
  },
  {
    title: "Who can see your information",
    body: [
      "Your name and photo appear in your own dashboard. When you send a booking request, the vendor sees your name and email so they can reply. Vendors' business names and photos are shown on their public services. Our admins can see account details to keep the platform safe.",
      "We never sell your information.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You can change your name and photo at any time from Profile settings. To delete your account and your data, email hello@wedplan.com from the address you signed up with.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
      <p className="text-xs font-medium tracking-[0.25em] text-gold uppercase">WedPlan</p>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Privacy policy</h1>
      <p className="mt-4 text-muted-foreground">
        This page explains what information WedPlan keeps, why, and what you can do
        about it. Last updated November 2026.
      </p>

      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h2 className="text-2xl font-semibold">{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-foreground/90">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
