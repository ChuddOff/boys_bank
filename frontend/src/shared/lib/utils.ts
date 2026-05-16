import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
export const money = (value = 0, currency = 'RUB') => new Intl.NumberFormat('ru-RU', { style: 'currency', currency }).format(value);
export const date = (value: string) => new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
export const newOperationId = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
