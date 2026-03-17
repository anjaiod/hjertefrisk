import type { ReactNode } from "react";

type AuthPageTemplateProps = {
  children: ReactNode;
};

export function AuthPageTemplate({ children }: AuthPageTemplateProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      {children}
    </main>
  );
}
