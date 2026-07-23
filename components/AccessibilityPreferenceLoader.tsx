"use client";

import { useEffect } from "react";

import { apiJson } from "@/lib/api";

type Preferences = {
  reduced_motion?: boolean;
  high_contrast?: boolean;
  larger_text?: boolean;
  simple_language?: boolean;
};

function apply(preferences: Preferences) {
  document.documentElement.classList.toggle("moveready-reduced-motion", Boolean(preferences.reduced_motion));
  document.documentElement.classList.toggle("moveready-high-contrast", Boolean(preferences.high_contrast));
  document.documentElement.classList.toggle("moveready-larger-text", Boolean(preferences.larger_text));
  document.documentElement.classList.toggle("moveready-simple-language", Boolean(preferences.simple_language));
}

export default function AccessibilityPreferenceLoader() {
  useEffect(() => {
    let active = true;
    apiJson<{ ok: boolean; preferences?: Preferences }>("account/preferences", { timeoutMs: 10000 })
      .then((response) => {
        if (active && response.preferences) apply(response.preferences);
      })
      .catch(() => {
        // Anonymous visitors and accounts awaiting migration keep the safe defaults.
      });
    return () => {
      active = false;
    };
  }, []);

  return null;
}
