import { Button } from '@/components/ui/button';
import { useProfileData } from '@/features/profile/hooks/queries/useProfileData';
import { generateErrorMessage } from '@/lib/error';
import { useGenerateWeeklyInsight } from '@/features/insight/hooks/mutations/useGenerateWeeklyInsight';
import { useWeeklyInsightData } from '@/features/insight/hooks/queries/useWeeklyInsightData';
import { useSession } from '@/store/session';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default function WeeklyInsightCard() {
	const session = useSession();
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
		<section className="bg-card flex flex-col gap-4 rounded-xl border p-5">
			<div className="flex items-center justify-between gap-3">
				<div>
					<h2 className="text-base font-semibold">AI 주간 회고</h2>
					<p className="text-muted-foreground text-xs">
						버튼을 누르면 주간 회고를 생성하고 알림으로 알려드려요.
					</p>
				</div>
				<Button onClick={handleGenerateInsight} disabled={isPending}>
					{isPending ? '생성 중...' : '회고 생성'}
				</Button>
			</div>
		</section>
	);
}
