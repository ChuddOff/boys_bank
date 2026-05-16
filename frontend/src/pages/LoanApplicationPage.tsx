import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { bankApi } from '../shared/api/bank';
import { Field } from './LoginPage';

const schema = z.object({
  amount: z.coerce.number().min(1000),
  termMonths: z.coerce.number().min(1).max(120),
  purpose: z.string().optional()
});

type FormInput = z.input<typeof schema>;
type Form = z.output<typeof schema>;

export function LoanApplicationPage() {
  const nav = useNavigate();
  const form = useForm<FormInput, unknown, Form>({ resolver: zodResolver(schema), defaultValues: { termMonths: 24 } });
  const amount = Number(form.watch('amount'));
  const termMonths = Number(form.watch('termMonths'));
  const estimate = useQuery({
    queryKey: ['creditEstimate', amount, termMonths],
    queryFn: () => bankApi.creditEstimate(amount, termMonths),
    enabled: amount >= 1000 && termMonths >= 1 && termMonths <= 120
  });
  const mutation = useMutation({ mutationFn: bankApi.applyLoan, onSuccess: () => nav('/loans') });

  return <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
    <div className="card max-w-2xl">
      <h2 className="mb-5 text-3xl font-black">Заявка на кредит</h2>
      <form className="space-y-4" onSubmit={form.handleSubmit(d => mutation.mutate(d))}>
        <Field label="Сумма"><input className="input" {...form.register('amount')} /></Field>
        <Field label="Срок, мес"><input className="input" {...form.register('termMonths')} /></Field>
        <Field label="Цель кредита"><input className="input" placeholder="Например, ремонт или обучение" {...form.register('purpose')} /></Field>
        <p className="rounded-2xl bg-black/5 p-4 text-sm text-black/60">Ставку рассчитывает банк: пользователь больше не может вручную занизить процент.</p>
        {mutation.error && <p className="text-red-600">{mutation.error.message}</p>}
        <button className="btn">Отправить заявку</button>
      </form>
    </div>
    <EstimateCard title="Предварительный расчет" loading={estimate.isFetching} items={estimate.data ? [
      ['Ставка банка', `${estimate.data.annualRate}%`],
      ['Ежемесячный платеж', money(estimate.data.monthlyPayment)],
      ['Всего к возврату', money(estimate.data.totalPayment)],
      ['Переплата', money(estimate.data.overpayment)]
    ] : []} />
  </div>;
}

export function EstimateCard({ title, loading, items }: { title: string; loading: boolean; items: [string, string][] }) {
  return <aside className="card h-fit">
    <h3 className="mb-4 text-2xl font-black">{title}</h3>
    {loading && <p className="text-black/50">Считаем…</p>}
    {!loading && items.length === 0 && <p className="text-black/50">Введите сумму и срок, чтобы увидеть расчет.</p>}
    <dl className="space-y-3">{items.map(([label, value]) => <div className="flex justify-between gap-4" key={label}><dt className="text-black/50">{label}</dt><dd className="font-black">{value}</dd></div>)}</dl>
  </aside>;
}

export function money(value: number) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);
}
