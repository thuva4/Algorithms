import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { LearningPath, LearningStep } from '../data/learning-paths';
import { learningPaths } from '../data/learning-paths';
import PatternCard from '../components/PatternCard';
import patternsIndexData from '../data/patterns-index.json';
import type { PatternData, PatternIndexData } from '../types/patterns';

function getStorageKey(pathId: string): string {
  return `learning-path-${pathId}-progress`;
}

function loadProgress(pathId: string): number[] {
  try {
    const raw = localStorage.getItem(getStorageKey(pathId));
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((v): v is number => typeof v === 'number');
      }
    }
  } catch {
    // ignore corrupted data
  }
  return [];
}

function saveProgress(pathId: string, completed: number[]): void {
  localStorage.setItem(getStorageKey(pathId), JSON.stringify(completed));
}

const difficultyColors: Record<string, string> = {
  beginner:
    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
  intermediate:
    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
  advanced:
    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
};

const progressBarColors: Record<string, string> = {
  beginner: 'bg-green-500 dark:bg-green-400',
  intermediate: 'bg-yellow-500 dark:bg-yellow-400',
  advanced: 'bg-red-500 dark:bg-red-400',
};

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize ${
        difficultyColors[difficulty] || difficultyColors.beginner
      }`}
    >
      {difficulty}
    </span>
  );
}

function ProgressBar({
  completed,
  total,
  difficulty,
}: {
  completed: number;
  total: number;
  difficulty: string;
}) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
        <span>
          {completed} of {total} completed
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            progressBarColors[difficulty] || progressBarColors.beginner
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StepItem({
  step,
  index,
  isCompleted,
  onToggle,
}: {
  step: LearningStep;
  index: number;
  isCompleted: boolean;
  onToggle: (index: number) => void;
}) {
  return (
    <div className="relative flex gap-4">
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => onToggle(index)}
          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-200 ${
            isCompleted
              ? 'border-green-500 bg-green-500 text-white dark:border-green-400 dark:bg-green-400 dark:text-gray-900'
              : 'border-gray-300 bg-white text-gray-500 hover:border-blue-400 hover:text-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-blue-500 dark:hover:text-blue-400'
          }`}
          title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {isCompleted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <span>{index + 1}</span>
          )}
        </button>
        {/* Vertical line below the circle */}
        <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Step content */}
      <div className="pb-8 flex-1 min-w-0">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <Link
              to={`/algorithm/${step.category}/${step.algorithmSlug}`}
              className="text-base font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {step.title}
            </Link>
            <span className="shrink-0 text-xs font-medium text-gray-400 dark:text-gray-500 capitalize bg-gray-100 dark:bg-gray-800 rounded-md px-2 py-0.5">
              {step.category.split('-').join(' ')}
            </span>
          </div>
          <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 p-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 shrink-0 mt-0.5 text-amber-500 dark:text-amber-400"
            >
              <path d="M10 1a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 1ZM5.05 3.05a.75.75 0 0 1 1.06 0l1.062 1.06A.75.75 0 1 1 6.11 5.173L5.05 4.11a.75.75 0 0 1 0-1.06ZM14.95 3.05a.75.75 0 0 1 0 1.06l-1.06 1.062a.75.75 0 0 1-1.062-1.061l1.061-1.06a.75.75 0 0 1 1.06 0ZM3 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 3 8ZM14 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 14 8ZM7.172 13.89a.75.75 0 0 1-1.061-1.062l1.06-1.06a.75.75 0 1 1 1.062 1.06l-1.06 1.061ZM12.828 13.89a.75.75 0 0 1 0-1.061l1.06-1.06a.75.75 0 1 1 1.062 1.06l-1.061 1.061a.75.75 0 0 1-1.06 0ZM10 14a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 14Z" />
              <path
                fillRule="evenodd"
                d="M10 17a1 1 0 0 1 .993.883L11 18v.25a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75V18a1 1 0 0 1 1-1ZM10 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {step.keyTakeaway}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Link
              to={`/algorithm/${step.category}/${step.algorithmSlug}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              View algorithm
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-3 h-3"
              >
                <path
                  fillRule="evenodd"
                  d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <button
              onClick={() => onToggle(index)}
              className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors ${
                isCompleted
                  ? 'border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40'
                  : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PathCard({
  path,
  completedCount,
  isExpanded,
  onToggleExpand,
}: {
  path: LearningPath;
  completedCount: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggleExpand}
      className={`w-full text-left rounded-xl border p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        isExpanded
          ? 'border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10'
          : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{path.title}</h3>
        <DifficultyBadge difficulty={path.difficulty} />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {path.description}
      </p>
      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
        <span className="flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
              clipRule="evenodd"
            />
          </svg>
          ~{path.estimatedHours} hours
        </span>
        <span className="flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M10 1a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 1ZM5.05 3.05a.75.75 0 0 1 1.06 0l1.062 1.06A.75.75 0 1 1 6.11 5.173L5.05 4.11a.75.75 0 0 1 0-1.06ZM14.95 3.05a.75.75 0 0 1 0 1.06l-1.06 1.062a.75.75 0 0 1-1.062-1.061l1.061-1.06a.75.75 0 0 1 1.06 0ZM3 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 3 8ZM14 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 14 8Z" />
            <path
              fillRule="evenodd"
              d="M10 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
              clipRule="evenodd"
            />
          </svg>
          {path.steps.length} steps
        </span>
      </div>
      <ProgressBar
        completed={completedCount}
        total={path.steps.length}
        difficulty={path.difficulty}
      />
    </button>
  );
}

