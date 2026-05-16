import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, HeartHandshake, PawPrint, ShieldCheck, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { bankApi } from '../shared/api/bank';
import { EmptyState, ErrorState, LoadingState } from '../shared/components/State';
import { newOperationId } from '../shared/lib/utils';
import { DonationCampaign } from '../shared/types/bank';
import { Field } from './LoginPage';

const schema = z.object({
  fromAccountId: z.coerce.number().positive('Выберите счет списания'),
  amount: z.coerce.number().min(10, 'Минимум 10 ₽'),
  message: z.string().max(160).optional(),
});

type FormInput = z.input<typeof schema>;
type Form = z.output<typeof schema>;

const quickAmounts = [100, 300, 500, 1000];

export function DonationsPage() {
  const qc = useQueryClient();
  const campaigns = useQuery({ queryKey: ['donation-campaigns'], queryFn: bankApi.donationCampaigns });
  const accounts = useQuery({ queryKey: ['accounts'], queryFn: bankApi.accounts });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const form = useForm<FormInput, unknown, Form>({ resolver: zodResolver(schema), defaultValues: { amount: 300, message: 'Благотворительный перевод из Boys Bank' } });

  const selected = useMemo(() => campaigns.data?.find((campaign) => campaign.id === selectedId) ?? campaigns.data?.[0], [campaigns.data, selectedId]);
  const sourceAccounts = accounts.data?.filter((account) => account.active && account.type !== 'DONATION') ?? [];
  const currentAccount = sourceAccounts.find((account) => account.id === Number(form.watch('fromAccountId')));

  const donate = useMutation({
    mutationFn: (data: Form) => {
      if (!selected) throw new Error('Выберите фонд');
      return bankApi.donate({ ...data, campaignId: selected.id, operationId: newOperationId() });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['donation-campaigns'] });
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['transactions'] });
      form.reset({ ...form.getValues(), amount: 300 });
    },
  });

  if (campaigns.isLoading || accounts.isLoading) return <LoadingState />;
  if (campaigns.error) return <ErrorState error={campaigns.error} />;
  if (accounts.error) return <ErrorState error={accounts.error} />;

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[2rem] bg-ink text-white shadow-soft">
        <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[1.2fr_.8fr] lg:p-10">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white/75">
              <HeartHandshake className="h-4 w-4" /> Добрые переводы
            </div>
            <h2 className="text-3xl font-black sm:text-4xl">Благотворительность в один тап</h2>
            <p className="mt-3 max-w-2xl text-white/65">Выберите проверенное направление, счет списания и сумму. Для демо-проекта перевод проходит внутри Boys Bank на специальные донатные счета фондов.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <HeroMetric label="Фондов" value={String(campaigns.data?.length ?? 0)} />
            <HeroMetric label="Минимальный перевод" value="10 ₽" />
          </div>
        </div>
      </section>

      {!campaigns.data?.length ? <EmptyState /> : (
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="grid gap-4 md:grid-cols-2">
            {campaigns.data.map((campaign) => <CampaignCard campaign={campaign} selected={selected?.id === campaign.id} onSelect={() => setSelectedId(campaign.id)} key={campaign.id} />)}
          </div>

          <aside className="card h-fit lg:sticky lg:top-28">
            <div className="mb-4 flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-fintech"><Sparkles className="h-5 w-5" /></div>
              <div>
                <h3 className="text-xl font-black">Перевести фонду</h3>
                <p className="text-sm text-black/55">Сейчас выбран: {selected?.title ?? 'выберите фонд'}</p>
              </div>
            </div>
            <form className="space-y-4" onSubmit={form.handleSubmit((data) => donate.mutate(data))}>
              <Field label="Счет списания" error={form.formState.errors.fromAccountId?.message}>
                <select className="input" {...form.register('fromAccountId')}>
                  <option value="">Выберите счет</option>
                  {sourceAccounts.map((account) => <option value={account.id} key={account.id}>{account.iban} · {account.balance} {account.currency}</option>)}
                </select>
              </Field>
              <Field label="Сумма" error={form.formState.errors.amount?.message}>
                <input className="input" inputMode="decimal" {...form.register('amount')} />
              </Field>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((amount) => <button className="rounded-2xl bg-black/5 px-2 py-2 text-sm font-bold transition hover:bg-fintech" type="button" onClick={() => form.setValue('amount', amount)} key={amount}>{amount} ₽</button>)}
              </div>
              <Field label="Сообщение фонду">
                <textarea className="input min-h-24 resize-none" {...form.register('message')} />
              </Field>
              {currentAccount && <p className="rounded-2xl bg-black/5 p-3 text-sm text-black/55">Баланс выбранного счета: {currentAccount.balance} {currentAccount.currency}</p>}
              {donate.error && <p className="text-sm font-semibold text-red-600">{donate.error.message}</p>}
              {donate.isSuccess && <p className="text-sm font-semibold text-green-700">Спасибо! Пожертвование отправлено.</p>}
              <button className="btn w-full" disabled={!selected || donate.isPending}>Отправить пожертвование</button>
            </form>
          </aside>
        </section>
      )}
    </div>
  );
}

function CampaignCard({ campaign, selected, onSelect }: { campaign: DonationCampaign; selected: boolean; onSelect: () => void }) {
  const Icon = campaign.category?.toLowerCase().includes('живот') ? PawPrint : HeartHandshake;
  return (
    <article className={`card flex flex-col transition ${selected ? 'ring-2 ring-ink' : 'hover:-translate-y-1'}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-fintech"><Icon className="h-6 w-6" /></div>
        <span className="badge text-right">{campaign.category ?? 'Помощь'}</span>
      </div>
      <h3 className="text-2xl font-black">{campaign.title}</h3>
      <p className="mt-3 text-sm leading-6 text-black/60">{campaign.description}</p>
      {campaign.impact && <p className="mt-4 rounded-2xl bg-black/5 p-3 text-sm text-black/60"><ShieldCheck className="mr-2 inline h-4 w-4" />{campaign.impact}</p>}
      <div className="mt-auto pt-5">
        <div className="mb-4 flex items-center justify-between text-sm"><span className="text-black/45">Уже собрано в Boys Bank</span><b>{campaign.collectedAmount} ₽</b></div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button className="btn flex-1" onClick={onSelect}>Выбрать фонд</button>
          {campaign.sourceUrl && <a className="btn-secondary flex-1" href={campaign.sourceUrl} target="_blank" rel="noreferrer"><ExternalLink className="mr-2 h-4 w-4" />Сайт</a>}
        </div>
      </div>
    </article>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-3xl bg-white/10 p-4"><p className="text-sm text-white/55">{label}</p><b className="mt-1 block text-2xl">{value}</b></div>;
}
