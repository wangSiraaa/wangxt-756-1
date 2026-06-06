export type Role = 'leader' | 'member' | 'manager';
export type Period = 'morning' | 'afternoon' | 'night';
export type LeavePeriod = 'morning' | 'afternoon' | 'night' | 'all_day';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';
export type MemberStatus = 'active' | 'on_leave';
export type ConflictType = 'dual_coverage' | 'leave_overlap';

export interface Account {
  username: string;
  password: string;
  role: Role;
  memberId: string;
  displayName: string;
}

export interface Position {
  id: string;
  name: string;
  isCritical: boolean;
}

export interface Member {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  skills: string[];
  status: MemberStatus;
}

export interface Shift {
  id: string;
  date: string;
  period: Period;
  positionId: string;
  memberIds: string[];
}

export interface LeaveRequest {
  id: string;
  memberId: string;
  date: string;
  period: LeavePeriod;
  status: LeaveStatus;
  reason: string;
}

export interface Conflict {
  type: ConflictType;
  shiftId: string;
  positionId: string;
  date: string;
  period: string;
  message: string;
}

export interface Annotation {
  id: string;
  content: string;
  createdAt: string;
  author: string;
}

export const PERIOD_LABELS: Record<Period, string> = {
  morning: '早班',
  afternoon: '午班',
  night: '晚班',
};

export const ROLE_LABELS: Record<Role, string> = {
  leader: '保障组长',
  member: '组员',
  manager: '值班经理',
};

export const WEEKDAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] as const;
