import type { ReactNode } from 'react';

import { Surface } from '@/components/ui/surface';
import AuthPreviewPanel from './AuthPreviewPanel';

type Props = {
	children: ReactNode;
};

export default function AuthShell({ children }: Props) {
	return (
		<div className="grid min-h-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch">
			<AuthPreviewPanel />
			<Surface
				as="section"
				tone="frosted"
				radius="xl"
				padding="roomy"
				className="flex min-h-[620px] items-center justify-center">
				<div className="w-full max-w-md">{children}</div>
			</Surface>
		</div>
	);
}
