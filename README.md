## 개인 과제
### 내가 가진 코인들의 현재가격과 수익률을 한번에 보여주는 사이트
개발기간 : 22/06/01 ~ 22/06/12 
배포 URL : https://kaleidoscopic-crisp-080632.netlify.app/

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
- 암호화폐  
현재 암호화폐 시세를 보여줍니다.
오른쪽 토글 버튼을 눌러서 USD와 KRW의 시세를 확인 할 수 있습니다.

- 거래소  
신뢰도를 기준으로 거래소의 순위를 매기고 거래량을 파악한 거래소 리스트를 보여줍니다.

- 포트폴리오  
modal을 사용하여 거래소, 날짜, 가격, 수량, 코인 이름을 추가하면
현재 시세와 비교해서 수익률과 손익을 보여줍니다
