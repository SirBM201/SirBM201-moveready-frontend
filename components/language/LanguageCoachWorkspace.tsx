"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ApiError, apiJson } from "@/lib/api";

type Language = "english" | "french";
type LanguageChoice = Language | "both";
type ActivityMode = "diagnostic" | "adaptive" | "daily" | "review";
type AccessState = "checking" | "ready" | "signed-out" | "unavailable";

type CatalogResponse = {
  ok: boolean;
  contract_version: string;
  language_choices: LanguageChoice[];
  allocation_presets: Array<{ english: number; french: number }>;
  answer_key_policy: string;
  content_policy: string;
  score_boundary: string;
};

type LanguageProfile = {
  language_selection?: LanguageChoice;
  english_allocation?: number;
  french_allocation?: number;
  daily_minutes?: number;
  english_current_level?: number;
  french_current_level?: number;
  english_target_level?: number;
  french_target_level?: number;
};

type LearningPlan = {
  contract_version?: string;
  allocation?: { english: number; french: number };
  daily_minutes?: number;
  daily_plan?: Array<{
    language: Language;
    minutes: number;
    activities: Array<{ type: string; minutes: number }>;
  }>;
};

type Question = {
  id: string;
  language: Language;
  exam: string;
  skill: string;
  difficulty: number;
  prompt: string;
  choices: string[];
  content_origin?: "moveready_original" | "official_released";
  source_url?: string | null;
};

type AttemptFeedback = {
  ok: boolean;
  correct: boolean;
  correct_answer: string;
  explanation: string;
  next_action?: string;
};

type Mistake = {
  id: string;
  question_id: string;
  mistake_count: number;
  correct_streak: number;
  next_review_at: string;
  mastered_at?: string | null;
};

type ProgressResponse = {
  ok: boolean;
  languages?: Partial<Record<Language, {
    attempted: number;
    correct: number;
    accuracy_percent: number;
    readiness: string;
  }>>;
  daily?: Array<{
    activity_date: string;
    english_minutes: number;
    french_minutes: number;
    questions_attempted: number;
    questions_correct: number;
    momentum_points: number;
  }>;
  momentum?: {
    active_days_last_14: number;
    points_last_14: number;
    model: string;
  };
};

type QualificationResponse = {
  ok: boolean;
  actions?: Array<{
    language: Language;
    exam: string;
    current_target_level: number;
    profile_level: number;
    target_gap: number;
    action: string;
    priority: "high" | "medium" | "low";
    practice?: {
      attempted: number;
      accuracy_percent: number;
      readiness: string;
    };
  }>;
};

const fallbackAllocationPresets = [
  { english: 50, french: 50 },
  { english: 70, french: 30 },
  { english: 30, french: 70 },
];

const languageMeta: Record<Language, { label: string; exam: string }> = {
  english: { label: "English", exam: "IELTS General" },
  french: { label: "French", exam: "TEF Canada" },
};

function boundedNumber(value: unknown, minimum: number, maximum: number, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(minimum, Math.min(maximum, Math.round(parsed)));
}

