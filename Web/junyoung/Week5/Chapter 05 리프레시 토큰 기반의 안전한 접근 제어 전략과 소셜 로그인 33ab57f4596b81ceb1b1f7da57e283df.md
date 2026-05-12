# Chapter 05. 리프레시 토큰 기반의 안전한 접근 제어 전략과 소셜 로그인

# 📝 학습 목표

---

### 1. 웹 서비스 인증/인가 심화 개념 및 최신 표준 이해

- **OAuth 2.0 (Open Authorization) 이해**:
    - OAuth 2.0이 **인증(Authentication)**이 아닌 **권한 부여(Authorization)**를 위한 표준 프레임워크임을 명확히 이해합니다.
    - OAuth 2.0의 네 가지 주요 역할자(리소스 소유자, 클라이언트, 권한 서버, 리소스 서버)의 기능을 파악합니다.
- **Authorization Code Flow with PKCE 숙달**:
    - 보안상 가장 권장되는 **Authorization Code Flow with PKCE**의 전체 흐름(code_verifier 생성, code_challenge 전달, 토큰 교환 등)을 익히고, **프론트엔드(React)와 백엔드 간의 역할 분담**을 명확히 구분합니다.
    - OpenID Connect (OIDC)가 OAuth 2.0 위에 구축된 **인증 계층**임을 이해하고 두 프로토콜의 차이점을 파악합니다.
- **토큰 재발급(Refresh Token) 흐름 습득**:
    - 단기 유효 Access Token과 장기 유효 Refresh Token을 사용한 **보안적인 토큰 재발급 메커니즘**의 작동 흐름을 정확히 이해하고 실무에 적용할 수 있는 기반을 마련합니다.

---

### 2. 웹 보안 근간: SOP, CORS, CSP 심층 분석

- **동일 출처 정책 (Same-Origin Policy, SOP) 정립**:
    - 웹 보안의 근간인 SOP의 원칙과 출처(Origin)를 구성하는 세 가지 요소(프로토콜, 도메인, 포트)를 정확히 이해합니다.
    - SOP가 어떻게 **Session Hijacking**과 같은 보안 위험을 방지하는지 구체적으로 설명할 수 있는 능력을 기릅니다.
- **교차 출처 리소스 공유 (Cross-Origin Resource Sharing, CORS) 해결 전략**:
    - SOP의 제약을 완화하는 CORS의 개념을 이해하고, **Simple Request**와 Preflight Request (OPTIONS 메소드)의 작동 방식을 구분하여 파악합니다.
    - 프론트엔드 개발자로서 CORS 에러 발생 시 백엔드에 요청해야 할 핵심 응답 헤더(e.g., `Access-Control-Allow-Origin`, `Access-Control-Allow-Credentials`) 및 **Proxy**를 활용한 임시 해결책을 습득합니다.
- **Content Security Policy (CSP) 학습**:
    - *Content Security Policy (CSP)의 필요성과 작동 방식을 이해하고, 이를 통해 **XSS (Cross-Site Scripting)와 같은 공격을 방어하는 웹 보안 설정 능력을 강화합니다.

---

### 3. 접근 제어 모델 (RBAC/ABAC) 비교 및 활용

- **RBAC (Role-Based Access Control) 이해**:
    - 역할(Role) 기반의 접근 제어 방식인 RBAC의 핵심 개념(사용자, 역할, 권한)과 장단점을 이해합니다.
- **ABAC (Attribute-Based Access Control) 숙달**:
    - 속성(Attribute) 기반의 접근 제어 방식인 ABAC의 네 가지 속성 유형(주체, 객체, 작업, 환경)을 이해하고, **정교하고 동적인 접근 제어**가 필요한 상황에 ABAC을 활용하는 능력을 기릅니다.
- **접근 제어 모델 선택 능력**:
    - RBAC과 ABAC의 특징과 한계점을 비교하고, 실제 서비스 환경 및 복잡성에 따라 두 모델 중 어떤 것을 선택할지 **합리적인 의사결정**을 내릴 수 있는 사고력을 기릅니다.

---

<aside>
💡 이번 주차는 지난 주차 워크북에 이어서 웹 서비스의 **기본이자 가장 중요한 요소**인 인증(Authentication)과 인가(Authorization)의 개념을 명확히 정립하고, 특정 경로를 보호하는 방법과 리프레시 토큰과 소셜로그인 구현하는 기술을 습득하는 데 중점을 둡니다.

**- UMC 중앙 웹 파트장 매튜 / 김용민 -**

</aside>

# ⚠️ 스터디 진행 방법

---

1. **워크북 완료 후 스터디 참여**
    - 스터디 전, 워크북 내용을 **모두 작성**하고 이해되지 않은 부분을 준비합니다.
2. **스터디 미션 수행**
    - 워크북 완료 후 미션을 수행합니다.
    - 진행 내용과 문제점을 스터디 시간에 공유합니다.
    - **코드 리뷰**는 GitHub PR에서 상시 진행합니다.
3. **스터디 시간 구성**
    1. 각자 진행한 미션 중 **해결하지 못한 이슈 공유**
    2. 해당 문제를 **스터디원과 함께 해결 방법 공유**, 필요 시 같이 해결
    3. 미션 후 **피드백 공유 및 개선**
