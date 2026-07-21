type BeginnerFriendlyGuideProps = {
  title?: string;
  intro?: string;
  compact?: boolean;
};

const simpleSteps = [
  {
    label: "1. Start with yourself",
    text: "Enter your country, passport, goal, money available, family count, and timeline. It is okay if some answers are estimates.",
  },
  {
    label: "2. Check before paying",
    text: "Use Check Route, Passport, and Visa Power before paying agents, booking tickets, or sending documents.",
  },
  {
    label: "3. Save one profile",
    text: "Use one email or phone number so your reports, saved routes, alerts, and support requests do not get mixed up.",
  },
  {
    label: "4. Use official sources",
    text: "MoveReady gives planning guidance only. Always check embassy, government, airline, school, or employer rules before acting.",
  },
];

const quickChoices = [
  { label: "I am new", href: "/start", text: "Show me what to do first." },
  { label: "Check my route", href: "/route-checker", text: "Tell me if my plan looks realistic." },
  { label: "Check passport", href: "/passport-index", text: "Show what my passport can do." },
  { label: "Check visas I already have", href: "/visa-power", text: "Show extra travel benefits." },
  { label: "Open account", href: "/dashboard", text: "Save or load my details." },
];

export default function BeginnerFriendlyGuide({
  title = "Simple guide for every user",
  intro = "Use MoveReady one step at a time. The app is written for everyday people, not only immigration experts.",
  compact = false,
}: BeginnerFriendlyGuideProps) {
  return (
    <section className={`section ${compact ? "no-top-pad" : ""}`}>
      <div className="result-block soft">
        <div className="panel-heading">
          <div>
            <p className="overline">Plain language guide</p>
            <h2>{title}</h2>
            <p className="section-intro" style={{ marginBottom: 0 }}>{intro}</p>
          </div>
          <span className="status-dot">Beginner friendly</span>
        </div>

        <div className="mini-list" style={{ marginTop: 14 }}>
          {simpleSteps.map((step) => (
            <div key={step.label}>
              <strong>{step.label}</strong>
              <span>{step.text}</span>
            </div>
          ))}
        </div>

        <div className="actions" style={{ marginTop: 16 }}>
          {quickChoices.map((choice, index) => (
            <a className={`btn ${index === 1 ? "primary" : ""}`} href={choice.href} key={choice.href} title={choice.text}>
              {choice.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
