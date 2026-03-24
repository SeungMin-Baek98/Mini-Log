import { useCallback, useEffect } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

import { signOut } from '@/features/auth/api/auth';
import {
	clearSessionStartedAt,
	ensureSessionStartedAt,
	getSessionRemainingMs,
	isSessionExpired,
	syncSessionStartedAt
} from '@/features/auth/lib/session-expiration';
import { useProfileData } from '@/features/profile/hooks/queries/useProfileData';
import { useIsSessionLoaded, useSession, useSetSession } from '@/store/session';

import supabase from '@/utils/supabase';
import GlobalLoader from '@/components/GlobalLoader';

export default function SessionProvider({
	children
}: {
	children: React.ReactNode;
}) {
	const session = useSession();
	const isSessionLoaded = useIsSessionLoaded();
	const setSession = useSetSession();

	const { data: profile, isLoading: isProfileLoading } = useProfileData(
		session?.user.id
	);

	const expireSession = useCallback(async () => {
		clearSessionStartedAt();
		await signOut();
		setSession(null);

		toast.info('로그인 후 24시간이 지나 자동으로 로그아웃되었어요.', {
			description: '다시 로그인해주세요.',
			id: 'session-expired',
			position: 'top-center'
		});
	}, [setSession]);

	const handleAuthStateChange = useCallback(
		async (event: AuthChangeEvent, nextSession: Session | null) => {
			const startedAt = syncSessionStartedAt(event, nextSession);

			if (!nextSession) {
				setSession(null);
				return;
			}

			if (startedAt && isSessionExpired(startedAt)) {
				await expireSession();
				return;
			}

			setSession(nextSession);
		},
		[expireSession, setSession]
	);

	useEffect(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, session) => {
			void handleAuthStateChange(event, session);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [handleAuthStateChange]);

	useEffect(() => {
		if (!session) return;

		const startedAt = ensureSessionStartedAt(session);
		const remainingSessionMs = getSessionRemainingMs(startedAt);

		if (remainingSessionMs <= 0) {
			void expireSession();
			return;
		}

		const timerId = window.setTimeout(() => {
			void expireSession();
		}, remainingSessionMs);

		return () => {
			window.clearTimeout(timerId);
		};
	}, [expireSession, session]);

	if (!isSessionLoaded) return <GlobalLoader />;
	if (isProfileLoading) return <GlobalLoader />;

	return children;
}
