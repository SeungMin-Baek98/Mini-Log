import type { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = ComponentProps<typeof Button>;

export default function AuthSubmitButton({
	className,
	type = 'submit',
	...props
}: Props) {
	return <Button className={cn('w-full', className)} type={type} {...props} />;
}
