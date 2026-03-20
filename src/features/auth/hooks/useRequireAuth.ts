import { toast } from 'sonner';

import { useSession } from '@/store/session';

type RequireAuthOptions = {
	message?: string;
};

export function useRequireAuth() {
	const session = useSession();

	return (options?: RequireAuthOptions) => {
		if (session) return true;

		toast.info(options?.message ?? '로그인 후 사용할 수 있어요.', {
			id: 'auth-required',
			position: 'top-center'
		});

		return false;
	};
}
