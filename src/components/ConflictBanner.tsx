import { useScheduleStore } from '@/store/useScheduleStore';
import { AlertTriangle } from 'lucide-react';

export default function ConflictBanner() {
  const conflicts = useScheduleStore((s) => s.conflicts);
  const openConflictPanel = useScheduleStore((s) => s.openConflictPanel);
  const currentUser = useScheduleStore((s) => s.currentUser);

  if (conflicts.length === 0) return null;
  if (currentUser?.role === 'member') return null;

  return (
    <button
      onClick={openConflictPanel}
      className="w-full px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-center gap-2 text-sm text-amber-300 hover:bg-amber-500/15 transition-colors"
    >
      <AlertTriangle className="w-4 h-4" />
      <span>发现 {conflicts.length} 项排班冲突，点击查看详情</span>
    </button>
  );
}
