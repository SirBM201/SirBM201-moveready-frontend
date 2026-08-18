export default function Loading() {
  return (
    <main className="global-loading-shell" aria-busy="true" aria-labelledby="global-loading-title">
      <section className="global-loading-card" role="status">
        <p className="overline">Project MoveReady</p>
        <h1 id="global-loading-title">Loading the next part of your relocation workspace...</h1>
        <p>Source status, private account data, provider controls, and saved progress may take a moment to verify.</p>
        <div className="loading-bar" aria-hidden="true" />
      </section>
    </main>
  );
}
