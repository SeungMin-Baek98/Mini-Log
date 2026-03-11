import { Link } from 'react-router';

import {
	Carousel,
	CarouselContent,
	CarouselItem
} from '@/components/ui/carousel';

import { formatTimeAgo } from '@/lib/time';
import { MAX_IMAGE_WIDTH_PX } from '@/lib/constants';
import { useSession } from '@/store/session';
import { usePostByIdData } from '@/features/post/hooks/queries/usePostByIdData';
import { useOpenShowOriginImagesModal } from '@/store/showOriginImagesModal';

import defaultAvatar from '@/assets/default-avatar.jpg';

import DeletePostButton from './DeletePostButton';
import EditPostButton from './EditPostButton';
import Loader from '@/components/Loader';
import Fallback from '@/components/Fallback';
import LikePostButton from './LikePostButton';
import CommentButton from './CommentButton';

export default function PostItem({
	postId,
	type
}: {
	postId: number;
	type: 'FEED' | 'DETAIL';
}) {
	const session = useSession();
	const userId = session?.user.id;
	const { data: post, isPending, error } = usePostByIdData({ postId, type });
	const openShowOriginImagesModal = useOpenShowOriginImagesModal();

	const handleShowOriginImagesModal = (index: number) => {
		if (!post) return;

		if (!post.image_urls?.length) return;

		openShowOriginImagesModal({
			images: post.image_urls,
			initialIndex: index
		});
	};

	if (error) return <Fallback />;
	if (isPending) return <Loader />;

	const isMine = userId === post.author_id;

	return (
		<div
			className={`border-border/80 bg-card/95 flex flex-col gap-5 overflow-hidden rounded-[1.75rem] border p-5 shadow-[0_18px_40px_rgba(96,76,48,0.06)] sm:p-6 ${
				type === 'DETAIL' ? 'sm:p-7' : ''
			}`}>
			{/* 1. 유저 정보, 수정/삭제 버튼 */}
			<div className="flex justify-between gap-4">
				{/* 1-1. 유저 정보 */}
				<div className="flex items-start gap-4">
					<Link to={`/profile/${post.author_id}`}>
						<img
							src={post.author.avatar_url || defaultAvatar}
							alt={`${post.author.nickname}의 프로필 이미지`}
							className="h-12 w-12 rounded-full border border-white/80 object-cover shadow-[0_10px_24px_rgba(96,76,48,0.12)]"
						/>
					</Link>
					<div className="space-y-1">
						<div className="font-semibold hover:underline">
							{post.author.nickname}
						</div>
						<div className="text-muted-foreground text-sm">
							{type === 'FEED'
								? formatTimeAgo(post.created_at)
								: new Date(post.created_at).toLocaleDateString()}
						</div>
					</div>
				</div>

				{/* 1-2. 수정/삭제 버튼 */}

				<div className="text-muted-foreground flex text-sm">
					{isMine && (
						<>
							<EditPostButton {...post} />
							<DeletePostButton id={post.id} />
						</>
					)}
				</div>
			</div>

			{/* 2. 컨텐츠, 이미지 캐러셀 */}
			<div className="flex cursor-pointer flex-col gap-5">
				{/* 2-1. 컨텐츠 */}
				{type === 'FEED' ? (
					<Link to={`/post/${post.id}`}>
						<div className="line-clamp-3 text-[15px] leading-7 break-words whitespace-pre-wrap sm:text-base">
							{post.content}
						</div>
					</Link>
				) : (
					<div className="text-[15px] leading-7 break-words whitespace-pre-wrap sm:text-base">
						{post.content}
					</div>
				)}

				{/* 2-2. 이미지 캐러셀 */}
				<Carousel className="relative">
					<CarouselContent>
						{post.image_urls?.map((url, index) => (
							<CarouselItem className="basis-full sm:basis-1/3" key={index}>
								<div
									className="bg-muted/70 relative mx-auto aspect-square w-full overflow-hidden rounded-[1.35rem]"
									style={{ maxWidth: `${MAX_IMAGE_WIDTH_PX}px` }}>
									<img
										src={url}
										onClick={() => handleShowOriginImagesModal(index)}
										alt={`게시 이미지 ${index + 1}`}
										className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
									/>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
			</div>

			{/* 3. 좋아요, 댓글 버튼 */}
			<div className="border-border/70 flex gap-2 border-t pt-4">
				{/* 3-1. 좋아요 버튼 */}
				<LikePostButton
					id={post.id}
					likeCount={post.like_count}
					isLiked={post.isLiked}
				/>
				{/* 3-2. 댓글 버튼 */}
				<CommentButton
					id={post.id}
					commentCount={post.comment_count}
					disabled={type === 'DETAIL'}
				/>
			</div>
		</div>
	);
}
