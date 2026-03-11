import { useSession } from '@/store/session';
import { useProfileData } from '@/features/profile/hooks/queries/useProfileData';

import Fallback from '@/components/Fallback';
import Loader from '@/components/Loader';
import defaultAvatar from '@/assets/default-avatar.jpg';
import EditProfileButton from './EditProfileButton';
import Calendar from '@/features/calendar/components/Calendar';

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

	const {
		data: profile,
		error: fetchProfileError,
		isPending: isFetchingProfilePending
	} = useProfileData(userId);

	if (fetchProfileError) return <Fallback />;
	if (isFetchingProfilePending) return <Loader />;

	const isMine = session?.user.id === userId;

	return (
		<div className="flex flex-col gap-8">
			<div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--card)_94%,white)_0%,color-mix(in_oklab,var(--secondary)_78%,white)_100%)] p-6 shadow-[0_22px_50px_rgba(96,76,48,0.07)] dark:bg-[linear-gradient(135deg,color-mix(in_oklab,var(--card)_92%,black)_0%,color-mix(in_oklab,var(--secondary)_66%,black)_100%)] dark:shadow-[0_24px_52px_rgba(0,0,0,0.3)] sm:p-8">
				<div className="bg-primary/10 absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl dark:bg-primary/16" />
				<div className="bg-accent/10 absolute bottom-0 left-0 h-24 w-24 rounded-full blur-2xl dark:bg-accent/14" />
				<div className="flex items-center justify-center gap-6 max-sm:flex-col">
					<div className="relative flex flex-1 flex-col items-center justify-center gap-5">
						<img
							src={profile.avatar_url || defaultAvatar}
							alt={
								profile.nickname
									? `${profile.nickname}의 이미지`
									: '프로필 이미지'
							}
							className="h-32 w-32 rounded-full border-4 border-background/80 object-cover shadow-[0_18px_35px_rgba(96,76,48,0.14)] dark:border-card/80 dark:shadow-[0_18px_35px_rgba(0,0,0,0.3)]"
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

						<div className="grid w-full max-w-md grid-cols-2 gap-3 text-center sm:grid-cols-3">
							<div className="rounded-2xl border border-border/70 bg-background/45 px-4 py-3 backdrop-blur-sm dark:bg-card/55">
								<div className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
									Mood
								</div>
								<div className="mt-1 text-sm font-medium">잔잔한 기록</div>
							</div>
							<div className="rounded-2xl border border-border/70 bg-background/45 px-4 py-3 backdrop-blur-sm dark:bg-card/55">
								<div className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
									Archive
								</div>
								<div className="mt-1 text-sm font-medium">사진과 글</div>
							</div>
							<div className="rounded-2xl border border-border/70 bg-background/45 px-4 py-3 backdrop-blur-sm max-sm:col-span-2 dark:bg-card/55">
								<div className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
									Style
								</div>
								<div className="mt-1 text-sm font-medium">Warm lifelog</div>
							</div>
						</div>

						{isMine && <EditProfileButton />}
					</div>
				</div>
			</div>
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
