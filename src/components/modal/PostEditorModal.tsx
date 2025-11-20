import { ImageIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { usePostEditorModal } from '@/store/postEditorModal';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useCreatePost } from '@/hooks/mutations/post/useCreatePost';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import { useSession } from '@/store/session';
import { useOpenAlertModal } from '@/store/alertModal';

import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
type Image = {
	file: File;
	previewURL: string;
};

export default function PostEditorModal() {
	const { isOpen, close } = usePostEditorModal();
	const session = useSession();
	const openAlertModal = useOpenAlertModal();

	const [content, setContent] = useState('');
	const [images, setImages] = useState<Image[]>([]);

	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { mutate: createPost, isPending: isCreatePostPending } = useCreatePost({
		onSuccess: () => {
			close();
		},
		onError: error => {
			toast.error('포스트 작성에 실패했습닏나', {
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
		if (!isOpen) {
			// 메모리 누수를 막기위해 생성된 이미지 URL 해제
			images.forEach(image => URL.revokeObjectURL(image.previewURL));
			return;
		}
		textareaRef.current?.focus();
		setContent('');
		setImages([]);
	}, [isOpen]);

	const handleCloseModal = () => {
		if (content !== '' || images.length > 0) {
			// Alert Modal 열기
			openAlertModal({
				title: '게시글 작성이 마무리 되지 않았습니다',
				description: '이 화면에서 나가면 작성중이던 내용이 사라집니다',
				onPositive: () => {
					close();
				}
			});

			return;
		}
		close();
	};

	const handleCreatePost = () => {
		if (content.trim() === '') return;

		createPost({
			content,
			images: images.map(image => image.file),
			userId: session!.user.id
		});
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

	return (
		<Dialog open={isOpen} onOpenChange={handleCloseModal}>
			<DialogContent className="max-h-[90vh]">
				<DialogTitle>포스트 작성</DialogTitle>
				<textarea
					ref={textareaRef}
					value={content}
					disabled={isCreatePostPending}
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
				{images.length > 0 && (
					<Carousel>
						<CarouselContent>
							{images.map(image => (
								<CarouselItem className="basis-2/5" key={image.previewURL}>
									<div className="relative">
										<img
											src={image.previewURL}
											className="h-full w-full rounded-sm object-cover"
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
					</Carousel>
				)}
				<Button
					onClick={() => {
						fileInputRef.current?.click();
					}}
					disabled={isCreatePostPending}
					variant={'outline'}
					className="cursor-pointer">
					<ImageIcon />
					이미지 추가
				</Button>
				<Button
					className="cursor-pointer"
					onClick={handleCreatePost}
					disabled={isCreatePostPending}>
					저장
				</Button>
			</DialogContent>
		</Dialog>
	);
}
