import React from 'react';
import { useScheduleStore } from '@/store/useScheduleStore';
import type { Period } from '@/types';
import { PERIOD_LABELS } from '@/types';
import { X, UserPlus, AlertTriangle } from 'lucide-react';

export default function ShiftEditModal() {
  const editState = useScheduleStore((s) => s.showShiftEdit);
  const close = useScheduleStore((s) => s.closeShiftEdit);
  const shifts = useScheduleStore((s) => s.shifts);
  const members = useScheduleStore((s) => s.members);
  const positions = useScheduleStore((s) => s.positions);
  const leaveRequests = useScheduleStore((s) => s.leaveRequests);
  const assignMemberToShift = useScheduleStore((s) => s.assignMemberToShift);
  const removeMemberFromShift = useScheduleStore((s) => s.removeMemberFromShift);
  const openMemberDetail = useScheduleStore((s) => s.openMemberDetail);
  const conflicts = useScheduleStore((s) => s.conflicts);

  const [feedback, setFeedback] = React.useState<string | null>(null);

  if (!editState) return null;

  const { positionId, date, period } = editState;
  const position = positions.find((p) => p.id === positionId);
  const shift = shifts.find(
    (s) => s.positionId === positionId && s.date === date && s.period === period
  );

  const approvedLeaves = leaveRequests.filter(
    (l) => l.status === 'approved' && l.date === date && (l.period === 'all_day' || l.period === period)
  );
  const leaveMemberIds = approvedLeaves.map((l) => l.memberId);

  const assignedMembers = shift
    ? shift.memberIds.map((mid) => members.find((m) => m.id === mid)).filter(Boolean)
    : [];

  const availableMembers = members.filter(
    (m) => m.role !== 'manager' && !leaveMemberIds.includes(m.id) && (!shift || !shift.memberIds.includes(m.id))
  );

  const leaveMembers = shift
    ? shift.memberIds
        .map((mid) => members.find((m) => m.id === mid))
        .filter((m): m is NonNullable<typeof m> => !!m && leaveMemberIds.includes(m.id))
    : [];

  const handleAssign = (memberId: string) => {
    if (!shift) return;

    const member = members.find((m) => m.id === memberId);
    const isLeaveMember = leaveMemberIds.includes(memberId);

    if (isLeaveMember) {
      setFeedback(`⚠️ ${member?.name || '该成员'}当前已请假，强行排班会产生冲突！`);
      return;
    }

    assignMemberToShift(shift.id, memberId);
    setFeedback(null);

    const updatedShift = { ...shift, memberIds: [...shift.memberIds, memberId] };
    const position2 = positions.find((p) => p.id === positionId);
    if (position2?.isCritical) {
      const activeCount = updatedShift.memberIds.filter((mid) => !leaveMemberIds.includes(mid)).length;
      if (activeCount < 2) {
        setFeedback(`⚠️ 关键岗位「${position2.name}」当前仅 ${activeCount} 人值班，需要至少 2 人覆盖！`);
      }
    }
  };

  const handleRemove = (memberId: string) => {
    if (!shift) return;
    removeMemberFromShift(shift.id, memberId);
  };

  const shiftConflicts = shift
    ? conflicts.filter((c) => c.shiftId === shift.id)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={close}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-md bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">编辑班次</h2>
          <button onClick={close} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 px-3 py-2 rounded-lg bg-slate-700/50 text-sm text-slate-300">
          <span className="text-amber-400">{position?.name}</span>
          <span className="mx-2 text-slate-600">|</span>
          <span>{date}</span>
          <span className="mx-2 text-slate-600">|</span>
          <span>{PERIOD_LABELS[period as Period]}</span>
        </div>

        {shiftConflicts.length > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
            {shiftConflicts.map((c, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-rose-300">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{c.message}</span>
              </div>
            ))}
          </div>
        )}

        {feedback && (
          <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm text-amber-300">
            {feedback}
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-sm font-medium text-slate-400 mb-2">当前值班人员</h3>
          {assignedMembers.length === 0 && leaveMembers.length === 0 ? (
            <p className="text-sm text-slate-500">暂无人员</p>
          ) : (
            <div className="space-y-1.5">
              {assignedMembers.map((member) => {
                if (!member) return null;
                const isOnLeave = leaveMemberIds.includes(member.id);
                return (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                      isOnLeave ? 'bg-rose-500/10 border border-rose-500/30' : 'bg-slate-700/30'
                    }`}
                  >
                    <button
                      onClick={() => openMemberDetail(member.id)}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span>{member.avatar}</span>
                      <span className={isOnLeave ? 'text-rose-300 line-through' : 'text-slate-200'}>
                        {member.name}
                      </span>
                      {isOnLeave && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                          请假中
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => handleRemove(member.id)}
                      className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      移除
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-400 mb-2">添加人员</h3>
          {availableMembers.length === 0 ? (
            <p className="text-sm text-slate-500">无可用人员</p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {availableMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleAssign(member.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/30 text-sm text-slate-200 hover:bg-amber-400/10 hover:text-amber-300 transition-colors"
                >
                  <span>{member.avatar}</span>
                  <span>{member.name}</span>
                  <span className="ml-auto">
                    <UserPlus className="w-4 h-4 text-slate-500" />
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {position?.isCritical && (
          <div className="mt-4 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300/80">
            此岗位为关键岗位，每个时段至少需要 2 人值班
          </div>
        )}
      </div>
    </div>
  );
}
