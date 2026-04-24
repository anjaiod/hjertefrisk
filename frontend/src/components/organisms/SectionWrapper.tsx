import { ReactNode } from "react";

type SectionProps = {
  title: string;
  children: ReactNode;
};

export function SectionWrapper({ title, children }: SectionProps) {
  return (
    <div className="bg-blue-100 rounded-2xl p-4 mb-4">
      <h2 className="text-brand-navy font-semibold mb-3">{title}</h2>

      <div className="grid grid-cols-4 gap-6 max-[1100px]:grid-cols-2">
        {children}
      </div>
    </div>
  );
}
