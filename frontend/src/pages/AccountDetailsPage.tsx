import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowDownLeft, ArrowUpRight, Copy, Gauge, ReceiptText, WalletCards } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { bankApi } from '../shared/api/bank';
import { ErrorState, LoadingState } from '../shared/components/State';
import { date, money } from '../shared/lib/utils';
const schema = z.object({ amount: z.coerce.number().positive('Введите сумму') }); type FormInput = z.input<typeof schema>; type Form = z.output<typeof schema>;
export function AccountDetailsPage() {
  const { id = '' } = useParams(); const qc = useQueryClient();
  const account = useQuery({ queryKey: ['account', id], queryFn: () => bankApi.account(id) });
  const tx = useQuery({ queryKey: ['accountTx', id], queryFn: () => bankApi.accountTransactions(id) });
  const cards = useQuery({ queryKey: ['cards'], queryFn: bankApi.cards });
  const form = useForm<FormInput, unknown, Form>({ resolver: zodResolver(schema) });
  const mutate = useMutation({ mutationFn: ({ kind, amount }: { kind: 'topUp' | 'withdraw'; amount: number }) => kind === 'topUp' ? bankApi.topUp(Number(id), amount) : bankApi.withdraw(Number(id), amount), onSuccess: () => { qc.invalidateQueries(); form.reset(); } });
  if (account.isLoading) return <LoadingState />; if (account.error) return <ErrorState error={account.error} />; const a = account.data!;
  const accountCards = cards.data?.filter((c) => c.accountId === a.id) ?? [];
  const incoming = tx.data?.filter((t) => t.toAccountId === a.id).reduce((sum, t) => sum + Number(t.amount), 0) ?? 0;
  const outgoing = tx.data?.filter((t) => t.fromAccountId === a.id).reduce((sum, t) => sum + Number(t.amount), 0) ?? 0;
  return <div className="space-y-6">
    <section className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]"><div className="card bg-ink text-white"><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">{a.productName ?? a.type}</span><h2 className="mt-4 text-5xl font-black">{money(a.balance, a.currency)}</h2><p className="mt-2 text-white/60">{a.iban}</p><button className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-ink" onClick={() => navigator.clipboard?.writeText(a.iban)}><Copy className="h-4 w-4" />Скопировать IBAN</button></div><div className="card"><h3 className="text-xl font-black">Пульс счета</h3><div className="mt-5 grid gap-3"><Metric icon={ArrowDownLeft} label="Поступило" value={money(incoming, a.currency)} /><Metric icon={ArrowUpRight} label="Списано" value={money(outgoing, a.currency)} /><Metric icon={Gauge} label="Лимит переводов" value={`${a.monthlyTransfersLimit ?? 100}/мес`} /><Metric icon={WalletCards} label="Привязано карт" value={String(accountCards.length)} /></div></div></section>
    <form className="card grid gap-3 sm:grid-cols-[1fr_auto_auto]" onSubmit={(e) => e.preventDefault()}><input className="input" placeholder="Сумма" {...form.register('amount')} /><button className="btn-secondary" onClick={form.handleSubmit((d) => mutate.mutate({ kind: 'topUp', amount: d.amount }))}>Пополнить</button><button className="btn" onClick={form.handleSubmit((d) => { if (confirm('Списать средства?')) mutate.mutate({ kind: 'withdraw', amount: d.amount }); })}>Списать</button><p className="text-red-600">{form.formState.errors.amount?.message}</p></form>
    <section className="grid gap-4 lg:grid-cols-[1fr_.8fr]"><div className="card"><h3 className="mb-4 text-xl font-black">Операции счета</h3><div className="space-y-2">{tx.data?.map((t) => <div key={t.id} className="flex justify-between rounded-2xl bg-black/5 p-3"><span>{t.description || t.type}<br /><small>{date(t.createdAt)} · {t.operationId}</small></span><b>{t.fromAccountId === a.id ? '−' : '+'}{money(t.amount, a.currency)}</b></div>)}</div></div><div className="card bg-fintech"><ReceiptText className="h-6 w-6" /><h3 className="mt-3 text-xl font-black">Реквизиты и подсказки</h3><p className="mt-2 text-sm text-black/65">Используйте IBAN для переводов, подключайте карты в разделе «Карты» и отслеживайте лимиты перед крупными платежами.</p><div className="mt-5 space-y-2 text-sm"><p><b>Пакет:</b> {a.packageName ?? 'Стандарт'}</p><p><b>Статус:</b> {a.active ? 'активен' : 'закрыт'}</p><p><b>Валюта:</b> {a.currency}</p></div></div></section>
  </div>;
}
function Metric({ icon: Icon, label, value }: { icon: typeof Gauge; label: string; value: string }) { return <div className="flex items-center justify-between rounded-2xl bg-black/5 p-3"><span className="flex items-center gap-2 text-sm text-black/60"><Icon className="h-4 w-4" />{label}</span><b>{value}</b></div>; }
