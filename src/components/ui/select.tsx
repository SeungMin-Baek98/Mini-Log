import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

export type SelectOption<T extends string = string> = {
	label: string;
	value: T;
};

type SelectProps<T extends string> = Omit<
	React.ComponentProps<'select'>,
	'value' | 'onChange'
> & {
	options: SelectOption<T>[];
	value: T;
	onChange: (value: T) => void;
	containerClassName?: string;
};

function Select<T extends string>({
	className,
	containerClassName,
	options,
	value,
	onChange,
	...props
}: SelectProps<T>) {
	return (
		<div className={cn('relative inline-flex', containerClassName)}>
			<select
				data-slot="select"
				value={value}
				onChange={event => onChange(event.target.value as T)}
				className={cn(
					'border-input bg-background text-foreground h-9 w-full min-w-28 appearance-none rounded-md border px-3 py-1 pr-9 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
					'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
					'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
					className
				)}
				{...props}>
				{options.map(option => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			<ChevronDown
				className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2"
				aria-hidden
			/>
		</div>
	);
}

export { Select };
