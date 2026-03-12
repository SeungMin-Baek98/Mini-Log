import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfinitePostsData } from '@/features/post/hooks/queries/useInfinitePosts';
import { usePagedPostsData } from '@/features/post/hooks/queries/usePagedPosts';
import type { PostSortOrder } from '@/types';

import Fallback from '@/components/Fallback';
import Loader from '@/components/Loader';
import PostItem from './PostItem';
import Nodata from '@/components/Nodata';
import { Pagination } from '@/components/ui/pagination';

export default function PostFeed({
	authorId,
	date,
	sortOrder = 'latest',
	mode = 'infinite'
}: {
	authorId?: string;
	date?: Date | null;
	sortOrder?: PostSortOrder;
	mode?: 'infinite' | 'paged';
}) {
	const [page, setPage] = useState(1);
	const { ref, inView } = useInView();
	const dateTime = date?.getTime();
	const infiniteQuery = useInfinitePostsData({
		authorId,
		date,
		sortOrder,
		enabled: mode === 'infinite'
	});
	const pagedQuery = usePagedPostsData({
		authorId,
		date,
		sortOrder,
		page,
		enabled: mode === 'paged'
	});
	const { fetchNextPage, isFetchingNextPage } = infiniteQuery;

	useEffect(() => {
		setPage(1);
	}, [authorId, dateTime, sortOrder, mode]);

	useEffect(() => {
		if (mode === 'infinite' && inView) {
			fetchNextPage();
		}
	}, [inView, mode, fetchNextPage]);

	if (mode === 'infinite') {
		if (infiniteQuery.error) return <Fallback />;
		if (infiniteQuery.isPending) return <Loader />;

		const hasPosts = infiniteQuery.data.pages.some(page => page.length > 0);
		if (!hasPosts) {
			return <Nodata />;
		}

		return (
			<div className="flex flex-col gap-6 sm:gap-8">
				{infiniteQuery.data.pages.map(page =>
					page.map(postId => <PostItem key={postId} postId={postId} type="FEED" />)
				)}
				{isFetchingNextPage && <Loader />}
				<div ref={ref}></div>
			</div>
		);
	}

	if (pagedQuery.error) return <Fallback />;
	if (pagedQuery.isPending) return <Loader />;

	const postIds = pagedQuery.data.postIds;
	if (postIds.length === 0) {
		return <Nodata />;
	}

	const totalPages = Math.max(
		1,
		Math.ceil(pagedQuery.data.totalCount / pagedQuery.data.pageSize)
	);

	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			{postIds.map(postId => (
				<PostItem key={postId} postId={postId} type="FEED" />
			))}
			<Pagination
				className="pt-2"
				currentPage={page}
				onPageChange={setPage}
				totalPages={totalPages}
			/>
		</div>
	);
}
