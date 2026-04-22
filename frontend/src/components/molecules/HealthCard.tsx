"use client";

import { useRouter } from "next/navigation";
import { Tag } from "../atoms/Tag";

type HealthCardProps = {
  title: string;
  tag?: string;
  tagVariant?: "high" | "medium" | "low";
  categoryId?: number;
};

export function HealthCard({
  title,
  tag,
  tagVariant,
  categoryId,
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
      className="bg-white rounded-2xl p-5 shadow-sm w-[220px] h-[140px] flex flex-col justify-between hover:shadow-md transition cursor-pointer"
    >
      <div>
        <h3 className="text-brand-navy font-semibold">{title}</h3>
      </div>

      {tag && tagVariant && (
        <div className="flex justify-end">
          <Tag variant={tagVariant} className="text-xs px-2 py-1">
            {tag}
          </Tag>
        </div>
      )}
    </div>
  );
}
