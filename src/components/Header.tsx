import { useScheduleStore } from '@/store/useScheduleStore';
import { ROLE_LABELS, PERIOD_LABELS } from '@/types';
import type { Period } from '@/types';
import { LogOut, AlertTriangle, FileDown, CalendarDays, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const user = useScheduleStore((s) => s.currentUser);
  const conflicts = useScheduleStore((s) => s.conflicts);
  const annotations = useScheduleStore((s) => s.annotations);
  const logout = useScheduleStore((s) => s.logout);
  const openConflictPanel = useScheduleStore((s) => s.openConflictPanel);
  const openAnnotationPanel = useScheduleStore((s) => s.openAnnotationPanel);
  const navigate = useNavigate();

  if (!user) return null;

  const canEdit = user.role === 'leader';
  const canLeave = user.role === 'member';
  const canExport = user.role === 'manager';
  const canSeeConflicts = user.role === 'leader' || user.role === 'manager';

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-700/50">
      <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-amber-400 tracking-wide">保障排班图</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
            {ROLE_LABELS[user.role]}
          </span>
          <span className="text-sm text-slate-400">{user.displayName}</span>
        </div>

        <div className="flex items-center gap-3">
          {canSeeConflicts && conflicts.length > 0 && (
            <button
              onClick={openConflictPanel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm hover:bg-rose-500/20 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{conflicts.length} 项冲突</span>
            </button>
          )}
          <button
            onClick={openAnnotationPanel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 text-sm hover:bg-slate-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>批注 ({annotations.length})</span>
          </button>
          {canLeave && (
            <button
              onClick={() => navigate('/leave')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 text-sm hover:bg-slate-700 transition-colors"
            >
              <CalendarDays className="w-4 h-4" />
              请假
            </button>
          )}
          {canEdit && (
            <button
              onClick={() => navigate('/leave')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-300 text-sm hover:bg-slate-700 transition-colors"
            >
              <CalendarDays className="w-4 h-4" />
              请假审批
            </button>
          )}
          {canExport && (
            <button
              onClick={() => {
                const data = JSON.stringify(useScheduleStore.getState().shifts, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'schedule.json';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm hover:bg-emerald-500/20 transition-colors"
            >
              <FileDown className="w-4 h-4" />
              导出
            </button>
          )}
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/50 text-slate-400 text-sm hover:text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            退出
          </button>
        </div>
      </div>
    </header>
  );
}