function readable(value: unknown) {
  const text = String(value || "Not available").replaceAll("_", " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatDate(value?: string | null) {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function apiMessage(error: unknown) {
  const apiError = error as ApiError;
  const code = String(apiError?.data?.error || apiError?.message || "");
  if (apiError?.status === 401 || code === "verified_session_required") {
    return "Sign in with your verified email before using your private Language Coach.";
  }
  if (code === "diagnostic_incomplete") {
    const required = Number(apiError?.data?.required_attempts || 6);
    return `Answer at least ${required} distinct diagnostic questions before an internal placement can be saved.`;
  }
  if (code === "unsupported_allocation") return "Choose one of the supported 50/50, 70/30, or 30/70 language allocations.";
  if (code === "question_not_found") return "That practice question is no longer active. Start a new activity.";
  if (code === "question_content_unavailable") return "That question is unavailable because its content source could not be verified.";
  if (code === "invalid_answer" || code === "answer_required") return "Choose an answer before continuing.";
  if (apiError?.name === "AbortError") return "The Language Coach request timed out. Please try again.";
  return "MoveReady could not complete that Language Coach action. Please try again.";
}

function isSignedOutError(error: unknown) {
  const apiError = error as ApiError;
  return apiError?.status === 401 || apiError?.data?.error === "verified_session_required";
}

export default function LanguageCoachWorkspace() {
  const [access, setAccess] = useState<AccessState>("checking");
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [choice, setChoice] = useState<LanguageChoice>("english");
  const [englishAllocation, setEnglishAllocation] = useState(50);
  const [minutes, setMinutes] = useState(20);
  const [targets, setTargets] = useState<Record<Language, number>>({ english: 7, french: 7 });
  const [levels, setLevels] = useState<Record<Language, number>>({ english: 0, french: 0 });
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [qualification, setQualification] = useState<QualificationResponse | null>(null);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [mode, setMode] = useState<ActivityMode>("adaptive");
  const [sessionLanguage, setSessionLanguage] = useState<Language>("english");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState<AttemptFeedback | null>(null);
  const [busyAction, setBusyAction] = useState("");
  const [message, setMessage] = useState("Checking the live Language Coach contract...");
  const questionStartedAt = useRef(Date.now());

  const selectedLanguages = useMemo<Language[]>(
    () => choice === "both" ? ["english", "french"] : [choice],
    [choice],
  );

  const allocation = useMemo(
    () => choice === "english"
      ? { english: 100, french: 0 }
      : choice === "french"
        ? { english: 0, french: 100 }
        : { english: englishAllocation, french: 100 - englishAllocation },
    [choice, englishAllocation],
  );

  const activeQuestion = questions[questionIndex];
  const daily = progress?.daily || [];
  const today = daily[0];
  const momentum = progress?.momentum;
  const activeMistakes = mistakes.filter((item) => !item.mastered_at);
  const dueMistakes = activeMistakes.filter((item) => {
    const dueAt = Date.parse(item.next_review_at);
    return Number.isFinite(dueAt) && dueAt <= Date.now();
  });

  function applyProfile(profile?: LanguageProfile | null) {
    if (!profile) return;
    const nextChoice = profile.language_selection || "english";
    setChoice(nextChoice);
    setEnglishAllocation(
      nextChoice === "both"
        ? boundedNumber(profile.english_allocation, 30, 70, 50)
        : 50,
    );
    setMinutes(boundedNumber(profile.daily_minutes, 5, 180, 20));
    setTargets({
      english: boundedNumber(profile.english_target_level, 0, 12, 7),
      french: boundedNumber(profile.french_target_level, 0, 12, 7),
    });
    setLevels({
      english: boundedNumber(profile.english_current_level, 0, 5, 0),
      french: boundedNumber(profile.french_current_level, 0, 5, 0),
    });
  }

  async function loadDashboard(options: { quiet?: boolean } = {}) {
    const quiet = Boolean(options.quiet);
    if (!quiet) {
      setAccess("checking");
      setMessage("Checking the live Language Coach contract...");
    }

    try {
      const contract = await apiJson<CatalogResponse>("language-coach/options", {
        timeoutMs: 15000,
        useAuthToken: false,
      });
      if (contract.contract_version !== "b07-v1") {
        throw new Error("language_coach_contract_mismatch");
      }
      setCatalog(contract);

      const results = await Promise.allSettled([
        apiJson<{ ok: boolean; profile: LanguageProfile | null }>("language-coach/profile"),
        apiJson<ProgressResponse>("language-coach/progress"),
        apiJson<QualificationResponse>("language-coach/qualification-actions"),
        apiJson<{ ok: boolean; mistakes: Mistake[] }>("language-coach/mistakes"),
      ]);

      const profileResult = results[0];
      if (profileResult.status === "rejected") {
        if (isSignedOutError(profileResult.reason)) {
          setAccess("signed-out");
          setMessage("Sign in to load your private learning plan, attempts, progress, and Mistakes Bank.");
          return;
        }
        throw profileResult.reason;
      }

      applyProfile(profileResult.value.profile);
      if (results[1].status === "fulfilled") setProgress(results[1].value);
      if (results[2].status === "fulfilled") setQualification(results[2].value);
      if (results[3].status === "fulfilled") setMistakes(results[3].value.mistakes || []);

      const partialFailures = results.slice(1).filter((result) => result.status === "rejected").length;
      setAccess("ready");
      if (!quiet) {
        setMessage(partialFailures
          ? `Your plan loaded, but ${partialFailures} progress section${partialFailures === 1 ? " is" : "s are"} temporarily unavailable.`
          : profileResult.value.profile
            ? "Your private learning plan and progress are ready."
            : "Choose English, French, or both, then save your first learning plan.");
      }
    } catch (error) {
      setAccess("unavailable");
      setMessage(
        error instanceof Error && error.message === "language_coach_contract_mismatch"
          ? "The live backend is not yet serving the required B07 Language Coach contract."
          : "The Language Coach is temporarily unavailable. Your existing private progress has not been changed.",
      );
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  function changeChoice(nextChoice: LanguageChoice) {
    setChoice(nextChoice);
    setQuestions([]);
    setFeedback(null);
    setSelectedAnswer("");
    setMessage(
      nextChoice === "both"
        ? "Choose how to divide your daily time between English and French."
        : `${languageMeta[nextChoice].label} will receive 100% of your selected daily practice time.`,
    );
  }

  async function savePlan() {
    setBusyAction("save-plan");
    setMessage("Saving your private learning plan...");
    try {
      const response = await apiJson<{
        ok: boolean;
        profile: LanguageProfile;
        plan: LearningPlan;
      }>("language-coach/profile", {
        method: "PUT",
        body: {
          language_selection: choice,
          allocation,
          daily_minutes: minutes,
          targets,
        },
        timeoutMs: 20000,
      });
      applyProfile(response.profile);
      setPlan(response.plan);
      setMessage("Plan saved. Your diagnostic placement was preserved and was not self-awarded by this form.");
      await loadOutcomeData();
    } catch (error) {
      if (isSignedOutError(error)) setAccess("signed-out");
      setMessage(apiMessage(error));
    } finally {
      setBusyAction("");
    }
  }

  async function loadOutcomeData() {
    const results = await Promise.allSettled([
      apiJson<ProgressResponse>("language-coach/progress"),
      apiJson<QualificationResponse>("language-coach/qualification-actions"),
      apiJson<{ ok: boolean; mistakes: Mistake[] }>("language-coach/mistakes"),
    ]);
    if (results[0].status === "fulfilled") setProgress(results[0].value);
    if (results[1].status === "fulfilled") setQualification(results[1].value);
    if (results[2].status === "fulfilled") setMistakes(results[2].value.mistakes || []);
  }

  async function loadActivity(language: Language, nextMode: ActivityMode) {
    const path = nextMode === "diagnostic"
      ? "language-coach/diagnostic"
      : nextMode === "adaptive"
        ? "language-coach/adaptive-practice"
        : "language-coach/daily-challenge";
    setBusyAction(`load-${nextMode}-${language}`);
    setMessage(`Preparing ${languageMeta[language].label} ${readable(nextMode).toLowerCase()}...`);
    try {
      const response = await apiJson<{
        ok: boolean;
        questions: Question[];
        difficulty?: number;
        minimum_attempts?: number;
      }>(path, { query: { language }, timeoutMs: 20000 });
      const nextQuestions = Array.isArray(response.questions) ? response.questions : [];
      const required = Number(response.minimum_attempts || 6);
      if (nextMode === "diagnostic" && nextQuestions.length < required) {
        setQuestions([]);
        setMessage(`The diagnostic bank currently has ${nextQuestions.length} eligible questions; at least ${required} are required before placement can begin.`);
        return;
      }
      setQuestions(nextQuestions);
      setQuestionIndex(0);
      setFeedback(null);
      setSelectedAnswer("");
      setMode(nextMode);
      setSessionLanguage(language);
      questionStartedAt.current = Date.now();
      setMessage(nextQuestions.length
        ? nextMode === "diagnostic"
          ? `Answer all ${nextQuestions.length} questions. Placement is saved only after the minimum distinct attempts are recorded.`
          : nextMode === "daily"
            ? `Your short ${languageMeta[language].label} challenge is ready.`
            : `Adaptive practice selected difficulty ${response.difficulty || nextQuestions[0]?.difficulty || 1}.`
        : "No eligible questions are available for this activity yet.");
    } catch (error) {
      if (isSignedOutError(error)) setAccess("signed-out");
      setQuestions([]);
      setMessage(apiMessage(error));
    } finally {
      setBusyAction("");
    }
  }

  async function loadReview() {
    setBusyAction("load-review");
    setMessage("Checking your due Mistakes Bank reviews...");
    try {
      const response = await apiJson<{
        ok: boolean;
        due: Array<Mistake & { question?: Question | null }>;
      }>("language-coach/review", { timeoutMs: 20000 });
      const dueQuestions = (response.due || [])
        .map((item) => item.question)
        .filter((item): item is Question => Boolean(item));
      setQuestions(dueQuestions);
      setQuestionIndex(0);
      setFeedback(null);
      setSelectedAnswer("");
      setMode("review");
      setSessionLanguage(dueQuestions[0]?.language || selectedLanguages[0]);
      questionStartedAt.current = Date.now();
      setMessage(dueQuestions.length
        ? `${dueQuestions.length} due review question${dueQuestions.length === 1 ? " is" : "s are"} ready.`
        : "Your due review queue is clear. Previous progress remains intact.");
    } catch (error) {
      if (isSignedOutError(error)) setAccess("signed-out");
      setQuestions([]);
      setMessage(apiMessage(error));
    } finally {
      setBusyAction("");
    }
  }

  async function answerQuestion(answer: string) {
    if (!activeQuestion || feedback || busyAction) return;
    setSelectedAnswer(answer);
    setBusyAction("answer");
    const responseSeconds = boundedNumber(
      (Date.now() - questionStartedAt.current) / 1000,
      0,
      7200,
      0,
    );
    try {
      const response = await apiJson<AttemptFeedback>("language-coach/attempts", {
        method: "POST",
        body: {
          question_id: activeQuestion.id,
          answer,
          response_seconds: responseSeconds,
        },
        timeoutMs: 20000,
      });
      setFeedback(response);
      setMessage(response.correct
        ? "Correct. Review the explanation, then continue."
        : "This answer was added to your Mistakes Bank for spaced review.");
      await loadOutcomeData();
    } catch (error) {
      if (isSignedOutError(error)) setAccess("signed-out");
      setSelectedAnswer("");
      setMessage(apiMessage(error));
    } finally {
      setBusyAction("");
    }
  }

  async function finishActivity() {
    setBusyAction("finish");
    try {
      if (mode === "diagnostic") {
        const response = await apiJson<{
          ok: boolean;
          placement_level: number;
          attempted: number;
          required_attempts: number;
        }>("language-coach/diagnostic/complete", {
          method: "POST",
          body: {
            language: sessionLanguage,
            question_ids: questions.map((question) => question.id),
          },
          timeoutMs: 20000,
        });
        setLevels((current) => ({
          ...current,
          [sessionLanguage]: boundedNumber(response.placement_level, 0, 5, current[sessionLanguage]),
        }));
        setMessage(`Diagnostic complete. Your internal ${languageMeta[sessionLanguage].label} placement is ${response.placement_level}/5. It is not an official exam score.`);
      } else {
        setMessage(`${readable(mode)} complete. Your progress and review queue have been updated.`);
      }
      setQuestions([]);
      setQuestionIndex(0);
      setFeedback(null);
      setSelectedAnswer("");
      await loadDashboard({ quiet: true });
    } catch (error) {
      setMessage(apiMessage(error));
    } finally {
      setBusyAction("");
    }
  }

  function nextQuestion() {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((current) => current + 1);
      setFeedback(null);
      setSelectedAnswer("");
      questionStartedAt.current = Date.now();
      setMessage("Continue with the next question.");
      return;
    }
    void finishActivity();
  }

  if (access === "checking") {
    return (
      <main className="language-shell">
        <section className="language-state-card" aria-live="polite">
          <span className="eyebrow">Language Coach</span>
          <h1>Preparing your private learning workspace...</h1>
          <p>{message}</p>
        </section>
      </main>
    );
  }

  if (access === "signed-out") {
    return (
      <main className="language-shell">
        <section className="language-state-card language-sign-in-card">
          <span className="eyebrow">Private Language Coach</span>
          <h1>Sign in to continue your English or French preparation.</h1>
          <p>Your selected language, placement, answers, mistakes, and daily progress belong only to your verified MoveReady account.</p>
          <div className="language-feature-grid">
            <div><strong>Diagnostic</strong><span>Internal placement after enough distinct answers</span></div>
            <div><strong>Adaptive practice</strong><span>Difficulty responds to recent practice</span></div>
            <div><strong>Mistakes Bank</strong><span>Due review without punitive streak loss</span></div>
          </div>
          <div className="actions">
            <a className="btn primary" href="/login?next=/language-coach">Sign in with email</a>
            <a className="btn" href="/qualify">Back to Qualify</a>
          </div>
          <p className="language-boundary">MoveReady practice indicators are not official IELTS, TEF, CLB, or NCLC results.</p>
        </section>
      </main>
    );
  }

  if (access === "unavailable") {
    return (
      <main className="language-shell">
        <section className="language-state-card" aria-live="polite">
          <span className="eyebrow">Language Coach unavailable</span>
          <h1>Your private progress has not been changed.</h1>
          <p>{message}</p>
          <div className="actions">
            <button className="btn primary" type="button" onClick={() => void loadDashboard()}>Try again</button>
            <a className="btn" href="/deployment-status">Check deployment status</a>
          </div>
        </section>
      </main>
    );
  }

  const allocationPresets = catalog?.allocation_presets?.length
    ? catalog.allocation_presets
    : fallbackAllocationPresets;

  return (
    <main className="language-shell">
      <section className="language-hero">
        <div>
          <span className="eyebrow">QUALIFY · LANGUAGE &amp; EXAM COACH</span>
          <h1>Build practical English, French, or both—one short session at a time.</h1>
          <p>Choose your plan, complete an internal diagnostic, practise at an adaptive level, and review mistakes when they are due.</p>
        </div>
        <aside className="language-hero-status">
          <span className="status-dot complete">Verified account</span>
          <strong>{catalog?.contract_version || "B07 contract"}</strong>
          <p>Answers and explanations remain hidden until your answer is recorded.</p>
        </aside>
      </section>

      <p className="language-message" aria-live="polite">{message}</p>

      <section className="language-plan-grid">
        <article className="language-card language-plan-card">
          <div className="panel-heading">
            <div><p className="overline">Step 1</p><h2>Choose your learning plan</h2></div>
            <span className="status-dot">Private</span>
          </div>

          <fieldset className="language-choice-grid">
            <legend>Which language do you want to practise?</legend>
            {(["english", "french", "both"] as LanguageChoice[]).map((item) => (
              <label className={choice === item ? "selected" : ""} key={item}>
                <input
                  type="radio"
                  name="language_selection"
                  value={item}
                  checked={choice === item}
                  onChange={() => changeChoice(item)}
                />
                <span>
                  <strong>{item === "both" ? "English + French" : languageMeta[item].label}</strong>
                  <small>{item === "english" ? "IELTS General foundation" : item === "french" ? "TEF Canada foundation" : "Divide daily time between both"}</small>
                </span>
              </label>
            ))}
          </fieldset>

          {choice === "both" ? (
            <fieldset className="language-allocation-grid">
              <legend>How should daily time be divided?</legend>
              {allocationPresets.map((preset) => (
                <label className={englishAllocation === preset.english ? "selected" : ""} key={`${preset.english}-${preset.french}`}>
                  <input
                    type="radio"
                    name="language_allocation"
                    value={preset.english}
                    checked={englishAllocation === preset.english}
                    onChange={() => setEnglishAllocation(preset.english)}
                  />
                  <span><strong>{preset.english}% English</strong><small>{preset.french}% French</small></span>
                </label>
              ))}
            </fieldset>
          ) : null}

          <div className="form-grid two-col language-plan-fields">
            <div className="field">
              <label htmlFor="language_daily_minutes">Daily practice time</label>
              <input
                id="language_daily_minutes"
                type="number"
                inputMode="numeric"
                min="5"
                max="180"
                step="5"
                value={minutes}
                onChange={(event) => setMinutes(boundedNumber(event.target.value, 5, 180, 20))}
              />
              <small>Choose 5–180 minutes. Short, consistent practice is acceptable.</small>
            </div>
            {selectedLanguages.map((language) => (
              <div className="field" key={language}>
                <label htmlFor={`${language}_target_level`}>{languageMeta[language].label} planning target</label>
                <input
                  id={`${language}_target_level`}
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="12"
                  value={targets[language]}
                  onChange={(event) => setTargets((current) => ({
                    ...current,
                    [language]: boundedNumber(event.target.value, 0, 12, current[language]),
                  }))}
                />
                <small>Planning level only; not a self-awarded official CLB/NCLC result.</small>
              </div>
            ))}
          </div>

          <button className="btn primary" type="button" onClick={() => void savePlan()} disabled={Boolean(busyAction)}>
            {busyAction === "save-plan" ? "Saving plan..." : "Save private plan"}
          </button>

          {plan?.daily_plan?.length ? (
            <div className="language-plan-preview">
              <strong>Saved daily split</strong>
              {plan.daily_plan.map((item) => (
                <span key={item.language}>{languageMeta[item.language].label}: {item.minutes} minute{item.minutes === 1 ? "" : "s"}</span>
              ))}
            </div>
          ) : null}
        </article>

        <article className="language-card language-readiness-card">
          <div className="panel-heading">
            <div><p className="overline">Practice indicators</p><h2>Your current readiness</h2></div>
            <span className="status-dot">Internal</span>
          </div>
          {selectedLanguages.map((language) => {
            const item = progress?.languages?.[language];
            const accuracy = boundedNumber(item?.accuracy_percent, 0, 100, 0);
            return (
              <div className="language-readiness-row" key={language}>
                <div><strong>{languageMeta[language].exam}</strong><span>{accuracy}% practice accuracy</span></div>
                <div className="language-progress-track" aria-label={`${accuracy}% practice accuracy`}>
                  <span style={{ width: `${accuracy}%` }} />
                </div>
                <p>Internal placement {levels[language]}/5 · {item?.attempted || 0} recorded attempts · {readable(item?.readiness || "building")}</p>
              </div>
            );
          })}
          <div className="language-boundary">
            <strong>Important score boundary</strong>
            <p>Internal placement, accuracy, readiness, and planning targets are preparation signals. They are not official IELTS, TEF, CLB, or NCLC results.</p>
          </div>
        </article>
      </section>

      <section className="language-card language-momentum-card">
        <div className="panel-heading">
          <div><p className="overline">Daily momentum</p><h2>Keep moving without streak punishment</h2></div>
          <span className="status-dot complete">{momentum?.points_last_14 || 0} points</span>
        </div>
        <p>Missing one day does not erase your accumulated practice.</p>
        <div className="language-metric-grid">
          <div><strong>{momentum?.active_days_last_14 || 0}</strong><span>active days / 14</span></div>
          <div><strong>{today?.questions_attempted || 0}</strong><span>questions today</span></div>
          <div><strong>{today?.english_minutes || 0}m</strong><span>English today</span></div>
          <div><strong>{today?.french_minutes || 0}m</strong><span>French today</span></div>
        </div>
      </section>

      <section className="language-card language-learning-card">
        <div className="panel-heading">
          <div><p className="overline">Step 2</p><h2>Choose today&apos;s activity</h2></div>
          <span className="status-dot">{dueMistakes.length} due reviews</span>
        </div>
        <p>Use the diagnostic for internal placement, adaptive practice for your current difficulty, or a short daily challenge when time is limited.</p>
        <div className="language-activity-grid">
          {selectedLanguages.map((language) => (
            <div className="language-activity-group" key={language}>
              <strong>{languageMeta[language].label}</strong>
              <button className="btn" type="button" onClick={() => void loadActivity(language, "diagnostic")} disabled={Boolean(busyAction)}>
                {levels[language] > 0 ? "Retake diagnostic" : "Start diagnostic"}
              </button>
              <button className="btn primary" type="button" onClick={() => void loadActivity(language, "adaptive")} disabled={Boolean(busyAction)}>Adaptive practice</button>
              <button className="btn" type="button" onClick={() => void loadActivity(language, "daily")} disabled={Boolean(busyAction)}>1–5 minute challenge</button>
            </div>
          ))}
          <div className="language-activity-group review">
            <strong>Mistakes Bank</strong>
            <button className="btn" type="button" onClick={() => void loadReview()} disabled={Boolean(busyAction)}>Review due mistakes</button>
            <span>{dueMistakes.length ? `${dueMistakes.length} ready now` : "No due review detected"}</span>
          </div>
        </div>

        {activeQuestion ? (
          <article className="language-question-card">
            <div className="language-question-meta">
              <span>{readable(mode)}</span>
              <span>{activeQuestion.exam}</span>
              <span>{readable(activeQuestion.skill)}</span>
              <span>Difficulty {activeQuestion.difficulty}</span>
              <span>{questionIndex + 1} of {questions.length}</span>
            </div>
            <div className="language-question-progress"><span style={{ width: `${((questionIndex + (feedback ? 1 : 0)) / questions.length) * 100}%` }} /></div>
            <p className="language-question-source">
              {activeQuestion.content_origin === "official_released" ? "Permitted official-release practice" : "MoveReady-original practice"}
              {activeQuestion.content_origin === "official_released" && activeQuestion.source_url?.startsWith("https://") ? <a href={activeQuestion.source_url} target="_blank" rel="noreferrer">View source</a> : null}
            </p>
            <h3>{activeQuestion.prompt}</h3>
            <div className="language-answer-grid">
              {(activeQuestion.choices || []).map((answer) => {
                const isSelected = selectedAnswer === answer;
                const isCorrectAnswer = Boolean(feedback && feedback.correct_answer === answer);
                return (
                  <button
                    className={`${isSelected ? "selected" : ""} ${isCorrectAnswer ? "correct" : ""}`.trim()}
                    type="button"
                    disabled={Boolean(feedback) || busyAction === "answer"}
                    onClick={() => void answerQuestion(answer)}
                    key={answer}
                  >
                    {answer}
                  </button>
                );
              })}
            </div>
            {feedback ? (
              <div className={`language-feedback ${feedback.correct ? "correct" : "review"}`} aria-live="polite">
                <strong>{feedback.correct ? "Correct" : "Review this one"}</strong>
                <p>{feedback.explanation}</p>
                {!feedback.correct ? <p>Correct answer: <b>{feedback.correct_answer}</b></p> : null}
                <button className="btn primary" type="button" onClick={nextQuestion} disabled={Boolean(busyAction)}>
                  {questionIndex < questions.length - 1 ? "Next question" : mode === "diagnostic" ? "Complete diagnostic" : "Finish activity"}
                </button>
              </div>
            ) : null}
          </article>
        ) : null}
      </section>

      {qualification?.actions?.length ? (
        <section className="language-card">
          <div className="panel-heading">
            <div><p className="overline">Qualification plan</p><h2>What to work on next</h2></div>
            <span className="status-dot">Choice preserved</span>
          </div>
          <div className="language-action-grid">
            {qualification.actions.map((action) => (
              <article key={action.language}>
                <div><strong>{action.exam}</strong><span className={`language-priority ${action.priority}`}>{action.priority} priority</span></div>
                <h3>{readable(action.action)}</h3>
                <p>Internal placement {action.profile_level}/5 · planning target {action.current_target_level} · practice accuracy {action.practice?.accuracy_percent || 0}%</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="language-card language-mistakes-card">
        <div className="panel-heading">
          <div><p className="overline">Spaced review</p><h2>Mistakes Bank</h2></div>
          <span className="status-dot">{activeMistakes.length} active</span>
        </div>
        <p>A wrong answer adds a review item. Three later correct reviews can mark it mastered; missing a day does not delete progress.</p>
        {!mistakes.length ? (
          <div className="language-empty-state">No mistakes are recorded yet. Start a diagnostic or practice activity when you are ready.</div>
        ) : (
          <div className="language-mistake-grid">
            {mistakes.map((mistake) => (
              <article className={mistake.mastered_at ? "mastered" : ""} key={mistake.id}>
                <div><strong>{mistake.mastered_at ? "Mastered" : "Learning"}</strong><span>{mistake.mistake_count} mistake{mistake.mistake_count === 1 ? "" : "s"}</span></div>
                <p>Correct review streak: {mistake.correct_streak}/3</p>
                <p>{mistake.mastered_at ? `Mastered ${formatDate(mistake.mastered_at)}` : `Next review ${formatDate(mistake.next_review_at)}`}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="language-safety-strip">
        <strong>Content and score boundary</strong>
        <span>MoveReady uses original practice or permitted official-release material with provenance. It does not use leaked, recalled, or reconstructed live exam content, and it does not issue official test scores.</span>
      </section>
    </main>
  );
}
