import { Navigate, useParams } from 'react-router';

import ProfileInfo from '@/components/profile/ProfileInfo';
import PostFeed from '@/components/post/PostFeed';
import { useEffect } from 'react';

export default function ProfileDetailPage() {
	const params = useParams();
	const userId = params.userId;

	useEffect(() => {
		window.scrollTo({
			top: 0
		});
	}, []);

	if (!userId) return <Navigate to={'/'} replace />;

	return (
		<div className="flex flex-col gap-10">
			<ProfileInfo userId={userId} />
			<div className="border-b"></div>
			<PostFeed authorId={userId} />
		</div>
	);
}
