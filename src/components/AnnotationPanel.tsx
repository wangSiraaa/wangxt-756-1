import React from 'react';
import { useScheduleStore } from '@/store/useScheduleStore';
import { X, MessageSquare, Trash2, Send } from 'lucide-react';

export default function AnnotationPanel() {
  const show = useScheduleStore((s) => s.showAnnotationPanel);
  const close = useScheduleStore((s) => s.closeAnnotationPanel);
  const annotations = useScheduleStore((s) => s.annotations);
  const addAnnotation = useScheduleStore((s) => s.addAnnotation);
  const deleteAnnotation = useScheduleStore((s) => s.deleteAnnotation);
  const currentUser = useScheduleStore((s) => s.currentUser);
  const [content, setContent] = React.useState('');

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      addAnnotation(content.trim());
      setContent('');
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const canDelete = currentUser?.role === 'leader' || currentUser?.role === 'manager';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={close}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative w-full max-w-xl max-h-[80vh] bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-400" />
              批注记录
            </h2>
            <button onClick={close} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-6 pb-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="输入批注内容..."
              className="flex-1 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
            />
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-3 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm hover:bg-amber-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              发送
            </button>
          </form>
        </div>

        <div className="px-6 pb-6 overflow-y-auto flex-1">
          {annotations.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500">暂无批注记录</p>
            </div>
          ) : (
            <div className="space-y-3">
              {annotations.map((a) => (
                <div
                  key={a.id}
                  className="p-3 rounded-lg bg-slate-700/30 border border-slate-700/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-white">{a.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-amber-400">{a.author}</span>
                        <span className="text-xs text-slate-500">·</span>
                        <span className="text-xs text-slate-500">{formatDate(a.createdAt)}</span>
                      </div>
                    </div>
                    {canDelete && (
                      <button
                        onClick={() => deleteAnnotation(a.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="删除批注"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
