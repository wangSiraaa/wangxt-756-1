import { create } from 'zustand';
import type { Member, Shift, LeaveRequest, Position, Account, Role, Conflict } from '@/types';
import { ACCOUNTS, POSITIONS, MEMBERS, SHIFTS, LEAVE_REQUESTS, WEEK_DATES } from '@/fixtures';
import { getAllConflicts } from '@/utils/conflictCheck';

interface ScheduleState {
  currentUser: Account | null;
  members: Member[];
  positions: Position[];
  shifts: Shift[];
  leaveRequests: LeaveRequest[];
  weekDates: string[];
  selectedMemberId: string | null;
  showConflictPanel: boolean;
  showShiftEdit: { positionId: string; date: string; period: string } | null;
  conflicts: Conflict[];

  login: (username: string, password: string) => boolean;
  logout: () => void;
  openMemberDetail: (memberId: string) => void;
  closeMemberDetail: () => void;
  openConflictPanel: () => void;
  closeConflictPanel: () => void;
  openShiftEdit: (positionId: string, date: string, period: string) => void;
  closeShiftEdit: () => void;
  assignMemberToShift: (shiftId: string, memberId: string) => void;
  removeMemberFromShift: (shiftId: string, memberId: string) => void;
  submitLeaveRequest: (memberId: string, date: string, period: LeaveRequest['period'], reason: string) => void;
  approveLeave: (leaveId: string) => void;
  rejectLeave: (leaveId: string) => void;
  recalculateConflicts: () => void;
}

function computeConflicts(
  shifts: Shift[],
  positions: Position[],
  members: Member[],
  leaveRequests: LeaveRequest[]
): Conflict[] {
  const approved = leaveRequests.filter((l) => l.status === 'approved');
  return getAllConflicts(shifts, positions, members, approved);
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  currentUser: null,
  members: [...MEMBERS],
  positions: [...POSITIONS],
  shifts: [...SHIFTS],
  leaveRequests: [...LEAVE_REQUESTS],
  weekDates: [...WEEK_DATES],
  selectedMemberId: null,
  showConflictPanel: false,
  showShiftEdit: null,
  conflicts: computeConflicts(SHIFTS, POSITIONS, MEMBERS, LEAVE_REQUESTS),

  login: (username, password) => {
    const account = ACCOUNTS.find(
      (a) => a.username === username && a.password === password
    );
    if (account) {
      set({ currentUser: account });
      return true;
    }
    return false;
  },

  logout: () => {
    set({ currentUser: null, selectedMemberId: null, showConflictPanel: false, showShiftEdit: null });
  },

  openMemberDetail: (memberId) => set({ selectedMemberId: memberId }),
  closeMemberDetail: () => set({ selectedMemberId: null }),
  openConflictPanel: () => set({ showConflictPanel: true }),
  closeConflictPanel: () => set({ showConflictPanel: false }),

  openShiftEdit: (positionId, date, period) =>
    set({ showShiftEdit: { positionId, date, period } }),
  closeShiftEdit: () => set({ showShiftEdit: null }),

  assignMemberToShift: (shiftId, memberId) => {
    const { shifts } = get();
    const updated = shifts.map((s) => {
      if (s.id === shiftId && !s.memberIds.includes(memberId)) {
        return { ...s, memberIds: [...s.memberIds, memberId] };
      }
      return s;
    });
    set({ shifts: updated });
    get().recalculateConflicts();
  },

  removeMemberFromShift: (shiftId, memberId) => {
    const { shifts } = get();
    const updated = shifts.map((s) => {
      if (s.id === shiftId) {
        return { ...s, memberIds: s.memberIds.filter((id) => id !== memberId) };
      }
      return s;
    });
    set({ shifts: updated });
    get().recalculateConflicts();
  },

  submitLeaveRequest: (memberId, date, period, reason) => {
    const { leaveRequests } = get();
    const newLeave: LeaveRequest = {
      id: `l${Date.now()}`,
      memberId,
      date,
      period,
      status: 'pending',
      reason,
    };
    set({ leaveRequests: [...leaveRequests, newLeave] });
  },

  approveLeave: (leaveId) => {
    const { leaveRequests } = get();
    const updated = leaveRequests.map((l) =>
      l.id === leaveId ? { ...l, status: 'approved' as const } : l
    );
    const leave = leaveRequests.find((l) => l.id === leaveId);
    if (leave) {
      const memberId = leave.memberId;
      const { members } = get();
      const updatedMembers = members.map((m) =>
        m.id === memberId ? { ...m, status: 'on_leave' as const } : m
      );
      set({ leaveRequests: updated, members: updatedMembers });
    } else {
      set({ leaveRequests: updated });
    }
    get().recalculateConflicts();
  },

  rejectLeave: (leaveId) => {
    const { leaveRequests } = get();
    const updated = leaveRequests.map((l) =>
      l.id === leaveId ? { ...l, status: 'rejected' as const } : l
    );
    set({ leaveRequests: updated });
  },

  recalculateConflicts: () => {
    const { shifts, positions, members, leaveRequests } = get();
    const conflicts = computeConflicts(shifts, positions, members, leaveRequests);
    set({ conflicts });
  },
}));
