import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router';

import ProfileInfo from '@/components/profile/ProfileInfo';
import PostFeed from '@/components/post/PostFeed';
import { useProfileSelectedDate } from '@/store/profileSelectedDate';

export default function ProfileDetailPage() {
	const params = useParams();
	const userId = params.userId;
	const {
		selectedDate,
		actions: { setSelectedDate, clear }
	} = useProfileSelectedDate();

	useEffect(() => {
		window.scrollTo({
			top: 0
		});
	}, []);

	useEffect(() => {
		// 다른 유저 프로필로 이동 시 선택 날짜 초기화
		return () => {
			clear();
		};
	}, []);

	if (!userId) return <Navigate to={'/'} replace />;

	return (
		<div className="flex flex-col gap-3">
			<ProfileInfo
				userId={userId}
				onDateChange={setSelectedDate}
				selectedDate={selectedDate}
			/>
			<div className="visible border-b max-sm:invisible"></div>
			{selectedDate && <PostFeed authorId={userId} date={selectedDate} />}
		</div>
	);
}
