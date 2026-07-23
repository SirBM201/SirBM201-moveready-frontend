import SiteHeader from "@/components/SiteHeader";
import StudyAdmissionPlanner from "@/components/StudyAdmissionPlanner";


const principles = [
  {
    title: "Academic fit first",
    text: "Check programme prerequisites, qualification equivalence, grade, subject credits, work experience, field change, and institution recognition before paying an application fee.",
  },
  {
    title: "Affordability is wider than tuition",
    text: "Separate tuition, deposits, living costs, proof of funds, insurance, travel, housing, family expenses, and emergency funds.",
  },
  {
    title: "Admission is not a visa",
    text: "An offer does not guarantee a study visa, work right, dependant right, post-study route, professional licence, or permanent residence.",
  },
  {
    title: "Regulated careers need a regulator check",
    text: "Nursing, pharmacy, medicine, teaching, law, engineering, and other regulated careers may require licensing beyond the academic programme.",
  },
];


export default function StudyPlannerPage() {
  return (
    <main className="page-shell">
      <SiteHeader sectionLabel="Study and admission planner" />

      <section className="hero-band compact-hero">
        <div className="hero-copy">
          <span className="eyebrow">Admission + study visa readiness</span>
          <h1>Plan the education route without treating admission, scholarship, visa, or licensing as guaranteed.</h1>
          <p className="lede">
            Enter the academic background, grade, desired field, funding, language evidence, target intake, family plan, and refusal history. MoveReady will organize the programme-search, admission, funding, visa, and arrival work.
          </p>
          <div className="actions">
            <a className="btn primary" href="#study-admission-planner">Build study plan</a>
            <a className="btn" href="/opportunities">Scholarships and opportunities</a>
            <a className="btn" href="/route-checker">Check study route</a>
            <a className="btn" href="/journey-plans">My saved plans</a>
          </div>
        </div>
      </section>

      <section className="section no-top-pad">
        <div className="grid">
          {principles.map((principle) => (
            <article className="card" key={principle.title}>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <StudyAdmissionPlanner />
      </section>

      <section className="section">
        <article className="result-block soft">
          <p className="overline">Trust notice</p>
          <h2>Shortlist only programmes and institutions you can verify.</h2>
          <p>
            Confirm recognition, accreditation, programme entry requirements, application deadline, tuition, scholarship, refund, professional outcome, visa eligibility, dependant rules, work conditions, and post-study options from official institutions, regulators, and government sources.
          </p>
        </article>
      </section>
    </main>
  );
}
