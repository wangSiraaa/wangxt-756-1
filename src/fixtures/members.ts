import type { Member } from '@/types';

export const MEMBERS: Member[] = [
  { id: 'm1', name: '张组长', role: 'leader', avatar: '👨‍💼', skills: ['监控', '网络', '应急'], status: 'active' },
  { id: 'm2', name: '李组员', role: 'member', avatar: '👷', skills: ['巡检', '网络'], status: 'active' },
  { id: 'm3', name: '王组员', role: 'member', avatar: '👩‍🔧', skills: ['监控', '应急'], status: 'active' },
  { id: 'm4', name: '赵组员', role: 'member', avatar: '🧑‍💻', skills: ['网络', '运维'], status: 'active' },
  { id: 'm5', name: '陈经理', role: 'manager', avatar: '👨‍💻', skills: ['管理', '调度'], status: 'active' },
  { id: 'm6', name: '刘组员', role: 'member', avatar: '👩‍💼', skills: ['监控', '巡检'], status: 'active' },
  { id: 'm7', name: '周组员', role: 'member', avatar: '🧑‍🔧', skills: ['应急', '巡检'], status: 'on_leave' },
  { id: 'm8', name: '孙组员', role: 'member', avatar: '👷‍♀️', skills: ['网络', '运维'], status: 'active' },
];
