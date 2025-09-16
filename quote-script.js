// 기본 명언 데이터베이스 (백업용)
const fallbackQuotes = [
    {
        text: "성공은 준비된 기회와 만나는 것이다.",
        author: "루이 파스퇴르"
    },
    {
        text: "꿈을 꾸는 것은 계획을 세우는 첫 번째 단계이다.",
        author: "오프라 윈프리"
    },
    {
        text: "실패는 성공의 어머니다.",
        author: "토마스 에디슨"
    },
    {
        text: "행복은 습관이다. 그것을 몸에 지니라.",
        author: "허버드"
    },
    {
        text: "오늘 할 수 있는 일을 내일로 미루지 마라.",
        author: "벤자민 프랭클린"
    }
];

// ChatGPT API 클래스
class QuoteGenerator {
    constructor() {
        this.isLoading = false;
        this.lastGeneratedQuote = null;
    }

    // ChatGPT API로 명언 생성
    async generateQuoteFromAPI() {
        if (!apiConfig.isAPIKeyValid()) {
            throw new Error('유효한 API 키가 필요합니다.');
        }

        this.isLoading = true;
        updateLoadingState(true);

        try {
            const response = await fetch(apiConfig.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiConfig.apiKey}`
                },
                body: JSON.stringify({
                    model: apiConfig.model,
                    messages: [
                        {
                            role: 'system',
                            content: '당신은 영감을 주는 명언을 생성하는 전문가입니다. 한국어로 짧고 임팩트 있는 명언과 그 작가를 제공해주세요.'
                        },
                        {
                            role: 'user',
                            content: '새로운 영감을 주는 명언 하나와 그 작가를 JSON 형식으로 제공해주세요. 형식: {"text": "명언 내용", "author": "작가명"}'
                        }
                    ],
                    max_tokens: apiConfig.maxTokens,
                    temperature: apiConfig.temperature
                })
            });

            if (!response.ok) {
                throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content;
            
            // JSON 파싱 시도
            try {
                const quoteData = JSON.parse(content);
                this.lastGeneratedQuote = quoteData;
                return quoteData;
            } catch (parseError) {
                // JSON 파싱 실패시 텍스트에서 추출 시도
                return this.parseQuoteFromText(content);
            }

        } catch (error) {
            console.error('API 호출 오류:', error);
            throw error;
        } finally {
            this.isLoading = false;
            updateLoadingState(false);
        }
    }

    // 텍스트에서 명언 추출
    parseQuoteFromText(text) {
        const lines = text.split('\n').filter(line => line.trim());
        let quoteText = '';
        let author = '';

        for (const line of lines) {
            if (line.includes('"') || line.includes('「')) {
                quoteText = line.replace(/["""「」]/g, '').trim();
            } else if (line.includes('-') || line.includes('by') || line.includes('작가')) {
                author = line.replace(/[-by작가:]/g, '').trim();
            }
        }

        return {
            text: quoteText || '새로운 영감을 찾아보세요.',
            author: author || 'ChatGPT'
        };
    }

    // 백업 명언 반환
    getFallbackQuote() {
        const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
        return fallbackQuotes[randomIndex];
    }
}

// 전역 인스턴스
const quoteGenerator = new QuoteGenerator();

// 전역 변수
let currentQuote = null;
let totalQuotesViewed = 0;
let favorites = JSON.parse(localStorage.getItem('favoriteQuotes')) || [];
let usedQuotes = [];

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', async function() {
    updateStats();
    displayFavorites();
    await initializeAPI();
});

// API 초기화
async function initializeAPI() {
    // GitHub에서 API 키 로드 시도
    const githubSuccess = await apiConfig.loadAPIKeyFromGitHub();
    
    if (!githubSuccess) {
        // 로컬에서 API 키 로드 시도
        const localSuccess = apiConfig.loadAPIKeyFromLocal();
        
        if (!localSuccess) {
            // API 키 설정 모달 표시
            showAPIKeyModal();
        }
    }
    
    updateAPIStatus();
}

// 랜덤 명언 생성 (개선된 버전)
async function generateQuote() {
    if (quoteGenerator.isLoading) return;

    try {
        let selectedQuote;
        
        // API 키가 있으면 ChatGPT에서 생성, 없으면 백업 사용
        if (apiConfig.isAPIKeyValid()) {
            try {
                selectedQuote = await quoteGenerator.generateQuoteFromAPI();
                showNotification('ChatGPT에서 새로운 명언을 생성했습니다! ✨');
            } catch (error) {
                console.error('API 호출 실패, 백업 명언 사용:', error);
                selectedQuote = quoteGenerator.getFallbackQuote();
                showNotification('백업 명언을 표시합니다. API 키를 확인해주세요.');
            }
        } else {
            // 백업 명언 사용
            selectedQuote = quoteGenerator.getFallbackQuote();
        }
        
        currentQuote = { ...selectedQuote, index: Date.now() }; // 고유 ID 생성
        
        // 애니메이션과 함께 표시
        displayQuoteWithAnimation(selectedQuote);
        
        // 통계 업데이트
        totalQuotesViewed++;
        updateStats();
        
        // 버튼 활성화
        document.getElementById('favoriteBtn').disabled = false;
        document.getElementById('shareBtn').disabled = false;
        
        // 즐겨찾기 버튼 상태 업데이트
        updateFavoriteButton();
        
    } catch (error) {
        console.error('명언 생성 오류:', error);
        showNotification('명언 생성 중 오류가 발생했습니다.');
    }
}

// 애니메이션과 함께 명언 표시
function displayQuoteWithAnimation(quote) {
    const quoteCard = document.getElementById('quoteCard');
    const quoteText = document.getElementById('quoteText');
    const author = document.getElementById('author');
    
    // 페이드 아웃
    quoteCard.style.opacity = '0';
    quoteCard.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        quoteText.textContent = quote.text;
        author.textContent = `- ${quote.author} -`;
        
        // 페이드 인
        quoteCard.style.opacity = '1';
        quoteCard.style.transform = 'translateY(0)';
    }, 300);
}

// 즐겨찾기 토글
function toggleFavorite() {
    if (!currentQuote) return;
    
    const index = favorites.findIndex(fav => fav.index === currentQuote.index);
    
    if (index === -1) {
        // 즐겨찾기 추가
        favorites.push(currentQuote);
        showNotification('즐겨찾기에 추가되었습니다! ❤️');
    } else {
        // 즐겨찾기 제거
        favorites.splice(index, 1);
        showNotification('즐겨찾기에서 제거되었습니다.');
    }
    
    // 로컬 스토리지에 저장
    localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
    
    // UI 업데이트
    updateFavoriteButton();
    updateStats();
    displayFavorites();
}

// 즐겨찾기 버튼 상태 업데이트
function updateFavoriteButton() {
    const favoriteBtn = document.getElementById('favoriteBtn');
    const isCurrentFavorite = currentQuote && favorites.some(fav => fav.index === currentQuote.index);
    
    if (isCurrentFavorite) {
        favoriteBtn.classList.add('active');
        favoriteBtn.innerHTML = '<span class="btn-icon">💖</span>즐겨찾기 해제';
    } else {
        favoriteBtn.classList.remove('active');
        favoriteBtn.innerHTML = '<span class="btn-icon">❤️</span>즐겨찾기';
    }
}

// 명언 공유
function shareQuote() {
    if (!currentQuote) return;
    
    const shareText = `"${currentQuote.text}" - ${currentQuote.author}`;
    
    if (navigator.share) {
        // Web Share API 지원 시
        navigator.share({
            title: '오늘의 명언',
            text: shareText,
            url: window.location.href
        });
    } else {
        // 클립보드에 복사
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('명언이 클립보드에 복사되었습니다! 📋');
        });
    }
}

// 통계 업데이트
function updateStats() {
    document.getElementById('totalQuotes').textContent = totalQuotesViewed;
    document.getElementById('favoriteCount').textContent = favorites.length;
}

// 즐겨찾기 목록 표시
function displayFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p class="no-favorites">아직 즐겨찾기한 명언이 없습니다.</p>';
        return;
    }
    
    favoritesList.innerHTML = favorites.map((quote, index) => `
        <div class="favorite-item">
            <div class="favorite-quote">"${quote.text}"</div>
            <div class="favorite-author">- ${quote.author} -</div>
            <button class="remove-favorite" onclick="removeFavorite(${index})">❌</button>
        </div>
    `).join('');
}

// 즐겨찾기 제거
function removeFavorite(index) {
    favorites.splice(index, 1);
    localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
    updateStats();
    displayFavorites();
    updateFavoriteButton();
    showNotification('즐겨찾기에서 제거되었습니다.');
}

// 알림 표시
function showNotification(message) {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 애니메이션
    setTimeout(() => notification.classList.add('show'), 100);
    
    // 3초 후 제거
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 로딩 상태 업데이트
function updateLoadingState(isLoading) {
    const generateBtn = document.getElementById('generateBtn');
    
    if (isLoading) {
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="btn-icon">⏳</span>생성 중...';
        generateBtn.classList.add('loading');
    } else {
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<span class="btn-icon">🎲</span>새로운 명언';
        generateBtn.classList.remove('loading');
    }
}

// API 상태 업데이트
function updateAPIStatus() {
    const statusElement = document.getElementById('apiStatus');
    if (!statusElement) return;
    
    if (apiConfig.isAPIKeyValid()) {
        statusElement.textContent = '✅ ChatGPT API 연결됨';
        statusElement.className = 'api-status connected';
    } else {
        statusElement.textContent = '⚠️ API 키 필요 (백업 명언 사용중)';
        statusElement.className = 'api-status disconnected';
    }
}

// API 키 설정 모달 표시
function showAPIKeyModal() {
    const modal = document.createElement('div');
    modal.className = 'api-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>🔑 OpenAI API 키 설정</h3>
            <p>ChatGPT에서 명언을 생성하려면 API 키가 필요합니다.</p>
            <div class="api-input-group">
                <input type="password" id="apiKeyInput" placeholder="sk-..." />
                <button onclick="setAPIKeyFromInput()">설정</button>
            </div>
            <div class="api-help">
                <p><strong>API 키 획득 방법:</strong></p>
                <ol>
                    <li><a href="https://platform.openai.com/api-keys" target="_blank">OpenAI API 키 페이지</a> 방문</li>
                    <li>"Create new secret key" 클릭</li>
                    <li>생성된 키를 복사하여 위에 입력</li>
                </ol>
                <p><strong>GitHub에서 키 관리:</strong></p>
                <p>보안을 위해 GitHub 저장소에 <code>api-key.txt</code> 파일을 생성하고 API 키를 저장하세요.</p>
            </div>
            <button class="close-modal" onclick="closeAPIKeyModal()">나중에 설정</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
}

// API 키 입력에서 설정
function setAPIKeyFromInput() {
    const input = document.getElementById('apiKeyInput');
    const apiKey = input.value.trim();
    
    if (apiKey.startsWith('sk-') && apiKey.length > 20) {
        apiConfig.setAPIKey(apiKey);
        updateAPIStatus();
        closeAPIKeyModal();
        showNotification('API 키가 설정되었습니다! 🎉');
    } else {
        showNotification('유효하지 않은 API 키입니다. sk-로 시작하는 키를 입력해주세요.');
    }
}

// API 키 모달 닫기
function closeAPIKeyModal() {
    const modal = document.querySelector('.api-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// 키보드 단축키
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        generateQuote();
    } else if (e.code === 'KeyF' && currentQuote) {
        e.preventDefault();
        toggleFavorite();
    } else if (e.code === 'KeyS' && currentQuote) {
        e.preventDefault();
        shareQuote();
    } else if (e.code === 'KeyK' && e.ctrlKey) {
        e.preventDefault();
        showAPIKeyModal();
    }
});
