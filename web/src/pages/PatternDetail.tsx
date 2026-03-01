import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import AlgorithmProgressTracker from '../components/AlgorithmProgressTracker'
import patternsIndexData from '../data/patterns-index.json'
import { useProgress } from '../hooks/useProgress'
import type { PatternAlgorithmReference, PatternData, PatternIndexData } from '../types/patterns'

const difficultyOrder: Record<string, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
}

const difficultyBadgeClass: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  intermediate: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
  advanced: 'bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200',
}

const sectionAccentClass: Record<string, string> = {
  beginner: 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/20',
  intermediate: 'border-amber-200 bg-amber-50/60 dark:border-amber-800 dark:bg-amber-950/20',
  advanced: 'border-rose-200 bg-rose-50/60 dark:border-rose-800 dark:bg-rose-950/20',
}

function byPracticeOrder(a: PatternAlgorithmReference, b: PatternAlgorithmReference): number {
  const orderA = a.practiceOrder ?? Number.MAX_SAFE_INTEGER
  const orderB = b.practiceOrder ?? Number.MAX_SAFE_INTEGER
  if (orderA !== orderB) {
    return orderA - orderB
  }

  const difficultyA = difficultyOrder[a.patternDifficulty] ?? 99
  const difficultyB = difficultyOrder[b.patternDifficulty] ?? 99
  if (difficultyA !== difficultyB) {
    return difficultyA - difficultyB
  }

  return a.name.localeCompare(b.name)
}

const patterns = (patternsIndexData as PatternIndexData).patterns

