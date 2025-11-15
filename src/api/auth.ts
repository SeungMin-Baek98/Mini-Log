/** 인증관련 API 호출 */

import supabase from '@/utils/supabase';
import type { Provider } from '@supabase/supabase-js';

export async function signUp({ email, password }: { email: string; password: string }) {
	const { data, error } = await supabase.auth.signUp({ email, password });

	if (error) throw error;

	return data;
}

export async function signInWithPassword({ email, password }: { email: string; password: string }) {
	const { data, error } = await supabase.auth.signInWithPassword({ email, password });

	if (error) throw error;

	return data;
}

export async function signInWithOAuth(provider: Provider) {
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider
	});

	if (error) throw error;

	return data;
}
