# ☕ CafeOS

> 카페 운영의 모든 흐름을 하나의 시스템으로 연결하다.

**주문 · 메뉴 · 레시피 · 재고 · 직원 · 근태 · 업무 · 매출 · AI 운영 분석**

[ 🎬 Demo ]  [ 🚀 Live ]  [ 💻 GitHub ]

---

## 📌 Project

CafeOS는 카페 매장의 운영 데이터를 하나의 시스템에서 통합 관리할 수 있도록 구현한 **카페 매장 운영 관리 시스템**입니다.

단순 CRUD 구현에 그치지 않고 실제 매장 운영에서 발생하는 데이터가 서로 연결되도록 설계했습니다.

주문
↓
주문 아이템
↓
메뉴
↓
레시피
↓
재료
↓
재고 자동 차감
↓
재고 사용량 분석
↓
재고 소진 예측
↓
AI 운영 분석

주문에서 발생한 데이터가 재고 관리와 매출 분석으로 이어지고, 이를 다시 AI 운영 분석에 활용할 수 있도록 구성했습니다.

---

## ✨ Key Features

### 🛒 주문 관리

- 주문 생성 및 조회
- 주문 상품 및 수량 관리
- 주문 상태 관리
- 주문 완료 / 취소 처리
- 주문 완료 데이터 기반 매출 집계
- 주문 완료 시 레시피 기반 재고 자동 차감

### ☕ 메뉴 & 레시피 관리

- 메뉴 등록 / 조회 / 수정 / 삭제
- 메뉴 카테고리 관리
- 메뉴 가격 관리
- 메뉴별 레시피 관리
- 레시피별 재료 및 사용량 관리

### 📦 재고 관리

- 재료별 재고 관리
- 현재 재고 및 최소 재고 관리
- 주문 완료 시 레시피 기반 재고 자동 차감
- 재료별 사용량 집계
- 최근 사용량 기반 재고 소진 예측
- 예상 소진 기간 계산
- 발주 필요 여부 확인

### 📊 매출 분석

- 오늘 매출
- 이번 달 매출
- 이번 달 완료 주문 수
- 평균 주문 금액
- 최근 7일 매출
- 최근 7일 일별 매출
- 최근 12개월 월별 매출
- 인기 메뉴 TOP 5
- 카테고리별 매출

### 🤖 AI 운영 분석

CafeOS에서 실제로 발생한 운영 데이터를 기반으로 매장 운영 상황을 분석합니다.

- 매출 분석
- 메뉴 분석
- 재고 분석
- 인력 운영 분석
- 운영 위험 분석
- 오늘의 운영 우선순위
- 운영 개선 제안

### 👥 직원 관리

- 직원 등록 / 조회 / 수정 / 삭제
- OWNER / MANAGER / STAFF 역할 관리
- 역할 기반 권한 관리
- 직원 상태 관리

### 🕐 근태 관리

- 출근 처리
- 퇴근 처리
- 출퇴근 시간 기록
- 근무 상태 관리

### 📋 업무 관리

- 업무 등록 / 조회 / 수정 / 삭제
- 역할별 업무 관리
- 업무 완료 처리
- 완료 취소

### 📢 공지사항

- 공지 등록
- 공지 조회
- 공지 수정
- 공지 삭제

---

## 🔄 Core Business Flow

CafeOS의 핵심은 각각의 기능을 독립적인 CRUD로 구성하는 것이 아니라 **하나의 매장 운영 흐름으로 연결하는 것**입니다.

                    ┌──────────────┐
                    │     메뉴     │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │    레시피    │
                    └──────┬───────┘
                           │
                           ▼
┌──────────────┐    ┌──────────────┐
│     주문     │ →  │  주문 아이템  │
└──────┬───────┘    └──────┬───────┘
       │                    │
       │                    ▼
       │             ┌──────────────┐
       └────────────→│     재고     │
                     └──────┬───────┘
                            │
                            ▼
                       사용량 집계
                            │
                            ▼
                        소진 예측
                            │
                            ▼
                       AI 운영 분석

---

## 📦 Inventory Flow

주문 완료 시 메뉴의 레시피를 기준으로 실제 사용된 재료의 양을 계산하여 재고를 자동으로 차감합니다.

