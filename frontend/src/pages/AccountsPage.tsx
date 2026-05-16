import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Landmark, PiggyBank, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { bankApi } from '../shared/api/bank';
import { EmptyState, ErrorState, LoadingState } from '../shared/components/State';
import { money } from '../shared/lib/utils';
import { AccountType } from '../shared/types/bank';
import { Field } from './LoginPage';

const products = [
  { name: 'Boys Everyday', type: 'CURRENT' as AccountType, icon: Landmark, text: 'Для зарплаты, платежей, переводов и ежедневных покупок.', perks: ['100 переводов/мес', 'Мгновенные пополнения', 'Базовые лимиты'] },
  { name: 'Boys Save', type: 'SAVINGS' as AccountType, icon: PiggyBank, text: 'Накопительный счет с отдельной копилкой и подсказками по цели.', perks: ['25 переводов/мес', 'Цели накопления', 'Отдельная аналитика'] },
  { name: 'Boys Premium', type: 'CURRENT' as AccountType, icon: ShieldCheck, text: 'Расширенный пакет для крупных переводов и премиальных карт.', perks: ['300 переводов/мес', 'Приоритетная поддержка', 'Повышенные лимиты'] },
];
const schema = z.object({ productName: z.string(), type: z.string(), currency: z.string().length(3), packageName: z.string().min(2) });
type Form = z.infer<typeof schema>;

export function AccountsPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['accounts'], queryFn: bankApi.accounts });
  const form = useForm<Form>({ resolver: zodResolver(schema), defaultValues: { ...products[0], currency: 'RUB', packageName: 'Стандарт' } });
  const selected = products.find((p) => p.name === form.watch('productName')) ?? products[0];
  const create = useMutation({ mutationFn: (data: Form) => bankApi.createAccount(data), onSuccess: () => qc.invalidateQueries({ queryKey: ['accounts'] }) });

  if (q.isLoading) return <LoadingState />;
  if (q.error) return <ErrorState error={q.error} />;

  return <div className="space-y-5">
    <div><h2 className="text-3xl font-black">Счета</h2><p className="mt-2 text-black/55">Теперь счет открывается как банковский продукт: выберите назначение, пакет и валюту.</p></div>
    <section className="grid gap-4 lg:grid-cols-[1.3fr_.9fr]">
      <div className="grid gap-3 md:grid-cols-3">{products.map(({ icon: Icon, ...p }) => <button key={p.name} className={`card text-left transition ${selected.name === p.name ? 'ring-2 ring-ink' : 'hover:-translate-y-1'}`} onClick={() => form.reset({ productName: p.name, type: p.type, currency: form.getValues('currency'), packageName: p.name.includes('Premium') ? 'Премиум' : 'Стандарт' })}>
        <Icon className="mb-4 h-6 w-6" /><b>{p.name}</b><p className="mt-2 text-sm text-black/55">{p.text}</p><div className="mt-4 space-y-1">{p.perks.map((perk) => <span className="badge mr-1" key={perk}>{perk}</span>)}</div>
      </button>)}</div>
      <form className="card space-y-4" onSubmit={form.handleSubmit((data) => create.mutate(data))}>
        <h3 className="text-xl font-black">Заявка на счет</h3>
        <Field label="Продукт"><input className="input" readOnly {...form.register('productName')} /></Field>
        <div className="grid gap-3 md:grid-cols-2"><Field label="Валюта"><select className="input" {...form.register('currency')}><option>RUB</option><option>USD</option><option>EUR</option></select></Field><Field label="Пакет"><select className="input" {...form.register('packageName')}><option>Стандарт</option><option>Премиум</option><option>Семейный</option></select></Field></div>
        {create.error && <p className="text-red-600">{create.error.message}</p>}<button className="btn-secondary">Открыть выбранный счет</button>
      </form>
    </section>
    {!q.data?.length ? <EmptyState /> : <div className="grid gap-4 md:grid-cols-2">{q.data.map((a) => <Link className="card transition hover:-translate-y-1" to={`/accounts/${a.id}`} key={a.id}><div className="flex justify-between"><span className="badge">{a.productName ?? a.type}</span><span>{a.active ? 'Активен' : 'Закрыт'}</span></div><h3 className="mt-8 text-3xl font-black">{money(a.balance, a.currency)}</h3><p className="mt-2 text-black/50">{a.iban}</p><p className="mt-4 text-sm text-black/55">Пакет: {a.packageName ?? 'Стандарт'} · лимит {a.monthlyTransfersLimit ?? 100} переводов/мес</p></Link>)}</div>}
  </div>;
}
