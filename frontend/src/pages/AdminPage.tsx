import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bankApi } from '../shared/api/bank';
import { LoadingState } from '../shared/components/State';
import { money } from './LoanApplicationPage';

export function AdminPage() {
  const qc = useQueryClient();
  const users = useQuery({ queryKey: ['adminUsers'], queryFn: bankApi.adminUsers });
  const transactions = useQuery({ queryKey: ['adminFraudTransactions'], queryFn: bankApi.adminFraudTransactions });
  const role = useMutation({ mutationFn: ({ id, role }: { id: number; role: string }) => bankApi.updateRole(id, role), onSuccess: () => qc.invalidateQueries({ queryKey: ['adminUsers'] }) });
  const review = useMutation({ mutationFn: ({ id, status }: { id: number; status: 'SAFE' | 'SUSPICIOUS' }) => bankApi.adminReviewFraud(id, status, 'Проверено администратором'), onSuccess: () => qc.invalidateQueries({ queryKey: ['adminFraudTransactions'] }) });

  if (users.isLoading || transactions.isLoading) return <LoadingState />;
  const suspiciousCount = transactions.data?.filter(t => t.suspicious || t.status === 'SUSPICIOUS').length ?? 0;

  return <div className="space-y-6">
    <section className="grid gap-4 md:grid-cols-3">
      <Metric label="Пользователей" value={users.data?.length ?? 0} />
      <Metric label="Операций в мониторинге" value={transactions.data?.length ?? 0} />
      <Metric label="Требуют внимания" value={suspiciousCount} danger={suspiciousCount > 0} />
    </section>

    <section className="card">
      <h2 className="mb-5 text-3xl font-black">Admin · пользователи</h2>
      <div className="overflow-x-auto"><table className="w-full text-left"><tbody>{users.data?.map(u => <tr className="border-t" key={u.id}><td className="py-4"><b>{u.firstName} {u.lastName}</b><p className="text-black/50">{u.email}</p></td><td>{u.roles.join(', ')}</td><td className="text-right"><button className="btn-secondary" onClick={() => role.mutate({ id: u.id, role: u.roles.includes('ADMIN') ? 'USER' : 'ADMIN' })}>Сменить роль</button></td></tr>)}</tbody></table></div>
    </section>

    <section className="card">
      <h2 className="mb-2 text-3xl font-black">Мониторинг операций</h2>
      <p className="mb-5 text-black/55">Администратор видит все транзакции банка, риск-скоринг антифрода и может закрывать проверку.</p>
      <div className="space-y-3">{transactions.data?.map(item => <article className="rounded-3xl border border-black/10 p-4" key={item.id}>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div><div className="flex flex-wrap items-center gap-2"><b>{money(item.transaction.amount)}</b><span className={`badge ${item.suspicious ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>risk {item.riskScore}</span><span className="badge">{item.status}</span></div><p className="mt-2 text-sm text-black/60">{item.reason}</p><p className="mt-1 text-xs text-black/40">{item.transaction.description || 'Без описания'} · {new Date(item.transaction.createdAt).toLocaleString('ru-RU')}</p></div>
          <div className="flex gap-2"><button className="btn-secondary" onClick={() => review.mutate({ id: item.id, status: 'SAFE' })}>Безопасно</button><button className="btn" onClick={() => review.mutate({ id: item.id, status: 'SUSPICIOUS' })}>Подозрительно</button></div>
        </div>
      </article>)}</div>
    </section>
  </div>;
}

function Metric({ label, value, danger = false }: { label: string; value: number; danger?: boolean }) {
  return <div className="card"><p className="text-sm text-black/50">{label}</p><p className={`mt-2 text-4xl font-black ${danger ? 'text-red-600' : ''}`}>{value}</p></div>;
}
