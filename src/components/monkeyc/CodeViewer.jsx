import React, { useState } from 'react';
import { MONKEY_C_PROJECT } from './MonkeyCBundle';
import { FileCode, Copy, Check, Download, ExternalLink, Code2, Folder } from 'lucide-react';

export default function CodeViewer() {
  const [selectedFileIndex, setSelectedFileIndex] = useState(2); // BiometricSensorManager.mc by default
  const [copied, setCopied] = useState(false);

  const file = MONKEY_C_PROJECT[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.path.split('/').pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    // Downloads all files as combined text bundle
    const bundleText = MONKEY_C_PROJECT.map(f => `// ==========================================\n// FILE: ${f.path}\n// DESC: ${f.description}\n// ==========================================\n\n${f.content}\n\n`).join('\n');
    const blob = new Blob([bundleText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DAQQA_Garmin_ConnectIQ_SourceBundle.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm backdrop-blur-sm space-y-4 relative z-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
              <Code2 className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 font-mono">
              Garmin Connect IQ (Monkey C) Source Code Suite
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Production Monkey C architecture developed for Garmin tactix 7 / fenix 7 in microgravity
          </p>
        </div>

        <button
          onClick={handleDownloadAll}
          className="px-3.5 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 border border-sky-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Complete Bundle</span>
        </button>
      </div>

      {/* Main Grid: File Explorer + Code Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: File Tree */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-2 px-1 flex items-center gap-1">
              <Folder className="w-3.5 h-3.5 text-sky-700" />
              <span>Project Files (Connect IQ 7)</span>
            </div>

            <div className="space-y-1">
              {MONKEY_C_PROJECT.map((f, idx) => {
                const isSelected = selectedFileIndex === idx;
                return (
                  <button
                    key={f.path}
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-lg transition-all flex items-start gap-2 text-xs font-mono ${
                      isSelected
                        ? 'bg-sky-100/80 border border-sky-400 text-sky-900 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-transparent font-medium'
                    }`}
                  >
                    <FileCode className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-sky-700' : 'text-slate-400'}`} />
                    <div className="overflow-hidden">
                      <div className="truncate">{f.path}</div>
                      <div className="text-[10px] text-slate-500 font-normal line-clamp-1">{f.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-mono text-slate-500">
            <div>Target SDK: <span className="text-slate-800 font-bold">Connect IQ 4.2+</span></div>
            <div>Runtime: <span className="text-sky-700 font-bold">Monkey C V4 Engine</span></div>
          </div>
        </div>

        {/* Right Column: Code Editor View */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between shadow-sm">
          
          {/* Code Header Bar */}
          <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold">{file.path}</span>
              <span className="text-slate-400 text-[10px]">({file.language.toUpperCase()})</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition-colors"
                title="Copy code to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownloadSingle}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition-colors"
                title="Download this file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* Code Content */}
          <div className="p-4 overflow-x-auto max-h-[480px] overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed no-scrollbar select-text">
            <pre className="text-cyan-300/90">{file.content}</pre>
          </div>

          {/* Description footer */}
          <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>{file.description}</span>
            <span className="text-[10px] text-slate-500">Garmin Connect IQ Compliant</span>
          </div>

        </div>

      </div>

    </div>
  );
}
