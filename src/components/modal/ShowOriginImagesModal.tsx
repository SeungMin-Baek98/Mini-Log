import { useShowOriginImagesModal } from '@/store/showOriginImagesModal';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '../ui/carousel';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';

export default function ShowOriginImagesModal() {
	const store = useShowOriginImagesModal();

	if (!store.isOpen) return null;

	const handleOpenChange = (open: boolean) => {
		if (!open) store.actions.close();
	};

	return (
		<Dialog open={store.isOpen} onOpenChange={handleOpenChange}>
			<DialogContent className="border-none p-4">
				<DialogTitle className="text-muted-foreground text-xs opacity-45">
					{store.images.length > 1 && '이미지를 좌우로 넘기세요'}
				</DialogTitle>
				<Carousel
					className="relative"
					opts={{
						startIndex: store.initialIndex,
						loop: store.images.length > 1
					}}>
					<CarouselContent>
						{store.images.map((url, index) => (
							<CarouselItem className="basis-full" key={`${url}-${index}`}>
								<div className="flex items-center justify-center">
									<img
										src={url}
										alt={`원본 게시 이미지 ${index + 1}`}
										className="max-h-[450px] w-full rounded-lg object-contain"
									/>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					{store.images.length > 1 && (
						<>
							<CarouselPrevious className="border-none bg-white/20 text-white max-sm:absolute max-sm:left-2 max-sm:bg-black" />
							<CarouselNext className="border-none bg-white/20 text-white max-sm:absolute max-sm:right-2 max-sm:bg-black" />
						</>
					)}
				</Carousel>
			</DialogContent>
		</Dialog>
	);
}
