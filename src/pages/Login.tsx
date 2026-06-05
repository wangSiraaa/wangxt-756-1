import React from 'react';
import { useScheduleStore } from '@/store/useScheduleStore';
import { Shield, Users, Eye } from 'lucide-react';
import type { Role } from '@/types';
import { ROLE_LABELS } from '@/types';
import { useNavigate, Navigate } from 'react-router-dom';

const ROLE_ICONS: Record<Role, React.ReactNode> = {
  leader: <Shield className="w-8 h-8" />,
  member: <Users className="w-8 h-8" />,
  manager: <Eye className="w-8 h-8" />,
};

const ROLE_DESCRIPTIONS: Record<Role, string> = {
  leader: '编辑排班、审批请假、查看冲突',
  member: '查看排班、提交请假申请',
  manager: '查看排班与覆盖报告',
};

const ROLE_ACCOUNTS: Record<Role, { username: string; password: string }[]> = {
  leader: [{ username: 'leader1', password: '123456' }],
  member: [
    { username: 'member1', password: '123456' },
    { username: 'member2', password: '123456' },
    { username: 'member3', password: '123456' },
  ],
  manager: [{ username: 'manager1', password: '123456' }],
};

export default function Login() {
  const login = useScheduleStore((s) => s.login);
  const currentUser = useScheduleStore((s) => s.currentUser);
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = React.useState<Role | null>(null);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  if (currentUser) {
    return <Navigate to="/schedule" replace />;
  }

  const handleQuickLogin = (role: Role, u: string, p: string) => {
    const ok = login(u, p);
    if (ok) {
      navigate('/schedule', { replace: true });
    } else {
      setError('登录失败，请检查账号密码');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = login(username, password);
    if (ok) {
      navigate('/schedule', { replace: true });
    } else {
      setError('账号或密码错误');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-amber-400 text-center mb-2 tracking-wide">
          保障小组排班图
        </h1>
        <p className="text-slate-400 text-center mb-10">选择角色快速登录，或输入账号密码</p>

        <div className="grid grid-cols-3 gap-6 mb-10">
          {(Object.keys(ROLE_LABELS) as Role[]).map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(selectedRole === role ? null : role)}
              className={`group relative rounded-2xl border-2 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                selectedRole === role
                  ? 'border-amber-400 bg-slate-800 shadow-lg shadow-amber-400/10'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
              }`}
            >
              <div className={`${selectedRole === role ? 'text-amber-400' : 'text-slate-400'} mb-4 transition-colors`}>
                {ROLE_ICONS[role]}
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{ROLE_LABELS[role]}</h3>
              <p className="text-sm text-slate-400 mb-4">{ROLE_DESCRIPTIONS[role]}</p>
              {selectedRole === role && (
                <div className="space-y-2">
                  {ROLE_ACCOUNTS[role].map((acc) => (
                    <button
                      key={acc.username}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickLogin(role, acc.username, acc.password);
                      }}
                      className="w-full rounded-lg bg-amber-400/10 border border-amber-400/30 px-3 py-2 text-sm text-amber-300 hover:bg-amber-400/20 transition-colors"
                    >
                      {acc.username} 快速登录
                    </button>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
          <div>
            <input
              type="text"
              placeholder="账号"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none transition-colors"
            />
          </div>
          {error && <p className="text-rose-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-amber-400 py-3 font-semibold text-slate-900 hover:bg-amber-300 transition-colors"
          >
            登录
          </button>
        </form>
      </div>
    </div>
  );
}
