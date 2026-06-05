import React from 'react';
import { useScheduleStore } from '@/store/useScheduleStore';
import { PERIOD_LABELS, WEEKDAYS, ROLE_LABELS } from '@/types';
import type { Period } from '@/types';
import { UserPlus, AlertTriangle } from 'lucide-react';

const PERIODS: Period[] = ['morning', 'afternoon', 'night'];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const wd = WEEKDAYS[d.getDay() === 0 ? 6 : d.getDay() - 1];
  return `${month}/${day} ${wd}`;
}

function ShiftCell({
  positionId,
  date,
  period,
}: {
  positionId: string;
  date: string;
  period: Period;
}) {
  const shifts = useScheduleStore((s) => s.shifts);
  const members = useScheduleStore((s) => s.members);
  const positions = useScheduleStore((s) => s.positions);
  const leaveRequests = useScheduleStore((s) => s.leaveRequests);
  const currentUser = useScheduleStore((s) => s.currentUser);
  const conflicts = useScheduleStore((s) => s.conflicts);
  const openMemberDetail = useScheduleStore((s) => s.openMemberDetail);
  const openShiftEdit = useScheduleStore((s) => s.openShiftEdit);

  const shift = shifts.find(
    (s) => s.positionId === positionId && s.date === date && s.period === period
  );
  const position = positions.find((p) => p.id === positionId);
  const assignedMembers = shift
    ? shift.memberIds.map((mid) => members.find((m) => m.id === mid)).filter(Boolean)
    : [];

  const approvedLeaves = leaveRequests.filter(
    (l) =>
      l.status === 'approved' &&
      l.date === date &&
      (l.period === 'all_day' || l.period === period)
  );
  const leaveMemberIds = approvedLeaves.map((l) => l.memberId);

  const hasConflict = conflicts.some(
    (c) => c.shiftId === shift?.id && c.type === 'leave_overlap'
  );
  const hasDualCoverageIssue = conflicts.some(
    (c) => c.shiftId === shift?.id && c.type === 'dual_coverage'
  );

  const canEdit = currentUser?.role === 'leader';
  const isMemberView = currentUser?.role === 'member';
  const showOnlyOwn = isMemberView;

  const visibleMembers = showOnlyOwn
    ? assignedMembers.filter((m) => m?.id === currentUser?.memberId)
    : assignedMembers;

  const cellBorderClass = hasConflict
    ? 'border-rose-500/70 bg-rose-500/5'
    : hasDualCoverageIssue
    ? 'border-amber-500/70 bg-amber-500/5'
    : 'border-slate-700/50';

  return (
    <td
      className={`border ${cellBorderClass} p-1.5 min-w-[120px] h-16 align-top transition-colors relative group`}
    >
      {visibleMembers.length > 0 ? (
        <div className="space-y-1">
          {visibleMembers.map((member) => {
            if (!member) return null;
            const isOnLeave = leaveMemberIds.includes(member.id);
            return (
              <button
                key={member.id}
                onClick={() => openMemberDetail(member.id)}
                className={`flex items-center gap-1.5 w-full text-left rounded px-1.5 py-0.5 text-xs transition-colors ${
                  isOnLeave
                    ? 'bg-rose-500/20 text-rose-300 line-through'
                    : 'bg-slate-700/30 text-slate-200 hover:bg-slate-700/60'
                }`}
              >
                <span className="text-sm">{member.avatar}</span>
                <span className="truncate">{member.name}</span>
                {isOnLeave && <AlertTriangle className="w-3 h-3 shrink-0" />}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <span className="text-slate-600 text-xs">
            {showOnlyOwn ? '—' : '空'}
          </span>
        </div>
      )}
      {canEdit && (
        <button
          onClick={() => openShiftEdit(positionId, date, period)}
          className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded bg-amber-400/20 text-amber-300 hover:bg-amber-400/30"
          title="编辑班次"
        >
          <UserPlus className="w-3.5 h-3.5" />
        </button>
      )}
    </td>
  );
}

export default function ShiftGrid() {
  const positions = useScheduleStore((s) => s.positions);
  const weekDates = useScheduleStore((s) => s.weekDates);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-slate-900 border border-slate-700/50 px-3 py-2 text-left text-slate-400 text-xs font-medium min-w-[100px]">
              岗位 / 时段
            </th>
            {weekDates.map((date, di) => (
              <th
                key={date}
                className="border border-slate-700/50 px-2 py-2 text-center text-xs font-medium min-w-[360px]"
              >
                <div className="flex justify-center gap-2">
                  <span className="text-amber-400">{formatDate(date)}</span>
                </div>
                <div className="flex mt-1">
                  {PERIODS.map((p) => (
                    <span key={p} className="flex-1 text-slate-400 text-[10px]">
                      {PERIOD_LABELS[p]}
                    </span>
                  ))}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => (
            <tr key={position.id}>
              <td className="sticky left-0 z-10 bg-slate-900 border border-slate-700/50 px-3 py-2">
                <div className="flex items-center gap-2">
                  {position.isCritical && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title="关键岗位" />
                  )}
                  <span className="text-sm text-white font-medium">{position.name}</span>
                </div>
                {position.isCritical && (
                  <span className="text-[10px] text-amber-400/70 mt-0.5 block">需双人覆盖</span>
                )}
              </td>
              {weekDates.map((date) => (
                <td key={date} className="border border-slate-700/50 p-0">
                  <div className="grid grid-cols-3 divide-x divide-slate-700/30">
                    {PERIODS.map((period) => (
                      <ShiftCell
                        key={period}
                        positionId={position.id}
                        date={date}
                        period={period}
                      />
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
