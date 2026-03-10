import supabase from '@/utils/supabase';
import type {
	InsightSummaryRow,
	WeeklyRecapData,
	WeeklyRecapRecord
} from '@/types';

function isWeeklyRecapData(data: unknown): data is WeeklyRecapData {
	if (!data || typeof data !== 'object') return false;
	const value = data as Record<string, unknown>;
	if (value.mode !== 'funnel' && value.mode !== 'empty') return false;
	if (
		typeof value.periodStart !== 'string' ||
		typeof value.periodEnd !== 'string'
	)
		return false;
	if (!value.counts || typeof value.counts !== 'object') return false;

	const counts = value.counts as Record<string, unknown>;
	if (
		typeof counts.posts !== 'number' ||
		typeof counts.comments !== 'number' ||
		typeof counts.likes !== 'number' ||
		typeof counts.total !== 'number'
	)
		return false;

	if (
		!Array.isArray(value.steps) ||
		!value.steps.every(step => {
			if (!step || typeof step !== 'object') return false;
			const s = step as Record<string, unknown>;
			return (
				typeof s.step === 'number' &&
				typeof s.type === 'string' &&
				typeof s.message === 'string'
			);
		})
	)
		return false;

	if (value.cta !== undefined) {
		if (!value.cta || typeof value.cta !== 'object') return false;
		const cta = value.cta as Record<string, unknown>;
		if (typeof cta.label !== 'string' || typeof cta.href !== 'string')
			return false;
	}

	return true;
}

export async function generateWeeklyInsight() {
	const { data, error } = await supabase.functions.invoke('weekly-insight', {
		body: {}
	});

	if (error) throw error;
	if (!isWeeklyRecapData(data)) {
		throw new Error('주간 회고 응답 형식이 올바르지 않습니다.');
	}

	return data;
}

export async function fetchLatestWeeklyInsight(userId: string) {
	const { data, error } = await supabase
		.from('insight_summary')
		.select('period_end, summary_json')
		.eq('user_id', userId)
		.eq('period_type', 'week')
		.order('period_end', { ascending: false })
		.limit(1)
		.maybeSingle();

	if (error) throw error;
	if (!data) return null;

	const summaryJson = (data as InsightSummaryRow).summary_json;
	if (!isWeeklyRecapData(summaryJson)) return null;
	return {
		periodEnd: data.period_end,
		recap: summaryJson
	} as WeeklyRecapRecord;
}
