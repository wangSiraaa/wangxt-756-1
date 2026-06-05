import type { Account } from '@/types';

export const ACCOUNTS: Account[] = [
  { username: 'leader1', password: '123456', role: 'leader', memberId: 'm1', displayName: '张组长' },
  { username: 'member1', password: '123456', role: 'member', memberId: 'm2', displayName: '李组员' },
  { username: 'member2', password: '123456', role: 'member', memberId: 'm3', displayName: '王组员' },
  { username: 'member3', password: '123456', role: 'member', memberId: 'm4', displayName: '赵组员' },
  { username: 'manager1', password: '123456', role: 'manager', memberId: 'm5', displayName: '陈经理' },
];
