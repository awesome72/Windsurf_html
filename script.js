function changeBackgroundColor() {
    const colors = ['#ffebee', '#e8f5e8', '#e3f2fd', '#fff3e0', '#f3e5f5'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = randomColor;
}

function showMessage() {
    const messages = [
        '안녕하세요! 👋',
        '자바스크립트가 작동중입니다! ✨',
        '버튼을 클릭해주셔서 감사합니다! 😊',
        '멋진 하루 되세요! 🌟',
        '계속 탐험해보세요! 🚀'
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    document.getElementById('messageDisplay').innerHTML = randomMessage;
    document.getElementById('messageDisplay').style.color = '#e74c3c';
    document.getElementById('messageDisplay').style.fontSize = '18px';
    document.getElementById('messageDisplay').style.fontWeight = 'bold';
}

function resetPage() {
    document.body.style.backgroundColor = '';
    document.getElementById('messageDisplay').innerHTML = '';
}
