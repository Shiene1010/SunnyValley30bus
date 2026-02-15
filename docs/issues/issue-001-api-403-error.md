# Issue #1: GBIS API 403 Forbidden 에러 해결

## 📋 이슈 개요

**발생 일시**: 2026-02-15  
**해결 일시**: 2026-02-16  
**심각도**: Critical  
**상태**: ✅ Resolved

### 문제 설명
공공데이터포털 GBIS API 연동 시 `403 Forbidden` 에러가 지속적으로 발생하여 실시간 버스 도착 정보를 가져올 수 없었습니다.

```
HTTP/1.1 403 Forbidden
Content-Type: text/plain; charset=utf-8
Forbidden
```

## 🔍 원인 분석

### 근본 원인
공공데이터포털에서 **승인받은 API 기능**과 **코드에서 호출하는 엔드포인트**가 불일치했습니다.

| 구분 | 내용 |
|------|------|
| **승인받은 기능** | `getBusArrivalItemv2` (버스도착정보**항목**조회) |
| **코드에서 호출** | `getBusArrivalListv2` (버스도착정보**목록**조회) |
| **결과** | API 게이트웨이에서 권한 없음(403) 반환 |

### 추가 발견 사항
1. **필수 파라미터 누락**: `getBusArrivalItemv2`는 `routeId` 파라미터 필수
2. **응답 형식 변경**: API가 XML 대신 JSON으로 응답
3. **타입 불일치**: API는 `routeName: 30` (숫자), 코드는 `"30"` (문자열)과 비교

## ✅ 해결 방법

### 1. API 엔드포인트 수정
**파일**: `server/gbis.js`

```diff
- const BASE_URL = 'http://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalListv2';
+ const BASE_URL = 'http://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalItemv2';
```

### 2. 필수 파라미터 추가
**파일**: `server/gbis.js`

```javascript
// routeId 파라미터 추가
const ROUTE_ID = process.env.BUS_ROUTE_ID;
const url = `${BASE_URL}?serviceKey=${API_KEY}&stationId=${stationId}&routeId=${ROUTE_ID}`;
```

### 3. JSON 응답 처리
**파일**: `server/gbis.js`

```diff
- // XML 파싱
- const result = await parser.parseStringPromise(response.data);
- const busArrivalList = result.response.msgBody.busArrivalList;

+ // JSON 직접 사용
+ const result = response.data;
+ if (result.response.msgHeader.resultCode !== 0) {
+     throw new Error(result.response.msgHeader.resultMessage);
+ }
+ const busItem = result.response.msgBody.busArrivalItem;
```

### 4. 타입 비교 버그 수정
**파일**: `server/index.js`

```diff
- const bus30 = data.find(bus => bus.routeName === BUS_ROUTE_NAME);
+ const bus30 = data.find(bus => 
+     String(bus.routeName) === String(BUS_ROUTE_NAME) || 
+     String(bus.routeId) === String(process.env.BUS_ROUTE_ID)
+ );
```

## 🧪 테스트 결과

### API 응답 확인
```bash
curl "http://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalItemv2?serviceKey=...&stationId=228002215&routeId=241425012"
```

**응답 (성공)**:
```json
{
  "response": {
    "msgHeader": {
      "resultCode": 0,
      "resultMessage": "정상적으로 처리되었습니다."
    },
    "msgBody": {
      "busArrivalItem": {
        "routeName": 30,
        "predictTime1": 20,
        "predictTime2": 44,
        "plateNo1": "경기78아9085",
        "plateNo2": "경기78아8158"
      }
    }
  }
}
```

### 실시간 데이터 확인
- ✅ 현대모닝사이드1차: 버스 도착 20분, 출발 시간 13분
- ✅ 보라신창아파트: 버스 도착 21분, 출발 시간 9분
- ✅ "Time to Leave" 계산 정상 작동
- ✅ 30초마다 자동 갱신

## 📝 변경 파일 목록

- `server/gbis.js` - API 엔드포인트 및 응답 처리 로직 수정
- `server/index.js` - 버스 필터링 로직 타입 처리 개선
- `server/.env` - `MOCK_MODE=false` 설정

## 💡 교훈 및 개선 사항

### 교훈
1. **API 문서 정확히 확인**: 공공데이터포털 마이페이지에서 승인받은 정확한 기능 확인 필수
2. **에러 코드 의미 파악**: 401(인증 실패) vs 403(권한 없음) 구분
3. **타입 일치 중요성**: API 응답 데이터 타입과 코드 비교 로직 일치 확인

### 향후 개선 사항
- [ ] API 에러 처리 강화 (fallback to mock data)
- [ ] 응답 데이터 캐싱으로 API 호출 횟수 절감
- [ ] 로깅 시스템 추가 (API 호출 이력 추적)
- [ ] 단위 테스트 추가

## 🔗 관련 문서
- [공공데이터포털 - 경기도 버스도착정보 조회 API](https://www.data.go.kr/data/15080346/openapi.do)
- [Walkthrough 문서](../walkthrough.md)

---

**작성자**: Antigravity AI  
**검토자**: -  
**승인자**: -
