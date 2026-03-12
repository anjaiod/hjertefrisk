"use client";

import { SearchBar } from "../atoms/SearchBar";

export function PatientHeader() {
  return (
    <div className="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200">
      {" "}
      {/* space for more functionality or logo if wanted: */}
      <div></div>
      <div className="flex items-center gap-5">
        <SearchBar className="w-64" />

        <button
          onClick={() => (window.location.href = "../../pasient_dashboard")}
          className="bg-brand-navy hover:bg-brand-navy-light transition rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M3 10.5L12 3l9 7.5" />
            <path d="M5 10v10h14V10" />
            <path d="M9 20v-6h6v6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
