import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfinitePostsData } from '@/features/post/hooks/queries/useInfinitePosts';
import type { PostSortOrder } from '@/types';

import Fallback from '@/components/Fallback';
import Loader from '@/components/Loader';
import PostItem from './PostItem';
import Nodata from '@/components/Nodata';

export default function PostFeed({
	authorId,
	date,
	sortOrder = 'latest'
}: {
	authorId?: string;
	date?: Date | null;
	sortOrder?: PostSortOrder;
}) {
	const { data, error, isPending, fetchNextPage, isFetchingNextPage } =
		useInfinitePostsData({ authorId, date, sortOrder });
	const { ref, inView } = useInView();

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [inView, fetchNextPage]);

	if (error) return <Fallback />;
	if (isPending) return <Loader />;

	const hasPosts = data.pages.some(page => page.length > 0);
	if (!hasPosts) {
		return <Nodata />;
	}

	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			{data.pages.map(page =>
				page.map(postId => (
					<PostItem key={postId} postId={postId} type="FEED" />
				))
			)}
			{isFetchingNextPage && <Loader />}
			<div ref={ref}></div>
		</div>
	);
}
