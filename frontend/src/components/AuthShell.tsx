import { ReactNode } from "react";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  footer: ReactNode;
  children: ReactNode;
}

const AuthShell = ({
  eyebrow,
  title,
  description,
  footer,
  children,
}: AuthShellProps) => (
  <main className="app-shell flex min-h-screen items-center justify-center px-4 py-6">
    <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-border bg-[#111111]/95 shadow-card backdrop-blur lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden border-r border-border bg-[radial-gradient(circle_at_top_left,rgba(212,255,0,0.16),transparent_28%),linear-gradient(180deg,#151515_0%,#101010_100%)] p-8 lg:flex lg:flex-col lg:justify-between">
        <div className="max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent">
            Smart Leads CRM
          </p>
          <h1 className="mt-5 text-3xl font-semibold leading-tight text-text-primary">
            Lead management that stays clear, fast, and easy to act on.
          </h1>
          <p className="mt-4 text-sm leading-6 text-text-secondary">
            Organize your pipeline, update records quickly, and keep every daily action
            readable in one consistent workspace.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-accent/20 bg-[#171d00] p-5 shadow-glow">
            <p className="text-sm text-accent">Built for compact, high-contrast work</p>
            <p className="mt-2 text-lg font-semibold text-text-primary">
              Cleaner actions, calmer spacing, and better visibility across the app
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-[#161616] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">Theme</p>
              <p className="mt-2 text-sm font-medium text-text-primary">Dark surfaces, bright actions</p>
            </div>
            <div className="rounded-2xl border border-border bg-[#161616] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-text-secondary">Focus</p>
              <p className="mt-2 text-sm font-medium text-text-primary">Fast lead updates without clutter</p>
            </div>
          </div>
        </div>
      </section>

      <section className="p-6 sm:p-8 lg:p-9">
        <div className="mx-auto max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-text-primary sm:text-[30px]">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-text-secondary">{description}</p>

          <div className="mt-6">{children}</div>
          <div className="mt-6 text-sm text-text-secondary">{footer}</div>
        </div>
      </section>
    </div>
  </main>
);

export default AuthShell;