export default function LearningPaths() {
  const interviewPatterns = (patternsIndexData as PatternIndexData).patterns as PatternData[];
  const [expandedPathId, setExpandedPathId] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, number[]>>(() => {
    const initial: Record<string, number[]> = {};
    for (const path of learningPaths) {
      initial[path.id] = loadProgress(path.id);
    }
    return initial;
  });

  const handleToggleExpand = useCallback((pathId: string) => {
    setExpandedPathId((prev) => (prev === pathId ? null : pathId));
  }, []);

  const handleToggleStep = useCallback((pathId: string, stepIndex: number) => {
    setProgressMap((prev) => {
      const current = prev[pathId] ?? [];
      let updated: number[];
      if (current.includes(stepIndex)) {
        updated = current.filter((i) => i !== stepIndex);
      } else {
        updated = [...current, stepIndex];
      }
      saveProgress(pathId, updated);
      return { ...prev, [pathId]: updated };
    });
  }, []);

  const expandedPath = useMemo(
    () => learningPaths.find((p) => p.id === expandedPathId) ?? null,
    [expandedPathId]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Learning Paths</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Structured paths to guide your algorithm learning journey. Pick a path, follow the steps
          in order, and track your progress as you go.
        </p>
      </div>

      <section className="mb-12">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Interview Patterns</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Learn by pattern: pick a pattern, complete its algorithms, and track your progress.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {interviewPatterns.map((pattern) => (
            <PatternCard key={pattern.slug} pattern={pattern} />
          ))}
        </div>
      </section>

      <div className="mb-8 border-t border-gray-200 dark:border-gray-800" />

      <div className="mb-5">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Guided Paths</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Structured sequences for interview prep, university coursework, and competitive programming.
        </p>
      </div>

      {/* Path Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
        {learningPaths.map((path) => (
          <PathCard
            key={path.id}
            path={path}
            completedCount={(progressMap[path.id] ?? []).length}
            isExpanded={expandedPathId === path.id}
            onToggleExpand={() => handleToggleExpand(path.id)}
          />
        ))}
      </div>

      {/* Expanded Path Detail */}
      {expandedPath && (
        <div className="mt-8">
          <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {expandedPath.title}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {expandedPath.description}
              </p>
            </div>
            <button
              onClick={() => setExpandedPathId(null)}
              className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
              Close
            </button>
          </div>

          <div className="mb-6">
            <ProgressBar
              completed={(progressMap[expandedPath.id] ?? []).length}
              total={expandedPath.steps.length}
              difficulty={expandedPath.difficulty}
            />
          </div>

          {/* Timeline Steps */}
          <div className="max-w-2xl mx-auto">
            {expandedPath.steps.map((step, index) => (
              <StepItem
                key={`${expandedPath.id}-${index}`}
                step={step}
                index={index}
                isCompleted={(progressMap[expandedPath.id] ?? []).includes(index)}
                onToggle={(stepIndex) => handleToggleStep(expandedPath.id, stepIndex)}
              />
            ))}
            {/* Final node */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    (progressMap[expandedPath.id] ?? []).length === expandedPath.steps.length
                      ? 'border-green-500 bg-green-500 text-white dark:border-green-400 dark:bg-green-400 dark:text-gray-900'
                      : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-4 h-4 ${
                      (progressMap[expandedPath.id] ?? []).length === expandedPath.steps.length
                        ? 'text-white dark:text-gray-900'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <p
                className={`text-sm font-semibold ${
                  (progressMap[expandedPath.id] ?? []).length === expandedPath.steps.length
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {(progressMap[expandedPath.id] ?? []).length === expandedPath.steps.length
                  ? 'Path completed!'
                  : 'Complete all steps to finish this path'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
