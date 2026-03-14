import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion';

const policySections = [
	{
		title: '1. 개인정보처리자의 정보',
		body: [
			'서비스명: Mini Log',
			'운영자명: 백승민',
			'문의 이메일: jah02190@naver.com'
		]
	},
	{
		title: '2. 처리하는 개인정보 항목, 목적, 보유기간',
		body: [
			'회원가입 및 로그인: 이메일 주소, 비밀번호, 소셜 로그인 제공자가 전달하는 계정 식별정보 및 프로필 정보 중 서비스 이용에 필요한 정보를 처리하며, 회원 식별, 회원가입 의사 확인, 로그인 처리, 계정 관리를 목적으로 합니다. 해당 정보는 서비스 운영 기간 동안 보관하며, 이용자의 삭제 요청 시 관련 법령에 반하지 않는 범위에서 지체 없이 검토 후 처리합니다.',
			'프로필 설정 및 운영: 닉네임, 자기소개, 프로필 이미지를 처리하며, 프로필 표시, 이용자 식별, 서비스 내 사용자 정보 제공을 목적으로 합니다. 해당 정보는 서비스 운영 기간 동안 보관하며, 이용자의 수정 또는 삭제 요청 시 처리합니다.',
			'게시글, 댓글, 좋아요, 알림 등 서비스 제공: 게시글 내용, 댓글 내용, 좋아요 기록, 알림 정보, 작성 및 수정 시각 등 이용 기록을 처리하며, 커뮤니티 기능 제공과 서비스 운영을 목적으로 합니다. 게시글 및 댓글은 이용자의 삭제 요청 또는 서비스 운영 정책에 따라 처리하며, 운영상 필요한 기록은 목적 달성 시까지 보관합니다.',
			'비밀번호 재설정 및 계정 보안: 이메일 주소와 인증, 세션 처리에 필요한 정보를 처리하며, 비밀번호 재설정, 계정 보호, 비정상 접근 대응을 목적으로 합니다. 관련 정보는 목적 달성 시까지 보관합니다.',
			'서비스 이용 과정에서 자동 생성되는 정보: 접속 일시, IP 주소, 브라우저 및 기기 정보, 쿠키, 세션 정보, 서비스 이용 기록을 처리하며, 서비스 안정성 확보, 오류 대응, 보안 관리, 부정 이용 방지를 목적으로 합니다. 관련 정보는 목적 달성 시까지 또는 관련 법령이 정한 기간까지 보관합니다.'
		]
	},
	{
		title: '3. 개인정보의 처리 및 보유 기간',
		body: [
			'서비스는 원칙적으로 개인정보의 처리 목적이 달성되면 지체 없이 해당 개인정보를 파기합니다.',
			'다만, 서비스 운영을 위해 필요한 범위에서 개인정보를 보관할 수 있으며, 이용자가 이메일을 통해 계정 삭제 또는 개인정보 삭제를 요청하는 경우 관련 법령에 반하지 않는 범위에서 지체 없이 검토 후 삭제 또는 분리 보관 조치합니다.',
			'회원정보와 프로필 정보는 서비스 운영 기간 동안 보관합니다.',
			'게시글, 댓글 등 이용자가 작성한 콘텐츠는 이용자의 삭제 요청 또는 서비스 운영 정책에 따라 처리합니다.',
			'접속기록 및 서비스 운영 로그는 보안 및 운영 목적 달성 시까지 보관합니다.'
		]
	},
	{
		title: '4. 개인정보의 제3자 제공',
		body: [
			'서비스는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.',
			'다만, 이용자가 사전에 동의한 경우, 법령에 특별한 규정이 있는 경우, 수사기관 등 관계기관의 적법한 요청이 있는 경우에는 예외로 합니다.'
		]
	},
	{
		title: '5. 개인정보 처리의 위탁',
		body: [
			'Supabase: 사용자 인증, 데이터베이스 운영, 파일 저장(스토리지)',
			'Vercel: 웹사이트 호스팅 및 배포 운영',
			'GitHub, Google, Kakao: 소셜 로그인 인증 제공',
			'서비스는 위탁 또는 외부 서비스 이용 과정에서 개인정보가 안전하게 처리되도록 필요한 관리적, 기술적 조치를 확인합니다.'
		]
	},
	{
		title: '6. 개인정보의 국외 이전',
		body: [
			'서비스는 클라우드 서비스 및 외부 플랫폼을 이용하는 과정에서 개인정보가 국외에서 처리되거나 저장될 수 있습니다.',
			'이전받는 자: Supabase, Vercel, GitHub, Google, Kakao',
			'이전 항목: 이메일 주소, 계정 식별정보, 프로필 정보, 게시글, 댓글, 이미지 등 이용자가 입력하거나 업로드한 정보, 서비스 이용 기록',
			'이전 목적: 인증 처리, 데이터 저장 및 조회, 파일 저장, 웹사이트 제공 및 운영',
			'이전 방법: 서비스 이용 시 네트워크를 통한 전송',
			'보유 및 이용기간: 각 처리 목적 달성 시까지 또는 각 사업자의 정책에 따름',
			'이전 국가: 각 서비스 제공자의 운영 정책 및 인프라 위치에 따름'
		]
	},
	{
		title: '7. 개인정보의 파기 절차 및 방법',
		body: [
			'서비스는 개인정보 보유기간의 경과, 처리목적 달성 등으로 개인정보가 불필요하게 된 경우 지체 없이 파기합니다.',
			'전자적 파일 형태의 정보는 복구 또는 재생이 불가능한 방법으로 삭제합니다.',
			'종이 문서 형태의 정보는 분쇄 또는 소각합니다.'
		]
	},
	{
		title: '8. 정보주체의 권리 및 행사방법',
		body: [
			'이용자는 언제든지 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지 등을 요청할 수 있습니다.',
			'관련 요청은 아래 이메일을 통해 접수할 수 있으며, 서비스는 관련 법령에 따라 지체 없이 검토 및 조치합니다.',
			'문의 이메일: jah02190@naver.com'
		]
	},
	{
		title: '9. 개인정보의 안전성 확보조치',
		body: [
			'서비스는 인증 및 세션 관리, 접근권한 최소화, 외부 인프라 및 인증 서비스의 보안 기능 활용, 개인정보 접근 통제, 비정상 접근 및 오류 모니터링 등 개인정보의 안전성 확보를 위해 노력합니다.'
		]
	},
	{
		title: '10. 쿠키 등 자동 수집 장치의 설치 및 운영',
		body: [
			'서비스는 로그인 유지, 세션 관리, 서비스 제공을 위해 쿠키 또는 유사 기술을 사용할 수 있습니다.',
			'이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이 경우 일부 서비스 이용에 제한이 있을 수 있습니다.'
		]
	},
	{
		title: '11. 개인정보 보호 관련 문의',
		body: ['담당자명: 백승민', '이메일: jah02190@naver.com']
	},
	{
		title: '12. 권익침해 구제방법',
		body: [
			'개인정보침해신고센터: https://privacy.kisa.or.kr',
			'개인정보분쟁조정위원회: https://www.kopico.go.kr',
			'대검찰청: https://www.spo.go.kr',
			'경찰청: https://ecrm.police.go.kr'
		]
	},
	{
		title: '13. 개인정보처리방침의 변경',
		body: [
			'본 개인정보처리방침은 2026.03.13부터 적용됩니다.',
			'관련 법령, 서비스 기능 또는 내부 정책 변경에 따라 내용이 수정될 수 있으며, 변경 시 서비스 내 공지 또는 별도 페이지를 통해 안내합니다.',
			'시행일자: 2026.03.13',
			'최종 수정일: 2026.03.13'
		]
	}
];

