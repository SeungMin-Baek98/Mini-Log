import supabase from '@/utils/supabase';

export async function getWeeklyInsight() {
	const { data, error } = await supabase.functions.invoke('weekly-insight');

	if (error) {
		return new Error(error.message);
	}

	return data;
}
