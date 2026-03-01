import { useState, useCallback, useMemo, useEffect } from 'react';
import { createHighlighter } from 'shiki';
import { getVisibleImplementations } from '../../utils/implementationFiles';

interface ImplementationFile {
  filename: string;
  content: string;
}

interface ImplementationEntry {
  display: string;
  files: ImplementationFile[];
}

interface CodeViewerProps {
  implementations: Record<string, ImplementationEntry>;
}

const SHIKI_THEME = 'github-dark-default';

const LANGUAGE_MAP: Record<string, string> = {
  c: 'c',
  cpp: 'cpp',
  'c++': 'cpp',
  java: 'java',
  javascript: 'javascript',
  js: 'javascript',
  typescript: 'typescript',
  ts: 'typescript',
  python: 'python',
  py: 'python',
  go: 'go',
  rust: 'rust',
  csharp: 'csharp',
  'c#': 'csharp',
  kotlin: 'kotlin',
  swift: 'swift',
  php: 'php',
  ruby: 'ruby',
  scala: 'scala',
  sql: 'sql',
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  md: 'markdown',
  markdown: 'markdown',
};

const EXTENSION_MAP: Record<string, string> = {
  c: 'c',
  cc: 'cpp',
  cpp: 'cpp',
  h: 'c',
  hpp: 'cpp',
  java: 'java',
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  py: 'python',
  go: 'go',
  rs: 'rust',
  cs: 'csharp',
  kt: 'kotlin',
  swift: 'swift',
  php: 'php',
  rb: 'ruby',
  scala: 'scala',
  sql: 'sql',
  sh: 'bash',
  bash: 'bash',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  md: 'markdown',
};

let highlighterPromise: Promise<Awaited<ReturnType<typeof createHighlighter>>> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [SHIKI_THEME],
      langs: [
        'c',
        'cpp',
        'java',
        'javascript',
        'typescript',
        'python',
        'go',
        'rust',
        'csharp',
        'kotlin',
        'swift',
        'php',
        'ruby',
        'scala',
        'sql',
        'bash',
        'json',
        'yaml',
        'markdown',
        'text',
      ],
    });
  }
  return highlighterPromise;
}

function resolveLanguage(activeLang: string, filename?: string): string {
  const normalizedLang = activeLang.toLowerCase().trim();
  const mappedFromLang = LANGUAGE_MAP[normalizedLang];
  if (mappedFromLang) return mappedFromLang;

  if (filename) {
    const extension = filename.split('.').pop()?.toLowerCase() ?? '';
    const mappedFromExtension = EXTENSION_MAP[extension];
    if (mappedFromExtension) return mappedFromExtension;
  }

  return 'text';
}

export default function CodeViewer({ implementations }: CodeViewerProps) {
  const visibleImplementations = useMemo(() => getVisibleImplementations(implementations), [implementations]);
  const languages = Object.keys(visibleImplementations);
  const [activeLang, setActiveLang] = useState(languages[0] || '');
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [highlightResult, setHighlightResult] = useState<{ key: string; html: string }>({
    key: '',
    html: '',
  });

  const currentImpl = visibleImplementations[activeLang];
  const currentFile = currentImpl?.files[activeFileIndex];
  const currentKey = useMemo(
    () => (currentFile ? `${activeLang}:${activeFileIndex}:${currentFile.filename}` : ''),
    [activeLang, activeFileIndex, currentFile]
  );
  const detectedLanguage = useMemo(
    () => resolveLanguage(activeLang, currentFile?.filename),
    [activeLang, currentFile?.filename]
  );
  const highlightedHtml = highlightResult.key === currentKey ? highlightResult.html : '';

  useEffect(() => {
    if (!languages.includes(activeLang)) {
      setActiveLang(languages[0] || '');
      setActiveFileIndex(0);
    }
  }, [activeLang, languages]);

  useEffect(() => {
    if (currentImpl && activeFileIndex >= currentImpl.files.length) {
      setActiveFileIndex(0);
    }
  }, [activeFileIndex, currentImpl]);

  useEffect(() => {
    let cancelled = false;
    const highlightKey = currentKey;

    async function highlight() {
      if (!currentFile) {
        return;
      }

      try {
        const highlighter = await getHighlighter();
        const html = highlighter.codeToHtml(currentFile.content, {
          lang: detectedLanguage,
          theme: SHIKI_THEME,
        });
        if (!cancelled) {
          setHighlightResult({ key: highlightKey, html });
        }
      } catch {
        // Keep plain-text fallback on highlight failure.
      }
    }

    void highlight();

    return () => {
      cancelled = true;
    };
  }, [currentFile, currentKey, detectedLanguage]);

  const handleCopy = useCallback(async () => {
    if (!currentFile) return;
    try {
      await navigator.clipboard.writeText(currentFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = currentFile.content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [currentFile]);

  const handleLangChange = useCallback((lang: string) => {
    setActiveLang(lang);
    setActiveFileIndex(0);
  }, []);

  if (languages.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-gray-500 dark:text-gray-400 text-sm">
        No implementations available.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="border-b border-slate-200 bg-slate-50/80 p-2 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="flex flex-wrap items-center gap-1.5">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLangChange(lang)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeLang === lang
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {visibleImplementations[lang].display}
            </button>
          ))}
        </div>
      </div>

      {currentImpl && currentImpl.files.length > 1 && (
        <div className="border-b border-slate-200 bg-slate-50/60 px-2 py-1.5 dark:border-slate-700 dark:bg-slate-800/40">
          <div className="flex gap-1 overflow-x-auto">
            {currentImpl.files.map((file, idx) => (
              <button
                key={file.filename}
                onClick={() => setActiveFileIndex(idx)}
                className={`rounded-md px-2.5 py-1.5 text-[11px] font-mono transition-colors ${
                  activeFileIndex === idx
                    ? 'bg-slate-900 text-slate-100 dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {file.filename}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-b border-slate-200 bg-slate-50/70 px-4 py-2 dark:border-slate-700 dark:bg-slate-800/40">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {currentFile?.filename ?? 'source'}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Copy to clipboard"
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-emerald-500">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.12A1.5 1.5 0 0 1 17 6.622V12.5a1.5 1.5 0 0 1-1.5 1.5h-1v-3.379a3 3 0 0 0-.879-2.121L10.5 5.379A3 3 0 0 0 8.379 4.5H7v-1Z" />
                  <path d="M4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L9.44 6.439A1.5 1.5 0 0 0 8.378 6H4.5Z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-h-[680px] overflow-y-auto overflow-x-hidden bg-[#0b1220] text-slate-100">
        {highlightedHtml ? (
          <div
            className="[&_pre]:!m-0 [&_pre]:!rounded-none [&_pre]:!bg-[#0b1220] [&_pre]:!p-0 [&_pre]:!text-[13px] [&_pre]:!leading-[1.45] [&_pre]:!overflow-visible [&_pre]:!whitespace-normal [&_code]:!block [&_code]:!font-mono [&_code]:!whitespace-normal [&_.line]:!block [&_.line]:!px-4 [&_.line]:!leading-[1.45] [&_.line]:!whitespace-pre-wrap [&_.line]:!break-words [&_.line]:![overflow-wrap:anywhere]"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <pre className="min-w-full px-4 py-3 text-[13px] leading-6 text-slate-200">
            <code className="block whitespace-pre-wrap break-words [overflow-wrap:anywhere] font-mono">
              {currentFile?.content ?? ''}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
}
