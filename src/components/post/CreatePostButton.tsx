import { useOpenCreatePostModal } from '@/store/postEditorModal';
import { PlusCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

function FloatingButton() {
	const openCreatePostModal = useOpenCreatePostModal();
	return (
		<div
			onClick={openCreatePostModal}
			className="group bg-muted fixed right-5 bottom-5 flex cursor-pointer items-center rounded-full text-white transition-all hover:px-4">
			<span className="text-muted-foreground max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all group-hover:max-w-sm group-hover:opacity-100">
				게시글 만들기
			</span>
			<div className="text-muted-foreground flex h-12 w-12 items-center justify-center">
				<PlusCircleIcon className="h-6 w-6" />
			</div>
		</div>
	);
}

function NormalButton() {
	const openCreatePostModal = useOpenCreatePostModal();

	return (
		<div
			onClick={openCreatePostModal}
			className="bg-muted text-muted-foreground cursor-pointer rounded-xl px-6 py-4">
			<div className="flex items-center justify-between">
				<div>나누고 싶은 이야기가 있나요?</div>
				<PlusCircleIcon className="h-5 w-5" />
			</div>
		</div>
	);
}

export default function CreatePostButton() {
	const [isScrollDown, setIsScrollDown] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const y = window.scrollY;

			setIsScrollDown(prev => {
				if (y > 350) return true;
				if (y < 250) return false;
				return prev;
			});
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return isScrollDown ? <FloatingButton /> : <NormalButton />;
}
