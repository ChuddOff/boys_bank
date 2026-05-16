import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { bankApi } from '../shared/api/bank';
import { EmptyState, LoadingState } from '../shared/components/State';
import { date, money } from '../shared/lib/utils';
export function LoansPage(){const q=useQuery({queryKey:['loans'],queryFn:bankApi.loans}); if(q.isLoading)return <LoadingState/>; return <div className="space-y-5"><div className="flex justify-between"><h2 className="text-3xl font-black">Кредиты</h2><Link className="btn-secondary" to="/loans/new">Подать заявку</Link></div>{!q.data?.length?<EmptyState title="Заявок нет"/>:<div className="grid gap-3">{q.data.map(l=><div className="card flex justify-between" key={l.id}><div><b>{money(l.amount)}</b><p>{l.purpose||'Потребительский кредит'} · {date(l.createdAt)}</p></div><span className="badge">{l.status}</span></div>)}</div>}</div>}
