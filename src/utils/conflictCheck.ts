import type { Shift, LeaveRequest, Position, Member, Conflict } from '@/types';

export function checkDualCoverage(
  shifts: Shift[],
  positions: Position[],
  members: Member[],
  approvedLeaves: LeaveRequest[]
): Conflict[] {
  const conflicts: Conflict[] = [];
  const criticalPositions = positions.filter((p) => p.isCritical);

  for (const position of criticalPositions) {
    const positionShifts = shifts.filter((s) => s.positionId === position.id);
    for (const shift of positionShifts) {
      const onLeaveMemberIds = approvedLeaves
        .filter(
          (l) =>
            l.status === 'approved' &&
            l.date === shift.date &&
            (l.period === 'all_day' || l.period === shift.period)
        )
        .map((l) => l.memberId);

      const activeMembers = shift.memberIds.filter(
        (mid) => !onLeaveMemberIds.includes(mid)
      );

      if (activeMembers.length < 2) {
        const leaveMembers = shift.memberIds.filter((mid) =>
          onLeaveMemberIds.includes(mid)
        );
        const leaveNames = leaveMembers
          .map((mid) => members.find((m) => m.id === mid)?.name)
          .filter(Boolean)
          .join('、');
        conflicts.push({
          type: 'dual_coverage',
          shiftId: shift.id,
          positionId: position.id,
          date: shift.date,
          period: shift.period,
          message: `关键岗位「${position.name}」${shift.date} ${shift.period === 'morning' ? '早班' : shift.period === 'afternoon' ? '午班' : '晚班'}仅${activeMembers.length}人值班${leaveNames ? `，${leaveNames}已请假` : ''}，要求至少2人`,
        });
      }
    }
  }

  return conflicts;
}

export function checkLeaveOverlap(
  shifts: Shift[],
  approvedLeaves: LeaveRequest[],
  members: Member[],
  positions: Position[]
): Conflict[] {
  const conflicts: Conflict[] = [];

  for (const leave of approvedLeaves.filter((l) => l.status === 'approved')) {
    const overlappingShifts = shifts.filter(
      (s) =>
        s.memberIds.includes(leave.memberId) &&
        s.date === leave.date &&
        (leave.period === 'all_day' || leave.period === s.period)
    );

    for (const shift of overlappingShifts) {
      const member = members.find((m) => m.id === leave.memberId);
      const position = positions.find((p) => p.id === shift.positionId);
      conflicts.push({
        type: 'leave_overlap',
        shiftId: shift.id,
        positionId: shift.positionId,
        date: shift.date,
        period: shift.period,
        message: `${member?.name || '未知'}已请假（${leave.reason}），但仍被排入「${position?.name || '未知'}」${shift.period === 'morning' ? '早班' : shift.period === 'afternoon' ? '午班' : '晚班'}`,
      });
    }
  }

  return conflicts;
}

export function getAllConflicts(
  shifts: Shift[],
  positions: Position[],
  members: Member[],
  approvedLeaves: LeaveRequest[]
): Conflict[] {
  return [
    ...checkDualCoverage(shifts, positions, members, approvedLeaves),
    ...checkLeaveOverlap(shifts, approvedLeaves, members, positions),
  ];
}
