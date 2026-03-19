"use client";

import { useRouter } from "next/navigation";

type HealthCardProps = {
  title: string;
  description?: string;
};

export function HealthCard({ title, description }: HealthCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/pasientDashboard/pasientTiltakside")}
      className="bg-white rounded-2xl p-5 shadow-sm w-[220px] h-[140px] flex flex-col justify-between hover:shadow-md transition cursor-pointer"
    >
      <div>
        <h3 className="text-brand-navy font-semibold">{title}</h3>

        {description && (
          <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
