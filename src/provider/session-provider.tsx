import { useEffect } from 'react';
import { useIsSessionLoaded, useSetSession } from '@/store/session';

import supabase from '@/utils/supabase';
import GlobalLoader from '@/components/global-loader';

export default function SessionProvder({ children }: { children: React.ReactNode }) {
	const setSession = useSetSession();
	const isSessionLoaded = useIsSessionLoaded();

	useEffect(() => {
		supabase.auth.onAuthStateChange((event, session) => {
			setSession(session);
		});
	}, []);

	if (!isSessionLoaded) return <GlobalLoader />;

	return children;
}
