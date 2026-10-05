# 🌬️ AirDust Sensing Dashboard

> 실외 공기질 및 대기 센싱 데이터를 시각화하고 관제하는 Next.js 기반 반응형 웹 대시보드입니다.

---

## 📌 프로젝트 개요 (Overview)
- **프로젝트명:** AirDust Sensing Dashboard
- **목적:** 대기질(임시 PM2.5) 센싱 지표를 실시간으로 모니터링하고 직관적으로 파악할 수 있는 관제 대시보드 구축
- **주요 대상:** 환경 모니터링 관제 담당자 및 대기질 분석 담당자

---

## 🛠 기술 스택 (Tech Stack)

### Frontend & Core
- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Hooks (`useState`, `useEffect`) / Zustand
- **Data Visualization:** Recharts / Lucide React (Icons)

### Architecture & Strategy
- **Hybrid Rendering:** SSR(Server-Side Rendering)을 통한 초기 로딩 속도 및 SEO 최적화 + 클라이언트 컴포넌트(`"use client"`)를 활용한 실시간 인터랙티브 UI 제공
- **Component-Driven:** Header, Sidebar, Metric Card, Chart 컴포넌트 모듈화

---

## ✨ 핵심 기능 (Key Features)

1. **실시간 센싱 데이터 요약 카드 (Summary Cards)**
   - 미세먼지(PM10) 주요 지표 실시간 상태 표시
   - 대기질 상태(정상/임계치초과)에 따른 동적 컬러 및 상태 뱃지 렌더링

2. **데이터 트렌드 시각화 (Interactive Charts)**
   - 시계열 기반 센싱 수치 변화 그래프 제공

3. **반응형 관제 레이아웃 (Responsive Layout)**
   - Desktop 환경 최적화 사이드바 및 모바일/태블릿 지원 반응형 그리드 시스템

---

## 🏛 아키텍처 및 렌더링 설계 (Architecture)

```airdust_sample_project/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # 전역 HTML/폰트/메타데이터 관리 및 공통 프레임 제공
│   │   ├── page.tsx           # Header/LeftMenu/Content 조립 화면 (SSR 기반 초기 데이터 로딩)
│   │   └── login/page.tsx     # 로그인 페이지(첫 화면)
│   ├── components/           
│   │   ├── dashboard/
│   │   │   ├── DashboardContent.tsx     # 대시보드(지도)
│   │   │   ├── DeviceDetailPopup.tsx    # 단말 아이콘 클릭 시 표시하는 상세 팝업
│   │   │   └── SensingMap.tsx
│   │   ├── layout/
│   │   │   ├── HeaderBar.tsx        # 화면 상단 헤더
│   │   │   └── LeftMenu.tsx         # 좌측 메뉴
│   │   ├── stats/StatsContent.tsx   # 통계 페이지
│   │   └── users/UsersContent.tsx   # 사용자 관리 페이지
│   └── lib/
        ├── auth.ts           # 로그인 검증
        ├── sensing-data.ts   # 목업 단말 데이터
        ├── stats-data.ts     # 목업 통계데이터
        ├── store.ts          # zustand 상태관리
        └── users-data.ts     # 목업 유저 데이터
```

- **렌더링 최적화:**  
  정적인 레이아웃 및 초기 HTML은 Next.js App Router의 Server Component로 빠르게 사전 렌더링(SSR)하고, 차트 렌더링 및 실시간 타이머 갱신이 필요한 영역만 `"use client"` Boundary로 격리하여 불필요한 번들 크기 증가를 방지했습니다.

---

## 🚀 시작 가이드 (Getting Started)

### Prerequisites
- Node.js 18.17 이상
- npm 또는 yarn

### Installation & Run

```bash
# 1. 저장소 클론
git clone [https://github.com/your-id/airdust_sample_project.git](https://github.com/your-id/airdust_sample_project.git)

# 2. 프로젝트 디렉토리 이동
cd airdust_sample_project

# 3. 의존성 패키지 설치
npm install

# 4. 개발 서버 실행
npm run dev
