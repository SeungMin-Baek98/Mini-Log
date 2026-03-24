import { Button } from '@/components/ui/button';
import { useProfileData } from '@/features/profile/hooks/queries/useProfileData';
import { generateErrorMessage } from '@/lib/error';
import { useGenerateWeeklyInsight } from '@/features/insight/hooks/mutations/useGenerateWeeklyInsight';
import { useWeeklyInsightData } from '@/features/insight/hooks/queries/useWeeklyInsightData';
import { useSession } from '@/store/session';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useRequireAuth } from '@/features/auth/hooks/useRequireAuth';
import { FeatureSurface } from '@/components/ui/surface';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default function WeeklyInsightCard() {
	const session = useSession();
	const requireAuth = useRequireAuth();
	const { data: profile, isLoading: isProfileLoading } = useProfileData(
		session?.user.id
	);
	const { data: latestRecap, isLoading } = useWeeklyInsightData();
	const { mutateAsync: generateInsight, isPending } =
		useGenerateWeeklyInsight();
	const [isJustCreated, setIsJustCreated] = useState(false);

	const isNewUser = useMemo(() => {
		if (!profile?.created_at) return false;
		const createdAt = new Date(profile.created_at).getTime();
		if (Number.isNaN(createdAt)) return false;

		return Date.now() - createdAt < ONE_WEEK_MS;
	}, [profile?.created_at]);

	const isHidden = useMemo(() => {
		if (isJustCreated) return true;
		if (!latestRecap?.periodEnd) return false;

		const periodEnd = new Date(latestRecap.periodEnd).getTime();
		if (Number.isNaN(periodEnd)) return false;

		return Date.now() - periodEnd < ONE_WEEK_MS;
	}, [latestRecap?.periodEnd, isJustCreated]);

	const handleGenerateInsight = async () => {
		if (
			!requireAuth({
				message: 'AI 주간 회고는 로그인 후 생성할 수 있어요.'
			})
		) {
			return;
		}

		try {
			await generateInsight();
			setIsJustCreated(true);
			toast.success('주간 회고가 생성됐어요. 알림창에서 확인해보세요!', {
				position: 'top-center'
			});
		} catch (error) {
			toast.error(generateErrorMessage(error), {
				position: 'top-center'
			});
		}
	};

	if (isProfileLoading) return null;
	if (isNewUser) return null;
	if (isLoading) return null;
	if (isHidden) return null;

	return (
		<FeatureSurface
			theme="insight"
			contentClassName="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
			<div>
				<p className="text-primary/70 mb-2 text-xs font-medium tracking-[0.22em] uppercase">
					Weekly letter
				</p>
				<h2 className="text-2xl font-semibold">AI 주간 회고</h2>
				<p className="text-muted-foreground mt-2 text-sm leading-6">
					지난 한 주의 기록을 차분하게 정리해서 알림으로 보내드려요.
					<br />
					(단 가입 후 일주일이 지난 사용자에게만 보여집니다)
				</p>
			</div>
			<Button
				onClick={handleGenerateInsight}
				disabled={isPending}
				className="cursor-pointer rounded-full px-5">
				{isPending ? '생성 중...' : '회고 생성'}
			</Button>
		</FeatureSurface>
	);
}
