import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router';

import ProfileInfo from '@/components/profile/ProfileInfo';
import PostFeed from '@/components/post/PostFeed';
import { useProfileSelectedDate } from '@/store/profileSelectedDate';

import Calendar from '@/components/calendar/Calendar';
import { Select, type SelectOption } from '@/components/ui/select';
import type { PostSortOrder } from '@/types';
import { Tab, type TabCategory } from '@/components/ui/tab';

const POST_SORT_OPTIONS: SelectOption<PostSortOrder>[] = [
	{ label: '최신순', value: 'latest' },
	{ label: '오래된순', value: 'oldest' }
];

export default function ProfileDetailPage() {
	const params = useParams();
	const userId = params.userId;
	const currentUserId = userId ?? null;
	const [selectedTab, setSelectedTab] = useState<TabCategory>('all');
	const [sortOrder, setSortOrder] = useState<PostSortOrder>('latest');
	const {
		selectedDate,
		selectedUserId,
		actions: { setSelectedDate, clear }
	} = useProfileSelectedDate();

	useEffect(() => {
		window.scrollTo({
			top: 0
		});
	}, []);

	useEffect(() => {
		// 다른 유저 프로필로 이동 시 선택 날짜 초기화
		if (selectedUserId && selectedUserId !== currentUserId) {
			clear();
		}
	}, [selectedUserId, currentUserId, clear]);

	if (!userId) return <Navigate to={'/'} replace />;

	return (
		<div className="flex flex-col gap-8">
			<ProfileInfo
				userId={userId}
				onDateChange={date => setSelectedDate(date, currentUserId)}
				selectedDate={selectedDate}
				showCalendar={false}
			/>
			<Tab value={selectedTab} onChange={setSelectedTab} />
			{selectedTab === 'all' && (
				<div className="flex flex-col gap-6">
					<div className="flex justify-start">
						<Select
							options={POST_SORT_OPTIONS}
							value={sortOrder}
							onChange={setSortOrder}
							containerClassName="w-28"
							aria-label="게시글 정렬"
						/>
					</div>
					<PostFeed authorId={userId} sortOrder={sortOrder} />
				</div>
			)}

			{selectedTab === 'date' && (
				<Calendar
					userId={userId}
					onChange={date => setSelectedDate(date, currentUserId)}
					value={selectedDate}
				/>
			)}
			{selectedTab === 'date' && selectedDate && (
				<PostFeed authorId={userId} date={selectedDate} />
			)}
		</div>
	);
}
