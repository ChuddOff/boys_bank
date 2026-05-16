import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { bankApi } from '../shared/api/bank';
import { Field } from './LoginPage';
import { EstimateCard, money } from './LoanApplicationPage';

const schema = z.object({
  sourceAccountId: z.coerce.number().positive(),
  amount: z.coerce.number().min(1000),
  termMonths: z.coerce.number().min(1).max(120)
});

type FormInput = z.input<typeof schema>;
type Form = z.output<typeof schema>;

export function DepositApplicationPage() {
  const accounts = useQuery({ queryKey: ['accounts'], queryFn: bankApi.accounts });
  const nav = useNavigate();
  const form = useForm<FormInput, unknown, Form>({ resolver: zodResolver(schema), defaultValues: { termMonths: 12 } });
  const amount = Number(form.watch('amount'));
  const termMonths = Number(form.watch('termMonths'));
  const estimate = useQuery({
    queryKey: ['depositEstimate', amount, termMonths],
    queryFn: () => bankApi.depositEstimate(amount, termMonths),
    enabled: amount >= 1000 && termMonths >= 1 && termMonths <= 120
  });
  const mutation = useMutation({ mutationFn: bankApi.applyDeposit, onSuccess: () => nav('/deposits') });

  return <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
    <div className="card max-w-2xl">
      <h2 className="mb-5 text-3xl font-black">Открыть вклад</h2>
      <form className="space-y-4" onSubmit={form.handleSubmit(d => mutation.mutate(d))}>
        <Field label="Счет списания"><select className="input" {...form.register('sourceAccountId')}><option value="">Выберите</option>{accounts.data?.map(a => <option value={a.id} key={a.id}>{a.iban} · {money(a.balance)}</option>)}</select></Field>
        <Field label="Сумма"><input className="input" {...form.register('amount')} /></Field>
        <Field label="Срок, мес"><input className="input" {...form.register('termMonths')} /></Field>
        <p className="rounded-2xl bg-black/5 p-4 text-sm text-black/60">Ставка подтягивается из банковских условий и фиксируется при открытии вклада.</p>
        {mutation.error && <p className="text-red-600">{mutation.error.message}</p>}
        <button className="btn">Открыть вклад</button>
      </form>
    </div>
    <EstimateCard title="Доход по вкладу" loading={estimate.isFetching} items={estimate.data ? [
      ['Ставка банка', `${estimate.data.annualRate}%`],
      ['Дата окончания', new Date(estimate.data.maturityDate).toLocaleDateString('ru-RU')],
      ['Доход', money(estimate.data.income)],
      ['К выплате', money(estimate.data.projectedPayout)]
    ] : []} />
  </div>;
}
