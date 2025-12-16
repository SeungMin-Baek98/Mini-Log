import { useSession } from '@/store/session';
import { useProfileData } from '@/hooks/queries/useProfileData';

import Fallback from '../Fallback';
import Loader from '../Loader';
import defaultAvatar from '@/assets/default-avatar.jpg';
import EditProfileButton from './EditProfileButton';
import Calendar from '../calendar/Calendar';

export default function ProfileInfo({
	userId,
	onDateChange
}: {
	userId: string;
	onDateChange?: (date: Date) => void;
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
		<div className="flex items-center justify-center gap-2 max-sm:flex-col">
			<div className="flex flex-1 flex-col items-center justify-center gap-5">
				<img
					src={profile.avatar_url || defaultAvatar}
					className="h-30 w-30 rounded-full object-cover"
				/>

				<div className="flex flex-col items-center gap-2">
					<div className="text-xl font-bold">{profile.nickname}</div>
					<div className="text-muted-foreground">{profile.bio}</div>
				</div>

				{isMine && <EditProfileButton />}
			</div>
			<div className="invisible border-b max-sm:visible max-sm:w-full"></div>
			<Calendar userId={userId} onChange={onDateChange} />
		</div>
	);
}
