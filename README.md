# 🌊 해몬도감 (Haemon Dogam) - Frontend

> **Vision:** "바다를 지키며 도감을 채우는 해양 ESG 게이미피케이션 앱"

## 🛠 Tech Stack

- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** TanStack Query (React Query)
- **HTTP Client:** Axios
- **UI Icons:** Lucide React
- **API:** FastAPI backend (APIDOCS.md 참고)

## 📱 Screen Structure

| Route         | Name     | Description                   |
| ------------- | -------- | ----------------------------- |
| `/`           | Home     | 최근 피드, 내 요약 정보, 순위 |
| `/register`   | Register | 생물 목격/쓰레기 수거 등록    |
| `/collection` | Pokedex  | 카드형 도감 (필터링 가능)     |
| `/map`        | Map      | 전체 지도 & 활동 시각화       |
| `/profile`    | User     | 내 뱃지, 활동 통계, 설정      |

## 🎨 Design System

### Colors

- **Primary:** `#0077BE` (Ocean Blue)
- **Secondary:** `#20B2AA` (Seafoam Green)
- **Accent:** `#FF6B6B`, `#FFD93D`, `#51CF66`

### Components

- Bottom Navigation Bar (하단 탭 바)
- Collection Cards (포켓몬 스타일)
- User Stats Cards
- Activity Feed
- Location Markers

## 🚀 Getting Started

### Installation

```bash
# 의존성 설치
npm install

# 또는 legacy peer deps 사용
npm install --legacy-peer-deps
```

### Development

```bash
# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### Production Build

```bash
# 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 📝 Environment Variables

`.env.local` 파일을 만들고 다음을 설정하세요:

```env
# API 설정
NEXT_PUBLIC_API_URL=http://localhost:8000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Kakao Maps API
NEXT_PUBLIC_KAKAO_APP_KEY=your_kakao_app_key
```

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── register/page.tsx   # Register page
│   ├── collection/page.tsx # Collection page
│   ├── map/page.tsx        # Map page
│   └── profile/page.tsx    # Profile page
├── components/
│   ├── Providers.tsx       # Query client provider
│   ├── MainLayout.tsx      # Main layout wrapper
│   └── BottomNavBar.tsx    # Bottom navigation
├── hooks/
│   ├── useSightings.ts     # Sightings queries
│   ├── useCleanups.ts      # Cleanups queries
│   └── useUser.ts          # User queries
├── lib/
│   ├── apiClient.ts        # Axios client
│   └── queryClient.ts      # React Query config
├── types/
│   └── index.ts            # TypeScript definitions
└── utils/
    └── index.ts            # Utility functions
```

## 🔌 API Integration

### Sightings (생물 목격)

- `GET /sightings` - 전체 목격 기록
- `GET /sightings/{id}` - 상세 조회
- `POST /sightings` - 새 목격 등록
- `PATCH /sightings/{id}` - 수정

### Cleanups (쓰레기 수거)

- `GET /cleanups` - 전체 수거 기록
- `GET /cleanups/{id}` - 상세 조회
- `POST /cleanups` - 새 수거 등록
- `PATCH /cleanups/{id}` - 수정

### User

- `GET /users/me` - 현재 사용자 정보
- `GET /users/{id}` - 사용자 프로필
- `PATCH /users/me` - 사용자 정보 수정

## 🎯 Key Features

### 1. PWA Support

- 모바일 환경 최적화
- 카메라/GPS 기능 활용
- 오프라인 지원 (설정 필요)

### 2. Real-time Updates

- React Query를 통한 자동 캐싱
- 자동 갱신 및 배경 재검증

### 3. Gamification

- 포인트 시스템
- 레벨/배지 시스템
- 순위표

### 4. Location-based

- Kakao Maps 연동 (예정)
- 위치 기반 마커
- 히트맵 표시

## 📚 Data Models

### User

```typescript
{
  id: string;
  email: string;
  nickname: string;
  points: number;
  level: number;
  achievements: Achievement[];
  createdAt: string;
}
```

### Sighting

```typescript
{
  id: string;
  userId: string;
  creatureId: string;
  photoUrl: string;
  lat: number;
  lng: number;
  memo?: string;
  status: 'pending' | 'approved' | 'rejected';
  points: number;
  createdAt: string;
}
```

### Cleanup

```typescript
{
  id: string;
  userId: string;
  beforePhoto: string;
  afterPhoto: string;
  trashType: string;
  amount: number;
  lat: number;
  lng: number;
  points: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}
```

## 🔄 State Management

React Query를 사용하여 서버 상태 관리:

```typescript
// 조회
const { data, isLoading, error } = useSightings();

// 수정/생성 (Mutation)
const { mutate } = useMutation({
  mutationFn: data => apiClient.post("/sightings", data),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sightings"] }),
});
```

## 🧪 Testing

```bash
# 단위 테스트 (설정 필요)
npm run test

# E2E 테스트 (설정 필요)
npm run test:e2e
```

## 📦 Dependencies

주요 의존성:

- `next@16+` - React 프레임워크
- `react@19+` - UI 라이브러리
- `@tanstack/react-query@5+` - 서버 상태 관리
- `axios` - HTTP 클라이언트
- `tailwindcss@4+` - CSS 유틸리티
- `lucide-react` - 아이콘 라이브러리
- `clsx` - 조건부 클래스

## 🚫 Important Notes

### No Next.js API Routes

모든 데이터 요청은 Client Component에서 FastAPI 서버로 직접 수행합니다.

### CORS 설정

FastAPI 백엔드에서 CORS가 올바르게 설정되어 있는지 확인하세요.

### Environment

`.env.local` 파일은 버전 관리에서 제외되어 있습니다 (.gitignore 참고).

## 🔐 Security

- Authorization 헤더는 Axios interceptor에서 자동 추가
- 민감한 정보는 환경 변수에 저장
- HTTPS 필수 (프로덕션)

## 📞 Support

문제 발생 시:

1. 콘솔 에러 메시지 확인
2. Network 탭에서 API 응답 확인
3. FastAPI 백엔드 로그 확인
4. 환경 변수 설정 확인

## 📄 License

MIT

## 🤝 Contributing

Pull Request는 언제든지 환영합니다!

---
