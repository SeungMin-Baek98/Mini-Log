import supabase from '@/utils/supabase';
import type { InsightSummaryRow, WeeklyRecapData } from '@/types';

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
	if (!Array.isArray(value.steps)) return false;
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
		.select('*')
		.eq('user_id', userId)
		.eq('period_type', 'week')
		.order('period_end', { ascending: false })
		.limit(1)
		.maybeSingle();

	if (error) throw error;
	if (!data) return null;

	const summaryJson = (data as InsightSummaryRow).summary_json;
	if (!isWeeklyRecapData(summaryJson)) return null;
	return summaryJson;
}
