import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router';

import ProfileInfo from '@/components/profile/ProfileInfo';
import PostFeed from '@/components/post/PostFeed';

export default function ProfileDetailPage() {
	const params = useParams();
	const userId = params.userId;
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	useEffect(() => {
		window.scrollTo({
			top: 0
		});
	}, []);

	if (!userId) return <Navigate to={'/'} replace />;

	return (
		<div className="flex flex-col gap-3">
			<ProfileInfo userId={userId} onDateChange={setSelectedDate} />
			<div className="visible border-b max-sm:invisible"></div>
			{selectedDate && <PostFeed authorId={userId} date={selectedDate} />}
		</div>
	);
}
