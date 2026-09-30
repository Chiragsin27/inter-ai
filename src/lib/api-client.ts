/**
 * Typed API client for the Express backend.
 * Token is passed in from components via `useAuth().getToken()`
 * so we never try to grab it from window globals.
 */

type TokenGetter = () => Promise<string | null>;

async function apiFetch<T>(
  path: string,
  getToken: TokenGetter,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Typed shapes ─────────────────────────────────────────────

export interface GeneratedQuestion {
  question: string;
  answer: string;
}

export interface EvaluateResult {
  ratings: number;
  feedback: string;
}

// ── API methods ───────────────────────────────────────────────
// Every method receives getToken as its first argument so the
// caller (a React component) controls how the token is obtained.

export const apiClient = {
  generateQuestions(
    getToken: TokenGetter,
    data: {
      position: string;
      description: string;
      experience: number;
      techStack: string;
    }
  ): Promise<{ questions: GeneratedQuestion[] }> {
    return apiFetch("/ai/generate-questions", getToken, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  evaluateAnswer(
    getToken: TokenGetter,
    data: {
      question: string;
      correctAnswer: string;
      userAnswer: string;
    }
  ): Promise<EvaluateResult> {
    return apiFetch("/ai/evaluate-answer", getToken, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
