import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfinitePostsData } from '@/features/post/hooks/queries/useInfinitePosts';
import { usePagedPostsData } from '@/features/post/hooks/queries/usePagedPosts';
import type { PostSortOrder } from '@/types';

import Fallback from '@/components/Fallback';
import Loader from '@/components/Loader';
import PostItem from './PostItem';
import NoData from '@/components/Nodata';
import { Pagination } from '@/components/ui/pagination';
import FeedSkeleton from '@/components/skeleton/FeedSkeleton';

function getEmptyStateCopy({
	authorId,
	date
}: {
	authorId?: string;
	date?: Date | null;
}) {
	if (date) {
		return {
			eyebrow: 'Selected day',
			title: '선택한 날짜에는 기록이 없어요',
			description:
				'달력을 조금 더 둘러보면 다른 날의 순간들을 다시 만날 수 있어요.'
		};
	}

	if (authorId) {
		return {
			eyebrow: 'Quiet archive',
			title: '이 프로필에는 아직 기록이 없어요',
			description: '새로운 게시글이 생기면 이곳에서 차분하게 모아볼 수 있어요.'
		};
	}

	return {
		eyebrow: 'Fresh feed',
		title: '아직 올라온 기록이 없어요',
		description:
			'첫 이야기가 올라오면 이 공간이 하루의 기록으로 천천히 채워질 거예요.'
	};
}

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

	const totalCount = pagedQuery.data?.totalCount ?? 0;
	const totalPages = pagedQuery.data
		? Math.ceil(totalCount / pagedQuery.data.pageSize)
		: 0;
	const emptyStateCopy = getEmptyStateCopy({ authorId, date });

	useEffect(() => {
		if (mode !== 'paged') return;
		if (!pagedQuery.data) return;
		if (page > totalPages) {
			setPage(Math.max(1, totalPages || 1));
		}
	}, [mode, page, totalPages, pagedQuery.data]);

	if (mode === 'infinite') {
		if (infiniteQuery.error) return <Fallback />;
		if (infiniteQuery.isPending) return <FeedSkeleton count={5} />;

		const hasPosts = infiniteQuery.data.pages.some(page => page.length > 0);
		if (!hasPosts) {
			return <NoData {...emptyStateCopy} />;
		}

		return (
			<div className="flex flex-col gap-6 sm:gap-8">
				{infiniteQuery.data.pages.map(page =>
					page.map(postId => (
						<PostItem key={postId} postId={postId} type="FEED" />
					))
				)}
				{isFetchingNextPage && <Loader />}
				<div ref={ref}></div>
			</div>
		);
	}

	if (pagedQuery.error) return <Fallback />;
	if (pagedQuery.isPending) return <FeedSkeleton count={4} />;

	const postIds = pagedQuery.data.postIds;

	if (totalCount === 0) {
		return <NoData {...emptyStateCopy} />;
	}

	if (page > totalPages) {
		return <Loader />;
	}

	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			{postIds.map(postId => (
				<PostItem key={postId} postId={postId} type="FEED" />
			))}
			<Pagination
				className="pt-2"
				currentPage={page}
				onPageChange={setPage}
				totalPages={Math.max(1, totalPages)}
			/>
		</div>
	);
}
