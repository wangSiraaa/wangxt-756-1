import { useScheduleStore } from '@/store/useScheduleStore';
import { X, Clock, Tag, UserCircle } from 'lucide-react';
import { PERIOD_LABELS, ROLE_LABELS } from '@/types';

export default function MemberDetailPanel() {
  const selectedId = useScheduleStore((s) => s.selectedMemberId);
  const close = useScheduleStore((s) => s.closeMemberDetail);
  const members = useScheduleStore((s) => s.members);
  const shifts = useScheduleStore((s) => s.shifts);
  const positions = useScheduleStore((s) => s.positions);
  const leaveRequests = useScheduleStore((s) => s.leaveRequests);

  if (!selectedId) return null;

  const member = members.find((m) => m.id === selectedId);
  if (!member) return null;

  const memberShifts = shifts.filter((s) => s.memberIds.includes(selectedId));
  const memberLeaves = leaveRequests.filter((l) => l.memberId === selectedId);

  return (
    <div className="fixed inset-0 z-40 flex justify-end" onClick={close}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-96 max-w-full bg-slate-800 border-l border-slate-700 h-full overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">成员详情</h2>
            <button
              onClick={close}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col items-center mb-6">
            <span className="text-5xl mb-3">{member.avatar}</span>
            <h3 className="text-xl font-bold text-white">{member.name}</h3>
            <span className="mt-1 px-2.5 py-0.5 rounded-full text-xs bg-slate-700 text-slate-300">
              {ROLE_LABELS[member.role]}
            </span>
            <span
              className={`mt-2 px-2.5 py-0.5 rounded-full text-xs ${
                member.status === 'active'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {member.status === 'active' ? '在岗' : '请假中'}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-1.5">
                <Tag className="w-4 h-4" /> 技能标签
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md text-xs bg-amber-400/10 text-amber-300 border border-amber-400/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> 近期排班
              </h4>
              <div className="space-y-1.5">
                {memberShifts.length === 0 ? (
                  <p className="text-sm text-slate-500">暂无排班记录</p>
                ) : (
                  memberShifts.map((shift) => {
                    const pos = positions.find((p) => p.id === shift.positionId);
                    return (
                      <div
                        key={shift.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/30 text-sm"
                      >
                        <span className="text-slate-300">{shift.date}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-amber-300">{PERIOD_LABELS[shift.period]}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-200">{pos?.name || '未知'}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-1.5">
                <UserCircle className="w-4 h-4" /> 请假记录
              </h4>
              <div className="space-y-1.5">
                {memberLeaves.length === 0 ? (
                  <p className="text-sm text-slate-500">暂无请假记录</p>
                ) : (
                  memberLeaves.map((leave) => (
                    <div
                      key={leave.id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-700/30 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300">{leave.date}</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-200">{leave.reason}</span>
                      </div>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] ${
                          leave.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : leave.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {leave.status === 'approved' ? '已批' : leave.status === 'pending' ? '待批' : '已驳'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
