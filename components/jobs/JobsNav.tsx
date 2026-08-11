const links = [
  { label: "Dashboard", href: "/jobs" },
  { label: "Companies", href: "/jobs/companies" },
  { label: "Applications", href: "/jobs/applications" },
  { label: "Resume", href: "/jobs/resume-vault" },
];

const supportingLinks = [
  { label: "Quick setup", href: "/jobs/setup" },
  { label: "Job profile", href: "/jobs/profile" },
  { label: "Recruiters", href: "/jobs/recruiters" },
  { label: "Interview Preparation", href: "/jobs/interview-preparation" },
];

export default function JobsNav() {
  return (
    <section className="jobs-nav-wrap" aria-label="Jobs workspace navigation">
      <div>
        <p className="overline">Job search workspace</p>
        <strong>Find jobs, prepare, apply, and follow up.</strong>
      </div>
      <nav className="jobs-nav">
        {links.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
        <details className="jobs-nav-more">
          <summary>More tools</summary>
          <div>
            {supportingLinks.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
          </div>
        </details>
      </nav>
    </section>
  );
}