export default function PatternDetail() {
  const { slug } = useParams()
  const { getPatternProgress } = useProgress()

  const pattern = useMemo<PatternData | null>(
    () => patterns.find((entry) => entry.slug === slug) ?? null,
    [slug]
  )

  const groupedAlgorithms = useMemo(() => {
    const buckets: Record<'beginner' | 'intermediate' | 'advanced', PatternAlgorithmReference[]> = {
      beginner: [],
      intermediate: [],
      advanced: [],
    }

    if (!pattern) {
      return buckets
    }

    for (const algorithm of pattern.algorithms) {
      if (algorithm.patternDifficulty in buckets) {
        buckets[algorithm.patternDifficulty].push(algorithm)
      }
    }

    buckets.beginner.sort(byPracticeOrder)
    buckets.intermediate.sort(byPracticeOrder)
    buckets.advanced.sort(byPracticeOrder)

    return buckets
  }, [pattern])

  const relatedPatterns = useMemo(
    () =>
      pattern ? patterns.filter((entry) => pattern.relatedPatterns.includes(entry.slug)) : [],
    [pattern]
  )

  if (!pattern) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Pattern not found</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          The requested interview pattern does not exist.
        </p>
        <Link
          to="/learn"
          className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Back to Learning Paths
        </Link>
      </div>
    )
  }

  const progress = getPatternProgress(pattern.slug, pattern.algorithmCount)

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -left-24 h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl dark:bg-cyan-800/20" />
        <div className="absolute top-44 -right-24 h-80 w-80 rounded-full bg-amber-200/50 blur-3xl dark:bg-amber-800/20" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/learn"
          className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white/90 px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-blue-500 hover:text-blue-700 dark:border-gray-600 dark:bg-gray-900/90 dark:text-gray-300 dark:hover:border-blue-400 dark:hover:text-blue-300"
        >
          <span aria-hidden>←</span>
          Back to Learning Paths
        </Link>

        <header className="mt-5 rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-cyan-50 to-amber-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">
                Pattern Playbook
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 [font-family:'Fraunces',Georgia,serif] sm:text-5xl">
                {pattern.name}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                {pattern.category} pattern • Typical time {pattern.timeComplexity} • Typical space{' '}
                {pattern.spaceComplexity}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                difficultyBadgeClass[pattern.difficulty] ?? difficultyBadgeClass.beginner
              }`}
            >
              {pattern.difficulty}
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/80 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/80">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Algorithms</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {pattern.algorithmCount}
              </p>
            </div>
            <div className="rounded-2xl border border-white/80 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/80">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Est. time</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {pattern.estimatedTime}
              </p>
            </div>
            <div className="rounded-2xl border border-white/80 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-900/80">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Progress</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {progress.pct}%
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
              <span>
                {progress.completed} / {progress.total} algorithms completed
              </span>
              <span>{progress.pct}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all"
                style={{ width: `${progress.pct}%` }}
              />
            </div>
          </div>
        </header>

        {pattern.keywords.length > 0 && (
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Keywords</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {pattern.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-300"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-cyan-200 bg-cyan-50/70 p-5 shadow-sm dark:border-cyan-900 dark:bg-cyan-950/20">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Recognition Tips
            </h2>
            <ul className="mt-3 space-y-2 text-[0.95rem] leading-6 text-slate-700 dark:text-slate-300">
              {pattern.recognitionTips.map((tip) => (
                <li key={tip} className="rounded-xl bg-white/80 px-3.5 py-2.5 dark:bg-slate-900/70">
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm dark:border-amber-900 dark:bg-amber-950/20">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Common Variations
            </h2>
            <ul className="mt-3 space-y-2 text-[0.95rem] leading-6 text-slate-700 dark:text-slate-300">
              {pattern.commonVariations.map((variation) => (
                <li key={variation} className="rounded-xl bg-white/80 px-3.5 py-2.5 dark:bg-slate-900/70">
                  {variation}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-gray-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm dark:border-gray-800 dark:from-slate-900 dark:to-slate-900 sm:p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 [font-family:'Fraunces',Georgia,serif]">
            Pattern Guide
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Focus on recognizing this pattern quickly, then practice implementation under time constraints.
          </p>
          <div
            className="mt-6 max-w-none text-[1.02rem] text-slate-700 dark:text-slate-200 [&_h1]:mb-5 [&_h1]:text-4xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-slate-900 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-slate-900 [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900 [&_p]:my-4 [&_p]:leading-8 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_li]:leading-7 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:border [&_pre]:border-slate-200 [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-6 [&_pre]:text-slate-100 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.92em] [&_code]:text-slate-800 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-slate-100 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-cyan-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_strong]:font-semibold [&_strong]:text-slate-900 [&_a]:font-medium [&_a]:text-blue-700 [&_a]:underline-offset-2 hover:[&_a]:underline [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-sm [&_td]:border [&_td]:border-slate-300 [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm dark:[&_h1]:text-slate-100 dark:[&_h2]:text-slate-100 dark:[&_h3]:text-slate-100 dark:[&_code]:bg-slate-800 dark:[&_code]:text-slate-100 dark:[&_strong]:text-slate-100 dark:[&_a]:text-blue-300 dark:[&_th]:border-slate-700 dark:[&_th]:bg-slate-800 dark:[&_th]:text-slate-100 dark:[&_td]:border-slate-700"
            dangerouslySetInnerHTML={{ __html: pattern.content }}
          />
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 [font-family:'Fraunces',Georgia,serif]">
            Practice Algorithms
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Complete algorithms in sequence to strengthen pattern recognition and implementation speed.
          </p>

          {(['beginner', 'intermediate', 'advanced'] as const).map((level) =>
            groupedAlgorithms[level].length > 0 ? (
              <div
                key={level}
                className={`mt-6 rounded-2xl border p-4 sm:p-5 ${sectionAccentClass[level] ?? sectionAccentClass.beginner}`}
              >
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-700 dark:text-slate-200">
                  {level}
                </h3>
                <div className="mt-3 space-y-3">
                  {groupedAlgorithms[level].map((algorithm) => (
                    <div
                      key={`${pattern.slug}-${algorithm.slug}`}
                      className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-slate-900"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            {algorithm.practiceOrder && (
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                Step {algorithm.practiceOrder}
                              </span>
                            )}
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium capitalize text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                              {algorithm.category}
                            </span>
                          </div>
                          <Link
                            to={`/algorithm/${algorithm.category}/${algorithm.slug}`}
                            className="text-base font-semibold text-gray-900 hover:text-blue-700 dark:text-gray-100 dark:hover:text-blue-300"
                          >
                            {algorithm.name}
                          </Link>
                          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                            Time {algorithm.complexity?.time ?? 'N/A'} • Space{' '}
                            {algorithm.complexity?.space ?? 'N/A'}
                          </p>
                        </div>
                        <AlgorithmProgressTracker patternSlug={pattern.slug} algorithmSlug={algorithm.slug} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </section>

        {relatedPatterns.length > 0 && (
          <section className="mt-10 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 [font-family:'Fraunces',Georgia,serif]">
              Related Patterns
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {relatedPatterns.map((relatedPattern) => (
                <Link
                  key={relatedPattern.slug}
                  to={`/patterns/${relatedPattern.slug}`}
                  className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-blue-500 hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-300"
                >
                  {relatedPattern.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
