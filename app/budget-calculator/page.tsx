import FinancialReadinessWorkspace from "@/components/financial/FinancialReadinessWorkspace";
import SiteHeader from "@/components/SiteHeader";

export default function BudgetCalculatorPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Financial readiness" />
      <FinancialReadinessWorkspace />
    </main>
  );
}
