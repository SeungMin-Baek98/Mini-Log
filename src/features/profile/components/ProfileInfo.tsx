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
			<div className="flex items-center justify-center gap-5 max-sm:flex-col">
				<div className="flex flex-1 flex-col items-center justify-center gap-5">
					<img
						src={profile.avatar_url || defaultAvatar}
						alt={
							profile.nickname
								? `${profile.nickname}의 이미지`
								: '프로필 이미지'
						}
						className="h-30 w-30 rounded-full object-cover"
					/>

					<div className="flex flex-col items-center gap-2">
						<div className="text-xl font-bold">{profile.nickname}</div>
						<div className="text-muted-foreground">{profile.bio}</div>
					</div>

					{isMine && <EditProfileButton />}
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
