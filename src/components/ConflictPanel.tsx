import React from 'react';
import { useScheduleStore } from '@/store/useScheduleStore';
import { X, AlertTriangle, ShieldAlert, UserX } from 'lucide-react';

export default function ConflictPanel() {
  const show = useScheduleStore((s) => s.showConflictPanel);
  const close = useScheduleStore((s) => s.closeConflictPanel);
  const conflicts = useScheduleStore((s) => s.conflicts);
  const [tab, setTab] = React.useState<'dual_coverage' | 'leave_overlap'>('dual_coverage');

  if (!show) return null;

  const dualConflicts = conflicts.filter((c) => c.type === 'dual_coverage');
  const leaveConflicts = conflicts.filter((c) => c.type === 'leave_overlap');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={close}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative w-full max-w-2xl max-h-[80vh] bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              冲突与覆盖报告
            </h2>
            <button onClick={close} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTab('dual_coverage')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === 'dual_coverage'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                  : 'bg-slate-700/30 text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-4 h-4 inline mr-1.5" />
              双人覆盖 ({dualConflicts.length})
            </button>
            <button
              onClick={() => setTab('leave_overlap')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === 'leave_overlap'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-slate-700/30 text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserX className="w-4 h-4 inline mr-1.5" />
              请假冲突 ({leaveConflicts.length})
            </button>
          </div>
        </div>

        <div className="px-6 pb-6 overflow-y-auto flex-1">
          {tab === 'dual_coverage' && (
            <div className="space-y-3">
              {dualConflicts.length === 0 ? (
                <div className="text-center py-8">
                  <ShieldAlert className="w-10 h-10 text-emerald-400/40 mx-auto mb-2" />
                  <p className="text-sm text-emerald-300">所有关键岗位双人覆盖达标</p>
                </div>
              ) : (
                dualConflicts.map((c, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 flex items-start gap-3"
                  >
                    <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-200">{c.message}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {c.date} · {c.period === 'morning' ? '早班' : c.period === 'afternoon' ? '午班' : '晚班'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'leave_overlap' && (
            <div className="space-y-3">
              {leaveConflicts.length === 0 ? (
                <div className="text-center py-8">
                  <UserX className="w-10 h-10 text-emerald-400/40 mx-auto mb-2" />
                  <p className="text-sm text-emerald-300">无请假冲突</p>
                </div>
              ) : (
                leaveConflicts.map((c, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 flex items-start gap-3"
                  >
                    <UserX className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-rose-200">{c.message}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {c.date} · {c.period === 'morning' ? '早班' : c.period === 'afternoon' ? '午班' : '晚班'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
