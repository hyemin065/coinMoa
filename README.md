## 개인 과제
### 내가 가진 코인들의 현재가격과 수익률을 한번에 보여주는 사이트
개발기간 : 22/06/01 ~ 22/06/12  
배포 URL : https://coinmoa.netlify.app/

<br>


### 파일구조
```
src  
  ├─assets   
  ├─components
  │  ├─DatePicker
  │  ├─Header
  |  ├─Layout
  |  ├─Modal
  |  ├─Radio      
  |  ├─ScrollTopButton      
  │  ├─Toggle
  │  └─SignInput
  ├─pages
  │  ├─Exchange
  │  ├─Market
  │  │  └─MarketItem  
  │  ├─PortFolio
  │  │  └─PortFolioItem
  │  ├─SignIn
  │  └─SignUp
  ├─recoil
  ├─routes
  ├─service
  ├─styles
  │  ├─base
  │  ├─constants
  │  └─mixins
  ├─types
  └─utils
  ```
  <br>

### Front-End 기술스택
- React

- TypeScript

- SCSS

<br>

### Back-End
- Express

- Mongoose

<br>


### 라이브러리 
- dayjs

- react-calendar

- recoil

- axios


<br>

### 기능
- 회원가입  
ID 중복확인을 체크 할 수 있으며 간단한 회원가입을 할 수 있습니다.

- 로그인  
 가입한 ID, Password로 로그인 할 수 있습니다.

- 암호화폐  
상단에는 실시간 인기 코인 순위가 보여지고 카테고리별 시가총액을 표시해줍니다.
하단의 테이블에는 현재 암호화폐 시세를 보여줍니다.
오른쪽 토글 버튼을 눌러서 USD와 KRW의 시세를 확인 할 수 있습니다.
즐겨찾기 버튼 클릭시 Modal에 거래소, 코인 이름, 날짜, 가격, 수량을 추가하면
즐겨찾기가 되고 포트폴리오 페이지에서 확인 할 수 있습니다.

- 거래소  
신뢰도를 기준으로 순위를 매기고 거래량을 파악한 거래소 리스트를 보여줍니다.

- 포트폴리오  
modal을 사용하여 거래소, 날짜, 가격, 수량, 코인 이름을 추가하면
현재 시세와 비교해서 수익률과 손익을 계산하여 보여줍니다.
상단의 Card 형식의 버튼을 클릭하면 모든 거래소의 총 자산과 거래소별 자산을 보여줍니다.


### 추가예정
- 코인 별 거래 히스토리
- 코인 별 차트 데이터
- 로딩 페이지
- 거래소 추가 기능
