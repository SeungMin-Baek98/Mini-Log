import { Link } from 'react-router';

import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';

import { formatTimeAgo } from '@/lib/time';
import { useSession } from '@/store/session';
import { usePostByIdData } from '@/hooks/queries/usePostByIdData';
import { useOpenShowOriginImagesModal } from '@/store/showOriginImagesModal';

import defaultAvatar from '@/assets/default-avatar.jpg';

import DeletePostButton from './DeletePostButton';
import EditPostButton from './EditPostButton';
import Loader from '../Loader';
import Fallback from '../Fallback';
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

	const handleShowOriginImagesModalOpen = (index: number) => {
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
			className={`flex flex-col gap-4 pb-8 ${type === 'FEED' && 'border-b'}`}>
			{/* 1. 유저 정보, 수정/삭제 버튼 */}
			<div className="flex justify-between">
				{/* 1-1. 유저 정보 */}
				<div className="flex items-start gap-4">
					<Link to={`profile/${post.author_id}`}>
						<img
							src={post.author.avatar_url || defaultAvatar}
							alt={`${post.author.nickname}의 프로필 이미지`}
							className="h-10 w-10 rounded-full object-cover"
						/>
					</Link>
					<div>
						<div className="font-bold hover:underline">
							{post.author.nickname}
						</div>
						<div className="text-muted-foreground text-sm">
							{formatTimeAgo(post.created_at)}
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
						<div className="line-clamp-2 break-words whitespace-pre-wrap">
							{post.content}
						</div>
					</Link>
				) : (
					<div className="break-words whitespace-pre-wrap">{post.content}</div>
				)}

				{/* 2-2. 이미지 캐러셀 */}
				<Carousel className="relative">
					<CarouselContent>
						{post.image_urls?.map((url, index) => (
							<CarouselItem className="basis-full sm:basis-1/3" key={index}>
								<div className="relative mx-auto aspect-square w-full max-w-[480px] overflow-hidden rounded-xl bg-neutral-100">
									<img
										src={url}
										onClick={() => handleShowOriginImagesModalOpen(index)}
										alt={`게시 이미지 ${index + 1}`}
										className="h-full w-full object-cover"
									/>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
			</div>

			{/* 3. 좋아요, 댓글 버튼 */}
			<div className="flex gap-2">
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
