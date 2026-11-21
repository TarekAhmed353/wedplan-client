import { GoogleButton } from "@/components/auth/google-button";
import { FieldSeparator } from "@/components/ui/field";

type AuthCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  withGoogle?: boolean;
  children: React.ReactNode;
};

export function AuthCard({
  eyebrow,
  title,
  description,
  withGoogle = false,
  children,
}: AuthCardProps) {
  return (
    <section className="flex flex-1 items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-sm ring-1 ring-foreground/5 sm:p-10">
        <div className="mb-8 space-y-2 text-center">
          <p className="text-xs font-medium tracking-[0.25em] text-gold uppercase">
            {eyebrow}
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-col gap-6">
          {withGoogle && (
            <>
              <GoogleButton />
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                or use your email
              </FieldSeparator>
            </>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
