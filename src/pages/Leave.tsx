import React from 'react';
import { useScheduleStore } from '@/store/useScheduleStore';
import { PERIOD_LABELS, ROLE_LABELS } from '@/types';
import type { LeavePeriod } from '@/types';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle, XCircle, Clock } from 'lucide-react';

const LEAVE_PERIOD_OPTIONS: { value: LeavePeriod; label: string }[] = [
  { value: 'morning', label: '早班' },
  { value: 'afternoon', label: '午班' },
  { value: 'night', label: '晚班' },
  { value: 'all_day', label: '全天' },
];

function LeaveForm() {
  const user = useScheduleStore((s) => s.currentUser);
  const weekDates = useScheduleStore((s) => s.weekDates);
  const submitLeaveRequest = useScheduleStore((s) => s.submitLeaveRequest);
  const [date, setDate] = React.useState(weekDates[0] || '');
  const [period, setPeriod] = React.useState<LeavePeriod>('all_day');
  const [reason, setReason] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !reason.trim()) return;
    submitLeaveRequest(user.memberId, date, period, reason.trim());
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReason('');
    }, 2000);
  };

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">提交请假申请</h2>
      {submitted && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-300 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> 请假申请已提交，等待审批
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">日期</label>
          <select
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white text-sm focus:border-amber-400 focus:outline-none"
          >
            {weekDates.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">时段</label>
          <div className="grid grid-cols-4 gap-2">
            {LEAVE_PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPeriod(opt.value)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  period === opt.value
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'bg-slate-700/50 text-slate-400 border border-slate-700 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">请假原因</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-white text-sm focus:border-amber-400 focus:outline-none resize-none h-20"
            placeholder="请输入请假原因"
          />
        </div>
        <button
          type="submit"
          disabled={!date || !reason.trim()}
          className="w-full rounded-lg bg-amber-400 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" /> 提交申请
        </button>
      </form>
    </div>
  );
}

function LeaveApprovalList() {
  const leaveRequests = useScheduleStore((s) => s.leaveRequests);
  const members = useScheduleStore((s) => s.members);
  const approveLeave = useScheduleStore((s) => s.approveLeave);
  const rejectLeave = useScheduleStore((s) => s.rejectLeave);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'pending');

  const handleApprove = (leaveId: string) => {
    approveLeave(leaveId);
    setFeedback('已批准请假，冲突校验已更新');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">请假审批</h2>
      {feedback && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-300">
          {feedback}
        </div>
      )}
      {pendingLeaves.length === 0 ? (
        <p className="text-sm text-slate-500">暂无待审批请假</p>
      ) : (
        <div className="space-y-3">
          {pendingLeaves.map((leave) => {
            const member = members.find((m) => m.id === leave.memberId);
            return (
              <div
                key={leave.id}
                className="p-4 rounded-lg bg-slate-700/30 border border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{member?.avatar}</span>
                    <span className="text-sm font-medium text-white">{member?.name}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    待审批
                  </span>
                </div>
                <div className="text-sm text-slate-400 space-y-1">
                  <p>日期：{leave.date}</p>
                  <p>时段：{leave.period === 'all_day' ? '全天' : leave.period === 'morning' ? '早班' : leave.period === 'afternoon' ? '午班' : '晚班'}</p>
                  <p>原因：{leave.reason}</p>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleApprove(leave.id)}
                    className="flex-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 py-2 text-sm text-emerald-300 hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" /> 批准
                  </button>
                  <button
                    onClick={() => rejectLeave(leave.id)}
                    className="flex-1 rounded-lg bg-rose-500/10 border border-rose-500/30 py-2 text-sm text-rose-300 hover:bg-rose-500/20 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> 驳回
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Leave() {
  const user = useScheduleStore((s) => s.currentUser);
  const navigate = useNavigate();

  const canApprove = user?.role === 'leader';
  const canSubmit = user?.role === 'member';

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/schedule')}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-amber-400">请假管理</h1>
        </div>

        <div className="space-y-6">
          {canSubmit && <LeaveForm />}
          {canApprove && <LeaveApprovalList />}
          {!canSubmit && !canApprove && (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">值班经理暂无请假操作权限</p>
              <p className="text-sm text-slate-500 mt-1">请联系组长处理请假审批</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
