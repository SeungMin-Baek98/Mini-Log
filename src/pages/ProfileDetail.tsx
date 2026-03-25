import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router';

import ProfileInfo from '@/features/profile/components/ProfileInfo';
import { useProfilePostStats } from '@/features/profile/hooks/queries/useProfilePostStats';
import PostFeed from '@/features/post/components/PostFeed';
import { useProfileSelectedDate } from '@/store/profileSelectedDate';

import Calendar from '@/features/calendar/components/Calendar';
import { Select, type SelectOption } from '@/components/ui/select';
import type { PostSortOrder } from '@/types';
import { Tab, type TabCategory } from '@/components/ui/tab';
import { Surface } from '@/components/ui/surface';

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
	const { data: profileStats } = useProfilePostStats(userId);
	const {
		selectedDate,
		selectedUserId,
		actions: { setSelectedDate, clear }
	} = useProfileSelectedDate();
	const hasPosts = (profileStats?.totalPosts ?? 0) > 0;

	useEffect(() => {
		window.scrollTo({
			top: 0
		});
	}, []);

	useEffect(() => {
		// 다른 유저 프로필로 이동 시 선택 날짜 초기화
		if (selectedUserId && selectedUserId !== currentUserId) {
			clear();
			setSortOrder('latest');
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
			<div className="space-y-4">
				<div className="space-y-2">
					<p className="text-primary/70 text-xs font-medium tracking-[0.22em] uppercase">
						Archive view
					</p>
					<h2 className="text-2xl font-semibold">기록 둘러보기</h2>
				</div>
				<Tab value={selectedTab} onChange={setSelectedTab} />
			</div>
			{selectedTab === 'all' && (
				<div className="flex flex-col gap-6">
					<div className="flex justify-start">
						<Select
							options={POST_SORT_OPTIONS}
							value={sortOrder}
							onChange={setSortOrder}
							disabled={!hasPosts}
							containerClassName="w-32"
							aria-label="게시글 정렬"
						/>
					</div>
					<PostFeed authorId={userId} sortOrder={sortOrder} mode="paged" />
				</div>
			)}

			{selectedTab === 'date' && (
				<Surface tone="muted" padding="compact">
					<Calendar
						userId={userId}
						onChange={date => setSelectedDate(date, currentUserId)}
						value={selectedDate}
					/>
				</Surface>
			)}
			{selectedTab === 'date' && selectedDate && (
				<PostFeed authorId={userId} date={selectedDate} />
			)}
		</div>
	);
}
