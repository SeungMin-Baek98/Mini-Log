import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfinitePostsData } from '@/hooks/queries/useInfinitePosts';

import Fallback from '../Fallback';
import Loader from '../Loader';
import PostItem from './PostItem';

export default function PostFeed() {
	const { data, error, isPending, fetchNextPage, isFetchingNextPage } =
		useInfinitePostsData();
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
				page.map(post => <PostItem key={post.id} {...post} />)
			)}
			{isFetchingNextPage && <Loader />}
			<div ref={ref}></div>
		</div>
	);
}
