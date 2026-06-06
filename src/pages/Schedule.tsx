import { useScheduleStore } from '@/store/useScheduleStore';
import Header from '@/components/Header';
import ShiftGrid from '@/components/ShiftGrid';
import MemberDetailPanel from '@/components/MemberDetailPanel';
import ShiftEditModal from '@/components/ShiftEditModal';
import ConflictPanel from '@/components/ConflictPanel';
import ConflictBanner from '@/components/ConflictBanner';
import AnnotationPanel from '@/components/AnnotationPanel';

export default function Schedule() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <ConflictBanner />
      <main className="max-w-screen-2xl mx-auto p-4">
        <ShiftGrid />
      </main>
      <MemberDetailPanel />
      <ShiftEditModal />
      <ConflictPanel />
      <AnnotationPanel />
    </div>
  );
}
