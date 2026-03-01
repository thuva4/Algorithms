import { useState, useEffect, useRef, useCallback } from 'react';

interface ScenarioPreset {
  id: string;
  label: string;
  description: string;
}

interface StepControllerProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  showSpeedControl: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStepBackward: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onSeek: (step: number) => void;
  onSpeedChange: (speed: number) => void;
  onCustomData: (data: number[]) => void;
  onRandomize: () => void;
  maxSpeed: number;
  randomizeLabel: string;
  showCustomDataControls: boolean;
  scenarioPresets: ScenarioPreset[];
  selectedScenarioId: string | null;
  onApplyScenario?: (scenarioId: string) => void;
}

export default function StepController({
  currentStep,
  totalSteps,
  isPlaying,
  showSpeedControl,
  speed,
  onPlay,
  onPause,
  onStepBackward,
  onStepForward,
  onReset,
  onSeek,
  onSpeedChange,
  onCustomData,
  onRandomize,
  maxSpeed,
  randomizeLabel,
  showCustomDataControls,
  scenarioPresets,
  selectedScenarioId,
  onApplyScenario,
}: StepControllerProps) {
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showCustomInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCustomInput]);

  const handleCustomSubmit = useCallback(() => {
    const numbers = customInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .map(Number)
      .filter((n) => !isNaN(n) && n > 0 && n <= 100);

    if (numbers.length >= 2) {
      onCustomData(numbers);
      setShowCustomInput(false);
      setCustomInput('');
    }
  }, [customInput, onCustomData]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleCustomSubmit();
      } else if (e.key === 'Escape') {
        setShowCustomInput(false);
      }
    },
    [handleCustomSubmit]
  );

  return (
    <div className="space-y-3">
      {/* Main controls row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Play/Pause */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={currentStep >= totalSteps && !isPlaying}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white transition-colors"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Zm10.5 0a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Step Back */}
        <button
          onClick={onStepBackward}
          disabled={currentStep <= 1}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40 text-gray-700 dark:text-gray-200 transition-colors"
          title="Step Back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M4.5 5.25A.75.75 0 0 1 5.25 6v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Z" />
            <path fillRule="evenodd" d="M19.5 5.653c0-1.427-1.529-2.33-2.779-1.643l-11.54 6.347c-1.295.712-1.295 2.573 0 3.286l11.54 6.347c1.25.687 2.779-.217 2.779-1.643V5.653Z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Step Forward */}
        <button
          onClick={onStepForward}
          disabled={currentStep >= totalSteps}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-40 text-gray-700 dark:text-gray-200 transition-colors"
          title="Step Forward"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
            <path d="M19.5 5.25a.75.75 0 0 1 .75.75v12a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 .75-.75Z" />
          </svg>
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
          title="Reset"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903H14.25a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 .75-.75v-6a.75.75 0 0 0-1.5 0v3.068l-1.658-1.658A9 9 0 0 0 3.366 9.576a.75.75 0 1 0 1.39.483Zm14.49 3.882a7.5 7.5 0 0 1-12.548 3.364l-1.903-1.903H9.75a.75.75 0 0 0 0-1.5h-6a.75.75 0 0 0-.75.75v6a.75.75 0 0 0 1.5 0v-3.068l1.658 1.658A9 9 0 0 0 20.634 14.424a.75.75 0 1 0-1.39-.483Z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1" />

        {showSpeedControl && (
          <>
            {/* Speed control */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                Speed
              </label>
              <input
                type="range"
                min="0.25"
                max={maxSpeed}
                step="0.25"
                value={Math.min(speed, maxSpeed)}
                onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                className="w-20 sm:w-24 accent-blue-600"
              />
              <span className="text-xs font-mono text-gray-600 dark:text-gray-300 w-10 text-right">
                {Math.min(speed, maxSpeed)}x
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-1 hidden sm:block" />
          </>
        )}

        {/* Step counter */}
        <span className="text-sm font-mono text-gray-500 dark:text-gray-400 whitespace-nowrap">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Timeline scrubber */}
      <div className="rounded-xl border border-gray-200 bg-gray-50/80 px-3 py-3 dark:border-gray-700 dark:bg-gray-800/40">
        <div className="flex items-center justify-between gap-3 text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          <span>Timeline</span>
          <span>{totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0}% complete</span>
        </div>
        <input
          type="range"
          min="1"
          max={Math.max(1, totalSteps)}
          step="1"
          value={Math.max(1, currentStep)}
          onChange={(e) => onSeek(Number(e.target.value))}
          disabled={totalSteps <= 1}
          className="mt-3 w-full accent-cyan-600 disabled:opacity-50"
          aria-label="Jump to a specific step"
        />
      </div>

      {scenarioPresets.length > 0 && onApplyScenario && (
        <div className="flex flex-col gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
            Real-World Scenarios
          </div>
          <div className="flex flex-wrap gap-2">
            {scenarioPresets.map((scenario) => {
              const isSelected = scenario.id === selectedScenarioId;

              return (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => onApplyScenario(scenario.id)}
                  title={scenario.description}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-400 dark:bg-cyan-950/40 dark:text-cyan-200'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-cyan-300 hover:text-cyan-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-cyan-600 dark:hover:text-cyan-200'
                  }`}
                >
                  {scenario.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Data controls row */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onRandomize}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H4.28a.75.75 0 0 0-.75.75v3.955a.75.75 0 0 0 1.5 0v-2.134l.228.228a7 7 0 0 0 11.711-3.138.75.75 0 0 0-1.458-.356Zm-2.624-5.848a7 7 0 0 0-11.711 3.138.75.75 0 0 0 1.458.356A5.5 5.5 0 0 1 11.89 6.11l.311.31H9.767a.75.75 0 0 0 0 1.5h3.955a.75.75 0 0 0 .75-.75V3.214a.75.75 0 0 0-1.5 0v2.134l-.228-.228Z" clipRule="evenodd" />
          </svg>
          {randomizeLabel}
        </button>

        {showCustomDataControls && (
          <>
            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M2.695 14.763l-1.262 3.154a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.885L17.5 5.5a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z" />
              </svg>
              Custom Input
            </button>

            {showCustomInput && (
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. 5, 3, 8, 1, 2"
                  className="px-2 py-1.5 text-xs rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 w-40 sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleCustomSubmit}
                  className="px-2 py-1.5 text-xs font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  Apply
                </button>
              </div>
            )}
          </>
        )}
        {!showCustomDataControls && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Regenerate the sample to explore a different run.
          </span>
        )}
      </div>
    </div>
  );
}
