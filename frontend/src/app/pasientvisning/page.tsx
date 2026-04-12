"use client";

import { useEffect, useState } from "react";
import PatientTable, {
  Patient,
  SortKey,
  SortDir,
} from "@/components/organisms/PatientTable";
import { SearchBar } from "@/components/atoms/SearchBar";
import { Tag, TagVariant } from "@/components/atoms/Tag";
import { PatientDto } from "@/types";
import { apiClient } from "@/lib/apiClient";

const PAGE_SIZE = 15;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

async function fetchPage(
  page: number,
  search: string,
  sortBy: SortKey | null,
  sortDir: SortDir,
  riskLevel: TagVariant | null,
): Promise<{ data: Patient[]; totalCount: number }> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(PAGE_SIZE),
  });
  if (search) params.set("search", search);
  if (sortBy) {
    params.set("sortBy", sortBy === "lastVisited" ? "createdAt" : sortBy);
    params.set("sortDir", sortDir);
  }
  if (riskLevel) params.set("riskLevel", riskLevel);

  const result = await apiClient.get<{
    data: PatientDto[];
    totalCount: number;
  }>(`/api/patients?${params.toString()}`);

  const data = result.data.map((p) => ({
    id: String(p.id),
    name: p.name,
    lastVisited: formatDate(p.createdAt),
    lastVisitedRaw: p.createdAt,
    riskLevel: (p.riskLevel as TagVariant) ?? "none",
  }));

  return { data, totalCount: result.totalCount };
}

const statusFilters: { variant: TagVariant; label: string }[] = [
  { variant: "high", label: "Høy" },
  { variant: "medium", label: "Middels" },
  { variant: "low", label: "Lav" },
];

export default function Page() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TagVariant | null>(null);
  const [sortKey, setSortKey] = useState<SortKey | null>("lastVisited");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  useEffect(() => {
    fetchPage(currentPage, search, sortKey, sortDir, statusFilter)
      .then(({ data, totalCount }) => {
        setPatients(data);
        setTotalCount(totalCount);
      })
      .catch((error) => {
        console.error("Failed to fetch patients:", error);
        setPatients([]);
        setTotalCount(0);
      });
  }, [currentPage, search, sortKey, sortDir, statusFilter]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d: SortDir) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setCurrentPage(1);
  }

  const filteredPatients = patients;

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-navy">Pasienter</h1>
        <div className="flex items-center gap-3">
          {statusFilters.map(({ variant, label }) => (
            <button
              key={variant}
              onClick={() => {
                setStatusFilter(statusFilter === variant ? null : variant);
                setCurrentPage(1);
              }}
              className={[
                "transition-opacity",
                statusFilter !== null && statusFilter !== variant
                  ? "opacity-40"
                  : "opacity-100",
              ].join(" ")}
            >
              <Tag variant={variant}>{label}</Tag>
            </button>
          ))}
          <SearchBar
            placeholder="Søk..."
            value={search}
            onChange={(v) => {
              setSearch(v);
              setCurrentPage(1);
              if (v) setStatusFilter(null);
            }}
            className="w-72"
          />
        </div>
      </div>
      <PatientTable
        patients={filteredPatients}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
      />
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-brand-mist text-brand-navy disabled:opacity-40 hover:bg-brand-mist-lightest transition-colors"
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={[
                "px-3 py-1 rounded border transition-colors",
                page === currentPage
                  ? "border-brand-sky bg-brand-sky text-white"
                  : "border-brand-mist text-brand-navy hover:bg-brand-mist-lightest",
              ].join(" ")}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-brand-mist text-brand-navy disabled:opacity-40 hover:bg-brand-mist-lightest transition-colors"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
