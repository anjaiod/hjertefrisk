import { FeatureCard } from "../atoms/FeatureCard";

export function FeatureCardGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <FeatureCard
        icon="❤️"
        title="Hjertefrisk"
        description="Trykk for å se detaljer om pasientens hjertehelse"
        iconBgColor="bg-brand-teal/20"
      />
      <FeatureCard
        icon="📊"
        title="Vitalia"
        description="Trykk for å se pasientens vitalia"
        iconBgColor="bg-brand-sky/25"
      />
      <FeatureCard
        icon="🖥️"
        title="Pasientvisning"
        description="Trykk for å se en utvidet pasientvisning"
        iconBgColor="bg-brand-navy/15"
      />
      <FeatureCard
        icon="🩸"
        title="Blodprøver"
        description="Trykk for å se og legge til resultater fra blodprøver"
        iconBgColor="bg-brand-orange/20"
      />
      <FeatureCard
        icon="📈"
        title="Målinger"
        description="Trykk for å se og legge til målinger"
        iconBgColor="bg-brand-sun/25"
      />
      <FeatureCard
        icon="💊"
        title="Legemidler"
        description="Trykk for å se legemidler"
        iconBgColor="bg-brand-mint/35"
      />
    </div>
  );
}