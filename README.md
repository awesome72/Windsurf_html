# 🌟 ChatGPT 명언 생성기

ChatGPT API를 활용한 인터랙티브 명언 생성기입니다. 실시간으로 새로운 명언을 생성하고, 즐겨찾기 기능을 제공합니다.

## ✨ 주요 기능

### 🎯 **핵심 기능**
- **ChatGPT API 연동**: 실시간 명언 생성
- **백업 명언**: API 없이도 사용 가능
- **즐겨찾기**: 마음에 드는 명언 저장
- **소셜 공유**: 클립보드 복사 및 네이티브 공유
- **통계 표시**: 확인한 명언 수, 즐겨찾기 수

### 🔧 **기술적 특징**
- **GitHub API 키 관리**: 보안을 위한 외부 키 관리
- **로컬 스토리지**: 데이터 영구 보존
- **반응형 디자인**: 모바일/태블릿 최적화
- **키보드 단축키**: 빠른 조작 지원

## 🚀 설치 및 사용법

### 1. 파일 구조
```
├── index.html          # 메인 HTML 파일
├── config.js           # API 설정 관리
├── quote-script.js     # 메인 JavaScript 로직
├── quote-styles.css    # 스타일시트
├── api-key.txt         # API 키 파일 (선택사항)
└── README.md           # 이 파일
```

### 2. OpenAI API 키 설정

#### 방법 1: 웹 인터페이스에서 설정
1. 웹사이트 실행 후 "⚙️ API 설정" 버튼 클릭
2. [OpenAI API 키 페이지](https://platform.openai.com/api-keys)에서 키 생성
3. 생성된 키를 입력창에 붙여넣기

#### 방법 2: GitHub에서 키 관리 (권장)
1. GitHub 저장소에 `api-key.txt` 파일 생성
2. 파일에 OpenAI API 키 입력 (sk-로 시작)
3. `config.js`에서 GitHub URL 수정:
   ```javascript
   const response = await fetch('https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/api-key.txt');
   ```

### 3. GitHub Pages 배포

#### 단계별 가이드:
1. **저장소 생성**
   - GitHub에서 새 저장소 생성
   - 모든 파일을 저장소에 업로드

2. **API 키 설정**
   ```bash
   # api-key.txt 파일 생성
   echo "sk-your-openai-api-key-here" > api-key.txt
   git add api-key.txt
   git commit -m "Add API key"
   git push
   ```

3. **GitHub Pages 활성화**
   - 저장소 Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: "main" 선택
   - 폴더: "/ (root)" 선택

4. **URL 업데이트**
   - `config.js`에서 GitHub URL을 실제 저장소 URL로 변경
   - 예: `https://raw.githubusercontent.com/username/repo-name/main/api-key.txt`

## 🎮 사용법

### 키보드 단축키
- **스페이스바**: 새로운 명언 생성
- **F**: 현재 명언 즐겨찾기 토글
- **S**: 현재 명언 공유
- **Ctrl + K**: API 키 설정 모달 열기

### 기능 설명
1. **명언 생성**: "새로운 명언" 버튼 클릭 또는 스페이스바
2. **즐겨찾기**: ❤️ 버튼으로 명언 저장/해제
3. **공유**: 📤 버튼으로 클립보드 복사 또는 네이티브 공유
4. **API 설정**: ⚙️ 버튼으로 OpenAI API 키 관리

## 🔒 보안 고려사항

### API 키 보안
- **절대 공개하지 마세요**: API 키를 공개 저장소에 직접 커밋하지 마세요
- **환경 변수 사용**: 가능하면 환경 변수나 비공개 저장소 사용
- **키 순환**: 정기적으로 API 키를 재생성하세요

### 권장 보안 방법
1. **비공개 저장소**: API 키가 포함된 저장소는 비공개로 설정
2. **GitHub Secrets**: GitHub Actions 사용시 Secrets 활용
3. **서버리스 함수**: Vercel, Netlify Functions 등 활용

## 🛠️ 커스터마이징

### 스타일 변경
`quote-styles.css`에서 색상, 폰트, 레이아웃 수정 가능

### API 설정 변경
`config.js`에서 다음 설정 조정 가능:
- `model`: GPT 모델 (gpt-3.5-turbo, gpt-4 등)
- `maxTokens`: 최대 토큰 수
- `temperature`: 창의성 수준 (0-1)

### 백업 명언 추가
`quote-script.js`의 `fallbackQuotes` 배열에 명언 추가

## 📱 브라우저 지원

- **Chrome**: 완전 지원
- **Firefox**: 완전 지원
- **Safari**: 완전 지원
- **Edge**: 완전 지원
- **모바일**: iOS Safari, Chrome Mobile 지원

## 🤝 기여하기

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🆘 문제 해결

### 자주 발생하는 문제

**Q: API 키를 설정했는데 작동하지 않아요**
A: 
- API 키가 `sk-`로 시작하는지 확인
- OpenAI 계정에 크레딧이 있는지 확인
- 브라우저 개발자 도구에서 네트워크 오류 확인

**Q: GitHub에서 API 키를 불러올 수 없어요**
A:
- `config.js`의 GitHub URL이 정확한지 확인
- `api-key.txt` 파일이 저장소에 있는지 확인
- CORS 정책으로 인해 로컬에서는 작동하지 않을 수 있음

**Q: 모바일에서 레이아웃이 깨져요**
A:
- 최신 브라우저 사용 권장
- 뷰포트 메타 태그가 올바른지 확인

## 📞 지원

문제가 발생하면 GitHub Issues에 등록해주세요.
