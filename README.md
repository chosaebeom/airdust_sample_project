# 🌬️ AirDust Sensing Dashboard

> **실무 기반 도메인 경량화 및 모던 웹/AI 기술 학습용 프로젝트**
> 현업에서 수행했던 **지자체 실시간 IoT 센싱 및 안전 관제 플랫폼** 도메인을 바탕으로, 핵심 관제 기능만 간략화하여 재구축한 프로젝트입니다. Next.js(App Router)와 TypeScript 생태계를 깊이 있게 학습하고, 대시보드 데이터와 연동되는 **대화형 AI 관제 어시스턴트(Chatbot)**를 직접 구현해 보기 위해 제작했습니다.


## 📌 프로젝트 개요 (Overview)
- **프로젝트명:** AirDust Sensing Dashboard
- **목적:** 대기질(임시 PM2.5) 센싱 지표를 실시간으로 모니터링하고 직관적으로 파악할 수 있는 관제 대시보드 구축
- **주요 기능**:
   1. **실시간 관제 지도 시각화**
      - 경기도 용인시 거점 센서 장비들의 위치와 상태(`정상`, `임계치초과`, `통신이상`)를 지도상에 직관적으로 마커 표시
      - 클라이언트 사이드 렌더링(`next/dynamic`, `ssr: false`) 최적화를 통한 지도 컴포넌트 안정적 로드
   2. **장비 상세 모니터링 및 통계/사용자 관리**
      - 개별 센서 클릭 시 상세 측정치 및 상태 정보를 보여주는 팝업(`DeviceDetailPopup`) 연동
      - 관제 대시보드, 통계 분석(`Stats`), 사용자 관리(`Users`) 탭 전환 구조
   3. **🆕 AI 관제 어시스턴트 (AI Chatbot)**
      - 대시보드 우측 플로팅 패널 형태의 실시간 AI 질의응답 인터페이스
      - 관제 데이터(`SAMPLE_DEVICES`) 컨텍스트 기반의 정확한 장비 상태 브리핑
      - **AI-UI 인터랙션 연동:** 질문과 연관된 이상 장비 발견 시, 텍스트 답변과 동시에 지도의 해당 장비 상세 팝업을 자동으로 오픈


## 🖥️ 주요 화면 (Screenshots)
| 실시간 관제 지도 및 장비 상세 팝업 | AI 관제 어시스턴트 (챗봇 연동) |
<img width="854" height="480" alt="clideo_editor_88ffb16cc2dc470da9b69b645445e25d" src="https://github.com/user-attachments/assets/df02c930-c1e5-4c72-a125-781a762efa5c" />
<img width="854" height="480" alt="clideo_editor_d4d5fe799cca40b48d64d5e102677c20" src="https://github.com/user-attachments/assets/64b959ad-2c94-48f1-b2f0-59a61487cf50" />


## 🛠 기술 스택 (Tech Stack)
**Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, Lucide React
**Backend / API:** Next.js Route Handlers (`app/api/chat/route.ts`)
**AI / LLM:** Google Gemini SDK (`@google/genai` - `gemini-3.8-flash` 등)


## ✨ 핵심 기능 (Key Features)

### 1. 관제 데이터 컨텍스트 주입 및 응답 표준화 (Structured JSON Output)
- 대시보드 내 센서 목업 데이터(`SAMPLE_DEVICES`)를 시스템 프롬프트 컨텍스트로 주입하여 할루시네이션(환각)을 방지하고 현재 관제 상태에 기반한 정확한 응답을 생성합니다.
- AI의 응답을 단순 줄글이 아닌 `{ reply, targetDeviceId }` 형태의 JSON 스키마(`responseMimeType: "application/json"`)로 강제 표준화했습니다. 이를 통해 AI가 특정 문제 장비를 지목하면 프론트엔드 상태(`setSelectedDevice`)를 즉시 트리거하여 **대화만으로 대시보드 UI(지도 팝업)를 제어하는 에이전트 경험**을 구현했습니다.

### 2. 외부 LLM 장애(503 과부하) 대비 다중 폴백(Graceful Degradation) 아키텍처
- 외부 AI API 호출 시 발생할 수 있는 일시적 트래픽 과부하(`503 Service Unavailable`)나 네트워크 오류로 인해 관제 서비스가 중단되지 않도록 **방어 로직**을 설계했습니다.
   **Local Smart Engine Fallback:** 모든 외부 LLM 엔드포인트가 응답 불능이거나 API Key가 없는 오프라인 환경일 경우, 백엔드 내장 규칙 기반(Rule-based) 데이터 파서가 즉시 동작하여 임계치 초과·통신 이상 장비를 필터링해 무중단 응답 제공

### 3. 단기 대화 문맥(Short-term Memory) 유지
- 사용자의 직전 대화 히스토리(최근 6턴)를 슬라이싱하여 API 요청 시 함께 전달함으로써, 이전 질문의 맥락을 이어가는 연속적인 질의응답이 가능하도록 구성했습니다.


## 🏛 아키텍처 및 렌더링 설계 (Architecture)

```airdust_sample_project/
├── src/
│   ├── app/
│   │   ├── api/chat/
│   │   │  └──  route.ts       # 챗봇 핸들러
│   │   ├── layout.tsx         # 전역 HTML/폰트/메타데이터 관리 및 공통 프레임 제공
│   │   ├── page.tsx           # Header/LeftMenu/Content 조립 화면 (SSR 기반 초기 데이터 로딩)
│   │   └── login/page.tsx     # 로그인 페이지(첫 화면)
│   ├── components/
│   │   ├── common/
│   │   │  └──  LineChart.tsx       # 라인차트 모듈화
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

# 4. 환경변수 설정
env.local 생성후  GEMINI_API_KEY=your_gemini_api_key_here api key입력

# 5. 개발 서버 실행
npm run dev
