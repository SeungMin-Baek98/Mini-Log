import type { ComponentProps, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = Omit<ComponentProps<typeof Button>, 'children'> & {
	icon?: ReactNode;
	children: ReactNode;
};

export default function SocialLoginButton({
	icon,
	children,
	className,
	variant = 'outline',
	...props
}: Props) {
	return (
		<Button
			className={cn('w-full truncate', className)}
			variant={variant}
			{...props}>
			{icon}
			{children}
		</Button>
	);
}
