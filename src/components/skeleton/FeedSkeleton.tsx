import { cn } from '@/lib/utils';
import SkeletonBox from './SkeletonBox';

export default function FeedSkeleton({ count = 1 }: { count?: number }) {
	return (
		<div className="flex flex-col gap-6 sm:gap-8">
			{Array.from({ length: count }).map((_, index) => (
				<div
					key={index}
					className="border-border/80 bg-card/95 flex flex-col gap-5 overflow-hidden rounded-[1.75rem] border p-5 shadow-[0_18px_40px_rgba(96,76,48,0.06)] sm:p-6">
					<div className="flex justify-between gap-4">
						<div className="flex items-start gap-4">
							<SkeletonBox className="h-12 w-12 shrink-0 rounded-full" />
							<div className="flex flex-col gap-2 pt-1">
								<SkeletonBox className="h-4 w-24 rounded-md" />
								<SkeletonBox className="h-3 w-16 rounded-md" />
							</div>
						</div>
						<div className="flex items-center gap-2">
							<SkeletonBox className="h-4 w-8 rounded-md" />
							<SkeletonBox className="h-4 w-8 rounded-md" />
						</div>
					</div>

					<div className="flex flex-col gap-5">
						<div className="flex flex-col gap-2">
							<SkeletonBox className="h-4 w-full rounded-md" />
							<SkeletonBox className="h-4 w-[88%] rounded-md" />
							<SkeletonBox className="h-4 w-[56%] rounded-md" />
						</div>

						<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
							{Array.from({ length: 3 }).map((_, imageIndex) => (
								<SkeletonBox
									key={imageIndex}
									className={cn(
										'rounded-[1.35rem]',
										imageIndex > 0 ? 'hidden sm:block' : 'block',
										'aspect-square w-full'
									)}
								/>
							))}
						</div>
					</div>

					<div className="border-border/70 flex gap-2 border-t pt-4">
						<SkeletonBox className="h-10 w-24 rounded-full" />
						<SkeletonBox className="h-10 w-24 rounded-full" />
					</div>
				</div>
			))}
		</div>
	);
}
