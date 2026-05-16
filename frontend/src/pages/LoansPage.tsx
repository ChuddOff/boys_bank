import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock3, FileSignature, Percent, ShieldCheck, Sparkles } from 'lucide-react';
import { bankApi } from '../shared/api/bank';
import { EmptyState, LoadingState } from '../shared/components/State';
import { date, money } from '../shared/lib/utils';
import type { Loan } from '../shared/types/bank';

const demoOffers = [
  { name: 'Быстрый старт', rate: 15.9, amount: 250000, term: 24, tag: 'предодобрено' },
  { name: 'Большая покупка', rate: 17.4, amount: 750000, term: 48, tag: 'популярно' },
  { name: 'Рефинанс', rate: 14.8, amount: 1200000, term: 60, tag: 'лучшая ставка' },
];

const steps = [
  { title: 'Заявка отправлена', text: 'Анкета и сумма уходят в кредитный модуль.', icon: FileSignature },
  { title: 'Решение банка', text: 'Витрина показывает статус, ставку и срок.', icon: ShieldCheck },
  { title: 'Принять условия', text: 'Демо-кнопка фиксирует выбранное предложение.', icon: CheckCircle2 },
];

export function LoansPage() {
  const q = useQuery({ queryKey: ['loans'], queryFn: bankApi.loans });
  const [acceptedOffer, setAcceptedOffer] = useState<string | null>(null);
  const [amount, setAmount] = useState(450000);
  const [term, setTerm] = useState(36);
  const calculatedRate = amount > 900000 ? 16.9 : amount > 400000 ? 15.9 : 14.9;
  const monthlyPayment = useMemo(() => calcMonthlyPayment(amount, term, calculatedRate), [amount, term, calculatedRate]);

  if (q.isLoading) return <LoadingState />;

  const loans = q.data ?? [];
  const approvedCount = loans.filter((loan) => loan.status === 'APPROVED').length;
  const pendingCount = loans.filter((loan) => loan.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="card bg-ink text-white">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-white/55">Кредитная витрина Boys Bank</p>
              <h2 className="mt-2 text-4xl font-black">Заявка, решение, ставка и принятие оффера</h2>
              <p className="mt-4 max-w-2xl text-white/65">
                Раздел выглядит как наполненный продукт: можно отправить настоящую заявку в API, увидеть статус и понажимать демо-офферы.
              </p>
            </div>
            <Link className="rounded-2xl bg-fintech px-5 py-3 text-sm font-black text-ink transition hover:-translate-y-0.5" to="/loans/new">
              Подать заявку
            </Link>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <LoanMetric label="Всего заявок" value={loans.length.toString()} />
            <LoanMetric label="На проверке" value={pendingCount.toString()} />
            <LoanMetric label="Одобрено" value={approvedCount.toString()} />
          </div>
        </div>

        <div className="card bg-fintech">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6" />
            <h3 className="text-2xl font-black">Предодобрено</h3>
          </div>
          <p className="mt-4 text-black/70">Персональная ставка от <b>14,8%</b> при заполненном профиле и активной истории операций.</p>
          <Link className="btn mt-6 w-full" to="/profile">Усилить профиль</Link>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <div className="card">
          <div className="mb-5 flex items-center gap-3">
            <Percent className="h-5 w-5" />
            <div>
              <h3 className="text-xl font-black">Калькулятор ставки</h3>
              <p className="text-sm text-black/50">Локальный расчет для презентации интерфейса</p>
            </div>
          </div>
          <div className="space-y-5">
            <Range label="Сумма" value={amount} min={50000} max={1500000} step={50000} suffix="₽" onChange={setAmount} />
            <Range label="Срок" value={term} min={6} max={84} step={6} suffix="мес" onChange={setTerm} />
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-3xl bg-black/[0.04] p-4">
              <p className="text-sm text-black/50">Ставка</p>
              <b className="text-3xl">{calculatedRate}%</b>
            </div>
            <div className="rounded-3xl bg-black/[0.04] p-4">
              <p className="text-sm text-black/50">Платеж</p>
              <b className="text-3xl">{money(monthlyPayment)}</b>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-black">Кредитный конвейер</h3>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {steps.map(({ title, text, icon: Icon }, index) => (
              <div className="rounded-3xl border border-black/5 p-4" key={title}>
                <div className="mb-4 flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-fintech"><Icon className="h-5 w-5" /></span>
                  <span className="badge">0{index + 1}</span>
                </div>
                <b>{title}</b>
                <p className="mt-2 text-sm text-black/55">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black">Демо-офферы</h3>
            <p className="text-sm text-black/50">Можно нажать «Принять», чтобы показать финальный шаг кредитного сценария</p>
          </div>
          {acceptedOffer && <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-800">Принято: {acceptedOffer}</span>}
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {demoOffers.map((offer) => (
            <div className="rounded-3xl border border-black/5 bg-black/[0.03] p-5" key={offer.name}>
              <span className="badge">{offer.tag}</span>
              <h4 className="mt-4 text-2xl font-black">{offer.name}</h4>
              <p className="mt-2 text-black/55">{money(offer.amount)} на {offer.term} мес.</p>
              <p className="mt-5 text-4xl font-black">{offer.rate}%</p>
              <button className="btn mt-5 w-full" onClick={() => setAcceptedOffer(offer.name)}>
                {acceptedOffer === offer.name ? 'Условия приняты' : 'Принять условия'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl font-black">Мои заявки</h2>
          <Link className="btn-secondary" to="/loans/new">Новая заявка</Link>
        </div>
        {!loans.length ? <EmptyState title="Заявок нет" /> : <div className="grid gap-3">{loans.map((loan) => <LoanCard loan={loan} key={loan.id} />)}</div>}
      </section>
    </div>
  );
}

function LoanCard({ loan }: { loan: Loan }) {
  return (
    <div className="card flex flex-wrap items-center justify-between gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <b className="text-2xl">{money(loan.amount)}</b>
          <span className={statusClass(loan.status)}>{statusLabel(loan.status)}</span>
        </div>
        <p className="mt-2 text-black/55">{loan.purpose || 'Потребительский кредит'} · {date(loan.createdAt)}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 text-right md:grid-cols-3">
        <div><p className="text-xs text-black/45">Ставка</p><b>{loan.annualRate}%</b></div>
        <div><p className="text-xs text-black/45">Срок</p><b>{loan.termMonths} мес.</b></div>
        <div><p className="text-xs text-black/45">Этап</p><b className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" /> {loan.status === 'PENDING' ? 'скоринг' : 'готово'}</b></div>
      </div>
    </div>
  );
}

function LoanMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white/10 p-4">
      <p className="text-sm text-white/55">{label}</p>
      <b className="text-3xl">{value}</b>
    </div>
  );
}

function Range({ label, value, min, max, step, suffix, onChange }: { label: string; value: number; min: number; max: number; step: number; suffix: string; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <div className="mb-2 flex justify-between text-sm font-semibold"><span>{label}</span><span>{value.toLocaleString('ru-RU')} {suffix}</span></div>
      <input className="w-full accent-black" type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function calcMonthlyPayment(amount: number, term: number, annualRate: number) {
  const monthlyRate = annualRate / 100 / 12;
  return Math.round((amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term)));
}

function statusLabel(status: Loan['status']) {
  return status === 'APPROVED' ? 'Одобрено' : status === 'REJECTED' ? 'Отказ' : 'На одобрении';
}

function statusClass(status: Loan['status']) {
  const base = 'rounded-full px-3 py-1 text-xs font-bold';
  if (status === 'APPROVED') return `${base} bg-green-100 text-green-800`;
  if (status === 'REJECTED') return `${base} bg-red-100 text-red-700`;
  return `${base} bg-amber-100 text-amber-800`;
}
