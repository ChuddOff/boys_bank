import { useQuery } from '@tanstack/react-query';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ArrowUpRight, BadgePercent, BellRing, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { bankApi } from '../shared/api/bank';
import { EmptyState, ErrorState, LoadingState } from '../shared/components/State';
import { money } from '../shared/lib/utils';

const fallbackCashflow = [
  { name: 'Пн', amount: 4200, incoming: 16000 },
  { name: 'Вт', amount: 1800, incoming: 0 },
  { name: 'Ср', amount: 7300, incoming: 5200 },
  { name: 'Чт', amount: 2600, incoming: 0 },
  { name: 'Пт', amount: 10900, incoming: 25000 },
  { name: 'Сб', amount: 3900, incoming: 0 },
  { name: 'Вс', amount: 2100, incoming: 0 },
];

const expenseMix = [
  { name: 'Покупки', value: 38, color: '#111111' },
  { name: 'Дом', value: 24, color: '#ffd84d' },
  { name: 'Такси', value: 16, color: '#86efac' },
  { name: 'Подписки', value: 12, color: '#93c5fd' },
  { name: 'Другое', value: 10, color: '#fca5a5' },
];

const offers = [
  { title: 'Boys Black', text: 'Кэшбэк до 7% на кафе, игры и поездки', action: 'Выпустить карту', to: '/cards' },
  { title: 'Кредит за 2 минуты', text: 'Предодобренная ставка от 15,9% годовых', action: 'Посмотреть ставку', to: '/loans' },
  { title: 'Умная копилка', text: 'Автоперевод сдачи во вклад с прогнозом дохода', action: 'Открыть вклад', to: '/deposits' },
];

export function DashboardPage() {
  const accounts = useQuery({ queryKey: ['accounts'], queryFn: bankApi.accounts });
  const tx = useQuery({ queryKey: ['transactions'], queryFn: bankApi.transactions });

  if (accounts.isLoading) return <LoadingState />;
  if (accounts.error) return <ErrorState error={accounts.error} />;

  const accountList = accounts.data ?? [];
  const transactions = tx.data ?? [];
  const total = accountList.reduce((sum, account) => sum + account.balance, 0);
  const outgoing = transactions.filter((item) => item.fromAccountId !== null).reduce((sum, item) => sum + item.amount, 0);
  const incoming = transactions.filter((item) => item.toAccountId !== null).reduce((sum, item) => sum + item.amount, 0);
  const chart = transactions.length
    ? transactions.slice(0, 8).reverse().map((item, index) => ({ name: `#${index + 1}`, amount: item.amount, incoming: item.toAccountId ? item.amount : 0 }))
    : fallbackCashflow;
  const profileScore = Math.min(98, 62 + accountList.length * 8 + transactions.length * 2);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <div className="card overflow-hidden bg-ink text-white">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-white/55">Совокупный баланс</p>
              <h2 className="mt-2 text-5xl font-black tracking-tight">{money(total)}</h2>
              <p className="mt-4 max-w-xl text-white/65">
                Живой обзор Boys Bank: счета, операции, кредиты, вклады и антифрод собраны в одном рабочем кабинете.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4 text-right backdrop-blur">
              <p className="text-sm text-white/60">Финансовый профиль</p>
              <b className="text-4xl">{profileScore}%</b>
              <p className="text-xs text-white/50">готов к персональным офферам</p>
            </div>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <Metric label="Счетов" value={accountList.length.toString()} hint="активные продукты" />
            <Metric label="Входящий поток" value={money(incoming)} hint="по всем операциям" />
            <Metric label="Расходы" value={money(outgoing)} hint="контролируются антифродом" />
          </div>
        </div>

        <div className="card bg-fintech">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white"><Sparkles className="h-5 w-5" /></span>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-black/50">Реклама Boys Bank</p>
              <h3 className="text-2xl font-black">Boys Plus</h3>
            </div>
          </div>
          <p className="mt-5 text-black/70">Подключите премиум-пакет: бесплатные переводы, 2 lounge-прохода и повышенный кэшбэк на выходные.</p>
          <Link className="btn mt-6 w-full" to="/profile">Заполнить профиль</Link>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="card h-96">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black">Динамика операций</h3>
              <p className="text-sm text-black/50">Реальные транзакции или демо-активность для наполненного интерфейса</p>
            </div>
            <span className="badge">Live</span>
          </div>
          {chart.length ? (
            <ResponsiveContainer>
              <AreaChart data={chart}>
                <defs>
                  <linearGradient id="amount" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#ffd84d" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#ffd84d" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => money(Number(value))} />
                <Area type="monotone" dataKey="amount" stroke="#111" fill="url(#amount)" strokeWidth={3} name="Сумма" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <EmptyState title="Нет операций" />}
        </div>

        <div className="card h-96">
          <h3 className="text-xl font-black">Категории расходов</h3>
          <p className="text-sm text-black/50">Витринная аналитика для презентации продукта</p>
          <div className="mt-3 h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={expenseMix} innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {expenseMix.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {expenseMix.map((item) => <span className="badge" key={item.name}>{item.name} · {item.value}%</span>)}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="card xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black">Промо-плитки и сценарии</h3>
              <p className="text-sm text-black/50">Можно быстро понажимать ключевые банковские действия</p>
            </div>
            <BadgePercent className="h-6 w-6" />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {offers.map((offer) => (
              <Link className="rounded-3xl border border-black/5 bg-black/[0.03] p-4 transition hover:-translate-y-1 hover:bg-fintech" to={offer.to} key={offer.title}>
                <ArrowUpRight className="mb-5 h-5 w-5" />
                <b>{offer.title}</b>
                <p className="mt-2 min-h-12 text-sm text-black/55">{offer.text}</p>
                <span className="mt-4 inline-flex text-sm font-black">{offer.action}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <BellRing className="h-5 w-5" />
            <h3 className="text-xl font-black">Лента событий</h3>
          </div>
          <div className="mt-5 space-y-4">
            <Event title="Антифрод активен" text="Подозрительные переводы уходят на ручную проверку." />
            <Event title="Ставка обновлена" text="Персональный кредитный диапазон 15,9–18,4%." />
            <Event title="Профиль почти готов" text="Добавьте данные в профиле для более красивой витрины." />
          </div>
        </div>
      </section>

      <section className="card">
        <div className="mb-4 flex items-center gap-3">
          <TrendingUp className="h-5 w-5" />
          <h3 className="text-xl font-black">Недельный пульс Boys Bank</h3>
        </div>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={fallbackCashflow}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => money(Number(value))} />
              <Bar dataKey="incoming" name="Пополнения" fill="#111111" radius={[12, 12, 0, 0]} />
              <Bar dataKey="amount" name="Списания" fill="#ffd84d" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-3xl bg-white/10 p-4">
      <p className="text-sm text-white/55">{label}</p>
      <b className="mt-1 block text-2xl">{value}</b>
      <p className="text-xs text-white/45">{hint}</p>
    </div>
  );
}

function Event({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-black/5 p-3">
      <b className="text-sm">{title}</b>
      <p className="mt-1 text-sm text-black/55">{text}</p>
    </div>
  );
}
