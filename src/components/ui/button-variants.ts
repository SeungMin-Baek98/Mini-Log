import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: {
				default:
					'bg-primary text-primary-foreground shadow-[0_12px_24px_rgba(47,93,80,0.22)] hover:bg-primary/92 hover:shadow-[0_16px_30px_rgba(47,93,80,0.26)]',
				destructive:
					'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
				outline:
					'border border-border/80 bg-card/90 shadow-[0_10px_24px_rgba(96,76,48,0.05)] hover:bg-secondary hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
				secondary:
					'bg-secondary text-secondary-foreground shadow-[0_10px_24px_rgba(96,76,48,0.05)] hover:bg-secondary/80',
				ghost:
					'hover:bg-secondary hover:text-foreground dark:hover:bg-accent/50',
				link: 'text-primary underline-offset-4 hover:underline'
			},
			size: {
				default: 'h-10 px-5 py-2 has-[>svg]:px-4',
				sm: 'h-9 gap-1.5 px-4 has-[>svg]:px-3',
				lg: 'h-11 px-7 has-[>svg]:px-5',
				icon: 'size-9'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
);
