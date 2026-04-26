"use client";

import { useRouter } from "next/navigation";
import { Tag } from "../atoms/Tag";

type HealthCardProps = {
  title: string;
  tag?: string;
  tagVariant?: "high" | "medium" | "low";
  categoryId?: number;
  info?: string[];
};

export function HealthCard({
  title,
  tag,
  tagVariant,
  categoryId,
  info,
}: HealthCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (categoryId) {
      router.push(`/pasientDashboard/pasientTiltakside?kategori=${categoryId}`);
    } else {
      router.push("/pasientDashboard/pasientTiltakside");
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl p-5 shadow-sm w-full min-h-35 flex flex-col justify-between hover:shadow-md transition cursor-pointer"
    >
      <div>
        <h3 className="text-brand-navy font-semibold">{title}</h3>
        {info && info.length > 0 && (
          <ul className="mt-2 space-y-0.5">
            {info.map((line) => (
              <li key={line} className="text-xs text-slate-500">
                {line}
              </li>
            ))}
          </ul>
        )}
      </div>

      {tag && tagVariant && (
        <div className="flex justify-end mt-3">
          <Tag variant={tagVariant} className="text-xs px-2 py-1">
            {tag}
          </Tag>
        </div>
      )}
    </div>
  );
}
