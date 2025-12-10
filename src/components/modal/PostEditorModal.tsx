import { ImageIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { usePostEditorModal } from '@/store/postEditorModal';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useCreatePost } from '@/hooks/mutations/post/useCreatePost';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '../ui/carousel';
import { useSession } from '@/store/session';
import { useOpenAlertModal } from '@/store/alertModal';

import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { useUpdatePost } from '@/hooks/mutations/post/useUpdatePost';

type Image = {
	file: File;
	previewURL: string;
};

export default function PostEditorModal() {
	const session = useSession();
	const postEditorModal = usePostEditorModal();

	const openAlertModal = useOpenAlertModal();

	const [content, setContent] = useState('');
	const [images, setImages] = useState<Image[]>([]);

	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { mutate: createPost, isPending: isCreatePostPending } = useCreatePost({
		onSuccess: () => {
			postEditorModal.actions.close();
		},
		onError: error => {
			toast.error('포스트 작성에 실패했습니다', {
				position: 'top-center'
			});
		}
	});

	const { mutate: updatePost, isPending: isUpdatePostPending } = useUpdatePost({
		onSuccess: () => {
			postEditorModal.actions.close();
		},
		onError: error => {
			toast.error('포스트 수정에 실패했습니다', {
				position: 'top-center'
			});
		}
	});

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height =
				textareaRef.current.scrollHeight + 'px';
		}
	}, [content]);

	useEffect(() => {
		if (!postEditorModal.isOpen) {
			// 메모리 누수를 막기위해 생성된 이미지 URL 해제
			images.forEach(image => URL.revokeObjectURL(image.previewURL));
			return;
		}
		if (postEditorModal.type === 'CREATE') {
			setContent('');
			setImages([]);
		} else {
			// EDIT 모드일 때 기존 데이터 세팅
			setContent(postEditorModal.content);
			setImages([]);
		}

		textareaRef.current?.focus();
	}, [postEditorModal.isOpen]);

	const handleCloseModal = () => {
		if (content !== '' || images.length > 0) {
			// Alert Modal 열기
			openAlertModal({
				title: '게시글 작성이 마무리 되지 않았습니다',
				description: '이 화면에서 나가면 작성중이던 내용이 사라집니다',
				onPositive: () => {
					postEditorModal.actions.close();
				}
			});

			return;
		}
		postEditorModal.actions.close();
	};

	const handleSavePostClick = () => {
		if (content.trim() === '') return;

		if (!postEditorModal.isOpen) return;

		if (postEditorModal.type === 'CREATE') {
			createPost({
				content,
				images: images.map(image => image.file),
				userId: session!.user.id
			});
		} else {
			if (content === postEditorModal.content) return;

			updatePost({
				id: postEditorModal.postId,
				content: content
			});
		}
	};

	/** 이미지 선택 핸들러 */
	const handleSelectImages = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const files = Array.from(e.target.files);

			files.forEach(file => {
				setImages(prev => [
					...prev,
					{ file, previewURL: URL.createObjectURL(file) }
				]);
			});
		}

		e.target.value = '';
	};

	/** 선택된 이미지 삭제 핸들러 */
	const handleDeleteImages = (image: Image) => {
		setImages(prevImages =>
			prevImages.filter(item => item.previewURL !== image.previewURL)
		);

		// 메모리 누수 방지
		URL.revokeObjectURL(image.previewURL);
	};

	const isPending = isCreatePostPending || isUpdatePostPending;

	return (
		<Dialog open={postEditorModal.isOpen} onOpenChange={handleCloseModal}>
			<DialogContent className="max-h-[90vh]">
				<DialogTitle>
					포스트{' '}
					{postEditorModal.isOpen && postEditorModal.type === 'CREATE'
						? '작성'
						: '수정'}
				</DialogTitle>
				<textarea
					ref={textareaRef}
					value={content}
					disabled={isPending}
					onChange={e => setContent(e.target.value)}
					className="max-h-125 min-h-25 focus:outline-none"
					placeholder="무슨 일이 있었나요?"
				/>
				<input
					ref={fileInputRef}
					onChange={handleSelectImages}
					type="file"
					accept="image/*"
					multiple
					className="hidden"
				/>
				{postEditorModal.isOpen && postEditorModal.type === 'EDIT' && (
					<Carousel className="relative">
						<CarouselContent>
							{postEditorModal.imageUrls?.map(url => (
								<CarouselItem className="basis-full sm:basis-1/3" key={url}>
									<div className="relative mx-auto aspect-square w-full max-w-[360px] overflow-hidden rounded-xl bg-neutral-100">
										<img
											src={url}
											alt="기존 게시 이미지"
											className="h-full w-full object-cover"
										/>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>
				)}

				{images.length > 0 && (
					<Carousel className="relative">
						<CarouselContent>
							{images.map(image => (
								<CarouselItem
									className="basis-full sm:basis-1/3"
									key={image.previewURL}>
									<div className="relative mx-auto aspect-square w-full max-w-[360px] overflow-hidden rounded-xl bg-neutral-100">
										<img
											src={image.previewURL}
											alt="선택한 이미지 미리보기"
											className="h-full w-full object-cover"
										/>
										<div
											onClick={() => handleDeleteImages(image)}
											className="absolute top-0 right-0 m-1 cursor-pointer rounded-full bg-black/30 p-1">
											<XIcon className="h-4 w-4 text-white" />
										</div>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						{images.length > 1 && (
							<>
								<CarouselPrevious className="absolute left-2 max-sm:left-10" />
								<CarouselNext className="absolute right-2 max-sm:right-10" />
							</>
						)}
					</Carousel>
				)}
				{postEditorModal.isOpen && postEditorModal.type === 'CREATE' && (
					<Button
						onClick={() => {
							fileInputRef.current?.click();
						}}
						disabled={isPending}
						variant={'outline'}
						className="cursor-pointer">
						<ImageIcon />
						이미지 추가
					</Button>
				)}

				<Button
					className="cursor-pointer"
					onClick={handleSavePostClick}
					disabled={isPending}>
					저장
				</Button>
			</DialogContent>
		</Dialog>
	);
}
