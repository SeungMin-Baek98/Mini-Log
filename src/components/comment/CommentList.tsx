import { useCommentsData } from '@/hooks/queries/useCommentsData';
import CommentItem from './CommentItem';
import Fallback from '../Fallback';
import Loader from '../Loader';

export default function CommentList({ postId }: { postId: number }) {
	const {
		data: comments,
		error: fetchCommentsError,
		isPending: isFetchCommentsPending
	} = useCommentsData(postId);

	if (fetchCommentsError) return <Fallback />;
	if (isFetchCommentsPending) return <Loader />;

	return (
		<div className="flex flex-col gap-5">
			{comments.map(comment => (
				<CommentItem key={comment.id} {...comment} />
			))}
		</div>
	);
}