export default function PrivacyPolicyPage() {
	return (
		<div className="bg-card/90 border-border text-card-foreground mx-auto max-w-3xl space-y-8 rounded-[2rem] border p-6 shadow-[0_18px_40px_color-mix(in_oklab,var(--foreground)_8%,transparent)] backdrop-blur-sm sm:p-8">
			<div className="space-y-3">
				<p className="text-primary text-xs font-semibold tracking-[0.24em] uppercase">
					Privacy Policy
				</p>
				<h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
					개인정보처리방침
				</h1>
				<p className="text-muted-foreground text-sm leading-7 sm:text-base">
					Mini Log는 이용자의 개인정보를 중요하게 생각하며, 관련 법령을
					준수합니다. 서비스 이용 과정에서 처리되는 개인정보와 이용자의 권리에
					대해 아래와 같이 안내합니다.
				</p>
			</div>

			<Accordion
				type="single"
				collapsible
				defaultValue="1. 개인정보처리자의 정보"
				className="bg-muted/55 border-border rounded-[1.5rem] border px-5">
				{policySections.map(section => (
					<AccordionItem
						key={section.title}
						value={section.title}
						className="border-border">
						<AccordionTrigger className="text-foreground cursor-pointer text-base font-semibold hover:no-underline sm:text-lg">
							{section.title}
						</AccordionTrigger>
						<AccordionContent className="pb-5">
							<div className="text-muted-foreground space-y-2 text-sm leading-7 sm:text-[15px]">
								{section.body.map(paragraph => (
									<p key={paragraph}>{paragraph}</p>
								))}
							</div>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
}
