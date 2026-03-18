import { useSession } from '@/store/session';
import { useProfileData } from '@/features/profile/hooks/queries/useProfileData';
import { useState } from 'react';

import Fallback from '@/components/Fallback';
import Loader from '@/components/Loader';
import defaultAvatar from '@/assets/default-avatar.jpg';
import EditProfileButton from './EditProfileButton';
import WeeklyRecapArchiveModal from './WeeklyRecapArchiveModal';
import Calendar from '@/features/calendar/components/Calendar';
import { cn } from '@/lib/utils';
import { useProfilePostStats } from '@/features/profile/hooks/queries/useProfilePostStats';
import { formatTimeAgo } from '@/lib/time';
import { Button } from '@/components/ui/button';

function MinistatCard({
	category,
	content,
	isLast
}: {
	category: string;
	content: string;
	isLast?: boolean;
}) {
	return (
		<div
			className={cn(
				'border-border/70 bg-background/45 dark:bg-card/55 rounded-2xl border px-4 py-3 backdrop-blur-sm',
				isLast && 'max-sm:col-span-2'
			)}>
			<div className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
				{category}
			</div>
			<div className="mt-1 text-sm font-medium">{content}</div>
		</div>
	);
}

export default function ProfileInfo({
	userId,
	onDateChange,
	selectedDate,
	showCalendar = true
}: {
	userId: string;
	onDateChange?: (date: Date | null) => void;
	selectedDate?: Date | null;
	showCalendar?: boolean;
}) {
	const session = useSession();
	const [isRecapArchiveOpen, setIsRecapArchiveOpen] = useState(false);

	const {
		data: profile,
		error: fetchProfileError,
		isPending: isFetchingProfilePending
	} = useProfileData(userId);
	const { data: profileStats, isPending: isFetchingProfileStats } =
		useProfilePostStats(userId);

	if (fetchProfileError) return <Fallback />;
	if (isFetchingProfilePending) return <Loader />;
	if (isFetchingProfileStats) return <Loader />;

	const isMine = session?.user.id === userId;
	const stats = [
		{
			category: '남긴 이야기',
			content: `${profileStats?.totalPosts ?? 0}개`
		},
		{
			category: '사진이 담긴 기록',
			content: `${profileStats?.imagePostCount ?? 0}개`
		},
		{
			category: '마지막 기록',
			content: profileStats?.latestPostCreatedAt
				? formatTimeAgo(profileStats.latestPostCreatedAt)
				: '아직 없어요'
		}
	];

	return (
		<div className="flex flex-col gap-8">
			<div className="border-border/70 relative overflow-hidden rounded-[2rem] border bg-[linear-gradient(135deg,color-mix(in_oklab,var(--card)_94%,white)_0%,color-mix(in_oklab,var(--secondary)_78%,white)_100%)] p-6 shadow-[0_22px_50px_rgba(96,76,48,0.07)] sm:p-8 dark:bg-[linear-gradient(135deg,color-mix(in_oklab,var(--card)_92%,black)_0%,color-mix(in_oklab,var(--secondary)_66%,black)_100%)] dark:shadow-[0_24px_52px_rgba(0,0,0,0.3)]">
				<div className="bg-primary/10 dark:bg-primary/16 absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl" />
				<div className="bg-accent/10 dark:bg-accent/14 absolute bottom-0 left-0 h-24 w-24 rounded-full blur-2xl" />
				<div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:items-stretch">
					<div className="relative flex flex-1 flex-col items-center justify-center gap-5">
						<img
							src={profile.avatar_url || defaultAvatar}
							alt={
								profile.nickname
									? `${profile.nickname}의 이미지`
									: '프로필 이미지'
							}
							className="border-background/80 dark:border-card/80 h-32 w-32 rounded-full border-4 object-cover shadow-[0_18px_35px_rgba(96,76,48,0.14)] dark:shadow-[0_18px_35px_rgba(0,0,0,0.3)]"
						/>

						<div className="flex flex-col items-center gap-2 text-center">
							<p className="text-primary/70 text-xs font-medium tracking-[0.24em] uppercase">
								Personal archive
							</p>
							<div className="text-3xl font-semibold">{profile.nickname}</div>
							<div className="text-muted-foreground max-w-xl text-sm leading-7 sm:text-base">
								{profile.bio ||
									'아직 소개가 없어요. 이 공간에 하루의 분위기를 남겨보세요.'}
							</div>
						</div>
						{isMine && (
							<EditProfileButton className="max-sm:w-full max-sm:flex-1" />
						)}
					</div>

					<div className="flex w-full flex-1 flex-col justify-between gap-4 sm:self-stretch">
						<div className="grid w-full max-w-md grid-cols-2 gap-3 self-start text-center sm:grid-cols-3">
							{stats.map((stat, index) => (
								<MinistatCard
									key={stat.category}
									category={stat.category}
									content={stat.content}
									isLast={index === stats.length - 1}
								/>
							))}
						</div>

						{isMine && (
							<Button onClick={() => setIsRecapArchiveOpen(true)}>
								주간 회고 모아보기
							</Button>
						)}
					</div>
				</div>
			</div>
			{isMine && (
				<WeeklyRecapArchiveModal
					userId={userId}
					open={isRecapArchiveOpen}
					onOpenChange={setIsRecapArchiveOpen}
				/>
			)}
			{showCalendar && (
				<Calendar
					userId={userId}
					onChange={onDateChange}
					value={selectedDate}
				/>
			)}
		</div>
	);
}
