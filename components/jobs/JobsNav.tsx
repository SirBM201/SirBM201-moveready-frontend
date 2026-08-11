const links = [
  { label: "Dashboard", href: "/jobs" },
  { label: "Quick Setup", href: "/jobs/setup" },
  { label: "Profile", href: "/jobs/profile" },
  { label: "Companies", href: "/jobs/companies" },
  { label: "Recruiters", href: "/jobs/recruiters" },
  { label: "Applications", href: "/jobs/applications" },
  { label: "Resume Vault", href: "/jobs/resume-vault" },
  { label: "Interview Preparation", href: "/jobs/interview-preparation" },
];

export default function JobsNav() {
  return (
    <section className="jobs-nav-wrap" aria-label="Jobs workspace navigation">
      <div>
        <p className="overline">Jobs execution center</p>
        <strong>Find, prepare, apply, follow up.</strong>
      </div>
      <nav className="jobs-nav">
        {links.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
      </nav>
    </section>
  );
}
