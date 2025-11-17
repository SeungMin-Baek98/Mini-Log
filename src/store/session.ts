import { create } from 'zustand';
import { combine, devtools } from 'zustand/middleware';
import type { Session } from '@supabase/supabase-js';

type State = {
	isLoaded: boolean;
	session: Session | null;
};

const initialState = {
	isLoaded: false,
	session: null
} as State;

const useSessionStore = create(
	devtools(
		combine(initialState, set => ({
			actions: {
				setSession: (session: Session | null) => {
					set({ session, isLoaded: true });
				}
			}
		})),
		{ name: 'sessionStore' }
	)
);

/** sessionState 접근하는 Custom Hook   */
export const useSession = () => {
	const session = useSessionStore(store => store.session);
	return session;
};

/** 로딩상태를 보관하는 Custom Hook */
export const useIsSessionLoaded = () => {
	const isSessionLoaded = useSessionStore(store => store.isLoaded);
	return isSessionLoaded;
};

/** 세션을 설정하는 Custom Hook */
export const useSetSession = () => {
	const setSession = useSessionStore(store => store.actions.setSession);
	return setSession;
};
