# BusNoti: Sunny Valley #30 Bus Notification

Sunny Valley 실시간 #30 버스 도착 알림 및 "출발 시간" 계산 대시보드입니다.

## 🚌 소개 (Introduction)
이 프로젝트는 나곡중학교 인근 정류장(현대모닝사이드1차, 보라신창아파트 등)에서 출발하여 써니밸리로 이동하는 #30 버스의 실시간 도착 정보를 제공합니다. 특히, **나곡중학교에서 정류장까지의 도보 시간을 고려하여 언제 출발해야 하는지(Time to Leave)**를 직관적으로 알려주는 것이 핵심 기능입니다.

## ✨ 주요 기능 (Features)
- **실시간 도착 정보**: 경기버스(GBIS) API를 연동하여 버스 도착 예정 시간을 실시간으로 갱신 (30초 간격).
- **출발 알림 (Time to Leave)**: 
    - 각 정류장별 도보 시간(5분, 10분 등)과 여유 시간(2분)을 제외한 실제 출발 필요 시간을 계산.
    - 상태 기반 색상 표시: SAFE (안전함), WARNING (서두르세요), URGENT (지금 당장 출발 필요).
- **피드백 시스템**: 사용자 중심의 지연 정보나 개선 제안을 보낼 수 있는 기능.
- **반응형 대시보드**: Lucide React 아이콘을 활용한 세련된 UI.

## 🛠 기술 스택 (Tech Stack)
- **Frontend**: React, Vite, Axios, Lucide React
- **Backend**: Node.js, Express, Cors
- **API**: 경기도_버스도착정보 조회 (GBIS Open API)
- **Deployment**: Vercel

## 📂 프로젝트 구조 (Project Structure)
```text
SunnyValley30bus/
├── client/           # React 프론트엔드 (Vite)
├── server/           # Node.js 백엔드 (Express)
├── api/              # Vercel Serverless Functions 연동용
├── 개발전 생각해 본 거/  # 계정 신청 및 기획 메모
├── package.json      # 프로젝트 통합 스크립트 (concurrently 사용)
└── vercel.json       # Vercel 배포 설정
```

## 🚀 시작하기 (Getting Started)

### 환경 변수 설정 (.env)
`server/` 디렉토리에 `.env` 파일을 생성하고 다음 값을 설정해야 합니다:
```env
GBIS_SERVICE_KEY=your_service_key_here
STATION_HYUNDAI=228002215
STATION_BORA=228003292
BUS_ROUTE_ID=228000166
MOCK_MODE=false
```

### 설치 및 로컬 실행
1. 저장소 클론: `git clone https://github.com/Shiene1010/SunnyValley30bus.git`
2. 루트 디렉토리에서 의존성 설치: `npm install`
3. 프론트엔드 및 백엔드 동시 실행: `npm start`
   - 프론트엔드: `http://localhost:5173`
   - 백엔드: `http://localhost:3001`

### 빌드 및 배포
- 전체 빌드: `npm run build`
- Vercel을 통한 자동 배포 구성 (GitHub 연동 권장)

## 📌 라이선스 (License)
이 프로젝트는 개인 학습 및 공공 서비스 제공을 목적으로 제작되었습니다.