4. **주차별 미션 제출**
    - 매주 **워크북과 미션을 제출**합니다. (디자인은 개인 보완 가능)
    - 워크북 완료 후 [**워크북 피드백 폼 제출**](https://forms.gle/BadzDEnCvw2n98TQ8)
        - 특정 주제에 많은 피드백 요청이 들어올 경우, 피드백 이후 해당 내용을 바탕으로 **추가 강의 영상** 제공 예정 ([유튜브 구독](https://www.youtube.com/@yongcoding?utm_source=chatgpt.com))
    - **🍠 코드 리뷰 제출 기준**
        - 본인이 리뷰한 코드 **최소 1개**
        - 본인이 받은 리뷰를 코드에 **실제 반영한 것 최소 1개**
5. **스터디 인증샷**
    - 매주 대표 사진 **1장** 남기기
    - 이미지 임베드 또는 복사·붙여넣기 가능

# 📸 잠깐 ! 스터디 인증샷은 찍으셨나요?📸

---

* 스터디리더께서 대표로 매 주차마다 한 장 남겨주시면 좋겠습니다!🙆💗
 (사진을 저장해서 이미지 임베드를 하셔도 좋고, 복사+붙여넣기해서 넣어주셔도 좋습니다!)

[](https://www.notion.so)

# 🎯 핵심 키워드

---

<aside>
💡 주요 내용들에 대해 조사해보고, 자신만의 생각을 통해 정리해보세요!
레퍼런스를 참고하여 정의, 속성, 장단점 등을 적어주셔도 됩니다.
조사는 공식 홈페이지 **Best**, 블로그(최신 날짜) **Not Bad**

🍠 이모지가 달린 부분은, 여러분들이 직접 조사하여, 추가 작성하거나, 실습해보실 부분이니, 꼭 진행해주셔야 합니다!

</aside>

- **OAuth 2.0**
    
    <aside>
    🍠
    
    **OAuth (Open Authorization)**는 **권한 부여**를 위한 **표준 프레임워크에**요. 흔히 "로그인"이라고 부르는 **인증(Authentication)**과는 본질적으로 다르답니다.
    
    - **핵심 목표:** 사용자가 자신의 로그인 정보(비밀번호)를 제3의 서비스(클라이언트 앱)에 직접 알려주지 않으면서도, 그 서비스가 다른 서비스(리소스 서버)에 있는 사용자 **데이터에 접근할 수 있는 권한**을 안전하게 부여하도록 돕는 거예요.
    - **쉬운 예시:** "구글로 로그인" 기능을 떠올려 보세요. 우리가 만든 React 앱은 사용자님의 구글 비밀번호를 전혀 모르지만, 구글에 있는 사용자님의 프로필 정보(이름, 이메일)를 잠시 가져올 수 있는 허가증(Access Token)을 받는 거죠.
    </aside>
    
    - **OAuth 2.0**의 주요 역할자 (Roles)
        
        # **OAuth 2.0**의 주요 역할자 (Roles)
        
        **OAuth 2.0**의 흐름에는 네 가지 주요 역할자가 있어요.
        각자의 역할을 정확히 이해하는 것이 전체 흐름을 파악하는 데 핵심이에요.
        
        | 역할 | 설명 | 예시 |
        | --- | --- | --- |
        | **리소스 소유자** (Resource Owner) | 데이터의 주인, 즉 사용자예요 | 카카오톡 계정 소유자 |
        | **클라이언트** (Client) | 리소스 소유자 대신 데이터를 요청하려는 우리 앱이에요 | 우리가 만드는 React 웹 앱 |
        | **권한 서버** (Authorization Server) | 사용자 신원을 확인하고, 클라이언트에게 Access Token을 발급하는 서버예요 | 네이버 로그인/권한 부여 서버 |
        | **리소스 서버** (Resource Server) | 보호된 사용자 데이터를 실제로 가지고 있는 서버예요. Access Token을 검증해서 유효하면 데이터를 제공해요 | 네이버 회원 정보 API 서버 |
    - **OAuth 2.0** 인증 및 권한 부여 프로세스
        
        ## **OAuth 2.0**  인증 및 권한 부여 프로세스
        
        "구글로 로그인" 버튼을 눌렀을 때 실제로 어떤 일이 일어나는지 단계별로 살펴볼게요.
        
        1. **권한 요청** — 사용자가 "구글로 로그인" 버튼을 클릭하면, 클라이언트(우리 앱)가 권한 서버(구글)로 사용자를 리디렉션해요.
        2. **사용자 인증 및 동의** — 구글 로그인 페이지에서 사용자가 직접 구글 계정으로 로그인하고, 우리 앱에 어떤 정보를 허용할지 동의해요.
        3. **Authorization Code 발급** — 동의가 완료되면 권한 서버가 우리 앱으로 일회용 코드(Authorization Code)를 전달해요.
        4. **Access Token 교환** — 우리 앱 서버는 이 코드를 권한 서버에 전달하고, 실제로 사용할 수 있는 Access Token을 받아요.
        5. **리소스 접근** — 발급받은 Access Token으로 리소스 서버에 요청해서 사용자 정보(이름, 이메일 등)를 가져와요.
        
        > 💡 Authorization Code를 중간에 거치는 이유는, Access Token이 브라우저 URL에 직접 노출되지 않도록 보안을 강화하기 위해서예요.
        > 
    - **OAuth 2.0**의 권한 부여 흐름 (Grant Types)
        
        # 권한 부여 흐름 (Grant Types)
        
        과거에는 프론트엔드에서 **Implicit Flow**를 사용했지만, 보안상의 이유로 현재는 사용을 **권장하지 않아요.** 따라서, React 앱 개발자에게 **가장 안전하고 권장되는 최신 표준**은 Authorization Code Flow with PKCE (Proof Key for Code Exchange)에요.
        
        React 앱은 `Client Secret`을 안전하게 숨길 수 없기 때문에, 이 **PKCE**라는 추가적인 검증 메커니즘을 사용해서 보안을 강화하는 거랍니다.
        
        ---
        
        ### 흐름 요약
        
        1. **PKCE 준비:** React 앱이 **`code_verifier`**(랜덤 문자열)를 생성하고, 이를 해시한 `code_challenge`를 만들어서 준비해요.
        2. **권한 요청:** React 앱이 사용자 브라우저를 **권한 서버**로 리다이렉트해요. 이때 `client_id`, `redirect_uri`, `scope`와 함께 생성한 `code_challenge`를 보냅니다.
        3. **코드 발급:** 권한 서버에서 로그인 및 동의가 완료되면, 사용자 브라우저를 우리 앱의 `redirect_uri`로 다시 리다이렉트하며 **Authorization Code**를 전달해요.
        4. **토큰 교환 (백엔드 역할):**
            - **⚠️ 중요:** React 앱(프론트엔드)은 이 코드를 직접 액세스 토큰으로 교환하면 **안 돼요.**
            - 프론트엔드에서 전달받은 **Authorization Code**와 `code_verifier`를 우리 백엔드 서버(BFF/API Gateway)가 권한 서버에 보내 Access Token 발급을 요청해요.
            - 권한 서버는 `code_verifier`를 검증하고 Access Token을 발급해서 백엔드에 전달해요.
        5. **리소스 접근:** 백엔드가 Access Token을 사용해서 리소스 서버에 접근하고 데이터를 가져와서 프론트엔드에 응답해 줍니다.
        
        ```mermaid
        sequenceDiagram
            participant U as 사용자(Resource Owner)
            participant C as React 앱(Client)
            participant AS as 권한 서버(Authorization Server)
            participant BS as 우리 백엔드(BFF/API Gateway)
            participant RS as 리소스 서버(Resource Server)
        
            U->>C: 로그인 클릭
            C->>C: code_verifier & code_challenge 생성(PKCE)
            C->>AS: (1) 리다이렉트(client_id, scope, code_challenge 등)
            AS->>U: (2) 로그인 및 권한 동의 요청
            U->>AS: (3) 로그인 및 동의
            AS->>C: (4) 리다이렉트(Authorization Code)
            C->>BS: (5) Code와 code_verifier 전달
            BS->>AS: (6) 토큰 요청(Authorization Code, code_verifier)
            AS-->>BS: (7) Access Token, Refresh Token 발급
            BS->>C: (8) HttpOnly 쿠키 등으로 로그인 세션 생성
            C->>BS: (9) 보호된 리소스 요청 (쿠키 자동 첨부)
            BS->>RS: (10) Access Token 첨부하여 리소스 요청
            RS-->>BS: (11) 리소스 응답
            BS-->>C: (12) 최종 데이터 응답
        ```
        
    - **OAuth 2.0**과 OpenID Connect
        
        ### **OAuth 2.0**과 OpenID Connect
        
        **OAuth 2.0**만으로는 "이 사용자가 누구인지"는 알 수 없어요.
        단순히 특정 리소스에 접근할 수 있는 권한(Authorization)만 다루거든요.
        
        그래서 등장한 게 **OpenID Connect (OIDC)** 예요.
        
        - **OAuth 2.0**→ "이 앱이 내 데이터에 접근해도 돼" (권한 부여)
        - **OpenID Connect** → "이 사용자는 홍길동이야" (신원 확인)
        
        OIDC는 **OAuth 2.0** 위에 얹혀진 인증 레이어예요. Access Token과 함께 **ID Token(JWT 형식)** 을 추가로 발급해서, 사용자의 신원 정보(이름, 이메일 등)를 안전하게 전달해요.
        
        > 💡 "구글 로그인"을 구현할 때 실제로는 **OAuth 2.0**이 아니라 OpenID Connect를 사용하는 경우가 대부분이에요.
        > 
        
        ---
        
        ### 요약
        
        - **OAuth 2.0**
            
            주로 권한 부여에 초점을 맞추어, 리소스 접근 권한을 관리합니다.
            
        - **OpenID Connect (OIDC)**
            
            **OAuth 2.0** 위에 구축된 인증 계층으로, 사용자 인증 및 프로필 정보를 제공하여 단일 로그인을 구현할 때 사용됩니다.
            
    - **OAuth 2.0** 장점 및 단점
        
        ### **OAuth 2.0** 장점 및 단점
        
        ### 장점
        
        - 사용자가 비밀번호를 우리 앱에 직접 알려주지 않아도 돼요. 보안 측면에서 가장 큰 이점이에요.
        - 구글, 카카오, 네이버 등 이미 신뢰받는 서비스의 인증 인프라를 그대로 활용할 수 있어요.
        - 접근 범위(Scope)를 세밀하게 제어할 수 있어서, 필요한 데이터만 최소한으로 요청할 수 있어요.
        - 사용자 입장에서는 새로운 계정을 만들 필요가 없어서 가입 허들이 낮아져요.
        
        ### 단점
        
        - 흐름이 복잡해서 처음 구현할 때 진입 장벽이 있어요.
        - 권한 서버(구글, 카카오 등)가 장애나면 우리 서비스 로그인도 함께 영향을 받아요.
        - 잘못 구현하면 오히려 보안 취약점이 생길 수 있어요. (CSRF, Token 탈취 등)
        - OAuth 2.0 자체는 인증(Authentication)이 아니라 권한 부여(Authorization) 프로토콜이라, 신원 확인까지 하려면 OpenID Connect를 별도로 이해해야 해요.
- **CORS**
    - **CORS**란 무엇인가요?
        
        # **CORS**란 무엇인가요?
        
        **CORS**는 **교차 출처 리소스 공유(Cross-Origin Resource Sharing)**의 약자예요. 이름 그대로, **다른 출처(Origin)**에 있는 자원(리소스, 즉 API 데이터)을 공유할 수 있도록 허용하는 메커니즘이죠.
        
        ---
        
        ### SOP (Same-Origin Policy) - **CORS**의 탄생 배경
        
        **CORS**를 이해하려면 먼저 웹 보안의 근간이 되는 **동일 출처 정책(SOP)**을 알아야 해요.
        
        - **SOP의 원칙:** 웹 브라우저는 기본적으로 **같은 출처**에서 온 리소스만 접근하도록 허용해요.
            - **출처(Origin) 구성 요소:** **프로토콜 (Protocol) + 도메인 (Domain) + 포트 (Port)**
        - **예시:**
            - `http://app.com:8080`과 `http://app.com:8080`은 **동일 출처**예요.
            - `https://app.com:8080`은 프로토콜이 다르므로 **다른 출처**예요. (SOP 위반)
            - `http://api.com:8080`은 도메인이 다르므로 **다른 출처**예요. (SOP 위반)
        
        SOP는 악의적인 웹사이트가 사용자 모르게 다른 사이트의 민감한 데이터(예: 은행 잔액, 개인 정보)를 훔쳐 가는 것을 막기 위한 방패에요.
        
        ---
        
        하지만 현대 웹 개발에서는 프론트엔드(예: `localhost:3000`)와 백엔드 API 서버(예: `api.myservice.com:8080`)가 **다른 출처**를 가질 수밖에 없죠. SOP의 엄격함을 유지하면서도 필요한 통신을 허용하기 위해 태어난 것이 바로 **CORS**랍니다.
        
    - **📚 블로그 읽고 Content Security Policy(CSP) 정리해보기 🍠**
        
        # **📚 블로그 읽고 Content Security Policy(CSP) 정리해보기 🍠**
        
        ---
        
        [개발자 매튜 | Content Security Policy(CSP)로 배우는 웹 보안 설정법](https://www.yolog.co.kr/post/http-content-security-policy/)
        
        - 서버에서 HTML 문서를 응답할 때 CSP를 적용하려면 어떤 HTTP 응답 헤더를 설정해야 하나요? 블로그에 나온 Express.js 코드 예시를 기반으로 설명해보세요.
        - `default-src 'self'` 설정은 브라우저에게 어떤 보안 정책을 의미하나요? 또한 `'self'` 값은 어떤 출처를 포함하거나 제외하나요?
        - 블로그에 나온 악성 스크립트(`<script>fetch(...)</script>`)를 주입했을 때 CSP가 어떻게 동작하는지 네트워크 탭과 콘솔 메시지 측면에서 설명해보세요.
        - 기본 CSP 설정에서 인라인 스타일이 차단된다고 했습니다. 블로그 예시 중 `width:600px`이 적용되지 않는 이유를 설명하세요.
        - 구글 애널리틱스, 카카오맵, 외부 API 등이 CSP 때문에 차단될 수 있다고 했습니다. 이러한 현상을 "건물 보안을 강화한다"는 비유와 연결해 설명해보세요.
        - Report-Only 모드에서는 실제 리소스 실행이 차단되지 않습니다. 그 대신 브라우저와 서버에서 각각 어떤 동작을 수행하나요?
        - CSP만으로는 CSRF를 막을 수 없다고 했습니다. 블로그에 정리된 다른 보안 조치들(SameSite 쿠키, X-Frame-Options 등) 중 2가지를 설명하세요.
        
    - **📚 블로그 읽고 동일 출처 정책(Same Origin Policy) 정리해보기 🍠**
        
        # **📚 블로그 읽고 동일 출처 정책(Same Origin Policy) 정리해보기 🍠**
        
        ---
        
        [개발자 매튜 | 웹 보안의 핵심, Same Origin Policy(동일 출처 정책) 쉽게 이해하기](https://www.yolog.co.kr/post/http-same-origin-policy/)
        
        - 출처(Origin)는 어떤 세 요소의 조합으로 결정되나요?
        - 출처의 요소가 다른 경우(예: 프로토콜만, 포트만 다른 경우)에 같은 출처인지 아닌지를 예시 3개(같은 출처 1개, 다른 출처 2개)로 설명하세요.
        - 블로그에 나온 `fetch` 기반 악성 스크립트를 다른 출처로 실행했을 때 브라우저에서 어떤 일이 발생하나요? 네트워크 전송 여부, 응답 사용 가능성, 브라우저 콘솔 메시지 측면에서 서술하세요.
        - SOP가 어떻게 Session Hijacking(세션 하이재킹) 시도를 방지하는지 구체적으로 설명하세요. SOP가 차단하는 것과 허용되는 것(예: 네트워크 요청은 나가지만 응답 데이터에 접근 불가)을 포함하세요.
        - 블로그에서 명시한 대로 SOP가 반드시 동일 출처에서만 접근하도록 하는 주요 브라우저 API/리소스 3가지를 쓰고, 각각에 대해 간단한 설명(왜 제한되는지)을 덧붙이세요.
        - SOP와 CSP의 차이를 블로그 내용에 따라 요점 4개(각 항목 1문장)로 정리하세요. (예: 누가 적용하는가, 제어 주체, 설정 가능 여부 등)
        - 브라우저에서 SOP 관련 차단 오류를 발견했을 때(예: 콘솔에 “동일 출처 정책으로 인해 ... 차단했습니다” 메시지) 문제 원인 파악을 위한 체크리스트(최소 3항목)를 작성하고, 임시·영구 대응 방안(각 1~2줄)도 제시하세요.
        
    - **CORS** 작동 방식: 요청의 종류
        
        ## **CORS** 작동 방식: 요청의 종류
        
        **CORS** 요청은 브라우저가 보안 검사를 진행하는 방식에 따라 크게 두 가지로 나뉘어요.
        
        ---
        
        ### 1. Simple Request (단순 요청)
        
        다음 **세 가지 조건**을 **모두** 만족하는 요청이에요. 브라우저는 서버에 요청을 보낸 후, 서버의 응답 헤더를 보고 접근 허용 여부를 판단해요.
        
        | 조건 | 세부 내용 |
        | --- | --- |
        | **메소드** | `GET`, `POST`, `HEAD` 중 하나여야 해요. |
        | **허용 헤더** | `Accept`, `Accept-Language`, `Content-Language`, `Content-Type` 중 하나여야 해요. |
        | **Content-Type** | `application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain` 중 하나여야 해요. |
        
        **✅ 흐름:** **요청 전송 → 응답 수신 → 브라우저가 CORS 헤더 확인 → 통과 시 데이터 전달**
        
        ---
        
        ### 2. Preflight Request (프리플라이트 요청)
        
        Simple Request 조건을 하나라도 만족하지 못하는 요청(예: `PUT`, `DELETE` 메소드, `Content-Type: application/json` 사용, 사용자 정의 헤더 사용 등)에 대해 브라우저가 사용하는 방식이에요.
        
        **⚠️ 이 방식이 중요해요!** 
        
        브라우저는 본 요청을 보내기 전에 서버에게 "내가 이런 요청을 보내도 될까요?" 하고 미리 물어보는 예비 요청을 보내요.
        
        - **메소드:** `OPTIONS`
        - **목적:** 서버가 실제 요청을 받아들일 준비가 되어 있는지, 어떤 메소드와 헤더를 허용하는지 미리 확인해요.
        
        **✅ 흐름:** **`OPTIONS` 요청 전송 → 서버가 허용 헤더로 응답 → 브라우저가 통과 확인 → 본 요청 전송**
        
        > 팁: React에서 fetch나 axios로 PUT, DELETE, 또는 Content-Type: application/json을 사용하는 POST 요청을 보내면, 무조건 Preflight Request가 발생하게 된답니다. 브라우저 개발자 도구의 Network 탭에서 OPTIONS 요청을 확인해 보세요.
        > 
        
    - **CORS** 해결책
        
        ## **CORS** 해결책
        
        **CORS** 에러는 클라이언트(브라우저)가 띄우지만, 사실상 이 문제를 해결할 책임은 **서버(백엔드)** 측에 있어요. 
        
        프론트엔드 개발자로서 이 에러를 마주했을 때 취해야 할 조치와 원칙을 정리해 드릴게요.
        
        ---
        
        ### 1. 서버 개발팀에 요청할 헤더 설정
        
        **CORS** 문제를 해결하는 핵심은 **서버가 응답 헤더에 명시적으로 클라이언트의 접근을 허용**하는 정보를 담아주는 거예요.
        
        | 헤더 | 역할 | 예시 값 |
        | --- | --- | --- |
        | **`Access-Control-Allow-Origin`** | **필수!** 이 출처의 접근을 허용해요. | `http://localhost:3000` 또는 `*` (모든 출처 허용, 권장되지 않음) |
        | **`Access-Control-Allow-Methods`** | 허용할 HTTP 메소드를 정의해요. (Preflight 응답용) | `GET, POST, PUT, DELETE` |
        | **`Access-Control-Allow-Headers`** | 허용할 요청 헤더를 정의해요. (Preflight 응답용, 특히 `Authorization` 헤더는 필수로 추가해야 해요.) | `Content-Type, Authorization` |
        | **`Access-Control-Allow-Credentials`** | `true`로 설정 시, 쿠키나 인증 정보(`Authorization` 헤더)를 요청에 포함할 수 있도록 허용해요. | `true` |
        
        ---
        
        ### 2. React 환경에서 임시 해결책: Proxy 설정
        
        개발 환경에서 백엔드 서버가 아직 **CORS** 설정을 완료하지 않았거나, 포트를 맞춰주기 어려울 때 React 앱에서 임시방편으로 사용할 수 있는 방법이에요.
        
        ---
        
        - **원리:** 브라우저의 SOP는 클라이언트 서버(React)에 대한 요청만 확인해요. React 앱에서 API 요청을 보낼 때, 실제 API 주소 대신 **자신의 도메인**으로 요청하고, React 개발 서버(webpack/Vite)가 이 요청을 받아서 **실제 API 서버로 대신 전달**해 주는 방식이에요. 이 과정은 서버 간의 통신이므로 SOP/**CORS**가 적용되지 않아요.
        - Create React App (CRA)의 경우:JSON
            
            package.json 파일에 간단하게 proxy 속성을 추가해요.
            
            `"proxy": "http://api.myservice.com:8080"`
            
            이제 React 코드에서 `fetch('/api/data')`를 호출하면, 개발 서버가 `http://api.myservice.com:8080/api/data`로 대신 요청을 보내줘요.
            
        
        ---
        
        ### 3. 인증 정보 전달 시 유의사항
        
        토큰 기반 인증(OAuth 2.0)이나 세션/쿠키를 사용할 때 **CORS**와 관련된 중요한 사항이에요.
        
        1. **쿠키 사용 시:** `HttpOnly` 쿠키를 사용한다면, 요청 시 `credentials: 'include'` 옵션(또는 `withCredentials: true`)을 설정하고, 서버는 반드시 **`Access-Control-Allow-Credentials: true`*를 응답해야 해요.
        2. **`Authorization` 헤더:** JWT 등의 토큰을 `Authorization` 헤더에 담아 보낸다면, 서버의 Preflight 응답에 **`Access-Control-Allow-Headers`** 목록에 `Authorization`이 반드시 포함되어야 한답니다.
        
        **CORS**는 웹 개발의 뗄 수 없는 그림자 같은 존재예요. 
        
        에러를 마주했을 때 당황하지 말고, **"아, 이건 백엔드의 헤더 설정 문제구나"**라고 판단하고 위에 정리된 헤더 목록을 전달하며 소통하는 개발자의 모습을 보여주세요!
        
    - **📚 블로그 읽고 교차 출처 리소스 공유(CORS) 정리해보기 🍠**
        
        # **📚 블로그 읽고 교차 출처 리소스 공유(CORS) 정리해보기 🍠**
        
        ---
        
        [개발자 매튜 | 악명 높은 CORS(교차 출처 리소스 공유) 쉽게 이해하기](https://www.yolog.co.kr/post/http-cors/)
        
        - 브라우저에서 `http://localhost:8080` 애플리케이션이 `http://localhost:8081/resource.json`을 요청했을 때, 네트워크 요청과 응답은 어떻게 처리되며, 브라우저가 응답 본문을 사용하지 못하는 이유는 무엇인가요?
        - 서버가 다른 출처(`http://localhost:8080`)에서 자원을 사용할 수 있게 하려면 어떤 응답 헤더를 어떻게 설정해야 하나요? 글의 예시 코드를 참고해 헤더 이름과 값까지 구체적으로 쓰세요.
        - 단순 요청으로 분류되기 위해서는 어떤 두 가지 조건을 만족해야 하나요? 또한 `GET /resource.json` 요청이 단순 요청에 해당하는 이유를 설명하세요.
        - 브라우저에서 `X-Goguma`라는 커스텀 헤더를 추가했을 때 왜 차단이 발생하나요? 이 문제를 해결하기 위해 서버에서 추가해야 하는 응답 헤더와 값은 무엇인가요?
        - `PUT` 요청을 보낼 때 브라우저는 왜 먼저 `OPTIONS` 요청을 보내나요? 이때 브라우저가 보내는 헤더와 서버가 응답해야 하는 헤더를 각각 쓰고, 사전 요청과 실제 요청이 어떻게 이어지는지 간단히 서술하세요.
- **RBAC vs ABAC**
    
    <aside>
    🍠
    
    **RBAC과 ABAC은 모두 '누가', '무엇을' 할 수 있는지 결정하는 접근 제어(Access Control) 모델이에요.**
    
    시스템과 데이터의 문을 관리하는 두 가지 방식이라고 생각하면 쉬워요. **RBAC은 신분증(역할)**을 보고, **ABAC은 다양한 조건(속성)**을 보고 문을 열어줄지 말지 판단한답니다.
    
    </aside>
    
    - **RBAC (Role-Based Access Control) : 역할 기반 접근 제어**
        
        ## **RBAC** (Role-Based Access Control) : 역할 기반 접근 제어
        
        **RBAC은 사용자의 '역할(Role)'을 기준으로 권한을 할당하는 방식이에요.** 가장 흔하게 사용되며, 관리하기 쉽다는 장점이 있어요.
        
        ---
        
        ### 🔑 핵심 개념
        
        | 용어 | 설명 | 예시 |
        | --- | --- | --- |
        | **사용자 (User)** | 시스템을 이용하는 사람이나 계정이에요. | 개발팀 김철수 사원 |
        | **역할 (Role)** | 수행하는 직무나 기능에 따라 **권한들을 묶어 놓은** 집합이에요. | '재무팀 관리자', '일반 사용자', '서버 엔지니어' |
        | **권한 (Permission)** | 리소스에 대해 구체적으로 할 수 있는 작업이에요. | `파일 읽기`, `사용자 추가`, `결제 승인` |
        
        ---
        
        ### 🧐 작동 방식
        
        1. **권한을 역할에 할당해요.** (예: '재무팀 관리자' 역할에는 `결제 승인` 권한을 할당해요.)
        2. **사용자에게 역할을 부여해요.** (예: 김철수 사원에게 '재무팀 관리자' 역할을 할당해요.)
        3. **결과:** 김철수 사원은 '재무팀 관리자' 역할에 있는 모든 권한, 즉 `결제 승인` 권한을 자동으로 갖게 된답니다.
        
        ---
        
        ### 👍 장점과 특징
        
        - **관리 효율성:** 수백 명의 사용자에게 일일이 권한을 부여할 필요 없이 역할만 할당하면 돼서 관리가 매우 편리하고 확장성이 좋아요.
        - **단순함:** 구조가 명확해서 대부분의 조직 환경에 적용하기 쉬워요.
        - **정적(Static) 모델:** 역할이 한 번 정의되면 잘 바뀌지 않는 비교적 고정적인 방식이에요.
        
    - **ABAC (Attribute-Based Access Control) : 속성 기반 접근 제어**
        
        ## **ABAC** (Attribute-Based Access Control) : 속성 기반 접근 제어
        
        **ABAC은 '속성(Attribute)'과 '조건'을 기반으로 권한을 동적으로 결정하는 방식이에요.** **RBAC**보다 훨씬 더 세밀하고 유연한 통제가 필요할 때 사용해요.
        
        ---
        
        ### 🔑 핵심 개념
        
        ABAC에서는 접근 요청을 승인할지 거부할지 판단하기 위해 **네 가지 유형의 속성**을 활용해요.
        
        | 속성 유형 | 설명 | 예시 |
        | --- | --- | --- |
        | **주체(사용자) 속성** | 접근을 요청하는 사용자의 특성이에요. | 부서: `마케팅팀`, 직위: `팀장`, 보안등급: `1등급` |
        | **객체(리소스) 속성** | 접근하려는 대상(파일, 데이터)의 특성이에요. | 민감도: `극비`, 파일 소유자: `John`, 위치: `US-East 서버` |
        | **작업 속성** | 사용자가 하려는 행동이에요. | `읽기(Read)`, `쓰기(Write)`, `다운로드(Download)` |
        | **환경 속성** | 접근이 요청되는 외부 상황(컨텍스트)이에요. | 시간: `업무 시간(09:00~18:00)`, 네트워크: `내부망`, 장치: `회사 지급 노트북` |
        
        ---
        
        ### 🧐 작동 방식
        
        1. **정책(Policy)을 정의해요.** 이 정책은 속성들을 조합한 **'만약/그러면'** 형태의 규칙이에요.
        2. **정책 예시:** **"만약** 사용자 속성(부서=재무팀)이고 **그리고** 리소스 속성(민감도=높음)이면, **그리고** 환경 속성(시간=업무 시간)일 **때만**, **그러면** 작업 속성(읽기)을 **허용한다.**"
        3. **결과:** 실시간으로 접근 요청이 들어올 때마다 이 정책을 평가해서 그때그때 권한을 부여할지 말지 **동적으로** 결정해요.
        
        ---
        
        ### 👍 장점과 특징
        
        - **세분화된 제어:** '재무팀의 김철수 사원이 평일 오전 9시에서 오후 6시 사이에만 극비 파일을 읽을 수 있다'와 같이 매우 정교한 제어가 가능해요.
        - **동적(Dynamic) 모델:** 상황(시간, 위치)이 바뀌면 실시간으로 접근 권한도 바뀔 수 있어요.
        - **유연성:** 새로운 리소스나 사용자 역할이 추가되어도 정책의 속성만 잘 정의하면 기존 정책을 그대로 활용할 수 있어요.
    - **RBAC vs ABAC 한눈에 비교하기**
        
        ## 한눈에 비교하기
        
        ---
        
        | 구분 | **RBAC** (역할 기반) | ABAC (속성 기반) |
        | --- | --- | --- |
        | **핵심 요소** | 역할 (Role) | 속성 (Attribute) 및 정책 (Policy) |
        | **접근 결정** | **할당된 역할**만 보고 결정해요. | **다양한 속성**과 **조건**을 모두 따져 동적으로 결정해요. |
        | **유연성** | 상대적으로 낮아요. | 상대적으로 매우 높아요. |
        | **복잡성** | 단순하고 관리하기 쉬워요. | 정책 정의와 관리가 복잡할 수 있어요. |
        | **언제 쓸까요?** | 권한 구조가 고정적이고 명확한 **일반 기업 시스템**에 적합해요. | **클라우드 환경**이나 **매우 민감한 데이터** 제어와 같이 세밀하고 동적인 제어가 필요할 때 적합해요. |
    - **📚 블로그 읽고 ABAC 정리해보기 🍠**
        
        # **📚 블로그 읽고 ABAC 정리해보기 🍠**
        
        ---
        
        <aside>
        🍠
        
        해당 블로그 포스트는 제가 실제로 사내에서 겪은 문제점을 쉽게 해결하기 위해 고민한 내용을 담은 글입니다!
        
        여러분들이라면, 어떠한 상황일 때 의사결정을 내릴지 여러분의 입장에서 정리를 해보시면 좋을 것 같습니다!
        
        늘 그렇지만 블로그를 읽고 답변하는 부분에는 명확한 정답이 없으니 정말 편하게 고민하는 시간을 갖어보셨으면 합니다!
        
        - UMC 중앙 웹 파트장 매튜/김용민 -
        
        </aside>
        
        [개발자 매튜 | 복잡한 권한, 깔끔하게 관리하기 - ABAC 도입기](https://www.yolog.co.kr/post/rbac-abac/)
        
        - **RBAC**의 한계에 대해 설명해주세요.
        - **ABAC**으로의 전환, 어떤 '기준'이 적절할까요?
        - 어떤 서비스 영역에 **RBAC**을 남겨두고, **ABAC**을 도입하시겠어요?
        - 여러분들은 다른 부서에서 요청을 받았을 때 어떤식으로 행동하실껀가요?

---

# 🌊 코딩은 흐름이다

---

<aside>
⚠️

### 유의사항 및 오늘의 미션 구현 방식

### 1. 로그인 구현은 다양해요!

팀에서 **로그인 방식을 어떻게 정의**하느냐에 따라 구현 방법은 아주 간단할 수도, 매우 복잡할 수도 있습니다. 정해진 정답은 없으니 이 점을 꼭 기억해 주세요!

### 2. 오늘의 구현 방식 (프론트엔드 친화적)

오늘 우리가 미션에서 함께 진행을 할 방식은 **프론트엔드 개발자 입장에서 조금 더 편하도록** 백엔드 개발자분들이 대부분의 처리를 완료해주는 방향으로 구현하는 것입니다.

### 3. 더 나은 방법 고민하기

오늘의 방식이 **유일한 정답은 아닙니다.** 다양한 프로젝트를 경험하면서 **보안에 더 좋거나** 혹은 **더 효율적인 방법**은 없는지 계속 고민해보시면 좋습니다. 

예를 들어, 이전에 학습했던 **쿠키(Cookie)를** 활용을 한다면 더 좋은 방향성을 많이 생각해 볼 수 있을 거예요!

**- UMC 중앙 웹 파트장 매튜/김용민 -** 

</aside>

- **Token Refresh 흐름**
    
    # **Token Refresh 흐름**
    
    ---
    
    ```
         [사용자 로그인]
                 │
                 ▼
     [서버에서 AccessToken과 RefreshToken 발급]
        (예: AccessToken은 3초 유효)
                 │
                 ▼
      [토큰들을 로컬 스토리지에 저장]
                 │
                 ├───────────── API 요청 → [서버: AccessToken 확인]
                 │                   │
                 │                   └─> [정상 AccessToken → 데이터 응답]
                 │
                 ▼
         [AccessToken 만료됨]
                 │
                 ▼
    [RefreshToken으로 새로운 AccessToken 요청]
                 │
                 ▼
      [서버: RefreshToken 확인]
                 │
                 ├─ 만약 RefreshToken이 정상 → 새 AccessToken 발급  
                 │
                 └─ 만약 RefreshToken이 문제 있거나 블랙리스트에 있으면 → 새 토큰 발급 거부
                 │
                 ▼
      [새로운 AccessToken을 로컬 스토리지에 저장]
    
    ```
    
- **OAuth 2.0 흐름**
    
    # OAuth 2.0 흐름
    
    ---
    
    - **React 앱에서 로그인 버튼 클릭:**
        
        사용자가 “Google로 로그인” 버튼을 누르면, 브라우저는 백엔드의 `/v1/auth/google/login` 엔드포인트로 이동합니다.
        
    - **백엔드 `/v1/auth/google/login` 엔드포인트:**
        - **GoogleAuthGuard**는 NestJS에서 Passport의 Google 전략을 이용하여, `사용자를 Google 인증 페이지로 리다이렉트(redirect)` 시킵니다.
    - **Google 인증 페이지:**
        - 사용자는 Google의 로그인 페이지에서 자신의 계정으로 로그인하고, 애플리케이션에 대한 접근 권한(동의)을 부여합니다.
    - **Google의 콜백 (Callback):**
        - 인증이 완료되면, Google은 사용자 브라우저를 백엔드의 `/v1/auth/google/callback` 엔드포인트로 리다이렉트합니다.
        - 이 요청에는 Google이 발급한 인증 코드나 사용자 정보가 함께 포함됩니다.
    - **백엔드 `/v1/auth/google/callback` 엔드포인트:**
        - 마찬가지로 @Public()와 @UseGuards(GoogleAuthGuard)로 보호되어 있으며, **`Google에서 전달된 정보를 검증`**합니다.
        - `req.user`에 Google에서 받아온 사용자 정보(예: id, name 등)가 저장됩니다.
        - 이 정보를 바탕으로 `authService.login(req.user.id, req.user.name)`을 호출하여 `AccessToken`과 `RefreshToken`을 생성합니다.
    - **토큰 발급 및 프론트엔드 리다이렉트:**
        - 백엔드는 생성한 토큰과 함께 사용자 정보를 포함한 URL로 리다이렉트합니다.
        - 예를 들어, `http://localhost:5173/v1/auth/google/callback?userId=...&name=...&accessToken=...&refreshToken=...`와 같이 토큰들이 쿼리 파라미터로 전달됩니다.
        - React 앱에서는 이 URL을 받아서 토큰들을 추출하고, 로컬 스토리지에 저장하거나 상태관리(store)에 보관하여 사용합니다.
    
    ```mermaid
    sequenceDiagram
        actor User as 사용자
        participant React as React 앱
        participant Backend as 백엔드<br/>(NestJS)
        participant Google as Google OAuth
    
        User->>React: "Google로 로그인" 버튼 클릭
        React->>Backend: GET /v1/auth/google/login
        Note over Backend: GoogleAuthGuard 실행<br/>Passport Google 전략 활성화
        Backend->>Google: 사용자를 Google 인증 페이지로 리다이렉트
        
        Note over Google: Google 로그인 페이지
        User->>Google: Google 계정으로 로그인<br/>애플리케이션 권한 동의
        
        Google->>Backend: GET /v1/auth/google/callback<br/>(인증 코드 + 사용자 정보 포함)
        Note over Backend: GoogleAuthGuard로 정보 검증<br/>req.user에 사용자 정보 저장<br/>(id, name 등)
        
        Backend->>Backend: authService.login(req.user.id, req.user.name)<br/>AccessToken, RefreshToken 생성
        
        Backend->>React: 리다이렉트<br/>http://localhost:5173/v1/auth/google/callback<br/>?userId=...&name=...&accessToken=...&refreshToken=...
        
        React->>React: 쿼리 파라미터에서 토큰 추출<br/>로컬 스토리지 또는 상태관리에 저장
        
        React->>User: 로그인 완료
    ```
    
- **Web에서의 Google OAuth 로그인 흐름**
    
    # **Web에서의 Google OAuth 로그인 흐름**
    
    ---
    
    1. **로그인 버튼 클릭:**
        
        사용자가 React 앱에서 "Google 로그인" 버튼을 클릭합니다.
        
    2. **로그인 요청:**
        
        버튼 클릭 시, React 앱은 백엔드의 `/v1/auth/google/login` 엔드포인트로 이동하여 Google 인증 과정을 시작합니다.
        
    3. **Google 로그인 페이지로 이동:**
        
        백엔드는 GoogleAuthGuard를 통해 사용자를 Google 로그인 페이지로 리다이렉트합니다.
        
    4. **Google 로그인 및 동의:**
        
        사용자는 Google 로그인 페이지에서 자신의 계정으로 로그인하고, 애플리케이션에 필요한 권한을 부여합니다.
        
    5. **콜백 및 토큰 수신:**
        
        로그인 후, Google은 인증된 사용자를 백엔드의 `/v1/auth/google/callback` 엔드포인트로 리다이렉트합니다.
        
        백엔드는 이 요청을 처리한 후, `AccessToken`과 `RefreshToken`을 포함한 `URL(쿼리 파라미터)을 React 앱으로 리다이렉트합니다.`
        
    6. **토큰 저장 및 로그인 완료:**
        
        React 앱은 URL에서 토큰과 사용자 정보를 추출하여 로컬 스토리지나 상태 관리 도구에 저장한 후, 사용자가 로그인된 상태로 앱을 이용할 수 있게 합니다.
        
    
    ```mermaid
     sequenceDiagram
        participant U as 사용자
        participant R as React 앱
        participant B as 백엔드(API 서버)
        participant G as Google OAuth 서버
    
        U->>R: "Google 로그인" 버튼 클릭
        R->>B: /v1/auth/google/login 요청
        B-->>R: Google 로그인 페이지로 리다이렉트 URL 응답
        R->>G: Google 로그인 페이지로 리다이렉트
        G->>U: 구글 로그인/동의 화면
        U->>G: 계정 로그인 및 동의
        G->>B: /v1/auth/google/callback (Authorization Code 전달)
        B->>G: Access Token 교환 요청
        G-->>B: Access Token, Refresh Token 발급
        B->>B: 사용자 정보 확인 및 자체 토큰 생성
        B-->>R: 토큰 포함된 리다이렉트 URL 응답
        R->>R: URL에서 토큰 추출 및 저장
        U->>R: 로그인 완료, 앱 이용
    
    ```
    

---

# 😼 실제 서비스 분석

---

<aside>
🍠 많은 분들이 "배우는 내용이 실제 서비스에서 어떻게 쓰이는지 보면 학습이 더 잘 된다"는 피드백을 주셨습니다. 

그래서 이번 기수부터 워크북마다 **😼 실제 서비스 분석** 섹션을 추가할려고합니다.

분석 대상은 제가 직접 사이드 프로젝트로 만든 **아이두(Aido) — AI 기반 할 일 관리** 앱입니다. 친구들과 함께 할 일을 공유하고 더 재미있게 활용할 수 있는 서비스로, 실제로 0~11주차에서 배우는 내용이 단 하나도 빠짐없이 녹아 있습니다. 

워크북 내용이 과하다고 느끼셨던 분들께 "이게 다 쓰인다"는 걸 직접 증명하는 섹션이기도 합니다.

정답은 없으니 부담 없이, 앱을 직접 써보면서 *"이런 식으로 만들어졌겠구나"* 를 느끼는 것만으로도 충분합니다. 구글링도 곁들여서 실무에서는 어떻게 구현하는지 가볍게 고민해보시면 더욱 좋습니다.

같이 UMC를 공부하는 스터디 팀원분들끼리 친구를 맺고 활용해보세요. 
추후 UMC 부원 대상 쿠폰 이벤트도 진행해보겠습니다 🎉

Android · iOS · Mac · Tablet 모두 지원하니 아래 미션을 진행하시는데 크게 문제 없으실 겁니다!

---

[🔗 **랜딩 페이지**](https://www.aido.kr/ko) , [ **App Store**](https://apps.apple.com/kr/app/%EC%95%84%EC%9D%B4%EB%91%90-ai-%ED%88%AC%EB%91%90-%ED%94%8C%EB%9E%98%EB%84%88/id6757722325) , [🤖 **Google Play Store**](https://play.google.com/store/apps/details?id=com.aido.mobile&pcampaignid=web_share)

**- 중앙 웹 파트장 매튜 김용민 -** 

</aside>

### 실제 서비스 분석 🍠

<aside>
❓

Aido 앱을 직접 사용하며 **OAuth 2.0 소셜 로그인, 토큰 갱신, 접근 제어, CORS** 등이 실제로 어떻게 동작하는지 관찰하고, **웹 프론트엔드 개발자의 시각뿐만 아니라 다양한 직무의 시각**에서 구현 방법을 고민해보는 워크북입니다.

</aside>

- **미션 1 - 소셜 로그인 플로우 관찰하기**
    
    <aside>
    ❓
    
    로그아웃 상태에서 로그인 화면을 열고, **"카카오로 계속하기"** 버튼을 눌러보세요.
    
    ![스크린샷, 2026-03-29 02.17.47.png](Chapter%2005%20%EB%A6%AC%ED%94%84%EB%A0%88%EC%8B%9C%20%ED%86%A0%ED%81%B0%20%EA%B8%B0%EB%B0%98%EC%9D%98%20%EC%95%88%EC%A0%84%ED%95%9C%20%EC%A0%91%EA%B7%BC%20%EC%A0%9C%EC%96%B4%20%EC%A0%84%EB%9E%B5%EA%B3%BC%20%EC%86%8C%EC%85%9C%20%EB%A1%9C%EA%B7%B8%EC%9D%B8/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2026-03-29_02.17.47.png)
    
    **Q1.** 버튼을 누르면 어떤 일이 일어나나요? 앱 안에서 화면이 바뀌나요, 아니면 외부 브라우저(또는 카카오톡)가 열리나요?
    
    **Q2.** 카카오 로그인이 완료된 후, 다시 앱으로 돌아오는 과정을 관찰해보세요. 브라우저 주소창에 URL이 잠깐 보였나요? 어떤 정보가 담겨 있었을 것 같나요?
    
    **Q3.** (iOS 사용자) Apple 로그인도 시도해보세요. 카카오와 어떻게 다른가요? 브라우저가 열리나요? (Android 사용자인 경우 Google / Naver 로그인도 시도해보세요)
    
    **Q4.** 웹 사이트에서 "카카오로 로그인" 버튼을 구현한다면, 버튼 클릭 시 어떤 일이 일어나야 할까요? `window.location.href`로 이동? 팝업 창?
    
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **나의 관찰**
        
        Q**1 답변.** 
        
        Q**2 답변**.
        
        **Q3 답변.
        
        Q4 답변.**
        
        </aside>
        
- **미션 2 - 소셜 로그인 후 계정 상태 관찰하기**
    
    <aside>
    ❓
    
    카카오(또는 다른 소셜)로 로그인한 후 아래를 관찰해보세요.
    
    **Q1.** 소셜 로그인 완료 후 바로 메인 화면(할 일 목록)이 보이나요? 추가 정보 입력 화면이 있나요?
    
    **Q2.** **마이** > **프로필 클릭** > **연결된 계정**에 들어가보세요. "연결된 계정" 항목이 있나요? 어떤 소셜 서비스가 연결되어 있다고 표시되나요?
    
    ![스크린샷, 2026-03-29 02.21.23.png](Chapter%2005%20%EB%A6%AC%ED%94%84%EB%A0%88%EC%8B%9C%20%ED%86%A0%ED%81%B0%20%EA%B8%B0%EB%B0%98%EC%9D%98%20%EC%95%88%EC%A0%84%ED%95%9C%20%EC%A0%91%EA%B7%BC%20%EC%A0%9C%EC%96%B4%20%EC%A0%84%EB%9E%B5%EA%B3%BC%20%EC%86%8C%EC%85%9C%20%EB%A1%9C%EA%B7%B8%EC%9D%B8/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2026-03-29_02.21.23.png)
    
    ![스크린샷, 2026-03-29 02.24.06.png](Chapter%2005%20%EB%A6%AC%ED%94%84%EB%A0%88%EC%8B%9C%20%ED%86%A0%ED%81%B0%20%EA%B8%B0%EB%B0%98%EC%9D%98%20%EC%95%88%EC%A0%84%ED%95%9C%20%EC%A0%91%EA%B7%BC%20%EC%A0%9C%EC%96%B4%20%EC%A0%84%EB%9E%B5%EA%B3%BC%20%EC%86%8C%EC%85%9C%20%EB%A1%9C%EA%B7%B8%EC%9D%B8/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2026-03-29_02.24.06.png)
    
    ![스크린샷, 2026-03-29 02.22.03.png](Chapter%2005%20%EB%A6%AC%ED%94%84%EB%A0%88%EC%8B%9C%20%ED%86%A0%ED%81%B0%20%EA%B8%B0%EB%B0%98%EC%9D%98%20%EC%95%88%EC%A0%84%ED%95%9C%20%EC%A0%91%EA%B7%BC%20%EC%A0%9C%EC%96%B4%20%EC%A0%84%EB%9E%B5%EA%B3%BC%20%EC%86%8C%EC%85%9C%20%EB%A1%9C%EA%B7%B8%EC%9D%B8/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2026-03-29_02.22.03.png)
    
    **Q3.** 이메일로 가입한 계정에 카카오를 추가로 연결할 수 있을까요? 반대로 카카오만으로 가입한 계정에 이메일/비밀번호를 추가할 수 있을까요?
    
    **Q4.** 웹 서비스(예: 노션, 깃허브 등)에서도 여러 로그인 방식을 연결할 수 있죠. 이걸 프론트엔드에서 구현한다면, "카카오 연결하기" 버튼을 눌렀을 때 어떤 흐름이 필요할까요?
    
    **Q5.** 직접 해봅시다! 본인이 사용하는 이메일(네이버 또는 구글)로 **이메일 회원가입**을 먼저 해보세요. 가입이 완료되면 할 일을 하나 만들고, 이름도 설정해보세요. 그 다음 **로그아웃**한 후, 이번에는 같은 이메일 주소에 해당하는 **소셜 로그인**(네이버 이메일이면 "네이버로 계속하기", 구글 이메일이면 "Google로 계속하기")으로 로그인해보세요.  
    
    - 아까 만들었던 할 일이 그대로 보이나요?
    - 이름도 그대로인가요?
    - 같은 계정으로 접속된 것 같나요, 아니면 새로운 계정이 만들어진 것 같나요?
    - 설정 > 계정 관리에서 연결된 계정을 확인해보세요. 이메일과 소셜 계정이 모두 연결되어 있나요?
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        답변
        
        **Q1 답변.** 
        
        **Q2 답변.**
        
        **Q3 답변.
        
        Q4 답변.
        
        Q5 답변.**
        
        </aside>
        
- **미션 3 - 토큰 자동 갱신 체험하기**
    
    <aside>
    ❓
    
    로그인한 상태에서 앱을 **15분 이상** 백그라운드에 두었다가, 다시 열어서 할 일 목록을 확인해보세요.
    
    **Q1.** "다시 로그인하세요" 같은 메시지가 나왔나요? 아니면 정상적으로 데이터가 보이나요?
    
    **Q2.** 아이두의 Access Token 수명은 **15분**입니다. 15분이 지났는데 정상 동작했다면, 뒤에서 어떤 일이 자동으로 일어난 걸까요?
    
    **Q3.** 웹에서 `axios`나 `fetch`를 사용한다고 가정해보세요. API 요청이 `401 Unauthorized`로 돌아왔을 때, 자동으로 토큰을 갱신하고 원래 요청을 재시도하려면 어디에 이 로직을 넣어야 할까요? 
    
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **나의 답변:** 
        
        **Q1 답변.
        
        Q2 답변.
        
        Q3 답변.**
        
        </aside>
        
- **생각해보기 1 - OAuth 2.0 Authorization Code Flow**
    
    <aside>
    ❓
    
    카카오 로그인 시, 앱은 카카오에서 직접 Access Token을 받지 않습니다.
    대신 **Authorization Code**라는 일회용 코드를 받아서 서버에 전달하고, **서버가 이 코드를 카카오 토큰으로 교환**합니다.
    
    왜 이런 번거로운 과정을 거칠까요? 아래 두 방식을 비교해보세요.
    
    | 방식 | 흐름 | `client_secret` 노출? | 토큰 탈취 위험 |
    | --- | --- | --- | --- |
    | Implicit Grant (옛날 방식) | 브라우저가 직접 Access Token을 URL에 받음 | ??? | ??? |
    | Authorization Code Grant (현재 방식) | 서버가 code를 받아서 서버끼리 토큰 교환 | ??? | ??? |
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **나의 답변: 
        
        ???에 답을 작성해주세요** 
        
        | 방식 | 흐름 | `client_secret` 노출? | 토큰 탈취 위험 |
        | --- | --- | --- | --- |
        | Implicit Grant (옛날 방식) | 브라우저가 직접 Access Token을 URL에 받음 | ??? | ??? |
        | Authorization Code Grant (현재 방식) | 서버가 code를 받아서 서버끼리 토큰 교환 | ??? | ???
         |
        
        **이유:** 
        
        </aside>
        
- **생각해보기 2 - OAuth의 redirect_uri는 왜 중요한가요?**
    
    <aside>
    ❓
    
    카카오 로그인을 할 때, 카카오는 로그인이 끝나면 `redirect_uri`로 사용자를 돌려보냅니다.
    이 `redirect_uri`는 카카오 개발자 콘솔에 미리 등록해두어야 합니다.
    
    **Q1.** 만약 `redirect_uri`를 검증하지 않고 아무 URL이나 허용한다면, 어떤 공격이 가능할까요?
    
    **Q2.** 웹에서 카카오 로그인을 구현한다면, `redirect_uri`에 해당하는 페이지(예: `/auth/kakao/callback`)에서는 무엇을 해야 할까요?
    
    **Q3.** 아이두 앱에서는 `redirect_uri`가 `myapp://auth/kakao`처럼 **딥링크(Deep Link)** 형태입니다. 웹에서는 왜 `https://mysite.com/auth/callback` 형태의 일반 URL을 사용할까요? 딥링크는 무엇일까요?
    
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **나의 답변:
        
        Q1. 답변:
        
        Q2. 답변:
        
        Q3. 답변:**
        
        </aside>
        
- **생각해보기 3 - CORS: 프론트엔드 개발자의 숙적**
    
    <aside>
    ❓
    
    웹 개발을 하다 보면 콘솔에 이런 에러를 자주 만나게 됩니다:
    
    ```
    Access to fetch at '<https://api.example.com/todos>'
    from origin '<http://localhost:3000>' has been blocked by CORS policy
    ```
    
    아이두 API 서버에는 이런 CORS 설정이 있습니다:
    
    ```tsx
    app.enableCors({
      origin: ["<http://localhost:3000>", "<http://localhost:8081>", "<https://www.aido.kr>",],
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });
    ```
    
    **Q1.** CORS는 **브라우저**가 차단하는 건가요, **서버**가 차단하는 건가요?
    
    **Q2.** 모바일 앱(React Native)에서 같은 API를 호출할 때도 CORS 에러가 발생할까요? 왜/왜 안 되나요?
    
    **Q3.** `credentials: true`가 없으면 어떤 문제가 생길까요? (힌트: 쿠키나 Authorization 헤더)
    
    **Q4.** 개발 중에 CORS 에러가 나면 어떻게 해결하나요? 프론트엔드 개발자가 할 수 있는 방법 2가지를 생각해보세요.
    
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **나의 답변:
        
        Q1. 답변:
        
        Q2. 답변:
        
        Q3. 답변:
        
        Q4. 답변:**
        
        </aside>
        
- **생각해보기 4 - Access Token을 어디에 저장해야 할까요? (복습)**
    
    <aside>
    ❓
    
    아이두 앱은 토큰을 **SecureStore**(iOS Keychain / Android Keystore)에 저장합니다.
    OS 수준에서 암호화되는 안전한 저장소죠.
    
    그런데 **웹 프론트엔드**에는 SecureStore가 없습니다.
    웹에서 토큰을 저장할 수 있는 후보 3가지를 비교해보세요.
    
    | 저장소 | XSS에 안전? | CSRF에 안전? | 새로고침 후 유지? | 적합도 |
    | --- | --- | --- | --- | --- |
    | `localStorage` | ??? | ??? | ??? | ??? |
    | `httpOnly Cookie` | ??? | ??? | ??? | ??? |
    | JavaScript 변수 (메모리) | ??? | ??? | ??? | ??? |
    
    힌트:
    
    - **XSS**: 악성 스크립트가 페이지에 삽입되면 JavaScript로 접근 가능한 저장소는 위험합니다.
    - **CSRF**: 쿠키는 브라우저가 자동으로 전송하므로, 다른 사이트에서 위조 요청을 보낼 수 있습니다.
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **나의 답변:** 
        
        | 저장소 | XSS에 안전? | CSRF에 안전? | 새로고침 후 유지? | 적합도 |
        | --- | --- | --- | --- | --- |
        | `localStorage` | ??? | ??? | ??? | ??? |
        | `httpOnly Cookie` | ??? | ??? | ??? | ??? |
        | JavaScript 변수 (메모리) | ??? | ??? | ??? | ??? |
        
        **이유:** 
        
        </aside>
        
- **생각해보기 5 - 동시 요청의 Race Condition (복습)**
    
    <aside>
    ❓
    
    메인 화면을 열면 "할 일 목록", "프로필", "알림 개수"를 **동시에** 3개 API로 요청합니다.
    Access Token이 만료된 상태라면, 3개 요청이 **동시에 401**을 받겠죠.
    
    **Q1.** 3개 요청이 **각각** 토큰 갱신을 시도하면 어떤 문제가 생길까요?
    
    (힌트: 아이두 서버는 Refresh Token을 한 번 사용하면 **즉시 폐기**하고 새 Refresh Token을 발급합니다. 이것을 **Token Rotation**이라고 합니다.)
    
    **Q2.** 이 문제를 해결하려면 프론트엔드에서 어떤 패턴을 사용해야 할까요?
    
    아래는 아이두 앱에서 실제로 사용하는 패턴의 핵심입니다:
    
    ```jsx
    let isRefreshing = false;       // 현재 갱신 중인가?
    let refreshPromise = null;      // 갱신 Promise 공유
    
    async function handleUnauthorized(failedRequest) {
      if (isRefreshing) {
        await refreshPromise;       // 다른 요청은 여기서 기다림
        return retry(failedRequest); // 갱신 끝나면 재시도
      }
    
      isRefreshing = true;
      refreshPromise = refreshTokens(); // 딱 1번만 갱신 요청
    
      await refreshPromise;
      isRefreshing = false;
      return retry(failedRequest);
    }
    ```
    
    이 패턴이 왜 필요한지 설명해보세요.
    
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **나의 답변:** 
        
        **Q1 답변.**
        
        **Q2 답변.**
        
        </aside>
        
- **생각해보기 6 - Protected Route (보호된 라우트)**
    
    <aside>
    ❓
    
    아이두 앱은 로그인 여부에 따라 보여주는 화면이 완전히 다릅니다.
    
    ```
    인증 상태: 'loading'          → 스플래시 화면 (로딩 중)
    인증 상태: 'authenticated'    → 메인 앱 (할 일 목록, 설정 등)
    인증 상태: 'unauthenticated'  → 로그인/회원가입 화면
    ```
    
    **Q1.** React 웹 앱에서 비슷한 패턴을 구현한다면 어떻게 할까요? `react-router-dom`을 사용한다고 가정하고, 아래 의사코드의 빈칸을 채워보세요. (아래 미션에서 더 좋은 패턴을 배울 예정)
    
    ```jsx
    function ProtectedRoute({ children }) {
      const { status } = useAuth();
    
      if (status === 'loading') {
        return <???>;
      }
    
      if (status === '???') {
        return <Navigate to="/???" replace />;
      }
    
      return children;
    }
    
    // 사용 예시
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={
        <???>
          <DashboardPage />
        </???>
      } />
    </Routes>
    ```
    
    **Q2.** 초기 상태가 `'loading'`이 아니라 `'unauthenticated'`로 시작하면 어떤 문제가 생길까요?
    
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **나의 답변:** 
        
        Q1 답변.
        
        Q2 답변.
        
        </aside>
        
- **생각해보기 7 - RBAC(역할 기반 접근 제어)**
    
    <aside>
    ❓
    
    아이두에는 일반 사용자(`USER`)와 관리자(`ADMIN`) 두 가지 역할이 있습니다.
    관리자만 접근할 수 있는 기능(예: 전체 사용자 관리, 통계 대시보드)이 있죠.
    
    **Q1.** 프론트엔드에서 역할(role)에 따라 메뉴나 버튼을 숨기는 것만으로 보안이 충분할까요? 왜/왜 안 될까요?
    
    **Q2.** 웹에서 관리자 전용 페이지(`/admin/users`)를 구현한다면, **Protected Route**를 어떻게 확장해야 할까요? 아래 의사코드를 완성해보세요.
    
    ```jsx
    function AdminRoute({ children }) {
      const { status, role } = useAuth();
    
      if (status === 'loading') return <LoadingSpinner />;
      if (status === 'unauthenticated') return <Navigate to="/???" />;
      if (role !== '???') return <Navigate to="/???" />;  // 권한 없음
    
      return children;
    }
    ```
    
    **TIP: 실무에서는 DAL(Data Access Layer)에서 권한 체크를 하는 패턴이 많이 쓰입니다. DAL에 대해서도 알아보세요! (Next.js에서는 proxy(구 middleware)나 Server Action 내에서 인증/인가를 처리하는 패턴도 많이 활용됩니다.)
    
    Q3.** 일반 사용자가 직접 `GET /v1/admin/users` API를 호출하면 어떤 HTTP 상태 코드가 돌아올까요? 401인가요? 403인가요? 차이는 뭔가요?
    
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **나의 답변:** 
        
        **Q1 답변.**
        
        **Q2 답변.**
        
        **Q3** 답변.
        
        </aside>
        
- **생각해보기 8 - Token Rotation: Refresh Token을 왜 한 번 쓰면 폐기하나요?**
    
    <aside>
    ❓
    
    아이두 서버는 토큰 갱신 시 **Token Rotation**을 사용합니다:
    
    - Refresh Token A로 갱신 요청 → 새 Access Token + **새 Refresh Token B** 발급, **A는 즉시 폐기**
    
    만약 Refresh Token을 **재사용 가능**하게 두면 (폐기 안 하면) 어떤 위험이 있을까요?
    
    아래 시나리오를 따라가 보세요:
    
    ```
    시간 0: 정상 사용자가 Refresh Token A로 갱신
            → 새 Token B 발급, A는 폐기됨
    
    시간 1: 해커가 탈취한 Token A로 갱신 시도
            → 서버: "이미 사용된 토큰이다!" → ???
    ```
    
    **Q1.** 시간 1에서 서버는 어떻게 대응해야 할까요?
    
    **Q2.** Token Rotation이 없다면 (A를 폐기하지 않으면), 해커는 Token A를 얼마나 오래 사용할 수 있나요?
    
    **Q3.** 프론트엔드에서는 Token Rotation 때문에 주의해야 할 점이 있나요? (힌트: 생각해보기 6의 Race Condition)
    
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **나의 답변:** 
        
        **Q1 답변.**
        
        **Q2 답변.**
        
        **Q3** 답변.
        
        </aside>
        
- **생각해보기 9 - 웹 vs 앱, 보안 관점에서 뭐가 다를까요?**
    
    <aside>
    ❓
    
    아이두 앱(모바일)과 웹 프론트엔드의 보안 환경은 꽤 다릅니다.
    아래 표를 채워보세요.
    
    | 항목 | 모바일 앱 (아이두) | 웹 (React 등) |
    | --- | --- | --- |
    | 토큰 저장소 | SecureStore (OS 암호화) | ??? |
    | XSS 공격 위험 | 거의 없음 (웹뷰 아님) | ??? |
    | CSRF 공격 위험 | 해당 없음 | ??? |
    | CORS 적용 | 해당 없음 (브라우저 아님) | ??? |
    | 코드 노출 | APK/IPA 디컴파일 가능 | ??? |
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **나의 답변:** 
        
        | 항목 | 모바일 앱 (아이두) | 웹 (React 등) |
        | --- | --- | --- |
        | 토큰 저장소 | SecureStore (OS 암호화) | ??? |
        | XSS 공격 위험 | 거의 없음 (웹뷰 아님) | ??? |
        | CSRF 공격 위험 | 해당 없음 | ??? |
        | CORS 적용 | 해당 없음 (브라우저 아님) | ??? |
        | 코드 노출 | APK/IPA 디컴파일 가능 | ??? |
        
        **이유:**
        
        </aside>
        
- **종합 과제 -  OAuth 2.0 Authorization Code Flow 전체 흐름 그리기**
    
    <aside>
    ❓
    
    **소셜 로그인(OAuth 2.0 Authorization Code Flow)**의 전체 흐름을 시퀀스 다이어그램으로 그려보세요.
    (앱 → 소셜 서버 → 백엔드 서버 흐름을 포함해야 합니다)
    
    답변 제출 양식) 종이, 노션, [draw.io](http://draw.io/), mermaid 등 아무 도구나 사용해도 좋습니다
    
    </aside>
    
    - 답변
        
        <aside>
        ❓
        
        **실제 시퀀스 다이어그램을 첨부해주세요 (아래는 Mermaid 예시입니다)**
        
        ![스크린샷 2026-03-29 오전 2.51.48.png](Chapter%2005%20%EB%A6%AC%ED%94%84%EB%A0%88%EC%8B%9C%20%ED%86%A0%ED%81%B0%20%EA%B8%B0%EB%B0%98%EC%9D%98%20%EC%95%88%EC%A0%84%ED%95%9C%20%EC%A0%91%EA%B7%BC%20%EC%A0%9C%EC%96%B4%20%EC%A0%84%EB%9E%B5%EA%B3%BC%20%EC%86%8C%EC%85%9C%20%EB%A1%9C%EA%B7%B8%EC%9D%B8/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2026-03-29_%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB_2.51.48.png)
        
        **나의 답변:**
        
        </aside>
        

---

# 🍠  미션 1.  Protected Route를 활용하여 페이지 안전하게 보호하기

<aside>
🍠

**Protected Route**란, 사용자가 로그인한 상태일 때만 접근 가능한 페이지를 설정하는 방법입니다. 예를 들어, 회원 전용 페이지나 관리자 페이지 등이 이에 해당합니다.

만약에 **`‘/premium/webtoon/1’`** 라는 페이지는 프리미엄 결제를 한 유저만 볼 수 있는 웹툰 페이지라고 생각해봅시다. 

프리미엄 결제를 하지 않은 유저가 프리미엄 웹툰을 볼 수 있는 경로를 어떻게 알아내서  `‘**/premium/webtoon/1'` 주소**창에 주소를 입력하였는데 이 페이지로 접속이 되면 어떻게 될까요?

그러면 어떠한 유저가 이 사이트에서 결제를 하려고 할까요?

우리는 이것을 막기 위해 **`Protected Route`**라는 것을 배우고 만들어볼려고 합니다!

</aside>

---

### 📗 Swagger 문서 읽는법

<aside>
🍠

현재 **Chapter 4와 Chapter 5 워크북**을 진행하시는 과정에서 **Swagger 문서**를 잘못 해석하거나 이해하는 데 어려움을 겪는 분들이 계신 것을 피드백을 통해 확인할 수 있었습니다.

이에 여러분들의 **정확하고 원활한 학습**을 돕기 위해, 라이브 방송에서 진행했던 **Swagger 문서 읽는 법에 대한 추가 강의 영상**을 긴급히 촬영하여 제공하기로 결정했습니다.

---

### 📹 추가 강의 영상 제공 정보

- **제공일:** 2025년 10월 17일 (금)

---

### ⚠️ 중요 요청 사항

**Swagger에 대해 이미 잘 알고 있다고 생각하시더라도, 놓치고 있는 부분이 있을 수 있습니다.** **Chapter 6 미션**을 진행하시기 전에 **반드시 이 추가 강의 영상을 시청해 주시기를 간곡히 부탁드립니다.** 이 영상은 **워크북 진행의 정확도를 높이는 데 결정적인 도움**이 될 것입니다.

---

### 📢 참고 및 구독 안내

주기적으로 **라이브 방송**을 통해 질문을 받으며, 매주 1편 이상의 주신 피드백 관련하여 영상을 촬영해서 업로드 할 예정입니다. [유튜브 구독](https://www.youtube.com/@yongcoding)을 해주시면 놓치지 않고 보실 수 있습니다!

---

감사합니다.

**- 중앙 웹 파트장 매튜 김용민 -** 

</aside>

### 🎥 강의 영상

<aside>
🍠

만약 미션을 진행하다가 막히는 부분이 생긴다면, 아래 방법을 활용해 문제를 해결해보세요.

1. **공식 문서와 검색을 최우선으로 활용해 주세요.**
    - **가장 빠르고 정확한 해답**을 찾을 수 있는 가장 좋은 방법입니다.
    - 에러 메시지나 궁금한 점을 직접 검색하며 스스로 답을 찾는 연습을 해보세요.
2. **그래도 해결되지 않을 때 AI에게 물어보세요.**
    - AI는 방대한 지식을 바탕으로 여러분이 겪는 문제를 해결하는 데 큰 도움을 줄 수 있습니다.
    - 에러 코드, 원하는 기능, 현재까지 작성한 코드 등을 함께 질문하면 더욱 정확한 답변을 얻을 수 있습니다.
3. **마지막 수단으로 영상을 활용해 주세요.**
    - 영상을 처음부터 끝까지 보기보다는, **필요한 부분만 찾아서** 미션을 해결하는 데 힌트를 얻는 용도로 활용해 보세요.

**- 중앙 웹 파트장 매튜 김용민 -**

</aside>

[https://www.youtube.com/watch?v=uF4PQjqM0g0](https://www.youtube.com/watch?v=uF4PQjqM0g0)

---

### ✅ 미션 체크리스트

**Protected Route**

- [ ]  **Swagger**를 확인 후, **Token이 필요한 (자물쇠가 걸린) API**에만 방문할 수 있는 페이지인 경우 `Protected Route`를 활용해 경로를 보호했나요?

**리다이렉트 처리**

- [ ]  사용자가 로그인하지 않은 경우, 인증이 필요한 페이지에 접근 시 **로그인 페이지로 Redirect** 되게 설정했나요?

---

### 🍠  미션 1. 기록하기

- 깃허브 주소
- 실행 영상

---

# 🍠  미션 2.  Refresh Token을 활용하여 지속적인 로그인 유지하기!

<aside>
🍠

미션2는 **Refresh Token**을 활용하여 사용자가 로그인 상태를 장기간 유지할 수 있도록 구현하는 미션입니다. 

**Access Token**은 일반적으로 짧은 유효 기간을 가지고 있고, 만료되면 사용자는 다시 로그인해야 합니다. 하지만 **Refresh Token**을 사용하면 사용자가 계속해서 로그인을 유지할 수 있습니다.

우리가 사용하는 웹 사이트들 중에서 로그인이 5분마다 끊기는 경우는 없겠죠??

이번에는 함께 RefreshToken을 활용하여 AccessToken을 갱신 받아 로그인이 끊기지 않게 서비스를 개선시켜 보는 것이 미션입니다!

</aside>

---

### 🎥 강의 영상

<aside>
🍠

만약 미션을 진행하다가 막히는 부분이 생긴다면, 아래 방법을 활용해 문제를 해결해보세요.

1. **공식 문서와 검색을 최우선으로 활용해 주세요.**
    - **가장 빠르고 정확한 해답**을 찾을 수 있는 가장 좋은 방법입니다.
    - 에러 메시지나 궁금한 점을 직접 검색하며 스스로 답을 찾는 연습을 해보세요.
2. **그래도 해결되지 않을 때 AI에게 물어보세요.**
    - AI는 방대한 지식을 바탕으로 여러분이 겪는 문제를 해결하는 데 큰 도움을 줄 수 있습니다.
    - 에러 코드, 원하는 기능, 현재까지 작성한 코드 등을 함께 질문하면 더욱 정확한 답변을 얻을 수 있습니다.
3. **마지막 수단으로 영상을 활용해 주세요.**
    - 영상을 처음부터 끝까지 보기보다는, **필요한 부분만 찾아서** 미션을 해결하는 데 힌트를 얻는 용도로 활용해 보세요.

**- 중앙 웹 파트장 매튜 김용민 -**

</aside>

[https://youtu.be/YgIjDgzuUqI?si=safkvvH_3np6wTqA](https://youtu.be/YgIjDgzuUqI?si=safkvvH_3np6wTqA)

---

### ✅ 미션 체크리스트

**서버 세팅**

- [ ]  아래 문서를 보고, 서버 세팅을 완료했나요?
    
    [RefreshToken 실습 전 확인해주세요!](https://www.notion.so/RefreshToken-33ab57f4596b81ce8dd8fea18929490d?pvs=21)
    

**토큰 갱신 로직**

- [ ]  **Access Token** 만료 시, **Axios의 응답 인터셉터**를 활용하여 Refresh Token으로 새로운 Access Token을 발급받고 실패한 요청을 **재시도**하는 로직을 작성했나요?

**무한 루프 방지**

- [ ]  토큰 갱신 과정에서 `_retry` 플래그 등을 사용하여 **무한 재시도가 발생하지 않도록** 방지했나요?

**동작 검증**

- [ ]  서버 토큰 시간을 임의로 짧게 조정을 해도 토큰 재발급 요청이 **정상적으로 동작**하여 서비스를 끊김 없이 이용할 수 있나요?

---

### 🍠  미션 2. 기록하기

- 깃허브 주소
- 실행 영상

---

# 🍠  미션 3.  **Social Login Google 직접 구현해보기!**

<aside>
🍠

이 미션은 **Google Social Login** 기능을 직접 구현하는 것입니다. 사용자가 구글 계정을 통해 손쉽게 로그인할 수 있도록 OAuth 2.0 인증 방식을 사용하여 **Google 로그인**을 연동하는 작업을 진행하는 미션입니다!

</aside>

---

### 🎥 강의 영상

<aside>
🍠

만약 미션을 진행하다가 막히는 부분이 생긴다면, 아래 방법을 활용해 문제를 해결해보세요.

1. **공식 문서와 검색을 최우선으로 활용해 주세요.**
    - **가장 빠르고 정확한 해답**을 찾을 수 있는 가장 좋은 방법입니다.
    - 에러 메시지나 궁금한 점을 직접 검색하며 스스로 답을 찾는 연습을 해보세요.
2. **그래도 해결되지 않을 때 AI에게 물어보세요.**
    - AI는 방대한 지식을 바탕으로 여러분이 겪는 문제를 해결하는 데 큰 도움을 줄 수 있습니다.
    - 에러 코드, 원하는 기능, 현재까지 작성한 코드 등을 함께 질문하면 더욱 정확한 답변을 얻을 수 있습니다.
3. **마지막 수단으로 영상을 활용해 주세요.**
    - 영상을 처음부터 끝까지 보기보다는, **필요한 부분만 찾아서** 미션을 해결하는 데 힌트를 얻는 용도로 활용해 보세요.

**- 중앙 웹 파트장 매튜 김용민 -**

</aside>

[https://www.youtube.com/watch?v=QPZ5uAusdA4&t=756s](https://www.youtube.com/watch?v=QPZ5uAusdA4&t=756s)

---

### ✅ 미션 체크리스트

**Google API 설정 및 Client ID 설정**

- [ ]  아래 문서를 보고, Google API Console 설정 및 서버 세팅을 완료했나요?
    
    [Google Login 실습 전 확인해주세요!](https://www.notion.so/Google-Login-33ab57f4596b812db811c85aac5fa2e7?pvs=21)
    
- [ ]  **Client ID**를 발급받고, **Redirect URI**와 **요청할 권한**을 정확히 서버 코드 환경변수에 입력했나요?

**동작 확인**

- [ ]  소셜 로그인이 정상적으로 잘 동작하나요?

---

### 🍠  미션 3. 기록하기

- 깃허브 주소
- 실행 영상

---

# 🍠 UMC 미션 제출

---

<aside>
💡

UMC는 과제 제출 여부를 **링크를 통해 확인하고 있습니다.**

워크북 미션을 모두 마무리하셨다면 아래 안내에 따라 제출해 주세요.

**📌 제출 안내**

**제출 시점 :** 각 주차 워크북 학습을 마친 뒤 **반드시 제출**해주세요.

**제출 방법 :** 하단의 **미션 제출 폼 링크를 통해 제출**해 주세요.

※ 제출하지 않을 경우 해당 주차 **워크북 미이수**로 간주됩니다.

</aside>

‣ 

# 🍠 워크북 피드백

---

<aside>
💡

여러분들이 워크북을 학습하며 느낀 **좋았던 점**, **아쉬웠던 점**, **개선이 필요한 부분**을 자유롭게 남겨주세요.

여러분의 솔직한 의견은 다음 기수와 현재 진행하고 있는 웹 파트 스터디를 더 발전시키는 데 큰 힘이 됩니다. 🙌

**📌 설문 안내**

**제출 시점 :** 각 주차 워크북 학습을 마친 뒤 **반드시 제출**해주세요.

(제출하지 않으면 해당 주차 **워크북 미이수**로 간주됩니다.)

</aside>

[UMC WEB 10th 주차별 워크북 피드백 설문](https://forms.gle/QZmuqzPoGfgNmved6)

---

# 🍠 코드 리뷰

---

<aside>
💡

워크북 하단에 아래 내용을 정리해 제출해 주세요. (제출용 폼은 추후 제공 예정)

1. **내가 리뷰한 내용**
    - 직접 리뷰한 코드 내용을 캡처하여 업로드 (**`GitHub Pull Request`** 캡처 권장)
2. **리뷰 반영 결과**
    - 받은 피드백을 반영한 개선된 코드와 그 캡처를 함께 업로드 (**`GitHub Pull Request`** 캡처 권장)

> 💬 아직 코드 작성을 하지 않은 경우
> 
> 
> 스터디 참여 인증 또는 워크북 피드백을 작성해 제출해 주세요.
> 
</aside>

- 내가 리뷰한 내용 캡처 예시
    
    **예시**
    
    ![스크린샷 2025-09-05 오후 12.46.40.png](Chapter%2005%20%EB%A6%AC%ED%94%84%EB%A0%88%EC%8B%9C%20%ED%86%A0%ED%81%B0%20%EA%B8%B0%EB%B0%98%EC%9D%98%20%EC%95%88%EC%A0%84%ED%95%9C%20%EC%A0%91%EA%B7%BC%20%EC%A0%9C%EC%96%B4%20%EC%A0%84%EB%9E%B5%EA%B3%BC%20%EC%86%8C%EC%85%9C%20%EB%A1%9C%EA%B7%B8%EC%9D%B8/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2025-09-05_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_12.46.40.png)
    
- 받은 리뷰를 반영하여 개선한 코드와 캡처 예시
    
    **예시**
    
    ![스크린샷 2025-09-05 오후 12.47.34.png](Chapter%2005%20%EB%A6%AC%ED%94%84%EB%A0%88%EC%8B%9C%20%ED%86%A0%ED%81%B0%20%EA%B8%B0%EB%B0%98%EC%9D%98%20%EC%95%88%EC%A0%84%ED%95%9C%20%EC%A0%91%EA%B7%BC%20%EC%A0%9C%EC%96%B4%20%EC%A0%84%EB%9E%B5%EA%B3%BC%20%EC%86%8C%EC%85%9C%20%EB%A1%9C%EA%B7%B8%EC%9D%B8/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA_2025-09-05_%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_12.47.34.png)
    

‣ 

---

# 🍠 트러블 슈팅

---

<aside>
🍠 실습을 진행하면서 생긴 문제들 또는 어려웠던 내용에 대해서, 이슈 - 문제 - 해결 순서로 작성해 주세요.

</aside>

- 🍠 이슈 No.1 (예시, 서식만 복사하시고 지워주세요.)
    
    **`이슈`**
    
    👉 React 상태 관리 중 `useState`로 배열을 업데이트할 때, 원본 배열이 변경되지 않는 문제가 발생했다.
    
    ---
    
    **`문제`**
    
    👉 `push()` 메서드를 사용해 상태 배열에 새 요소를 추가했지만, React가 상태 변경을 감지하지 않아 화면이 갱신되지 않았다.
    
    ```jsx
    const [items, setItems] = useState<string[]>([]);
    
    function addItem(newItem: string) {
      items.push(newItem); // 상태 직접 변경
      setItems(items);     // 동일 참조 전달
    }
    ```
    
    React는 상태 변경 여부를 **참조(Reference)** 기준으로 판단하기 때문에, 기존 배열을 직접 변경하면 리렌더링이 일어나지 않는다.
    
    ---
    
    **`해결`**
    
    👉 기존 배열을 복사하여 새로운 배열 객체를 만들어 전달했다.
    
    ```jsx
    function addItem(newItem: string) {
      setItems([...items, newItem]); // 새로운 배열 생성
    }
    ```
    
    이로써 React가 새로운 참조를 감지하여 정상적으로 리렌더링이 발생했다.
    

---

# 🍠 학습 회고

---

<aside>
🍠 이번 주차 워크북을 해결해보면서 어땠는지 **회고**해봅시다.

- **핵심 키워드**에 대해 완벽하게 이해했는지? 
- **이해한 점 - 어려운 점 (개선 방법) - 회고** 순서로 작성해주세요.
- **참고 자료**가 있다면 아래에 남겨주세요.

</aside>

- 📢 학습 회고 (예시, 서식만 복사하시고 지워주세요.)
    - **프론트엔드 배포, Vercel 활용**
        - **이해한 점**: Vercel은 프론트엔드 프로젝트를 **빠르고 간편하게 배포**할 수 있는 플랫폼입니다.
            
            GitHub 연동, 환경변수 설정, 커스텀 도메인 연결 등 배포 과정 대부분이 GUI와 CLI로 쉽게 처리되며, SPA 환경에서도 라우팅 문제를 `vercel.json` 설정으로 해결할 수 있습니다.
            
            - 예시:
                
                ```bash
                # CLI로 배포
                vercel         # Preview 배포
                vercel --prod  # Production 배포
                ```
                
                ```json
                // SPA 라우팅 문제 해결
                {
                  "routes": [
                    { "src": "/[^.]+", "dest": "/index.html", "status": 200 }
                  ]
                }
                ```
                
        - **어려운 점 (개선 방법)**: SPA 기반 프로젝트는 새로고침 시 404 문제가 발생할 수 있으며, 환경변수 관리, 커스텀 도메인 연결 과정이 처음에는 헷갈렸습니다.
            - 개선 방법: `vercel.json` 설정으로 SPA 라우팅 문제를 해결하고, Vercel Dashboard에서 환경변수와 DNS 설정을 직접 확인하면서 반복적으로 배포 실습을 진행했습니다.
            - 예시:
                
                ```tsx
                // 환경변수 사용
                const api = axios.create({
                  baseURL: import.meta.env.VITE_API_URL,
                  headers: { 'Content-Type': 'application/json' },
                });
                
                ```
                
        - **회고**: 실제 배포 과정을 경험해보니, 로컬 환경과 다른 실제 서비스 환경에서의 테스트 필요성을 이해할 수 있었습니다.
            
            앞으로 프로젝트를 진행할 때, GitHub 연동과 Vercel 배포를 활용해 **즉시 테스트 가능한 환경**을 만들고, SPA 라우팅 문제와 환경변수를 신경 써서 안정적으로 서비스를 운영할 수 있을 것 같습니다.
            
        
        ---
        
        ### 참고 자료
        
        [개발자 매튜 | 우리는 Vercel로 간다! 프론트엔드 배포 가이드](https://www.yolog.co.kr/post/vercel-deployment)
        

# 🥕 **인증 인가 시스템, 직접 구축 vs. SaaS 솔루션: 전략적 선택**

---

<aside>
🥕

오늘날의 거의 모든 서비스에는 **인증(Authentication)**과 **인가(Authorization)**가 필수적입니다.

하지만 이제 우리가 선택해야 할 길은 단순하지 않습니다. 
직접 구축할 것인가, 아니면 Auth0·Clerk 같은 SaaS 솔루션을 활용할 것인가?

이 글은 단순히 “무엇이 더 좋을까?” 라는 비교에 그치지 않습니다.

대신, 각 접근 방식이 **왜 등장했는지**, **어떤 문제를 해결하려고 했는지**, 그리고 **어떤 상황에서 가장 효과적인지**를 중심으로 살펴봅니다.

참고로, 이 글의 내용은 전부 **Perplexity**를 기반으로 정리했습니다.

</aside>

[**인증 인가 시스템, 직접 구축 vs. SaaS 솔루션: 전략적 선택**](https://www.notion.so/vs-SaaS-33ab57f4596b81a59e16eb2218de47a7?pvs=21)

---

# 🤔 참고 자료

---

[개발자 매튜 | Content Security Policy(CSP)로 배우는 웹 보안 설정법](https://www.yolog.co.kr/post/http-content-security-policy/)

[개발자 매튜 | 웹 보안의 핵심, Same Origin Policy(동일 출처 정책) 쉽게 이해하기](https://www.yolog.co.kr/post/http-same-origin-policy/)

[개발자 매튜 | 악명 높은 CORS(교차 출처 리소스 공유) 쉽게 이해하기](https://www.yolog.co.kr/post/http-cors/)

# 🛡️ 저작권

---

**© 2026 [Kim Yongmin (Matthew)](https://www.youtube.com/@yongcoding). All rights reserved.**