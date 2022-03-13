# server-side를 위한 폴더입니다.
이 부분은 서버를 돌리기 위한 부분입니다.

## Installation
1. MongoDB를 설치합니다
[링크](https://www.mongodb.com/download-center?jmp=hompage#community)
사이트에 접속해서 자신의 환경에 맞게 설치(community 버전)

1. Robo 3T(mongodb gui) 설치
[링크](https://robomongo.org/download)
설치 후, 좌측 상단에 +기호를 누르고 name부분만 원하는 이름으로 작성하고 Save버튼 클릭

3. MongoDB 환경변수 설정
제어판\시스템 및 보안\시스템 -> 고급 시스템 설정 -> 환경변수 -> PATH선택 -> 편집 -> 새로 만들기 -> C:\Program Files\MongoDB\Server\버전\bin 입력 -> 확인

다 설치 되었으면 cmd창에서
```
mongod
version()
```
순서대로 입력하여 확인

4. Postman 설치 및 사용
[링크](https://www.getpostman.com/)
설치 후 Enter request URL에 설정 URL(ex.localhost:4000)을 입력하고 GET, POST 등 Body부분에서 입력할 정보를 설정하고 Send버튼을 눌러서 사용