import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BadgeCheck, Bell, BriefcaseBusiness, Home, IdCard, ShieldCheck, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { bankApi } from '../shared/api/bank';
import { LoadingState } from '../shared/components/State';
import { Field } from './LoginPage';

const schema = z.object({ firstName: z.string().min(2), lastName: z.string().min(2), email: z.string().email() });
type Form = z.infer<typeof schema>;

const profileBlocks = [
  { title: 'Паспорт', text: 'Документ подтвержден для заявок', icon: IdCard, done: true },
  { title: 'Адрес', text: 'Доставка карт и KYC-анкета', icon: Home, done: true },
  { title: 'Работа', text: 'Повышает шанс одобрения кредита', icon: BriefcaseBusiness, done: false },
  { title: 'Безопасность', text: '2FA, антифрод и лимиты операций', icon: ShieldCheck, done: true },
];

const interests = ['Кэшбэк в кафе', 'Путешествия', 'Инвестиции', 'Семейный бюджет', 'Игры и подписки', 'Авто'];

export function ProfilePage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['profile'], queryFn: bankApi.profile });
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    values: q.data ? { firstName: q.data.firstName, lastName: q.data.lastName, email: q.data.email } : undefined,
  });
  const m = useMutation({ mutationFn: bankApi.updateProfile, onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }) });

  if (q.isLoading) return <LoadingState />;

  const completed = profileBlocks.filter((block) => block.done).length;
  const completion = Math.round((completed / profileBlocks.length) * 100);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <div className="card bg-ink text-white">
          <p className="text-white/55">Профиль клиента</p>
          <h2 className="mt-2 text-4xl font-black">{q.data?.firstName} {q.data?.lastName}</h2>
          <p className="mt-4 text-white/65">Заполненный профиль делает интерфейс живым, открывает персональные предложения и повышает шанс кредитного одобрения.</p>
          <div className="mt-8 rounded-3xl bg-white/10 p-4">
            <div className="mb-2 flex justify-between text-sm"><span>Заполненность</span><b>{completion}%</b></div>
            <div className="h-3 rounded-full bg-white/10"><div className="h-3 rounded-full bg-fintech" style={{ width: `${completion}%` }} /></div>
          </div>
        </div>

        <div className="card">
          <h2 className="mb-5 text-3xl font-black">Основные данные</h2>
          <form className="space-y-4" onSubmit={form.handleSubmit((data) => m.mutate(data))}>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Имя"><input className="input" {...form.register('firstName')} /></Field>
              <Field label="Фамилия"><input className="input" {...form.register('lastName')} /></Field>
            </div>
            <Field label="Email"><input className="input" {...form.register('email')} /></Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Телефон"><input className="input" value="+7 999 123-45-67" readOnly /></Field>
              <Field label="Город"><input className="input" value="Москва" readOnly /></Field>
            </div>
            {m.error && <p className="text-red-600">{m.error.message}</p>}
            {m.isSuccess && <p className="text-green-700">Сохранено</p>}
            <button className="btn">Сохранить</button>
          </form>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        {profileBlocks.map(({ title, text, icon: Icon, done }) => (
          <div className="card" key={title}>
            <div className="mb-5 flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-fintech"><Icon className="h-5 w-5" /></span>
              <span className={done ? 'rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800' : 'badge'}>{done ? 'Готово' : 'Добавить'}</span>
            </div>
            <b>{title}</b>
            <p className="mt-2 text-sm text-black/55">{text}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <div className="card">
          <div className="mb-5 flex items-center gap-3">
            <Star className="h-5 w-5" />
            <h3 className="text-xl font-black">Интересы и рекомендации</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => <span className="badge cursor-default bg-fintech/80 text-ink" key={interest}>{interest}</span>)}
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <Recommendation title="Кредитный лимит" text="Предложение до 750 000 ₽ появится после добавления места работы." />
            <Recommendation title="Премиум-реклама" text="Boys Plus: больше кэшбэка, страховка поездок и приоритетная поддержка." />
          </div>
        </div>

        <div className="card bg-fintech">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5" />
            <h3 className="text-xl font-black">Настройки уведомлений</h3>
          </div>
          <div className="mt-5 space-y-3">
            <Toggle title="Push по операциям" checked />
            <Toggle title="Одобрение кредита" checked />
            <Toggle title="Рекламные предложения Boys Bank" checked />
            <Toggle title="Еженедельный дайджест" />
          </div>
        </div>
      </section>

      <section className="card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BadgeCheck className="h-6 w-6 text-green-700" />
            <div>
              <h3 className="text-xl font-black">KYC-витрина</h3>
              <p className="text-sm text-black/55">Данные выглядят заполненными, но критичные поля по-прежнему сохраняются только через существующий API профиля.</p>
            </div>
          </div>
          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-800">Проверка пройдена</span>
        </div>
      </section>
    </div>
  );
}

function Recommendation({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-black/5 bg-black/[0.03] p-4">
      <b>{title}</b>
      <p className="mt-2 text-sm text-black/55">{text}</p>
    </div>
  );
}

function Toggle({ title, checked = false }: { title: string; checked?: boolean }) {
  return (
    <label className="flex items-center justify-between rounded-2xl bg-white/70 p-3 text-sm font-semibold">
      <span>{title}</span>
      <input className="h-5 w-5 accent-black" type="checkbox" defaultChecked={checked} />
    </label>
  );
}
