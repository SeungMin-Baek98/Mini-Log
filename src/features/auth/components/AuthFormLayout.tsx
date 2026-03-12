import type { FormEventHandler, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type Props = {
	title: string;
	description?: string;
	children: ReactNode;
	className?: string;
	contentClassName?: string;
	onSubmit?: FormEventHandler<HTMLFormElement>;
};

export default function AuthFormLayout({
	title,
	description,
	children,
	className,
	contentClassName,
	onSubmit
}: Props) {
	return (
		<form
			className={cn('flex w-full flex-col gap-8', className)}
			onSubmit={onSubmit}>
			<div className="flex flex-col gap-2">
				<div className="text-2xl font-bold">{title}</div>
				{description && (
					<div className="text-muted-foreground text-sm leading-6">
						{description}
					</div>
				)}
			</div>
			<div className={cn('flex flex-col gap-8', contentClassName)}>
				{children}
			</div>
		</form>
	);
}
