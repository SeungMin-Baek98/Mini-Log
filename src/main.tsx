import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { queryClient } from '@/lib/queryClient';
import { Toaster } from './components/ui/sonner.tsx';

createRoot(document.getElementById('root')!).render(
	<QueryClientProvider client={queryClient}>
		<ReactQueryDevtools buttonPosition="bottom-left" />
		<Toaster />
		<App />
	</QueryClientProvider>
);
