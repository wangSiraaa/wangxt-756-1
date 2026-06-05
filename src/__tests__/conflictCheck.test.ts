import { describe, it, expect } from 'vitest';
import { getAllConflicts, checkDualCoverage, checkLeaveOverlap } from '../utils/conflictCheck';
import type { Member, Shift, LeaveRequest, Position } from '../types';

const positions: Position[] = [
  { id: 'pos1', name: '监控中心', isCritical: true },
  { id: 'pos2', name: '网络运维', isCritical: true },
  { id: 'pos3', name: '现场巡检', isCritical: false },
];

const members: Member[] = [
  { id: 'm1', name: '张三', role: 'leader', avatar: '👨', skills: ['监控'], status: 'active' },
  { id: 'm2', name: '李四', role: 'member', avatar: '👷', skills: ['巡检'], status: 'on_leave' },
  { id: 'm3', name: '王五', role: 'member', avatar: '👩', skills: ['监控'], status: 'active' },
];

const baseShifts: Shift[] = [
  { id: 's1', date: '2026-06-01', period: 'morning', positionId: 'pos1', memberIds: ['m1', 'm3'] },
  { id: 's2', date: '2026-06-01', period: 'afternoon', positionId: 'pos1', memberIds: ['m1'] },
  { id: 's3', date: '2026-06-01', period: 'morning', positionId: 'pos2', memberIds: ['m3'] },
];

const noLeaves: LeaveRequest[] = [];

describe('conflictCheck', () => {
  it('should detect dual coverage violation for critical position with only 1 person', () => {
    const conflicts = checkDualCoverage(baseShifts, positions, members, noLeaves);
    const pos1Afternoon = conflicts.find(
      (c) => c.shiftId === 's2' && c.type === 'dual_coverage'
    );
    expect(pos1Afternoon).toBeDefined();
    expect(pos1Afternoon!.message).toContain('监控中心');
    expect(pos1Afternoon!.message).toContain('仅1人');
  });

  it('should NOT flag dual coverage for non-critical position', () => {
    const shifts: Shift[] = [
      { id: 's10', date: '2026-06-01', period: 'morning', positionId: 'pos3', memberIds: ['m1'] },
    ];
    const conflicts = checkDualCoverage(shifts, positions, members, noLeaves);
    const nonCritical = conflicts.find((c) => c.positionId === 'pos3');
    expect(nonCritical).toBeUndefined();
  });

  it('should NOT flag dual coverage when 2+ people are assigned', () => {
    const conflicts = checkDualCoverage(baseShifts, positions, members, noLeaves);
    const pos1Morning = conflicts.find(
      (c) => c.shiftId === 's1' && c.type === 'dual_coverage'
    );
    expect(pos1Morning).toBeUndefined();
  });

  it('should detect leave overlap when on-leave member is still assigned to shift', () => {
    const approvedLeaves: LeaveRequest[] = [
      { id: 'l1', memberId: 'm2', date: '2026-06-01', period: 'all_day', status: 'approved', reason: '病假' },
    ];
    const shifts: Shift[] = [
      { id: 's1', date: '2026-06-01', period: 'morning', positionId: 'pos1', memberIds: ['m1', 'm2'] },
    ];
    const conflicts = checkLeaveOverlap(shifts, approvedLeaves, members, positions);
    expect(conflicts.length).toBe(1);
    expect(conflicts[0].type).toBe('leave_overlap');
    expect(conflicts[0].message).toContain('李四');
    expect(conflicts[0].message).toContain('已请假');
  });

  it('should detect dual coverage violation caused by leave', () => {
    const approvedLeaves: LeaveRequest[] = [
      { id: 'l1', memberId: 'm3', date: '2026-06-01', period: 'morning', status: 'approved', reason: '病假' },
    ];
    const shifts: Shift[] = [
      { id: 's1', date: '2026-06-01', period: 'morning', positionId: 'pos1', memberIds: ['m1', 'm3'] },
    ];
    const conflicts = checkDualCoverage(shifts, positions, members, approvedLeaves);
    expect(conflicts.length).toBe(1);
    expect(conflicts[0].type).toBe('dual_coverage');
    expect(conflicts[0].message).toContain('王五');
    expect(conflicts[0].message).toContain('已请假');
  });

  it('core scenario: assign on-leave member to shift should produce conflict prompt', () => {
    const approvedLeaves: LeaveRequest[] = [
      { id: 'l1', memberId: 'm2', date: '2026-06-01', period: 'all_day', status: 'approved', reason: '病假' },
    ];

    const shiftsBefore: Shift[] = [
      { id: 's1', date: '2026-06-01', period: 'morning', positionId: 'pos1', memberIds: ['m1', 'm3'] },
    ];
    const conflictsBefore = getAllConflicts(shiftsBefore, positions, members, approvedLeaves);
    expect(conflictsBefore.length).toBe(0);

    const shiftsAfter: Shift[] = [
      { id: 's1', date: '2026-06-01', period: 'morning', positionId: 'pos1', memberIds: ['m1', 'm3', 'm2'] },
    ];
    const conflictsAfter = getAllConflicts(shiftsAfter, positions, members, approvedLeaves);
    const leaveOverlap = conflictsAfter.find((c) => c.type === 'leave_overlap');
    expect(leaveOverlap).toBeDefined();
    expect(leaveOverlap!.message).toContain('李四');
    expect(leaveOverlap!.message).toContain('已请假');
    expect(leaveOverlap!.message).toContain('监控中心');
  });

  it('should not flag leave overlap for pending or rejected leaves', () => {
    const leaves: LeaveRequest[] = [
      { id: 'l1', memberId: 'm2', date: '2026-06-01', period: 'all_day', status: 'pending', reason: '病假' },
      { id: 'l2', memberId: 'm2', date: '2026-06-02', period: 'all_day', status: 'rejected', reason: '事假' },
    ];
    const shifts: Shift[] = [
      { id: 's1', date: '2026-06-01', period: 'morning', positionId: 'pos1', memberIds: ['m1', 'm2'] },
      { id: 's2', date: '2026-06-02', period: 'morning', positionId: 'pos1', memberIds: ['m1', 'm2'] },
    ];
    const conflicts = checkLeaveOverlap(shifts, leaves, members, positions);
    expect(conflicts.length).toBe(0);
  });
});
