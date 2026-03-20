import { cn } from '@/lib/utils';
import {
	CheckCheckIcon,
	CircleAlertIcon,
	InfoIcon,
	LoaderCircleIcon,
	XIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const iconWrapperClass =
	'flex size-9 items-center justify-center rounded-full border bg-background/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-sm';

const Toaster = ({ ...props }: ToasterProps) => {
	const [theme, setTheme] = useState<ToasterProps['theme']>('light');

	useEffect(() => {
		const root = document.documentElement;

		const syncTheme = () => {
			setTheme(root.classList.contains('dark') ? 'dark' : 'light');
		};

		syncTheme();

		const observer = new MutationObserver(syncTheme);

		observer.observe(root, {
			attributes: true,
			attributeFilter: ['class']
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<Sonner
			theme={theme}
			className="toaster group"
			position="top-center"
			expand
			gap={14}
			offset={24}
			mobileOffset={16}
			visibleToasts={4}
			icons={{
				success: (
					<span
						className={cn(
							iconWrapperClass,
							'border-primary/20 bg-primary/12 text-primary'
						)}>
						<CheckCheckIcon className="size-4.5" />
					</span>
				),
				info: (
					<span
						className={cn(
							iconWrapperClass,
							'border-accent/30 bg-accent/14 text-accent-foreground'
						)}>
						<InfoIcon className="size-4.5" />
					</span>
				),
				error: (
					<span
						className={cn(
							iconWrapperClass,
							'border-destructive/20 bg-destructive/12 text-destructive'
						)}>
						<CircleAlertIcon className="size-4.5" />
					</span>
				),
				loading: (
					<span
						className={cn(
							iconWrapperClass,
							'border-primary/18 bg-secondary/88 text-primary'
						)}>
						<LoaderCircleIcon className="size-4.5 animate-spin" />
					</span>
				),
				close: <XIcon className="size-4" />
			}}
			toastOptions={{
				classNames: {
					toast:
						"group pointer-events-auto relative isolate overflow-hidden rounded-[1.5rem] border border-border/70 px-4 py-4 backdrop-blur-xl items-start gap-3 text-[0.95rem] shadow-[0_18px_40px_rgba(96,76,48,0.08)] before:absolute before:inset-0 before:-z-10 before:bg-[linear-gradient(145deg,color-mix(in_oklab,var(--card)_90%,white)_0%,color-mix(in_oklab,var(--secondary)_72%,white)_56%,color-mix(in_oklab,var(--accent)_18%,white)_100%)] before:content-[''] after:absolute after:-top-10 after:right-0 after:-z-10 after:h-24 after:w-24 after:rounded-full after:bg-primary/10 after:blur-3xl after:content-[''] dark:border-border/80 dark:shadow-[0_22px_46px_rgba(0,0,0,0.28)] dark:before:bg-[linear-gradient(145deg,color-mix(in_oklab,var(--card)_90%,black)_0%,color-mix(in_oklab,var(--secondary)_68%,black)_58%,color-mix(in_oklab,var(--accent)_15%,black)_100%)] dark:after:bg-primary/16",
					title: 'text-foreground text-[15px] leading-5 font-semibold',
					description: 'text-muted-foreground mt-1 text-[13px] leading-5',
					content: 'gap-0',
					icon: 'mt-0.5 !h-9 !w-9',
					closeButton:
						'!left-auto !right-4 !top-4 !translate-x-0 !translate-y-0 !border-border/70 !bg-background/82 !text-muted-foreground hover:!bg-secondary hover:!text-foreground',
					actionButton:
						'!h-9 !rounded-full !bg-primary !px-4 !text-primary-foreground !font-medium !shadow-[0_12px_24px_rgba(47,93,80,0.22)]',
					cancelButton:
						'!h-9 !rounded-full !border !border-border/80 !bg-card/90 !px-4 !text-foreground',
					success:
						'border-primary/18 before:bg-[linear-gradient(145deg,color-mix(in_oklab,var(--card)_88%,white)_0%,color-mix(in_oklab,var(--primary)_10%,white)_100%)] dark:before:bg-[linear-gradient(145deg,color-mix(in_oklab,var(--card)_88%,black)_0%,color-mix(in_oklab,var(--primary)_14%,black)_100%)]',
					info: 'border-accent/28 before:bg-[linear-gradient(145deg,color-mix(in_oklab,var(--card)_88%,white)_0%,color-mix(in_oklab,var(--accent)_16%,white)_100%)] dark:before:bg-[linear-gradient(145deg,color-mix(in_oklab,var(--card)_88%,black)_0%,color-mix(in_oklab,var(--accent)_18%,black)_100%)]',
					error:
						'border-destructive/18 before:bg-[linear-gradient(145deg,color-mix(in_oklab,var(--card)_92%,white)_0%,color-mix(in_oklab,var(--destructive)_10%,white)_100%)] dark:before:bg-[linear-gradient(145deg,color-mix(in_oklab,var(--card)_88%,black)_0%,color-mix(in_oklab,var(--destructive)_14%,black)_100%)]',
					loading:
						'border-primary/16 before:bg-[linear-gradient(145deg,color-mix(in_oklab,var(--card)_90%,white)_0%,color-mix(in_oklab,var(--secondary)_84%,white)_100%)] dark:before:bg-[linear-gradient(145deg,color-mix(in_oklab,var(--card)_90%,black)_0%,color-mix(in_oklab,var(--secondary)_80%,black)_100%)]',
					default:
						'before:bg-[linear-gradient(145deg,color-mix(in_oklab,var(--card)_90%,white)_0%,color-mix(in_oklab,var(--secondary)_72%,white)_56%,color-mix(in_oklab,var(--accent)_18%,white)_100%)] dark:before:bg-[linear-gradient(145deg,color-mix(in_oklab,var(--card)_90%,black)_0%,color-mix(in_oklab,var(--secondary)_68%,black)_58%,color-mix(in_oklab,var(--accent)_15%,black)_100%)]'
				}
			}}
			style={
				{
					'--normal-bg': 'transparent',
					'--normal-text': 'var(--foreground)',
					'--normal-border': 'transparent',
					'--border-radius': '1.5rem'
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
