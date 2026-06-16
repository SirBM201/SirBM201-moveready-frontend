"use client";

import { useEffect, useState } from "react";

import { apiJson } from "@/lib/api";

type Country = {
  id?: string;
  country_code: string;
  country_name: string;
  region?: string;
  currency_code?: string;
  summary?: string;
  is_active?: boolean;
};

export default function LiveCountryGrid() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [status, setStatus] = useState("Loading live countries...");

  useEffect(() => {
    let cancelled = false;

    async function loadCountries() {
      try {
        const data = await apiJson<{ countries: Country[] }>("relocation/countries", { timeoutMs: 15000 });
        if (cancelled) return;
        setCountries(data.countries || []);
        setStatus(data.countries?.length ? "Live database-backed countries" : "No countries found yet");
      } catch (error) {
        if (cancelled) return;
        setStatus("Unable to load live countries. Check backend URL/env if this continues.");
      }
    }

    loadCountries();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <p className="form-status">{status}</p>
      <div className="grid">
        {countries.map((country) => (
          <article className="card" key={country.id || country.country_code}>
            <h3>{country.country_name}</h3>
            <p>{country.summary || "Country summary pending admin review."}</p>
            <div className="badge-row">
              <span className="badge">{country.country_code}</span>
              {country.region ? <span className="badge">{country.region}</span> : null}
              {country.currency_code ? <span className="badge">{country.currency_code}</span> : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