주문 수량
   ×
레시피 재료 사용량
   ↓
실제 재료 사용량
   ↓
재고 차감

### 예시

아메리카노 5잔 주문

원두 18g × 5
= 90g

물 300ml × 5
= 1500ml

↓

원두 재고 -90g
물 재고 -1500ml

이를 통해 주문 데이터와 재고 데이터가 연결되도록 구현했습니다.

---

## 📈 Inventory Prediction

최근 완료 주문과 레시피 데이터를 기반으로 재료별 사용량을 계산하여 재고 소진 시점을 예측합니다.

최근 완료 주문
↓
메뉴별 판매량
↓
레시피 조회
↓
재료별 사용량 계산
↓
최근 7일 사용량 집계
↓
일 평균 사용량 계산
↓
현재 재고와 비교
↓
예상 소진 기간

### 분석 데이터

- 현재 재고
- 최소 재고
- 최근 7일 총 사용량
- 일 평균 사용량
- 예상 소진 기간
- 예상 일일 소진량
- 권장 발주량
- 발주 필요 여부

---

## 🤖 AI Analysis

AI 운영 분석은 CafeOS 내부에서 실제로 관리되는 데이터를 수집하여 하나의 분석 컨텍스트로 구성한 뒤 AI에게 전달합니다.

### AI 분석 데이터

SalesService

- 오늘 매출
- 이번 달 매출
- 완료 주문 수
- 평균 주문 금액
- 최근 매출
- 인기 메뉴
- 카테고리별 매출

InventoryPredictionService

- 현재 재고
- 최소 재고
- 최근 사용량
- 일 평균 사용량
- 예상 소진 기간
- 발주 필요 여부

UserRepository

- 역할별 직원 구성

TaskRepository

- 역할별 업무
- 업무 완료 여부

### AI 처리 흐름

매출 데이터
메뉴 데이터
재고 데이터
인력 운영 데이터
        ↓
AI Prompt Context
        ↓
Spring AI
        ↓
OpenAI API
        ↓
AiAnalysisResponse
        ↓
AI 운영 분석 화면

### AI 분석 영역

1. 매출 분석
2. 메뉴 분석
3. 재고 분석
4. 인력 운영 분석
5. 운영 위험 분석
6. 오늘의 운영 우선순위

AI가 실제 데이터에 존재하지 않는 메뉴, 재고, 매출, 직원 상태 등을 임의로 생성하지 않도록 제공된 데이터를 기준으로 분석하도록 구성했습니다.

또한 실제 데이터가 제공되지 않은 근무 시간이나 직원 부족 여부 등을 임의로 추론하지 않도록 분석 범위를 제한했습니다.

---

## 🔐 Authentication & Authorization

Spring Security와 JWT를 기반으로 사용자 인증 및 역할 기반 권한 관리를 구현했습니다.

로그인
↓
Spring Security
↓
인증 성공
↓
JWT Access Token
+
JWT Refresh Token
↓
API 요청
↓
JWT 검증
↓
Role 확인
↓
API 접근

### 지원 인증

- 일반 로그인
- Google OAuth2 로그인
- JWT Access Token
- JWT Refresh Token

### 사용자 역할

| Role | 역할 |
|---|---|
| OWNER | 매장 전체 관리 |
| MANAGER | 매장 운영 및 관리 |
| STAFF | 매장 실무 업무 |

---


## 🗄️ Domain Structure

User
 ├── Attendance
 └── Task

Menu
 └── Recipe
      └── RecipeItem
           └── Ingredient
                └── Inventory

Order
 └── OrderItem
      └── Menu

Dashboard
 └── Sales Analysis

AI
 ├── Sales Data
 ├── Menu Data
 ├── Inventory Data
 └── Workforce Data

---

## 🛠 Tech Stack

### Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT
- OAuth2
- REST API
- Gradle

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios

### Database

- PostgreSQL
- Redis

### AI

- Spring AI
- OpenAI API
- Prompt Engineering
- Jackson ObjectMapper
- JSON 기반 AI 응답 처리

### Infrastructure

- Docker
- AWS
- Environment Variables

