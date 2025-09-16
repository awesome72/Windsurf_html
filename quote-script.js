// 명언 데이터베이스
const quotes = [
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
    },
    {
        text: "인생은 10%는 무슨 일이 일어나는가 하는 것이고, 90%는 일어난 일에 어떻게 반응하느냐 하는 것이다.",
        author: "찰스 스윈돌"
    },
    {
        text: "변화를 원한다면 먼저 자신이 변해야 한다.",
        author: "마하트마 간디"
    },
    {
        text: "시작이 반이다.",
        author: "아리스토텔레스"
    },
    {
        text: "지식에 투자하는 것이 최고의 이자를 가져다준다.",
        author: "벤자민 프랭클린"
    },
    {
        text: "당신이 할 수 있다고 믿든 할 수 없다고 믿든, 당신이 옳다.",
        author: "헨리 포드"
    },
    {
        text: "성공의 비밀은 단 한 가지, 절대 포기하지 않는 것이다.",
        author: "윈스턴 처칠"
    },
    {
        text: "배움에는 왕도가 없다.",
        author: "유클리드"
    },
    {
        text: "천 리 길도 한 걸음부터.",
        author: "노자"
    },
    {
        text: "기회는 준비된 자에게 온다.",
        author: "루이 파스퇴르"
    },
    {
        text: "어제는 역사이고, 내일은 미스터리다. 하지만 오늘은 선물이다.",
        author: "엘리너 루스벨트"
    },
    {
        text: "위대한 일을 하려면 자신이 하는 일을 사랑해야 한다.",
        author: "스티브 잡스"
    },
    {
        text: "불가능이란 단지 의견일 뿐이다.",
        author: "파울로 코엘료"
    },
    {
        text: "행동은 모든 성공의 기초적 열쇠다.",
        author: "파블로 피카소"
    },
    {
        text: "삶이 있는 한 희망은 있다.",
        author: "키케로"
    },
    {
        text: "성공하는 사람은 실패에서 배우고, 실패하는 사람은 성공에서 배운다.",
        author: "로버트 키요사키"
    }
];

// 전역 변수
let currentQuote = null;
let totalQuotesViewed = 0;
let favorites = JSON.parse(localStorage.getItem('favoriteQuotes')) || [];
let usedQuotes = [];

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    displayFavorites();
});

// 랜덤 명언 생성
function generateQuote() {
    // 모든 명언을 다 봤으면 초기화
    if (usedQuotes.length >= quotes.length) {
        usedQuotes = [];
    }
    
    // 아직 보지 않은 명언들 필터링
    const availableQuotes = quotes.filter((_, index) => !usedQuotes.includes(index));
    
    // 랜덤 선택
    const randomIndex = Math.floor(Math.random() * availableQuotes.length);
    const selectedQuote = availableQuotes[randomIndex];
    
    // 사용된 명언 인덱스 추가
    const originalIndex = quotes.indexOf(selectedQuote);
    usedQuotes.push(originalIndex);
    
    currentQuote = { ...selectedQuote, index: originalIndex };
    
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
    }
});
