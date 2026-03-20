"use client";

import { PatientSidebarNav } from "../../../components/organisms/PatientSidebarNav";
import { PatientHeader } from "../../../components/organisms/PatientHeader";
import { Button } from "../../../components/atoms/Button";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="flex">
      <PatientSidebarNav activePath="/pasientDashboard/pasientHjertefrisk" />
      <div className="flex flex-col flex-1">
        <PatientHeader />
        <main>
          <div className="mb-6">
            <Button
              variant="primary"
              onClick={() =>
                router.push(
                  "/pasientDashboard/pasientHjertefrisk/pasientSkjema",
                )
              }
            >
              Fyll inn nytt hjertefrisk-skjema
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
