"use client";

import { useEffect } from "react";

const ADMIN_KEY_STORAGE = "moveready_admin_key";

export default function AdminKeyStorageGuard() {
  useEffect(() => {
    try {
      // B16 retires persistent admin-key storage. Admin tools may share the key
      // only within the current tab and lose it when that tab closes.
      localStorage.removeItem(ADMIN_KEY_STORAGE);
    } catch {
      // Storage may be unavailable in privacy-focused browsers.
    }
  }, []);

  return null;
}
