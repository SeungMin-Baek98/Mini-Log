import { Navigate, useParams } from 'react-router';

import CommentEditor from '@/components/comment/CommentEditor';
import CommentList from '@/components/comment/CommentList';
import PostItem from '@/components/post/PostItem';

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
