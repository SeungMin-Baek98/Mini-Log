import type { ReactNode } from 'react';
import { NotebookPen } from 'lucide-react';

import { cn } from '@/lib/utils';

type NoDataProps = {
	eyebrow?: string;
	title?: string;
	description?: string;
	icon?: ReactNode;
	className?: string;
};

export default function NoData({
	eyebrow = 'Quiet page',
	title = '아직 남겨진 기록이 없어요',
	description = '첫 이야기가 올라오면 이곳에 차분하게 쌓여갈 거예요.',
	icon,
	className
}: NoDataProps) {
	return (
		<section
			className={cn(
				'border-border/80 bg-card/95 relative overflow-hidden rounded-[1.75rem] border px-5 py-10 shadow-[0_18px_40px_rgba(96,76,48,0.06)] sm:px-6 sm:py-12 dark:shadow-[0_20px_44px_rgba(0,0,0,0.22)]',
				className
			)}>
			<div className="bg-primary/12 dark:bg-primary/18 absolute top-0 right-0 h-28 w-28 rounded-full blur-3xl" />
			<div className="bg-accent/14 dark:bg-accent/18 absolute bottom-0 left-0 h-24 w-24 rounded-full blur-2xl" />

			<div className="relative mx-auto flex max-w-md flex-col items-center text-center">
				<div className="border-border/70 bg-background/88 mb-5 flex size-16 items-center justify-center rounded-full border shadow-[0_14px_28px_rgba(96,76,48,0.08)] backdrop-blur-sm dark:bg-card/90 dark:shadow-[0_16px_30px_rgba(0,0,0,0.24)]">
					{icon ?? <NotebookPen className="text-primary size-7" />}
				</div>
				<p className="text-primary/70 text-[11px] font-semibold tracking-[0.24em] uppercase">
					{eyebrow}
				</p>
				<h3 className="mt-3 text-xl font-semibold sm:text-[1.4rem]">
					{title}
				</h3>
				<p className="text-muted-foreground mt-3 text-sm leading-6 sm:text-[15px]">
					{description}
				</p>
			</div>
		</section>
	);
}
