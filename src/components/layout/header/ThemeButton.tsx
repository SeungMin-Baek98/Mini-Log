import { CheckIcon, MoonIcon, SunIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { PopoverClose } from '@radix-ui/react-popover';
import type { Theme } from '@/types';
import { useSetTheme, useThemme } from '@/store/theme';

const THEME: Theme[] = ['system', 'dark', 'light'];

export default function ThemeButton() {
	const currentTheme = useThemme();
	const setTheme = useSetTheme();

	return (
		<Popover>
			<PopoverTrigger>
				<div className="hover:bg-muted cursor-pointer rounded-full p-2">
					{currentTheme === 'dark' ? <MoonIcon /> : <SunIcon />}
				</div>
			</PopoverTrigger>
			<PopoverContent className="w-35 p-0">
				{THEME.map(theme => (
					<PopoverClose key={`theme-button-${theme}`} asChild>
						<div
							onClick={() => {
								setTheme(theme);
							}}
							className="hover:bg-muted flex cursor-pointer items-center justify-between p-3">
							{theme}
							{currentTheme === theme && <CheckIcon className="h-4 w-4" />}
						</div>
					</PopoverClose>
				))}
			</PopoverContent>
		</Popover>
	);
}
