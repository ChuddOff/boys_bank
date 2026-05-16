import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Banknote, CreditCard, Gauge, Gift, Landmark, LogOut, Menu, ShieldAlert, User, WalletCards, X, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../features/auth/store';

const nav = [
  ['/dashboard','Обзор',Gauge], ['/accounts','Счета',WalletCards], ['/transactions','Операции',Banknote], ['/transfers/new','Перевод',Landmark], ['/donations','Добро',Gift], ['/cards','Карты',CreditCard], ['/loans','Кредиты',Landmark], ['/deposits','Вклады',WalletCards], ['/fraud','Антифрод',ShieldAlert], ['/profile','Профиль',User]
] as const;
const mobileNav = nav.slice(0, 5);

export function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const isAdmin = Boolean(user?.roles?.includes('ADMIN'));
  const [menuOpen, setMenuOpen] = useState(false);
  const handleLogout = () => { logout(); navigate('/login'); };

  return <div className="min-h-screen overflow-x-hidden bg-[#f7f7f3] pb-20 lg:pb-0">
    <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-black/5 bg-white/85 p-5 backdrop-blur lg:flex">
      <Brand />
      <DesktopNav isAdmin={isAdmin} />
      <button className="btn mt-auto" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4"/>Выйти</button>
    </aside>

    {menuOpen && <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden" onClick={() => setMenuOpen(false)} />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[min(88vw,22rem)] flex-col bg-white p-5 shadow-2xl transition-transform lg:hidden ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-6 flex items-center justify-between"><Brand compact /><button className="rounded-2xl bg-black/5 p-2" onClick={() => setMenuOpen(false)} aria-label="Закрыть меню"><X className="h-5 w-5" /></button></div>
      <nav className="space-y-1">{nav.map(([to,label,Icon])=><NavItem to={to} label={label} Icon={Icon} onClick={() => setMenuOpen(false)} key={to}/>)}{isAdmin && <NavLink to="/admin" onClick={() => setMenuOpen(false)} className={({isActive})=>`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${isActive?'bg-ink text-white':'text-black/65 hover:bg-black/5'}`}>Admin</NavLink>}</nav>
      <button className="btn mt-auto" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4"/>Выйти</button>
    </aside>

    <main className="lg:pl-72">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-[#f7f7f3]/90 px-4 py-3 backdrop-blur lg:px-10 lg:py-4">
        <div className="flex items-center justify-between gap-3">
          <button className="rounded-2xl bg-white p-2 shadow-soft lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Открыть меню"><Menu className="h-5 w-5" /></button>
          <div className="min-w-0 flex-1"><p className="text-xs text-black/50 sm:text-sm">Добро пожаловать</p><h1 className="truncate text-lg font-black sm:text-xl">{user ? `${user.firstName} ${user.lastName}` : 'Boys Bank'}</h1></div>
          <div className="badge hidden sm:block">{user?.roles?.join(', ')}</div>
        </div>
        <nav className="mt-3 hidden gap-2 overflow-x-auto md:flex lg:hidden">{nav.map(([to,label])=><NavLink className={({isActive})=>`badge whitespace-nowrap ${isActive ? 'bg-ink text-white' : ''}`} to={to} key={to}>{label}</NavLink>)}{isAdmin && <NavLink className="badge whitespace-nowrap" to="/admin" key="/admin">Admin</NavLink>}</nav>
      </header>
      <section className="px-4 py-5 sm:px-6 lg:p-10"><Outlet/></section>
    </main>

    <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 gap-1 rounded-[1.6rem] border border-black/5 bg-white/95 p-2 shadow-2xl backdrop-blur md:hidden">
      {mobileNav.map(([to,label,Icon])=><NavLink to={to} key={to} className={({isActive})=>`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-bold ${isActive ? 'bg-ink text-white' : 'text-black/60'}`}><Icon className="h-4 w-4" />{label}</NavLink>)}
    </nav>
  </div>;
}

function Brand({ compact = false }: { compact?: boolean }) {
  return <Link to="/dashboard" className={`flex items-center gap-3 font-black ${compact ? 'text-xl' : 'mb-8 text-2xl'}`}><span className="grid h-11 w-11 place-items-center rounded-2xl bg-fintech">BB</span>Boys Bank</Link>;
}

function DesktopNav({ isAdmin }: { isAdmin: boolean }) {
  return <nav className="space-y-1">{nav.map(([to,label,Icon])=><NavItem to={to} label={label} Icon={Icon} key={to}/>)}{isAdmin && <NavLink to="/admin" className={({isActive})=>`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${isActive?'bg-ink text-white':'text-black/65 hover:bg-black/5'}`}>Admin</NavLink>}</nav>;
}

function NavItem({ to, label, Icon, onClick }: { to: string; label: string; Icon: LucideIcon; onClick?: () => void }) {
  return <NavLink to={to} onClick={onClick} className={({isActive})=>`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${isActive?'bg-ink text-white':'text-black/65 hover:bg-black/5'}`}><Icon className="h-4 w-4"/>{label}</NavLink>;
}
