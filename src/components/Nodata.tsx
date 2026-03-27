import type { ComponentProps, ReactNode } from 'react';
import { NotebookPen } from 'lucide-react';

import { Surface } from '@/components/ui/surface';
import { cn } from '@/lib/utils';

type NoDataProps = Omit<
	ComponentProps<typeof Surface>,
	'children' | 'padding'
> & {
	eyebrow?: string;
	title?: string;
	description?: string;
	icon?: ReactNode;
	contentClassName?: string;
};

export default function NoData({
	as = 'section',
	contentClassName,
	eyebrow = 'Quiet page',
	title = '아직 남겨진 기록이 없어요',
	description = '첫 이야기가 올라오면 이곳에 차분하게 쌓여갈 거예요.',
	icon,
	className,
	radius = 'lg',
	tone = 'default',
	...props
}: NoDataProps) {
	return (
		<Surface
			as={as}
			radius={radius}
			tone={tone}
			className={cn(
				'relative overflow-hidden px-5 py-10 sm:px-6 sm:py-12',
				className
			)}
			{...props}>
			<div className="bg-primary/12 dark:bg-primary/18 absolute top-0 right-0 h-28 w-28 rounded-full blur-3xl" />
			<div className="bg-accent/14 dark:bg-accent/18 absolute bottom-0 left-0 h-24 w-24 rounded-full blur-2xl" />

			<div
				className={cn(
					'relative mx-auto flex max-w-md flex-col items-center text-center',
					contentClassName
				)}>
				<div className="border-border/70 bg-background/88 dark:bg-card/90 mb-5 flex size-16 items-center justify-center rounded-full border shadow-[0_14px_28px_rgba(96,76,48,0.08)] backdrop-blur-sm dark:shadow-[0_16px_30px_rgba(0,0,0,0.24)]">
					{icon ?? <NotebookPen className="text-primary size-7" />}
				</div>
				<p className="text-primary/70 text-[11px] font-semibold tracking-[0.24em] uppercase">
					{eyebrow}
				</p>
				<h3 className="mt-3 text-xl font-semibold sm:text-[1.4rem]">{title}</h3>
				<p className="text-muted-foreground mt-3 text-sm leading-6 sm:text-[15px]">
					{description}
				</p>
			</div>
		</Surface>
	);
}
