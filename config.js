// API 설정 파일
class APIConfig {
    constructor() {
        this.apiKey = null;
        this.baseURL = 'https://api.openai.com/v1/chat/completions';
        this.model = 'gpt-3.5-turbo';
        this.maxTokens = 150;
        this.temperature = 0.8;
    }

    // GitHub에서 API 키 로드
    async loadAPIKeyFromGitHub() {
        try {
            // GitHub raw URL에서 API 키 파일 로드
            // 실제 사용시에는 여러분의 GitHub 저장소 URL로 변경하세요
            const response = await fetch('https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/api-key.txt');
            
            if (!response.ok) {
                throw new Error('API 키 파일을 찾을 수 없습니다.');
            }
            
            const apiKey = await response.text();
            this.apiKey = apiKey.trim();
            
            // 로컬 스토리지에 임시 저장 (선택사항)
            localStorage.setItem('openai_api_key', this.apiKey);
            
            return true;
        } catch (error) {
            console.error('GitHub에서 API 키 로드 실패:', error);
            return false;
        }
    }

    // 로컬에서 API 키 로드 (백업 방법)
    loadAPIKeyFromLocal() {
        const storedKey = localStorage.getItem('openai_api_key');
        if (storedKey) {
            this.apiKey = storedKey;
            return true;
        }
        return false;
    }

    // 사용자 입력으로 API 키 설정
    setAPIKey(key) {
        this.apiKey = key;
        localStorage.setItem('openai_api_key', key);
    }

    // API 키 유효성 검사
    isAPIKeyValid() {
        return this.apiKey && this.apiKey.startsWith('sk-') && this.apiKey.length > 20;
    }

    // API 키 제거
    clearAPIKey() {
        this.apiKey = null;
        localStorage.removeItem('openai_api_key');
    }
}

// 전역 설정 객체
const apiConfig = new APIConfig();
