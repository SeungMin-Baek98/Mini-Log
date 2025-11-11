import { type Database } from './database.types';

/** Supabase Post 타입 정의 */
export type PostEntity = Database['public']['Tables']['post']['Row'];
