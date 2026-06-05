import type { LeaveRequest } from '@/types';
import { WEEK_DATES } from './shifts';

export const LEAVE_REQUESTS: LeaveRequest[] = [
  { id: 'l1', memberId: 'm7', date: WEEK_DATES[0], period: 'all_day', status: 'approved', reason: '病假' },
  { id: 'l2', memberId: 'm7', date: WEEK_DATES[1], period: 'all_day', status: 'approved', reason: '病假' },
  { id: 'l3', memberId: 'm3', date: WEEK_DATES[3], period: 'afternoon', status: 'pending', reason: '家事' },
  { id: 'l4', memberId: 'm2', date: WEEK_DATES[5], period: 'all_day', status: 'pending', reason: '调休' },
];
