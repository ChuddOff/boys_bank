import { Link } from 'react-router-dom';
export function NotFoundPage(){return <div className="grid min-h-[60vh] place-items-center text-center"><div><h1 className="text-7xl font-black">404</h1><p className="mt-3 text-black/60">Страница не найдена</p><Link className="btn mt-6" to="/dashboard">На dashboard</Link></div></div>}
