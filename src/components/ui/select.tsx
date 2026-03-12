import * as React from 'react';
import { CheckIcon, ChevronDown } from 'lucide-react';

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
	const [open, setOpen] = React.useState(false);
	const rootRef = React.useRef<HTMLDivElement>(null);

	const selectedOption = options.find(option => option.value === value);

	React.useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (!rootRef.current?.contains(event.target as Node)) {
				setOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div ref={rootRef} className={cn('relative w-32', className)}>
			<button
				type="button"
				onClick={() => setOpen(prev => !prev)}
				className="border-input bg-card text-foreground flex h-11 w-full items-center justify-between rounded-full border px-4 text-sm">
				<span>{selectedOption?.label ?? '선택해주세요'}</span>
				<ChevronDown
					className={cn('size-4 transition', open && 'rotate-180')}
				/>
			</button>

			{open && (
				<ul
					role="listbox"
					className="bg-card absolute top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border shadow-lg">
					{options.map(option => {
						const isSelected = option.value === value;

						return (
							<li key={option.value}>
								<button
									type="button"
									role="option"
									aria-selected={isSelected}
									onClick={() => {
										onChange(option.value);
										setOpen(false);
									}}
									className={cn(
										'hover:bg-muted-foreground/60 flex w-full items-center justify-between px-4 py-3 text-left text-sm',
										isSelected && 'font-semibold'
									)}>
									<span>{option.label}</span>
									{isSelected && <CheckIcon className="size-4" />}
								</button>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}

export { Select };
