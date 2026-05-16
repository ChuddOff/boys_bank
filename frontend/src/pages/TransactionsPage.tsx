import { useQuery } from '@tanstack/react-query';
import { bankApi } from '../shared/api/bank';
import { EmptyState, ErrorState, LoadingState } from '../shared/components/State';
import { date, money } from '../shared/lib/utils';
export function TransactionsPage(){const q=useQuery({queryKey:['transactions'],queryFn:bankApi.transactions}); if(q.isLoading)return <LoadingState/>; if(q.error)return <ErrorState error={q.error}/>; return <div className="card"><h2 className="mb-5 text-3xl font-black">История транзакций</h2>{!q.data?.length?<EmptyState/>:<div className="overflow-x-auto"><table className="w-full text-left"><tbody>{q.data.map(t=><tr className="border-t" key={t.id}><td className="py-4"><b>{t.description||t.type}</b><p className="text-sm text-black/50">{date(t.createdAt)} · {t.operationId}</p></td><td>{t.fromAccountId??'—'} → {t.toAccountId??'—'}</td><td className="text-right font-black">{money(t.amount)}</td></tr>)}</tbody></table></div>}</div>}
