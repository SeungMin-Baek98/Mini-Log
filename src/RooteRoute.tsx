import { Navigate, Route, Routes } from 'react-router';

import SigninPage from './pages/SignIn';
import SignUpPage from './pages/Signup';
import ForgetPasswordPage from './pages/ForgetPassword';
import IndexPage from './pages/Index';
import ProfileDetailPage from './pages/ProfileDetail';
import PostDetailPage from './pages/PostDetail';
import ResetPasswordPage from './pages/ResetPassword';
import GlobalLayout from './components/layout/GlobalLayout';

export default function RooteRoute() {
	return (
		<Routes>
			<Route element={<GlobalLayout />}>
				<Route path="sign-in" element={<SigninPage />} />
				<Route path="sign-up" element={<SignUpPage />} />
				<Route path="forget-password" element={<ForgetPasswordPage />} />
				<Route path="/" element={<IndexPage />} />
				<Route path="post/:postId" element={<PostDetailPage />} />
				<Route path="profile/:userId" element={<ProfileDetailPage />} />
				<Route path="reset/password" element={<ResetPasswordPage />} />
				/** 위의 경로 이외에 경로 접속시 Index페이지로 Redirect */
				<Route path="*" element={<Navigate to={'/'} />} />
			</Route>
		</Routes>
	);
}
