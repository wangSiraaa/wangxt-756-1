import type { Shift } from '@/types';

function generateWeekDates(): string[] {
  const dates: string[] = [];
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

const dates = generateWeekDates();

export const SHIFTS: Shift[] = [
  { id: 's1', date: dates[0], period: 'morning', positionId: 'pos1', memberIds: ['m1', 'm3'] },
  { id: 's2', date: dates[0], period: 'morning', positionId: 'pos2', memberIds: ['m4'] },
  { id: 's3', date: dates[0], period: 'afternoon', positionId: 'pos1', memberIds: ['m2'] },
  { id: 's4', date: dates[0], period: 'afternoon', positionId: 'pos3', memberIds: ['m6'] },
  { id: 's5', date: dates[0], period: 'night', positionId: 'pos1', memberIds: ['m1'] },
  { id: 's6', date: dates[0], period: 'night', positionId: 'pos4', memberIds: ['m3'] },
  { id: 's7', date: dates[1], period: 'morning', positionId: 'pos1', memberIds: ['m2', 'm6'] },
  { id: 's8', date: dates[1], period: 'morning', positionId: 'pos2', memberIds: ['m4', 'm8'] },
  { id: 's9', date: dates[1], period: 'afternoon', positionId: 'pos1', memberIds: ['m3'] },
  { id: 's10', date: dates[1], period: 'afternoon', positionId: 'pos4', memberIds: ['m1'] },
  { id: 's11', date: dates[1], period: 'night', positionId: 'pos1', memberIds: ['m6'] },
  { id: 's12', date: dates[1], period: 'night', positionId: 'pos2', memberIds: ['m4'] },
  { id: 's13', date: dates[2], period: 'morning', positionId: 'pos1', memberIds: ['m1', 'm2'] },
  { id: 's14', date: dates[2], period: 'morning', positionId: 'pos4', memberIds: ['m3'] },
  { id: 's15', date: dates[2], period: 'afternoon', positionId: 'pos1', memberIds: ['m6'] },
  { id: 's16', date: dates[2], period: 'afternoon', positionId: 'pos3', memberIds: ['m4'] },
  { id: 's17', date: dates[2], period: 'night', positionId: 'pos1', memberIds: ['m1'] },
  { id: 's18', date: dates[2], period: 'night', positionId: 'pos4', memberIds: ['m8'] },
  { id: 's19', date: dates[3], period: 'morning', positionId: 'pos1', memberIds: ['m3', 'm6'] },
  { id: 's20', date: dates[3], period: 'morning', positionId: 'pos2', memberIds: ['m4'] },
  { id: 's21', date: dates[3], period: 'afternoon', positionId: 'pos1', memberIds: ['m2'] },
  { id: 's22', date: dates[3], period: 'afternoon', positionId: 'pos4', memberIds: ['m1'] },
  { id: 's23', date: dates[3], period: 'night', positionId: 'pos1', memberIds: ['m6'] },
  { id: 's24', date: dates[3], period: 'night', positionId: 'pos2', memberIds: ['m8'] },
  { id: 's25', date: dates[4], period: 'morning', positionId: 'pos1', memberIds: ['m1', 'm2'] },
  { id: 's26', date: dates[4], period: 'morning', positionId: 'pos3', memberIds: ['m6'] },
  { id: 's27', date: dates[4], period: 'afternoon', positionId: 'pos1', memberIds: ['m3'] },
  { id: 's28', date: dates[4], period: 'afternoon', positionId: 'pos4', memberIds: ['m4'] },
  { id: 's29', date: dates[4], period: 'night', positionId: 'pos1', memberIds: ['m1'] },
  { id: 's30', date: dates[4], period: 'night', positionId: 'pos2', memberIds: ['m8'] },
  { id: 's31', date: dates[5], period: 'morning', positionId: 'pos1', memberIds: ['m6', 'm3'] },
  { id: 's32', date: dates[5], period: 'morning', positionId: 'pos4', memberIds: ['m1'] },
  { id: 's33', date: dates[5], period: 'afternoon', positionId: 'pos1', memberIds: ['m2'] },
  { id: 's34', date: dates[5], period: 'afternoon', positionId: 'pos2', memberIds: ['m4'] },
  { id: 's35', date: dates[5], period: 'night', positionId: 'pos1', memberIds: ['m3'] },
  { id: 's36', date: dates[5], period: 'night', positionId: 'pos4', memberIds: ['m8'] },
  { id: 's37', date: dates[6], period: 'morning', positionId: 'pos1', memberIds: ['m1', 'm6'] },
  { id: 's38', date: dates[6], period: 'morning', positionId: 'pos2', memberIds: ['m4', 'm8'] },
  { id: 's39', date: dates[6], period: 'afternoon', positionId: 'pos1', memberIds: ['m2'] },
  { id: 's40', date: dates[6], period: 'afternoon', positionId: 'pos3', memberIds: ['m3'] },
  { id: 's41', date: dates[6], period: 'night', positionId: 'pos1', memberIds: ['m6'] },
  { id: 's42', date: dates[6], period: 'night', positionId: 'pos4', memberIds: ['m1'] },
];

export { dates as WEEK_DATES };
