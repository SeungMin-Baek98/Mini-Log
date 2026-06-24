import { createPortal } from 'react-dom';

const PostEditorModal = lazy(
	() => import('@/components/modal/PostEditorModal')
);
const AlertModal = lazy(() => import('@/components/modal/AlertModal'));
const ProfileEditorModal = lazy(
	() => import('@/components/modal/ProfileEditorModal')
);
const ShowOriginImagesModal = lazy(
	() => import('@/components/modal/ShowOriginImagesModal')
);
const WeeklyRecapModal = lazy(
	() => import('@/components/modal/WeeklyRecapModal')
);

import { usePostEditorModal } from '@/store/postEditorModal';
import { lazy, Suspense } from 'react';
import { useAlertModal } from '@/store/alertModal';
import { useProfileEditorModal } from '@/store/profileEditorModal';
import { useShowOriginImagesModal } from '@/store/showOriginImagesModal';
import { useWeeklyRecapModal } from '@/store/weeklyRecapModal';

function LazyModals() {
	const postEditorModal = usePostEditorModal();
	const alertModal = useAlertModal();
	const profileEditorModal = useProfileEditorModal();
	const showOriginImagesModal = useShowOriginImagesModal();
	const weeklyRecapModal = useWeeklyRecapModal();

	return (
		<Suspense fallback={null}>
			{postEditorModal.isOpen && <PostEditorModal />}
			{alertModal.isOpen && <AlertModal />}
			{profileEditorModal.isOpen && <ProfileEditorModal />}
			{showOriginImagesModal.isOpen && <ShowOriginImagesModal />}
			{weeklyRecapModal.isOpen && <WeeklyRecapModal />}
		</Suspense>
	);
}

export default function ModalProvider({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{createPortal(<LazyModals />, document.getElementById('modal-root')!)}
			{children}
		</>
	);
}