---

## 🔌 API Structure

CafeOS는 REST API 기반으로 프론트엔드와 백엔드를 분리하여 구성했습니다.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/signup` | 회원가입 |
| POST | `/api/auth/refresh` | Access Token 재발급 |

### Order

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | 주문 생성 |
| GET | `/api/orders` | 주문 조회 |
| PATCH | `/api/orders/{id}/status` | 주문 상태 변경 |

### Inventory

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/inventory` | 재고 조회 |
| POST | `/api/inventory` | 재료 등록 |
| PATCH | `/api/inventory/{id}` | 재고 수정 |

### AI

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/ai/analysis` | AI 운영 분석 |

> 실제 프로젝트의 Controller 구조와 Endpoint에 맞춰 최종적으로 수정합니다.

---

## 🧩 Troubleshooting

### 01. 주문과 재고 데이터 연결

#### Problem

주문과 재고가 서로 다른 도메인으로 구성되어 있어 주문 완료 시 실제 사용된 재료의 양을 계산하고 재고에 반영하는 과정이 필요했습니다.

#### Solution

Order
↓
OrderItem
↓
Menu
↓
Recipe
↓
RecipeItem
↓
Ingredient
↓
Inventory

주문 수량과 레시피에 등록된 재료 사용량을 계산하여 주문 완료 시 재고가 자동으로 차감되도록 구현했습니다.

#### Result

주문 처리와 재고 관리를 별도로 처리하지 않아도 주문 데이터를 기반으로 재고가 자동 반영되는 구조를 구축했습니다.

---

### 02. JWT 인증 및 권한 처리

#### Problem

로그인 사용자의 인증 상태를 유지하면서 OWNER / MANAGER / STAFF에 따라 기능 접근 권한을 구분할 필요가 있었습니다.

#### Solution

Spring Security와 JWT를 이용하여 인증 구조를 구성하고 사용자의 Role을 기반으로 API 접근 권한을 제어했습니다.

#### Result

사용자 역할에 따라 접근 가능한 기능을 구분할 수 있는 인증 및 인가 구조를 구현했습니다.

---

### 03. AI 응답 구조화

#### Problem

OpenAI API의 응답을 프론트엔드에서 일관된 데이터 구조로 사용해야 했습니다.

#### Solution

AI에게 정해진 JSON 응답 구조를 요구하고 Spring AI를 통해 응답을 받은 뒤 Jackson ObjectMapper를 이용하여 DTO로 변환했습니다.

OpenAI Response
↓
JSON
↓
ObjectMapper
↓
AiAnalysisResponse
↓
Frontend

#### Result

AI 분석 결과를 프론트엔드에서 일관된 구조로 렌더링할 수 있도록 구현했습니다.

---

### 04. AI 데이터 신뢰성

#### Problem

AI가 실제 운영 데이터에 존재하지 않는 내용을 임의로 생성할 가능성이 있었습니다.

#### Solution

매출, 메뉴, 재고, 인력 운영 데이터를 명확하게 구분하여 AI Prompt에 전달하고 다음과 같은 기준을 적용했습니다.

실제로 제공된 데이터만 사용
+
존재하지 않는 데이터 생성 금지
+
제공되지 않은 정보 추론 금지

#### Result

CafeOS에서 실제로 수집된 데이터를 기반으로 운영 분석 결과를 생성하도록 구성했습니다.

---

## ⚙️ Design Considerations

### 도메인별 책임 분리

각 기능을 하나의 Service에 몰아넣지 않고 도메인별 Controller / Service / Repository 구조로 책임을 분리했습니다.

Controller
    ↓
Service
    ↓
Repository
    ↓
Entity

이를 통해 기능별 책임을 명확하게 구분하고 유지보수 및 기능 확장이 가능하도록 구성했습니다.

---

### 실제 운영 데이터 중심 설계

AI 분석을 별도의 독립 기능으로 만들기보다는 기존 CafeOS에서 이미 생성되는 데이터를 활용하도록 구성했습니다.

Order
 ↓
Sales

Order + Recipe
 ↓
Inventory

Inventory + Usage
 ↓
Prediction

Sales + Menu + Inventory + Workforce
 ↓
AI Analysis

따라서 기존 기능에서 생성되는 운영 데이터가 AI 분석 기능으로 자연스럽게 확장되도록 설계했습니다.

---

## 👤 My Role

### Backend / Full-Stack Developer

프로젝트에서 백엔드 구현을 중심으로 프론트엔드 연동 및 전체 기능 통합을 담당했습니다.

### 주요 담당 업무

- 프로젝트 초기 구조 설계
- Spring Boot 백엔드 구현
- REST API 설계 및 구현
- Spring Security 인증 / 인가
- JWT Access / Refresh Token 구현
- Google OAuth2 로그인 연동
- 사용자 및 직원 관리
- 메뉴 및 레시피 관리
- 주문 기능 구현
- 주문 기반 재고 자동 차감
- 재고 관리 및 소진 예측
- 매출 분석 API 구현
- AI 운영 분석 구현
- Next.js 프론트엔드 API 연동
- 프로젝트 기능 통합
- 팀 리딩
- 발표 및 시연 구성

---

## 📸 Screenshots

### Dashboard

![Dashboard](./docs/images/dashboard.png)

### Order

![Order](./docs/images/order.png)

### Menu & Recipe

![Menu](./docs/images/menu.png)

### Inventory

![Inventory](./docs/images/inventory.png)

### Employee

![Employee](./docs/images/employee.png)

### Attendance

![Attendance](./docs/images/attendance.png)

### Task

![Task](./docs/images/task.png)

### AI Analysis

![AI Analysis](./docs/images/ai-analysis.png)

---

---

## 📊 Project Flow

                    ┌──────────────┐
                    │     User     │
                    └──────┬───────┘
                           │
                    Authentication
                           │
                           ▼
                    ┌──────────────┐
                    │  Dashboard   │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
      Menu               Order            Employee
        │                  │                  │
        ▼                  ▼                  ▼
     Recipe           Order Item         Attendance
        │                  │                  │
        └──────────┬───────┘                  ▼
                   ▼                         Task
               Inventory
                   │
                   ▼
          Inventory Prediction
                   │
                   ▼
              AI Analysis
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
      Sales       Menu    Workforce
        │          │          │
        └──────────┴──────────┘
                   │
                   ▼
             운영 개선 제안

---

## 📌 Project Result

CafeOS를 통해 카페 운영에서 발생하는 여러 데이터를 하나의 시스템에서 관리할 수 있도록 구현했습니다.

특히 다음과 같은 핵심 데이터 흐름을 구축했습니다.

주문
↓
주문 아이템
↓
메뉴
↓
레시피
↓
재료
↓
재고 자동 차감
↓
재고 사용량 분석
↓
재고 소진 예측
↓
AI 운영 분석

단순한 관리자 페이지 형태의 CRUD 구현을 넘어 실제 매장 운영 과정에서 발생하는 데이터를 연결하고 활용하는 서비스 구조를 구현했습니다.

---

## 📈 Future Improvements

### 실시간 주문 처리

WebSocket 또는 SSE를 활용하여 주문 상태 변경을 실시간으로 반영할 수 있습니다.

### 고도화된 재고 예측

요일, 시간대, 계절별 판매량 등을 추가적으로 반영하여 재고 예측 정확도를 높일 수 있습니다.

### AI 운영 분석 고도화

과거 운영 데이터를 지속적으로 축적하여 매출 변화, 인기 메뉴 변화, 재고 변동 등을 비교하고 보다 구체적인 운영 의사결정을 지원할 수 있습니다.

### 배포 환경 고도화

AWS 기반 환경에서 Frontend / Backend / Database를 분리하여 실제 서비스 환경에 가까운 구조로 운영할 수 있습니다.

---

## 🔗 Links

### 🎬 Demo

<시연 영상 URL>

### 🚀 Live

<배포 URL>

### 💻 GitHub

<GitHub Repository URL>

### 📄 Portfolio

<Portfolio URL>

---

## 👨‍💻 Developer

### 이지노

**Backend / Full-Stack Developer**

`Java` · `Spring Boot` · `Spring Security` · `JPA`

`Next.js` · `React` · `TypeScript` · `PostgreSQL`
