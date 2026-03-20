import { useOpenCreatePostModal } from '@/store/postEditorModal';
import {
	SCROLL_DOWN_THRESHOLD_PX,
	SCROLL_UP_THRESHOLD_PX
} from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlusCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useRequireAuth } from '@/features/auth/hooks/useRequireAuth';

type ButtonProps = {
	onClick: () => void;
};

function FloatingButton({ onClick }: ButtonProps) {
	return (
		<motion.div
			className="fixed right-5 bottom-5 z-50"
			initial={{ opacity: 0, y: 16, scale: 0.96 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: 16, scale: 0.96 }}>
			<Button
				type="button"
				onClick={onClick}
				variant="outline"
				size="lg"
				className="group bg-background/92 text-foreground border-border/80 hover:bg-background flex h-12 cursor-pointer overflow-hidden rounded-full px-4 backdrop-blur-sm transition-[padding] duration-200 hover:pl-5">
				<span className="text-muted-foreground max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all group-hover:max-w-sm group-hover:opacity-100">
					게시글 만들기
				</span>
				<PlusCircleIcon className="mr-2 group-hover:mr-0" />
			</Button>
		</motion.div>
	);
}

function NormalButton({
	onClick,
	isHidden
}: ButtonProps & { isHidden: boolean }) {
	return (
		<motion.div
			initial={false}
			animate={{
				opacity: isHidden ? 0 : 1,
				y: isHidden ? -10 : 0,
				scale: isHidden ? 0.98 : 1
			}}
			transition={{ duration: 0.2, ease: 'easeOut' }}
			className={cn(isHidden && 'pointer-events-none')}>
			<Button
				type="button"
				onClick={onClick}
				variant="outline"
				className="bg-muted text-muted-foreground hover:bg-muted flex h-auto w-full cursor-pointer rounded-sm px-6 py-4">
				<div className="flex w-full items-center justify-between">
					<span>나누고 싶은 이야기가 있나요?</span>
					<PlusCircleIcon />
				</div>
			</Button>
		</motion.div>
	);
}

export default function CreatePostButton() {
	const [isScrollDown, setIsScrollDown] = useState(false);
	const openCreatePostModal = useOpenCreatePostModal();
	const requireAuth = useRequireAuth();

	const handleOpenCreatePostModal = () => {
		if (
			!requireAuth({
				message: '게시글 작성은 로그인 후 사용할 수 있어요.'
			})
		) {
			return;
		}

		openCreatePostModal();
	};

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY;
			const shouldShowFloatingButton = scrollY > SCROLL_DOWN_THRESHOLD_PX;
			const shouldShowNormalButton = scrollY < SCROLL_UP_THRESHOLD_PX;

			setIsScrollDown(prev => {
				if (shouldShowFloatingButton) return true;
				if (shouldShowNormalButton) return false;
				return prev;
			});
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<>
			<div className="min-h-[72px]">
				<NormalButton
					onClick={handleOpenCreatePostModal}
					isHidden={isScrollDown}
				/>
			</div>
			<AnimatePresence>
				{isScrollDown ? (
					<FloatingButton onClick={handleOpenCreatePostModal} />
				) : null}
			</AnimatePresence>
		</>
	);
}
