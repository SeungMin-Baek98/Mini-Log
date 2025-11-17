import { getRandomNickname } from '@/lib/utils';
import supabase from '@/utils/supabase';

/** 유저의 프로필 정보를 불러오는 함수 */
export async function fetchProfile(userId: string) {
	const { data, error } = await supabase
		.from('profile')
		.select('*')
		.eq('id', userId)
		.single();
	if (error) throw error;

	return data;
}

export async function createProfile(userId: string) {
	const { data, error } = await supabase
		.from('profile')
		.insert({
			id: userId,
			nickname: getRandomNickname()
		})
		.select()
		.single();

	if (error) throw error;
	return data;
}
