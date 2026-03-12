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

const featureChips = ['사진과 짧은 글', '캘린더 복기', 'AI 주간 회고'];

export default function AuthPreviewPanel() {
	return (
		<section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-[linear-gradient(145deg,color-mix(in_oklab,var(--card)_86%,white)_0%,color-mix(in_oklab,var(--secondary)_72%,white)_55%,color-mix(in_oklab,var(--accent)_26%,white)_100%)] p-6 shadow-[0_24px_60px_rgba(96,76,48,0.10)] sm:p-8 dark:bg-[linear-gradient(145deg,color-mix(in_oklab,var(--card)_88%,black)_0%,color-mix(in_oklab,var(--secondary)_62%,black)_55%,color-mix(in_oklab,var(--accent)_18%,black)_100%)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
			<div className="bg-primary/12 absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl" />
			<div className="bg-accent/18 absolute bottom-0 left-0 h-32 w-32 rounded-full blur-2xl" />
			<div className="relative flex h-full flex-col justify-between gap-8">
				<div className="space-y-4">
					<p className="text-primary/75 text-xs font-semibold tracking-[0.28em] uppercase">
						Daily moments
					</p>
					<div className="space-y-3">
						<h1 className="max-w-md text-3xl leading-tight font-semibold sm:text-4xl">
							흘러가는 하루를
							<br />
							차분히 남겨두는 기록장
						</h1>
						<p className="text-muted-foreground max-w-lg text-sm leading-7 sm:text-base">
							스쳐 지나가는 장면을 사진과 짧은 글로 남기고, 시간이 지난 뒤엔
							AI가 한 주의 흐름까지 정리해드려요.
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
							<h2 className="mt-3 text-lg leading-7 font-semibold">{item.title}</h2>
							<p className="text-muted-foreground mt-2 text-sm leading-6">
								{item.description}
							</p>
						</article>
					))}
				</div>

				<div className="flex flex-wrap gap-3">
					{featureChips.map(chip => (
						<span
							key={chip}
							className="border-border/80 bg-background/70 text-muted-foreground rounded-full border px-4 py-2 text-sm backdrop-blur-sm">
							{chip}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
