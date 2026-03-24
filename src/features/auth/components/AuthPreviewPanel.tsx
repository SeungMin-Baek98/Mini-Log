import { useEffect, useState } from 'react';

import { FeatureSurface } from '@/components/ui/surface';
import { cn } from '@/lib/utils';

const previewItems = [
	{
		label: '오늘의 기록',
		title: '퇴근길에 본 노을이 유난히 길게 남았다',
		description:
			'바빴던 하루였는데도 잠깐 멈춰서 사진을 찍었다. 나중에 다시 보면 오늘의 공기까지 떠오를 것 같다.'
	},
	{
		label: '이번 주 흐름',
		title: '작은 장면들이 차곡차곡 쌓이는 중',
		description:
			'사진, 짧은 글, 감정의 결을 모아두면 AI 회고로 한 주의 흐름을 더 선명하게 돌아볼 수 있어요.'
	}
];

const featureChips = [
	{
		text: '사진과 짧은 글을 함께 기록',
		subTitle:
			'하루의 장면을 사진과 짧은 문장으로 남기고\n시간이 지난 뒤에도 그 순간의 감정을 다시 꺼내볼 수 있어요'
	},
	{
		text: 'AI기반 주간 회고로 한 주를 정리',
		subTitle:
			'한 주 동안 쌓인 기록을 바탕으로 AI가 흐름을 정리해줘서\n내가 어떤 시간을 보냈는지 더 쉽게 돌아볼 수 있어요',
		description: '(단 가입 후 7일이 지나야 이용할 수 있어요)'
	}
];

function Chip({
	text,
	subTitle,
	description,
	className = ''
}: {
	text: string;
	subTitle: string;
	description?: string;
	className?: string;
}) {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024) {
				setIsOpen(false);
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<div
			className={cn(
				'group relative whitespace-pre-line sm:whitespace-normal',
				className
			)}>
			<button
				type="button"
				onClick={() => {
					if (window.innerWidth >= 1024) return;
					setIsOpen(prev => !prev);
				}}
				className={cn(
					'border-border/70 bg-background/55 dark:bg-card/55 lg:group-hover:bg-background/70 cursor-pointer rounded-full border px-4 py-2 text-left backdrop-blur-sm transition-colors',
					isOpen && 'bg-background/72'
				)}>
				<span>{text}</span>
			</button>
			<div
				className={cn(
					'text-muted-foreground overflow-hidden pl-2 text-xs leading-6 transition-all duration-300 md:hidden',
					isOpen ? 'mt-2 max-h-24 opacity-100' : 'max-h-0 opacity-0'
				)}>
				<div className="flex flex-col gap-2">
					<span>{subTitle}</span>
					{description && <p className="text-[10px]">{description}</p>}
				</div>
			</div>
			<div
				className={cn(
					'bg-background/95 border-border/80 text-muted-foreground pointer-events-none absolute top-full left-1/2 z-50 mt-3 hidden w-64 -translate-x-1/2 rounded-2xl border px-4 py-3 text-xs leading-6 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur-md transition-all duration-200 md:block',
					isOpen &&
						'pointer-events-auto translate-y-0 opacity-100 lg:pointer-events-none',
					!isOpen && 'translate-y-1 opacity-0',
					'lg:group-hover:pointer-events-auto lg:group-hover:translate-y-0 lg:group-hover:opacity-100'
				)}>
				<div className="bg-background/95 border-border/80 absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-t border-l" />
				<div className="flex flex-col gap-2">
					<span>{subTitle}</span>
					{description && <p className="text-[10px]">{description}</p>}
				</div>
			</div>
		</div>
	);
}

export default function AuthPreviewPanel() {
	return (
		<FeatureSurface
			theme="preview"
			radius="xl"
			padding="roomy"
			overflow="visible"
			contentClassName="flex h-full flex-col justify-between gap-8">
			<div className="space-y-4">
				<p className="text-primary/75 text-xs font-semibold tracking-[0.28em] uppercase">
					Daily moments
				</p>
				<div className="space-y-3">
					<h1 className="max-w-md text-2xl leading-tight font-semibold sm:text-4xl">
						흘러가는 하루를
						<br />
						차분히 남겨두는 기록장
					</h1>
					<p className="text-muted-foreground max-w-lg text-sm leading-7 sm:text-base">
						스쳐 지나가는 장면을 사진과 짧은 글로 남기고, 시간이 지난 뒤엔 AI가
						한 주의 흐름까지 정리해드려요.
					</p>
				</div>
			</div>

			<div className="grid gap-4">
				{previewItems.map(item => (
					<article
						key={item.label}
						className="border-border/70 bg-background/78 rounded-[1.5rem] border p-5 backdrop-blur-sm">
						<p className="text-primary/70 text-[11px] font-semibold tracking-[0.24em] uppercase">
							{item.label}
						</p>
						<h2 className="mt-3 text-base leading-7 font-semibold">
							{item.title}
						</h2>
						<p className="text-muted-foreground mt-2 text-sm leading-6">
							{item.description}
						</p>
					</article>
				))}
			</div>

			<div className="text-muted-foreground relative flex flex-wrap items-center gap-3 text-sm">
				{featureChips.map(chip => (
					<Chip
						key={chip.text}
						text={chip.text}
						subTitle={chip.subTitle}
						description={chip.description}
					/>
				))}
			</div>
		</FeatureSurface>
	);
}
