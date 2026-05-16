import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Shield, Sparkles, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { bankApi } from '../shared/api/bank';
import { EmptyState, ErrorState, LoadingState } from '../shared/components/State';
import { money } from '../shared/lib/utils';
import { Field } from './LoginPage';
const tiers = [
  { tier: 'BLACK', name: 'Boys Bank Black', icon: Shield, fee: 0, cashback: '1.5%', text: 'Базовая дебетовая карта для повседневных покупок и подписок.', perks: ['Бесплатное обслуживание', 'Лимит 150 000 ₽/день', 'Мгновенная блокировка'] },
  { tier: 'GOLD', name: 'Boys Bank Gold Premium', icon: Star, fee: 199, cashback: '2.2%', text: 'Для активных покупок: больше кэшбэка и расширенный дневной лимит.', perks: ['Кэшбэк в кафе', 'Лимит 300 000 ₽/день', 'Расширенные уведомления'] },
  { tier: 'PLATINUM', name: 'Boys Bank Platinum', icon: Sparkles, fee: 499, cashback: '3%', text: 'Премиум-карта с высоким лимитом, travel-подсказками и приоритетом.', perks: ['Travel-бонусы', 'Лимит 500 000 ₽/день', 'Приоритетная поддержка'] },
];
const schema = z.object({ accountId: z.coerce.number().positive(), tier: z.string() }); type FormInput = z.input<typeof schema>; type Form = z.output<typeof schema>;
export function CardsPage() {
  const qc = useQueryClient(); const cards = useQuery({ queryKey: ['cards'], queryFn: bankApi.cards }); const accounts = useQuery({ queryKey: ['accounts'], queryFn: bankApi.accounts });
  const form = useForm<FormInput, unknown, Form>({ resolver: zodResolver(schema), defaultValues: { tier: 'BLACK' } }); const selected = tiers.find((t) => t.tier === form.watch('tier')) ?? tiers[0];
  const create = useMutation({ mutationFn: (data: Form) => bankApi.createCard(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['cards'] }) });
  const toggle = useMutation({ mutationFn: ({ id, action }: { id: number; action: 'block' | 'unblock' }) => bankApi.setCard(id, action), onSuccess: () => qc.invalidateQueries({ queryKey: ['cards'] }) });
  if (cards.isLoading) return <LoadingState />; if (cards.error) return <ErrorState error={cards.error} />;
  return <div className="space-y-5"><div><h2 className="text-3xl font-black">Карты</h2><p className="mt-2 text-black/55">Выпуск стал похож на настоящий: выберите тариф, счет списания и посмотрите условия.</p></div>
    <section className="grid gap-4 xl:grid-cols-[1fr_380px]"><div className="grid gap-3 md:grid-cols-3">{tiers.map(({ icon: Icon, ...t }) => <button className={`card text-left ${selected.tier === t.tier ? 'ring-2 ring-ink' : ''}`} key={t.tier} onClick={() => form.setValue('tier', t.tier)}><Icon className="mb-4 h-6 w-6" /><b>{t.name}</b><p className="mt-2 text-sm text-black/55">{t.text}</p><p className="mt-4 font-black">{t.cashback} кэшбэк · {money(t.fee)}/мес</p><div className="mt-3 space-y-1">{t.perks.map((p) => <span className="badge mr-1" key={p}>{p}</span>)}</div></button>)}</div>
      <form className="card space-y-4" onSubmit={form.handleSubmit((data) => create.mutate(data))}><h3 className="text-xl font-black">Выпустить {selected.name}</h3><Field label="Счет"><select className="input" {...form.register('accountId')}><option value="">Выберите</option>{accounts.data?.map((a) => <option value={a.id} key={a.id}>{a.iban} · {money(a.balance, a.currency)}</option>)}</select></Field><input type="hidden" {...form.register('tier')} />{create.error && <p className="text-red-600">{create.error.message}</p>}<button disabled={!accounts.data?.length} className="btn-secondary">Выпустить карту</button></form></section>
    {!cards.data?.length ? <EmptyState title="Карт пока нет" /> : <div className="grid gap-4 md:grid-cols-2">{cards.data.map((c) => <div className={`card text-white ${c.tier === 'PLATINUM' ? 'bg-slate-700' : c.tier === 'GOLD' ? 'bg-yellow-700' : 'bg-ink'}`} key={c.id}><p className="text-white/60">{c.displayName ?? 'Boys Bank Black'}</p><h3 className="mt-10 text-3xl font-black">{c.maskedNumber}</h3><div className="mt-6 grid gap-2 text-sm text-white/70"><span>Кэшбэк {c.cashbackRate ?? 1.5}%</span><span>Лимит {money(c.dailyLimit ?? 150000)}/день</span><span>Обслуживание {money(c.monthlyFee ?? 0)}/мес</span></div><div className="mt-8 flex justify-between"><span>до {c.expiresAt}</span><button className="rounded-xl bg-white px-3 py-1 text-sm font-bold text-ink" onClick={() => toggle.mutate({ id: c.id, action: c.status === 'ACTIVE' ? 'block' : 'unblock' })}>{c.status === 'ACTIVE' ? 'Заблокировать' : 'Разблокировать'}</button></div></div>)}</div>}
  </div>;
}
