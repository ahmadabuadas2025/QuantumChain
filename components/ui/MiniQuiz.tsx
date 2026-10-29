"use client";

import { useState } from "react";
import { recordQuiz } from "@/lib/progress";
import type { QuizQuestion } from "@/content/types";

export function MiniQuiz({ id, title = "Check yourself", questions }: { id: string; title?: string; questions: QuizQuestion[] }) {
  const [picked, setPicked] = useState<Record<string, number>>({});

  const choose = (q: QuizQuestion, i: number) => {
    if (picked[q.id] !== undefined) return;
    const next = { ...picked, [q.id]: i };
    setPicked(next);
    if (Object.keys(next).length === questions.length) {
      const correct = questions.filter((qq) => next[qq.id] === qq.answer).length;
      recordQuiz(id, correct / questions.length);
    }
  };

  const answered = Object.keys(picked).length;
  const correct = questions.filter((q) => picked[q.id] === q.answer).length;

  return (
    <section aria-label={title} className="rounded-xl border border-rule bg-panel p-4" data-quiz={id}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-semibold">{title}</h3>
        {answered === questions.length ? (
          <span className="text-sm text-muted" role="status">
            {correct} of {questions.length} correct
          </span>
        ) : (
          <button type="button" className="text-sm text-muted underline" onClick={() => setPicked({})} hidden={!answered}>
            Reset
          </button>
        )}
      </div>
      <ol className="mt-3 flex flex-col gap-5">
        {questions.map((q, qi) => {
          const sel = picked[q.id];
          return (
            <li key={q.id}>
              <fieldset>
                <legend className="font-medium">
                  {qi + 1}. {q.prompt}
                </legend>
                <div className="mt-2 flex flex-col gap-2">
                  {q.options.map((o, i) => {
                    const state =
                      sel === undefined ? "idle" : i === q.answer ? "right" : i === sel ? "wrong" : "dim";
                    return (
                      <button
                        key={o}
                        type="button"
                        onClick={() => choose(q, i)}
                        disabled={sel !== undefined}
                        aria-pressed={sel === i}
                        className={`rounded-lg border px-3 py-2 text-left ${
                          state === "right"
                            ? "border-risk-green text-risk-green"
                            : state === "wrong"
                              ? "border-risk-red text-risk-red line-through"
                              : state === "dim"
                                ? "border-rule text-muted"
                                : "border-rule hover:border-accent"
                        }`}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
                {sel !== undefined && (
                  <p className="mt-2 text-sm text-muted" role="status">
                    {sel === q.answer ? "Correct. " : "Not quite. "}
                    {q.explain}
                  </p>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
