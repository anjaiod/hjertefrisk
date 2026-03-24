"use client";

import { FeatureCard } from "../atoms/FeatureCard";
import { useRouter, useSearchParams } from "next/navigation";

export function FeatureCardGrid() {
  const searchParams = useSearchParams();
  const patientId = searchParams?.get("patientId");
  const router = useRouter();
  const withPatientId = (href: string) => {
    if (!patientId) return href;
    const join = href.includes("?") ? "&" : "?";
    return `${href}${join}patientId=${encodeURIComponent(patientId)}`;
  };
  return (
    <div
      className="grid grid-cols-1 gap-4 md:grid-cols-3"
      onClick={() => router.push(withPatientId("/dashboard/maalinger"))}
    >
      <FeatureCard
        icon="❤️"
        title="Oppdater målinger"
        description="Trykk for å se og endre pasientens målinger"
        iconBgColor="bg-brand-sage/20"
      />
      <FeatureCard
        icon="🖥️"
        title="Teamvisning"
        description="Trykk for å se en utvidet pasientvisning"
        iconBgColor="bg-brand-navy/15"
      />
      <FeatureCard
        icon="📋"
        title="Tiltak"
        description="Trykk for å se anbefalte tiltak for pasienten"
        iconBgColor="bg-brand-sky/35"
      />
    </div>
  );
}
