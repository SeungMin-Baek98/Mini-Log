import { cn } from '@/lib/utils';
import SkeletonBox from './SkeletonBox';

export default function CommentSkeleton({ count = 3 }: { count?: number }) {
	return (
		<div className="flex flex-col gap-5">
			{Array.from({ length: count }).map((_, index) => (
				<div
					key={index}
					className={cn(
						'flex flex-col gap-8 pb-5',
						index !== count - 1 && 'border-b'
					)}>
					<div className="flex items-start gap-4">
						<SkeletonBox className="h-10 w-10 shrink-0 rounded-full" />
						<div className="flex w-full flex-col gap-3">
							<SkeletonBox className="h-4 w-24 rounded-md" />
							<div className="flex flex-col gap-2">
								<SkeletonBox className="h-4 w-full rounded-md" />
								<SkeletonBox className="h-4 w-[72%] rounded-md" />
							</div>
							<div className="flex items-center justify-between gap-4 pt-1">
								<div className="flex items-center gap-2">
									<SkeletonBox className="h-3 w-8 rounded-md" />
									<SkeletonBox className="h-3 w-px rounded-none" />
									<SkeletonBox className="h-3 w-20 rounded-md" />
									<SkeletonBox className="h-3 w-px rounded-none" />
									<SkeletonBox className="h-3 w-14 rounded-md" />
								</div>
								<div className="flex items-center gap-2">
									<SkeletonBox className="h-3 w-8 rounded-md" />
									<SkeletonBox className="h-3 w-px rounded-none" />
									<SkeletonBox className="h-3 w-8 rounded-md" />
								</div>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
