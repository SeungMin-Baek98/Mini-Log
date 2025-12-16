import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfinitePostsData } from '@/hooks/queries/useInfinitePosts';

import Fallback from '../Fallback';
import Loader from '../Loader';
import PostItem from './PostItem';
import Nodata from '../Nodata';

export default function PostFeed({
	authorId,
	date
}: {
	authorId?: string;
	date?: Date | null;
}) {
	const { data, error, isPending, fetchNextPage, isFetchingNextPage } =
		useInfinitePostsData({ authorId, date });
	const { ref, inView } = useInView();

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [inView]);

	if (error) return <Fallback />;
	if (isPending) return <Loader />;

	const hasPosts = data.pages.some(page => page.length > 0);
	if (!hasPosts) {
		return <Nodata />;
	}
	return (
		<div className="flex flex-col gap-10">
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
