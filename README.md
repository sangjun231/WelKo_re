# 프로젝트 명 : WelKo



## 프로젝트 소개
- 한 줄 정리 : 해외 여행객을 대상으로 한국의 현지 투어 상품을  판매하고 현지인이 직접 가이드해주는 투어 플랫폼
- 내용 : 지루하고 흔한 여행이 아닌, 현지인만이 아는 여행 장소와 맛집 등 특별한 투어를 계획하여 판매합니다. 여행객은 현지 가이드와 실시간 소통을 통해 여행 계획 수립에도 도움을 얻을 수 있습니다.

## 기술 환경 및 스택
<div align='center'>
<img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/> 
<img src="https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white" />
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" /> 
<img src="https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white" />
<img src="https://img.shields.io/badge/Next.js-%23000000.svg?style=for-the-badge&logo=Next.js&logoColor=white" />
</div>

## DB 설계
- users 테이블

|컬럼명|타입|용도|입력방법|외래키|예시|
| :-----: |:-----: |:-----: |:-----: |:-----: |:-----: |
|id|uuid|||auth.users.id||
|created_at|timestamptz|||||
|email|text|||||
|nickname|text|||||
|avatar|text|||||
|is_admin|text|||||
