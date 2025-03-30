// Toggle chat window
document.querySelector('.chat-header').addEventListener('click', function() {
    document.querySelector('.chat-container').classList.toggle('active');
    const arrow = this.querySelector('span');
    arrow.textContent = arrow.textContent === '▲' ? '▼' : '▲';
});

// Simple chatbot functionality
const chatInput = document.querySelector('.chat-input input');
const chatButton = document.querySelector('.chat-input button');
const chatMessages = document.querySelector('.chat-messages');

const botResponses = {
    'html': 'HTML (HyperText Markup Language) adalah bahasa markup standar untuk dokumen yang dirancang untuk ditampilkan di browser web. Ini menggambarkan struktur halaman web menggunakan markup.',
    'css': 'CSS (Cascading Style Sheets) adalah bahasa yang digunakan untuk menggambarkan tampilan dan format dokumen yang ditulis dalam bahasa markup seperti HTML.',
    'javascript': 'JavaScript adalah bahasa pemrograman yang memungkinkan Anda mengimplementasikan fitur kompleks pada halaman web seperti konten yang diperbarui secara dinamis, kontrol multimedia, dan animasi.',
    'flexbox': 'Flexbox adalah model layout satu dimensi yang memungkinkan Anda untuk mengatur item dalam baris atau kolom, dan mendistribusikan ruang di antara item tersebut.',
    'grid': 'CSS Grid Layout adalah sistem layout dua dimensi untuk web yang memungkinkan Anda untuk mengatur konten dalam baris dan kolom.',
    'responsive': 'Responsive web design adalah pendekatan yang membuat halaman web terlihat baik di semua perangkat dengan berbagai ukuran layar.',
    'dom': 'DOM (Document Object Model) adalah representasi dari objek yang membentuk struktur dokumen di browser.',
};

function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Add bot response
    setTimeout(() => {
        let botResponse = 'Maaf, saya belum memiliki informasi tentang topik tersebut. Silakan tanyakan tentang HTML, CSS, JavaScript, Flexbox, Grid, Responsive Design, atau DOM.';
        
        // Check for keywords in user message
        for (const [keyword, response] of Object.entries(botResponses)) {
            if (message.toLowerCase().includes(keyword)) {
                botResponse = response;
                break;
            }
        }
        
        // Special cases for code help
        if (message.toLowerCase().includes('code') || message.toLowerCase().includes('kode')) {
            botResponse = 'Saya dapat membantu mengoptimasi kode Anda. Silakan kirimkan kode yang ingin dioptimasi.';
        } else if (message.toLowerCase().includes('rangkum') || message.toLowerCase().includes('ringkas')) {
            botResponse = 'Saya dapat merangkum materi untuk Anda. Silakan tentukan topik yang ingin dirangkum.';
        }
        
        addMessage(botResponse, 'bot');
    }, 500);
}

function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(sender + '-message');
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});