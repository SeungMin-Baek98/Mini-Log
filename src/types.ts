import { type Database } from './database.types';

/** Supabase Post 타입 정의 */
export type PostEntity = Database['public']['Tables']['post']['Row'];
export type ProfileEntity = Database['public']['Tables']['profile']['Row'];
export type Post = PostEntity & { author: ProfileEntity; isLiked: boolean };

/** useMutation 콜백 타입 정의 */
export type UseMutationCallback = {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
	onMutate?: () => void;
	onSettled?: () => void;
};
