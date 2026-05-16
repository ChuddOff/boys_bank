import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';
import { authApi } from '../features/auth/api';
import { useAuthStore } from '../features/auth/store';
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30_000 } } });
function BootstrapAuth({ children }: { children: ReactNode }) {
  const { token, setUser, logout } = useAuthStore();
  useEffect(() => { if (token) authApi.me().then(setUser).catch(logout); }, [token, setUser, logout]);
  return <>{children}</>;
}
export function Providers({ children }: { children: ReactNode }) { return <QueryClientProvider client={queryClient}><BootstrapAuth>{children}</BootstrapAuth></QueryClientProvider>; }
