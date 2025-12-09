import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfinitePostsData } from '@/hooks/queries/useInfinitePosts';

import Fallback from '../Fallback';
import Loader from '../Loader';
import PostItem from './PostItem';

export default function PostFeed({ authorId }: { authorId?: string }) {
	const { data, error, isPending, fetchNextPage, isFetchingNextPage } =
		useInfinitePostsData(authorId);
	const { ref, inView } = useInView();

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [inView]);

	if (error) return <Fallback />;
	if (isPending) return <Loader />;

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
