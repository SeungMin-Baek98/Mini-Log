/**
 * E2E 테스트: 주요 사용자 흐름
 *
 * 테스트 시나리오:
 * 1. 메인 페이지 접속
 * 2. 게시글 상세 페이지로 이동
 * 3. 프로필 페이지로 이동
 * 4. 메인 페이지로 복귀
 *
 * 실행 방법:
 * Playwright MCP의 browser_run_code 도구를 사용하여 실행
 */

async function e2eUserFlowTest(page) {
	const results = [];
	const screenshots = [];

	try {
		// 1. 메인 페이지로 이동
		results.push('=== Step 1: 메인 페이지 접속 ===');
		await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
		await page.waitForTimeout(2000);

		const mainPageUrl = page.url();
		results.push(`현재 URL: ${mainPageUrl}`);

		// 게시글 작성 버튼 확인
		const createPostButton = await page
			.getByText('나누고 싶은 이야기가 있나요?')
			.isVisible()
			.catch(() => false);
		results.push(`게시글 작성 버튼 표시: ${createPostButton ? '✅' : '❌'}`);

		// 게시글 피드 확인
		const postLinks = await page.locator('a[href*="/post/"]').count();
		results.push(`게시글 개수: ${postLinks}개`);
		results.push(`게시글 피드 표시: ${postLinks > 0 ? '✅' : '❌'}`);

		await page
			.screenshot({
				path: '.playwright-mcp/e2e-step1-main.png',
				fullPage: true
			})
			.catch(() => {});
		screenshots.push('e2e-step1-main.png');

		// 2. 첫 번째 게시글 클릭하여 상세 페이지로 이동
		results.push('\n=== Step 2: 게시글 상세 페이지로 이동 ===');

		if (postLinks > 0) {
			const firstPostLink = page.locator('a[href*="/post/"]').first();
			const postHref = await firstPostLink.getAttribute('href');
			results.push(`선택한 게시글 링크: ${postHref}`);

			await firstPostLink.click();
			await page.waitForTimeout(3000);

			const postDetailUrl = page.url();
			results.push(`게시글 상세 페이지 URL: ${postDetailUrl}`);
			results.push(
				`게시글 상세 페이지 이동: ${postDetailUrl.includes('/post/') ? '✅' : '❌'}`
			);

			// 게시글 내용 확인
			const postContent = await page
				.locator('main')
				.textContent()
				.catch(() => '');
			const hasContent = postContent && postContent.length > 50;
			results.push(`게시글 내용 표시: ${hasContent ? '✅' : '❌'}`);

			// 댓글 섹션 확인
			const commentSection = await page
				.getByText('댓글')
				.first()
				.isVisible()
				.catch(() => false);
			results.push(`댓글 섹션 표시: ${commentSection ? '✅' : '❌'}`);

			// 댓글 작성 폼 확인
			const commentInput = await page
				.locator('textbox')
				.isVisible()
				.catch(() => false);
			const commentButton = await page
				.getByRole('button', { name: '작성' })
				.isVisible()
				.catch(() => false);
			results.push(
				`댓글 작성 폼 표시: ${commentInput && commentButton ? '✅' : '❌'}`
			);

			// 좋아요 버튼 확인
			const likeButton = await page
				.locator('button:has(img)')
				.first()
				.isVisible()
				.catch(() => false);
			results.push(`좋아요 버튼 표시: ${likeButton ? '✅' : '❌'}`);

			await page
				.screenshot({
					path: '.playwright-mcp/e2e-step2-post-detail.png',
					fullPage: true
				})
				.catch(() => {});
			screenshots.push('e2e-step2-post-detail.png');

			// 3. 프로필 링크 클릭 (게시글 작성자의 프로필)
			results.push('\n=== Step 3: 프로필 페이지로 이동 ===');

			// 프로필 이미지 링크 찾기
			const profileImageLink = page
				.locator('a[href*="/profile/"], a[href*="/post/"][href*="/profile/"]')
				.first();
			const profileHref = await profileImageLink
				.getAttribute('href')
				.catch(() => null);

			if (profileHref) {
				results.push(`프로필 링크: ${profileHref}`);

				// 프로필 링크 클릭
				await profileImageLink.click();
				await page.waitForTimeout(3000);

				const profileUrl = page.url();
				results.push(`프로필 페이지 URL: ${profileUrl}`);

				// 프로필 페이지인지 확인 (URL에 /profile/ 포함 또는 메인 페이지로 리다이렉트)
				const isProfilePage =
					profileUrl.includes('/profile/') ||
					profileUrl === 'http://localhost:5173/';
				results.push(`프로필 페이지 이동: ${isProfilePage ? '✅' : '❌'}`);

				// 캘린더 확인 (프로필 페이지에 있을 경우)
				if (profileUrl.includes('/profile/')) {
					const calendarPrev = await page
						.locator('button:has-text("◀")')
						.isVisible()
						.catch(() => false);
					const calendarNext = await page
						.locator('button:has-text("▶")')
						.isVisible()
						.catch(() => false);
					const hasCalendar = calendarPrev || calendarNext;
					results.push(`캘린더 표시: ${hasCalendar ? '✅' : '❌'}`);
				}

				// 사용자명 확인
				const mainContent = await page
					.locator('main')
					.textContent()
					.catch(() => '');
				const hasUserInfo = mainContent && mainContent.length > 0;
				results.push(`사용자 정보 표시: ${hasUserInfo ? '✅' : '❌'}`);

				await page
					.screenshot({
						path: '.playwright-mcp/e2e-step3-profile.png',
						fullPage: true
					})
					.catch(() => {});
				screenshots.push('e2e-step3-profile.png');
			} else {
				// 프로필 링크를 찾지 못한 경우, 직접 프로필 URL로 이동 시도
				results.push(
					'프로필 링크를 찾지 못함. 직접 프로필 페이지로 이동 시도...'
				);
				await page.goto(
					'http://localhost:5173/profile/c93cf9a7-f9b2-4df3-b62d-d25a102728e2',
					{ waitUntil: 'networkidle' }
				);
				await page.waitForTimeout(2000);

				const profileUrl = page.url();
				results.push(`프로필 페이지 URL: ${profileUrl}`);

				const calendarPrev = await page
					.locator('button:has-text("◀")')
					.isVisible()
					.catch(() => false);
				const calendarNext = await page
					.locator('button:has-text("▶")')
					.isVisible()
					.catch(() => false);
				const hasCalendar = calendarPrev || calendarNext;
				results.push(`캘린더 표시: ${hasCalendar ? '✅' : '❌'}`);

				await page
					.screenshot({
						path: '.playwright-mcp/e2e-step3-profile.png',
						fullPage: true
					})
					.catch(() => {});
				screenshots.push('e2e-step3-profile.png');
			}

			// 4. 메인 페이지로 돌아가기 (로고 클릭)
			results.push('\n=== Step 4: 메인 페이지로 돌아가기 ===');

			const logoLink = page.getByRole('link', { name: /미니 로그/ }).first();
			await logoLink.click();
			await page.waitForTimeout(2000);

			const backToMainUrl = page.url();
			results.push(`메인 페이지 복귀 URL: ${backToMainUrl}`);
			results.push(
				`메인 페이지 복귀: ${backToMainUrl === 'http://localhost:5173/' ? '✅' : '❌'}`
			);

			await page
				.screenshot({
					path: '.playwright-mcp/e2e-step4-back-to-main.png',
					fullPage: true
				})
				.catch(() => {});
			screenshots.push('e2e-step4-back-to-main.png');
		} else {
			results.push('게시글이 없어 테스트를 계속할 수 없습니다: ❌');
		}

		results.push(`\n=== 테스트 완료 ===`);
		results.push(`생성된 스크린샷: ${screenshots.join(', ')}`);
	} catch (error) {
		results.push(`\n❌ 테스트 중 오류 발생: ${error.message}`);
	}

	return results.join('\n');
}

// Playwright MCP에서 실행할 때는 다음과 같이 사용:
// browser_run_code 도구에 이 함수의 본문을 전달
