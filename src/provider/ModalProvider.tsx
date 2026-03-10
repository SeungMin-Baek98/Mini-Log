import { createPortal } from 'react-dom';

import PostEditorModal from '@/components/modal/PostEditorModal';
import AlertModal from '@/components/modal/AlertModal';
import ProfileEditorModal from '@/components/modal/ProfileEditorModal';
import ShowOriginImagesModal from '@/components/modal/ShowOriginImagesModal';
import WeeklyRecapModal from '@/components/modal/WeeklyRecapModal';

export default function ModalProvider({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{createPortal(
				<>
					<PostEditorModal />
					<AlertModal />
					<ProfileEditorModal />
					<ShowOriginImagesModal />
					<WeeklyRecapModal />
				</>,
				document.getElementById('modal-root')!
			)}
			{children}
		</>
	);
}
