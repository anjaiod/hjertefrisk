import { FeatureCard } from "../atoms/FeatureCard";

export function FeatureCardGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <FeatureCard
        icon="❤️"
        title="Hjertefrisk spørreskjema"
        description="Trykk for å endre svar på hjertefrisk spørreskjemaet"
        iconBgColor="bg-brand-sage/20"
        onClick={() => router.push(withPatientId("/dashboard/maalinger"))}
      />
      <FeatureCard
        icon="🖥️"
        title="Teamvisning"
        description="Trykk for å se en utvidet pasientvisning"
        iconBgColor="bg-brand-navy/15"
        onClick={() => router.push(withPatientId("/dashboard/teamvisning"))}
      />
      <FeatureCard
        icon="📋"
        title="Tiltak"
        description="Trykk for å se anbefalte tiltak for pasienten"
        iconBgColor="bg-brand-sky/35"
        onClick={() => router.push(withPatientId("/dashboard/tiltak"))}
      />
    </div>
  );
}