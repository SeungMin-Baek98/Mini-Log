import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const surfaceVariants = cva('border text-card-foreground', {
	variants: {
		tone: {
			default:
				'border-border/80 bg-card/95 shadow-[0_18px_40px_rgba(96,76,48,0.06)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.24)]',
			muted:
				'border-border/80 bg-card/90 dark:bg-card/80 shadow-[0_18px_40px_rgba(96,76,48,0.05)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.24)]',
			frosted:
				'border-border/70 bg-card/80 backdrop-blur-sm dark:bg-card/65 shadow-[0_18px_40px_rgba(96,76,48,0.08)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.24)]',
			page: 'border-border bg-card/90 backdrop-blur-sm shadow-[0_18px_40px_color-mix(in_oklab,var(--foreground)_8%,transparent)]'
		},
		radius: {
			lg: 'rounded-[1.75rem]',
			xl: 'rounded-[2rem]'
		},
		padding: {
			none: '',
			compact: 'p-5',
			card: 'p-5 sm:p-6',
			roomy: 'p-6 sm:p-8'
		}
	},
	defaultVariants: {
		tone: 'default',
		radius: 'lg',
		padding: 'none'
	}
});

const featureSurfaceVariants = cva('border-border/70 relative border', {
	variants: {
		theme: {
			insight:
				'bg-[linear-gradient(145deg,color-mix(in_oklab,var(--card)_88%,white)_0%,color-mix(in_oklab,var(--secondary)_72%,white)_58%,color-mix(in_oklab,var(--accent)_24%,white)_100%)] shadow-[0_18px_40px_rgba(96,76,48,0.06)] dark:bg-[linear-gradient(145deg,color-mix(in_oklab,var(--card)_90%,green)_20%,color-mix(in_oklab,var(--secondary)_80%,black)_58%,color-mix(in_oklab,var(--accent)_16%,black)_100%)] dark:shadow-[0_20px_46px_rgba(0,0,0,0.28)]',
			profile:
				'bg-[linear-gradient(135deg,color-mix(in_oklab,var(--card)_94%,white)_0%,color-mix(in_oklab,var(--secondary)_78%,white)_100%)] shadow-[0_22px_50px_rgba(96,76,48,0.07)] dark:bg-[linear-gradient(135deg,color-mix(in_oklab,var(--card)_92%,black)_0%,color-mix(in_oklab,var(--secondary)_66%,black)_100%)] dark:shadow-[0_24px_52px_rgba(0,0,0,0.3)]',
			preview:
				'bg-[linear-gradient(145deg,color-mix(in_oklab,var(--card)_86%,white)_0%,color-mix(in_oklab,var(--secondary)_72%,white)_55%,color-mix(in_oklab,var(--accent)_26%,white)_100%)] shadow-[0_24px_60px_rgba(96,76,48,0.10)] dark:bg-[linear-gradient(145deg,color-mix(in_oklab,var(--card)_88%,black)_0%,color-mix(in_oklab,var(--secondary)_62%,black)_55%,color-mix(in_oklab,var(--accent)_18%,black)_100%)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.28)]'
		},
		radius: {
			lg: 'rounded-[1.75rem]',
			xl: 'rounded-[2rem]'
		},
		padding: {
			none: '',
			card: 'p-5 sm:p-6',
			roomy: 'p-6 sm:p-8'
		},
		overflow: {
			hidden: 'overflow-hidden',
			visible: 'overflow-visible'
		}
	},
	defaultVariants: {
		theme: 'insight',
		radius: 'lg',
		padding: 'card',
		overflow: 'hidden'
	}
});

const radiusClassMap = {
	lg: 'rounded-[1.75rem]',
	xl: 'rounded-[2rem]'
} as const;

const featureGlowClassMap = {
	insight: {
		top: 'bg-primary/12 dark:bg-primary/18 absolute top-0 right-0 h-28 w-28 rounded-full blur-3xl',
		bottom:
			'bg-accent/14 dark:bg-accent/18 absolute bottom-0 left-0 h-24 w-24 rounded-full blur-2xl'
	},
	profile: {
		top: 'bg-primary/10 dark:bg-primary/16 absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl',
		bottom:
			'bg-accent/10 dark:bg-accent/14 absolute bottom-0 left-0 h-24 w-24 rounded-full blur-2xl'
	},
	preview: {
		top: 'bg-primary/12 absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl',
		bottom:
			'bg-accent/18 absolute bottom-0 left-0 h-32 w-32 rounded-full blur-2xl'
	}
} as const;

type SurfaceTag = 'article' | 'div' | 'section';

type SurfaceProps = React.HTMLAttributes<HTMLElement> &
	VariantProps<typeof surfaceVariants> & {
		as?: SurfaceTag;
	};

function Surface({
	as = 'div',
	className,
	tone,
	radius,
	padding,
	...props
}: SurfaceProps) {
	const Comp = as;

	return (
		<Comp
			className={cn(surfaceVariants({ tone, radius, padding }), className)}
			{...props}
		/>
	);
}

type FeatureSurfaceProps = React.HTMLAttributes<HTMLElement> &
	VariantProps<typeof featureSurfaceVariants> & {
		as?: SurfaceTag;
		bottomGlowClassName?: string;
		contentClassName?: string;
		decorationClassName?: string;
		topGlowClassName?: string;
	};

function FeatureSurface({
	as = 'section',
	bottomGlowClassName,
	children,
	className,
	contentClassName,
	decorationClassName,
	overflow,
	padding,
	radius = 'lg',
	theme = 'insight',
	topGlowClassName,
	...props
}: FeatureSurfaceProps) {
	const Comp = as;
	const resolvedTheme = theme ?? 'insight';
	const resolvedRadius = radius ?? 'lg';
	const glowClasses = featureGlowClassMap[resolvedTheme];

	return (
		<Comp
			className={cn(
				featureSurfaceVariants({
					theme: resolvedTheme,
					radius: resolvedRadius,
					padding,
					overflow
				}),
				className
			)}
			{...props}>
			<div
				className={cn(
					'pointer-events-none absolute inset-0 overflow-hidden',
					radiusClassMap[resolvedRadius],
					decorationClassName
				)}>
				<div className={cn(glowClasses.top, topGlowClassName)} />
				<div className={cn(glowClasses.bottom, bottomGlowClassName)} />
			</div>
			<div className={cn('relative', contentClassName)}>{children}</div>
		</Comp>
	);
}

export { FeatureSurface, Surface };
