import { cn } from '@/lib/utils';

export default function SkeletonBox({ className }: { className?: string }) {
	return (
		<div
			aria-hidden="true"
			className={cn(
				'bg-muted/80 dark:bg-muted/60 animate-pulse rounded-full',
				className
			)}
		/>
	);
}
