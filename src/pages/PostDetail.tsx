import { Navigate, useParams } from 'react-router';

import CommentEditor from '@/features/comment/components/CommentEditor';
import CommentList from '@/features/comment/components/CommentList';
import PostItem from '@/features/post/components/PostItem';

export default function PostDetailPage() {
	const params = useParams();
	const postId = params.postId;

	if (!postId) return <Navigate to={'/'} replace />;
	return (
		<div className="flex flex-col gap-5">
			<PostItem postId={Number(postId)} type="DETAIL" />
			<div className="text-xl font-bold">댓글</div>
			<CommentEditor postId={Number(postId)} type="CREATE" />
			<CommentList postId={Number(postId)} />
		</div>
	);
}
