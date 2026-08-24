"use client";

import type { ReactNode } from "react";

type BaseProps = { title?: string; detail?: string; action?: ReactNode; compact?: boolean };
const Frame = ({ tone, title, detail, action, compact }: BaseProps & { tone: string }) => (
  <section className={`request-state request-state--${tone}${compact ? " request-state--compact" : ""}`} aria-live="polite">
    <h2>{title}</h2>
    {detail && <p>{detail}</p>}
    {action && <div className="actions">{action}</div>}
  </section>
);
export const LoadingState = ({ title = "Loading…", detail = "MoveReady is checking the latest information.", compact }: BaseProps) => (
  <section className={`request-state request-state--loading${compact ? " request-state--compact" : ""}`} role="status" aria-busy="true">
    <h2>{title}</h2><p>{detail}</p><div className="loading-bar" aria-hidden="true" />
  </section>
);
export const EmptyState = ({ title = "Nothing here yet", detail = "When activity is available, it will appear here.", action, compact }: BaseProps) =>
  <Frame tone="empty" title={title} detail={detail} action={action} compact={compact} />;
export const AuthExpiredState = ({ title = "Your session has expired", detail = "Sign in again to safely continue.", compact }: BaseProps) =>
  <Frame tone="auth" title={title} detail={detail} compact={compact} action={<a className="btn primary" href="/login">Sign in</a>} />;
export const RecoverableErrorState = ({ title = "We could not load this", detail = "Your saved data was not changed. Try again.", action, compact }: BaseProps) =>
  <Frame tone="error" title={title} detail={detail} compact={compact} action={action} />;
