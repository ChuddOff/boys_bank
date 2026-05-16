import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { bankApi } from '../shared/api/bank';
import { EmptyState, LoadingState } from '../shared/components/State';
import { money } from '../shared/lib/utils';
export function DepositsPage(){const q=useQuery({queryKey:['deposits'],queryFn:bankApi.deposits}); if(q.isLoading)return <LoadingState/>; return <div className="space-y-5"><div className="flex justify-between"><h2 className="text-3xl font-black">Вклады</h2><Link className="btn-secondary" to="/deposits/new">Открыть вклад</Link></div>{!q.data?.length?<EmptyState title="Вкладов нет"/>:<div className="grid gap-4 md:grid-cols-2">{q.data.map(d=><div className="card" key={d.id}><span className="badge">{d.termMonths} мес · {d.annualRate}</span><h3 className="mt-5 text-3xl font-black">{money(d.projectedPayout)}</h3><p className="text-black/60">Вложено {money(d.principal)}</p></div>)}</div>}</div>}
