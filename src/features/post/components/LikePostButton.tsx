import { useSession } from '@/store/session';
import { HeartIcon } from 'lucide-react';
import { toast } from 'sonner';

import { useRequireAuth } from '@/features/auth/hooks/useRequireAuth';
import useTogglePostLike from '@/features/post/hooks/mutations/useTogglePostLike';

export default function LikePostButton({
	id,
	likeCount,
	isLiked
}: {
	id: number;
	likeCount: number;
	isLiked: boolean;
}) {
	const session = useSession();
	const requireAuth = useRequireAuth();

	const { mutate: togglePostLike, isPending } = useTogglePostLike({
		onError: error => {
			toast.error('좋아요 요청에 실패했습니다', {
				position: 'top-center'
			});
		}
	});

	const handleToggleLike = () => {
		if (
			!requireAuth({
				message: '좋아요는 로그인 후 남길 수 있어요.'
			})
		) {
			return;
		}

		togglePostLike({ postId: id, userId: session!.user.id });
	};

	return (
		<button
			type="button"
			onClick={handleToggleLike}
			disabled={isPending}
			className="hover:bg-muted disabled:text-muted-foreground flex cursor-pointer items-center gap-2 rounded-xl border-1 p-2 px-4 text-sm disabled:cursor-not-allowed">
			<HeartIcon
				className={`h-4 w-4 ${isLiked && 'fill-foreground border-foreground'}`}
			/>
			<span>{likeCount}</span>
		</button>
	);
}
