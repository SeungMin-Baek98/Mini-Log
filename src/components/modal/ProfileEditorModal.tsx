import { useSession } from '@/store/session';
import { useProfileData } from '@/hooks/queries/useProfileData';
import { useProfileEditorModal } from '@/store/profileEditorModal';

import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

import Fallback from '../Fallback';
import Loader from '../Loader';
import defaultAvatar from '@/assets/default-avatar.jpg';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useUpdateProfile } from '@/hooks/mutations/profile/useUpdateProfile';
import { toast } from 'sonner';

type Image = {
	file: File;
	previewUrl: string;
};

export default function ProfileEditorModal() {
	const session = useSession();
	const {
		data: profile,
		error: fetchProfileError,
		isPending: isFetchProfilePending
	} = useProfileData(session?.user.id);

	const store = useProfileEditorModal();
	const {
		isOpen,
		action: { close }
	} = store;

	const { mutate: updateProfile, isPending: isUpdateProfilePending } =
		useUpdateProfile({
			onSuccess: () => {
				close(); // 모달 닫기
			},
			onError: error => {
				toast.error('프로필 수정에 실패했습니다.', {
					position: 'top-center'
				});
			}
		});
	const [avatarImage, setAvatarImage] = useState<Image | null>(null);
	const [nickname, setNickname] = useState('');
	const [bio, setBio] = useState('');

	const fileInputRef = useRef<HTMLInputElement>(null);

	// 모달이 닫혀있고 이전에 선택한 이미지가 있다면 URL 해제 (메모리 누수 방지)
	useEffect(() => {
		if (!isOpen) {
			if (avatarImage) URL.revokeObjectURL(avatarImage.previewUrl);
		}
	}, [isOpen]);

	// 서버에서 프로필 데이터를 불러오거나 모달이 열릴 때 상태 초기화
	useEffect(() => {
		if (isOpen && profile) {
			setNickname(profile.nickname || '');
			setBio(profile.bio || '');
			setAvatarImage(null); // 새롭게 선택된 이미지previewUrl만 저장이 되기때문에 모달이 열릴 때 초기화만 하면 된다.
		}
	}, [profile, isOpen]);

	const handleUpdateProfileClick = () => {
		if (nickname.trim() === '') return;
		updateProfile({
			userId: session!.user.id,
			nickname,
			bio,
			avatarImageFile: avatarImage?.file
		});
	};

	// 이미지 선택 핸들러
	const handleSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return null;
		const file = e.target.files[0];

		// 이전에 선택한 이미지가 있다면 URL 해제(메모리 누수 방지)
		if (avatarImage) {
			URL.revokeObjectURL(avatarImage.previewUrl);
		}

		setAvatarImage({
			file,
			previewUrl: URL.createObjectURL(file)
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={close}>
			<DialogContent className="flex flex-col gap-5">
				<DialogTitle>프로필 수정하기</DialogTitle>
				{fetchProfileError && <Fallback />}
				{isFetchProfilePending && <Loader />}
				{!fetchProfileError && !isFetchProfilePending && (
					<>
						<div className="flex flex-col gap-2">
							<div className="text-muted-foreground">프로필 이미지</div>
							<input
								disabled={isUpdateProfilePending}
								ref={fileInputRef}
								onChange={handleSelectImage}
								type="file"
								accept="image/*"
								className="hidden"
							/>
							<img
								onClick={() => {
									if (fileInputRef.current) {
										// Input File 요소 클릭 트리거
										fileInputRef.current.click();
									}
								}}
								src={
									avatarImage?.previewUrl || profile.avatar_url || defaultAvatar
								}
								className="h-20 w-20 cursor-pointer rounded-full object-cover"
							/>
						</div>

						<div className="flex flex-col gap-2">
							<div className="text-muted-foreground">닉네임</div>
							<Input
								disabled={isUpdateProfilePending}
								value={nickname}
								onChange={e => {
									setNickname(e.target.value);
								}}
							/>
						</div>

						<div className="flex flex-col gap-2">
							<div className="text-muted-foreground">소개란</div>
							<Input
								disabled={isUpdateProfilePending}
								value={bio}
								onChange={e => {
									setBio(e.target.value);
								}}
							/>
						</div>

						<Button
							disabled={isUpdateProfilePending}
							className="cursor-pointer"
							onClick={handleUpdateProfileClick}>
							수정하기
						</Button>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}
