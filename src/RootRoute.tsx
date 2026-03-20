import {
	createBrowserRouter,
	createRoutesFromElements,
	Navigate,
	type LoaderFunctionArgs,
	Route
} from 'react-router';

import SigninPage from './pages/SignIn';
import SignUpPage from './pages/Signup';
import ForgetPasswordPage from './pages/ForgetPassword';
import IndexPage from './pages/Index';
import ProfileDetailPage from './pages/ProfileDetail';
import PostDetailPage from './pages/PostDetail';
import ResetPasswordPage from './pages/ResetPassword';
import PrivacyPolicyPage from './pages/PrivacyPolicy';
import GlobalLayout from './components/layout/GlobalLayout';
import GuestOnlyLayout from './components/layout/GuestOnlyLayout';
import MemberOnlyLayout from './components/layout/MemberOnlyLayout';
import RouteErrorPage from './pages/RouteError';
import { queryClient } from '@/lib/queryClient';
import { getPostByIdQueryOptions } from '@/features/post/hooks/queries/usePostByIdData';
import { getProfileQueryOptions } from '@/features/profile/hooks/queries/useProfileData';
import {
	AppRouteError,
	isNotFoundRouteError,
	isUuid,
	parsePositiveInteger
} from '@/lib/route-error';
import supabase from '@/utils/supabase';

async function getCurrentSessionOrThrow() {
	const { data, error } = await supabase.auth.getSession();

	if (error) {
		throw new AppRouteError({
			status: 500,
			title: '세션을 확인하지 못했어요',
			description: '잠시 후 다시 시도해주세요.'
		});
	}

	return data.session;
}

async function postDetailLoader({ params }: LoaderFunctionArgs) {
	const postId = parsePositiveInteger(params.postId);

	if (!postId) {
		throw new AppRouteError({
			status: 404,
			title: '존재하지 않는 게시글이에요',
			description: '게시글 주소를 다시 확인한 뒤 다른 기록으로 이동해주세요.'
		});
	}

	const session = await getCurrentSessionOrThrow();

	try {
		await queryClient.fetchQuery({
			...getPostByIdQueryOptions({
				postId,
				userId: session?.user.id
			}),
			staleTime: 0
		});
	} catch (error) {
		if (isNotFoundRouteError(error)) {
			throw new AppRouteError({
				status: 404,
				title: '존재하지 않는 게시글이에요',
				description: '이미 삭제되었거나 잘못된 주소일 수 있어요.'
			});
		}

		throw new AppRouteError({
			status: 500,
			title: '게시글을 불러오지 못했어요',
			description: '잠시 후 다시 시도해주세요.'
		});
	}

	return null;
}

async function profileDetailLoader({ params }: LoaderFunctionArgs) {
	const userId = params.userId;

	if (!userId || !isUuid(userId)) {
		throw new AppRouteError({
			status: 404,
			title: '존재하지 않는 프로필이에요',
			description: '프로필 주소를 다시 확인한 뒤 다른 페이지로 이동해주세요.'
		});
	}

	const session = await getCurrentSessionOrThrow();

	try {
		await queryClient.fetchQuery({
			...getProfileQueryOptions({
				userId,
				sessionUserId: session?.user.id
			}),
			staleTime: 0
		});
	} catch (error) {
		if (isNotFoundRouteError(error)) {
			throw new AppRouteError({
				status: 404,
				title: '존재하지 않는 프로필이에요',
				description: '탈퇴했거나 잘못된 주소로 접근했을 수 있어요.'
			});
		}

		throw new AppRouteError({
			status: 500,
			title: '프로필을 불러오지 못했어요',
			description: '잠시 후 다시 시도해주세요.'
		});
	}

	return null;
}

export const router = createBrowserRouter(
	createRoutesFromElements(
		<Route element={<GlobalLayout />} errorElement={<RouteErrorPage />}>
			<Route index element={<IndexPage />} />
			<Route path="privacy-policy" element={<PrivacyPolicyPage />} />
			<Route
				path="post/:postId"
				loader={postDetailLoader}
				element={<PostDetailPage />}
			/>
			<Route
				path="profile/:userId"
				loader={profileDetailLoader}
				element={<ProfileDetailPage />}
			/>
			<Route element={<GuestOnlyLayout />}>
				<Route path="sign-in" element={<SigninPage />} />
				<Route path="sign-up" element={<SignUpPage />} />
				<Route path="forget-password" element={<ForgetPasswordPage />} />
			</Route>
			<Route element={<MemberOnlyLayout />}>
				<Route path="reset-password" element={<ResetPasswordPage />} />
			</Route>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Route>
	)
);
