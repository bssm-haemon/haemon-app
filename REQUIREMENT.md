# 해몬도감 백엔드 API 구현 요구사항

> 해양 생물 도감 및 쓰레기 수거 인증 앱을 위한 RESTful API 서버 구현 가이드입니다.

- **Base URL**: `http://localhost:8000/api`
- **인증**: Bearer Token (JWT)
- **데이터 형식**: JSON (multipart/form-data for images)
- **필드 명명 규칙**: `snake_case`

---

## 1. 인증 (Auth)

### `POST /auth/google`
구글 로그인을 통한 인증 및 회원가입 (OAuth 2.0 Authorization Code Flow)

**Request Body**
```json
{
  "code": "4/0AeanS0a..." // Google OAuth Authorization Code
}
```

**백엔드 처리 로직:**
1. 프론트엔드로부터 `code`를 받습니다
2. Google Token Endpoint(`https://oauth2.googleapis.com/token`)에 다음 파라미터로 POST 요청:
   - `code`: 받은 authorization code
   - `client_id`: Google Client ID
   - `client_secret`: Google Client Secret (백엔드 환경 변수)
   - `redirect_uri`: `http://localhost:3000/login` (프론트엔드와 동일해야 함)
   - `grant_type`: `authorization_code`
3. Google로부터 받은 `id_token`을 검증
4. 유저 정보 추출 및 DB 저장/업데이트
5. JWT 토큰 발급

**Response** 
```json
{
  "access_token": "string",
  "token_type": "bearer",
  "user": { ... }
}
```

**주의사항 (중요)**: 
- 백엔드는 **Google Client Secret**이 필요합니다 (환경 변수로 관리)
- `redirect_uri`는 Google Cloud Console과 프론트엔드 요청이 **정확히 일치**해야 합니다
- CORS 설정에서 `http://localhost:3000` 허용 필수

### `POST /auth/logout`
현재 토큰 무효화
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ "message": "로그아웃되었습니다" }`

### `GET /auth/me`
현재 로그인된 유저 정보 반환
- **Headers**: `Authorization: Bearer {token}`
- **Response**: 유저 객체 (위와 동일)

---

## 2. 사용자 (Users)

### `GET /users/me`
내 프로필 및 활동 통계 상세 조회
- **Response**:
  ```json
  {
    "id": "uuid", "email": "string", "nickname": "string", "profile_image": "url",
    "points": number, "is_admin": boolean, "created_at": "ISO8601",
    "sighting_count": number, "cleanup_count": number, "creature_count": number, "badge_count": number
  }
  ```

### `PATCH /users/me`
내 정보 수정
- **Body**: `{ "nickname"?: string, "profile_image"?: "url" }`

### `GET /users/{user_id}`
타 유저 프로필 조회 (공개 데이터)

---

## 3. 생물 목격 (Sightings)

### `POST /sightings`
생물 목격 기록 등록 (FormData 사용)
- **Fields**: 
  - `photo`: File (필수)
  - `latitude`, `longitude`: float (필수)
  - `location_name`: string (선택)
  - `memo`: string (선택)
  - `creature_id`: uuid (선택, 도감에서 선택 시)
  - `ai_suggestion`: string (AI 추천 결과)
  - `ai_confidence`: float (AI 신뢰도)

### `GET /sightings`
목격 목록 (피드)
- **Query**: `page=int`, `limit=int`, `status=string`, `user_id=uuid`
- **Response**: `{ "sightings": [...], "total": int, "page": int, "limit": int }`

### `GET /sightings/{sighting_id}`
상세 조회 (댓글 등 확장 가능)

### `PATCH /sightings/{sighting_id}/status` (관리자)
상태 변경 (pending -> approved/rejected)
- **Body**: `{ "status": "approved", "creature_id"?: "uuid" }`
- **Logic**: 승인 시 유저에게 포인트 지급 및 도감 등록.

---

## 4. 쓰레기 수거 (Cleanups)

### `POST /cleanups`
쓰레기 수거 인증 등록 (FormData 사용)
- **Fields**:
  - `before_photo`, `after_photo`: File (필수)
  - `latitude`, `longitude`: float (필수)
  - `trash_type`: string (plastic, glass, metal, other 등)
  - `amount`: string (handful, one_bag, large)
- **Response**: Cleanup 객체 (status: pending)

### `GET /cleanups`
목록 조회 (Query: `page`, `limit`, `status`, `user_id`, `trash_type`)

### `PATCH /cleanups/{cleanup_id}/approve` (관리자)
인증 승인 및 포인트 지급

---

## 5. 생물 도감 (Creatures)

### `GET /creatures`
전체 생물 데이터 조회
- **Query**: `category=string`, `rarity=string`

### `POST /creatures` (관리자)
새로운 생물 데이터 등록 (`name`, `category`, `description`, `image_url`, `rarity`, `points`)

---

## 6. 내 도감 (Collection)

### `GET /collection`
현재 유저가 수집한 생물 목록 조회

### `GET /collection/stats`
도감 완성 통계
- **Response**:
  ```json
  {
    "total_creatures": int,
    "discovered_count": int,
    "completion_rate": float,
    "by_rarity": {
      "common": { "total": int, "discovered": int },
      "rare": { "total": int, "discovered": int },
      "legendary": { "total": int, "discovered": int }
    }
  }
  ```

---

## 7. 뱃지 (Badges)

### `GET /badges` - 전체 뱃지
### `GET /badges/my` - 내가 획득한 뱃지

---

## 8. 랭킹 (Rankings)

### `GET /rankings/collection` - 도감 수집 순위
### `GET /rankings/cleanup` - 수거 활동 순위
### `GET /rankings/points` - 전체 포인트 순위

---

## 9. 지도 (Maps)

### `GET /maps/sightings`
지도에 표시할 목격 마커 데이터 (`latitude`, `longitude`, `type: "sighting"`, `creature_name`, `photo_url`)

### `GET /maps/cleanups`
지도에 표시할 수거 마커 데이터 (`latitude`, `longitude`, `type: "cleanup"`, `trash_type`, `amount`)

---

## 10. AI (AI)

### `POST /ai/classify/creature`
사진 분석 -> 생물 카테고리/이름/희귀도 추측

### `POST /ai/classify/trash`
사진 분석 -> 쓰레기 종류 판별

### `POST /ai/verify/cleanup`
Before/After 사진 비교 -> 수거 여부 검증

---

## 포인트 시스템 규칙
- **목격**: common(30p), rare(80p), legendary(150p)
- **수거**: handful(30p), one_bag(50p), large(100p)
- **첫 발견 보너스**: +20p (해당 생물을 처음 도감에 등록할 때)
