import type { ReactNode } from 'react';

import AuthPreviewPanel from './AuthPreviewPanel';

type Props = {
	children: ReactNode;
};

export default function AuthShell({ children }: Props) {
	return (
		<div className="grid min-h-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch">
			<AuthPreviewPanel />
			<section className="flex min-h-[620px] items-center justify-center rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-[0_18px_40px_rgba(96,76,48,0.08)] backdrop-blur-sm sm:p-8 dark:bg-card/65 dark:shadow-[0_18px_40px_rgba(0,0,0,0.24)]">
				<div className="w-full max-w-md">{children}</div>
			</section>
		</div>
	);
}
