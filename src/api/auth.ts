/** 인증관련 API 호출 */

import type { Provider } from '@supabase/supabase-js';

import supabase from '@/utils/supabase';

export async function signOut() {
	const { error } = await supabase.auth.signOut();

	if (error) {
		await supabase.auth.signOut({
			scope: 'local' // 로컬 세션만 종료(브라우저 토큰 삭제)
		});
	}
}

export async function signUp({
	email,
	password
}: {
	email: string;
	password: string;
}) {
	const { data, error } = await supabase.auth.signUp({ email, password });

	if (error) throw error;

	return data;
}

export async function signInWithPassword({
	email,
	password
}: {
	email: string;
	password: string;
}) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password
	});

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

export async function requestPasswordResetEmail(email: string) {
	const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${import.meta.env.VITE_PUBLIC_URL}/reset-password`
	});

	if (error) throw error;

	return data;
}

export async function updatePassword(password: string) {
	const { data, error } = await supabase.auth.updateUser({
		password
	});
	if (error) throw error;

	return data;
}
