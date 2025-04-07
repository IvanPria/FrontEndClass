// Constants and configurations
const API_KEY = "";
let chatHistory = [];

// Toggle chat window
document.querySelector('.chat-header').addEventListener('click', function() {
    document.querySelector('.chat-container').classList.toggle('active');
    const arrow = this.querySelector('span');
    arrow.textContent = arrow.textContent === '▲' ? '▼' : '▲';
});

// Chat elements
const chatInput = document.querySelector('.chat-input input');
const chatButton = document.querySelector('.chat-input button');
const chatMessages = document.querySelector('.chat-messages');

// Function to call Gemini API
async function callGeminiAPI(promptText) {
    try {
        const apiKey = API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
        
        // Create system prompt with restrictions
        const systemPrompt = {
            role: "user",
            parts: [{
                text: "You are a helpful assistant that specializes in frontend development topics. " +
                      "You can only provide information about HTML, CSS, JavaScript, React, Vue, Angular, " +
                      "frontend frameworks, UI/UX, responsive design, web accessibility, and related frontend development topics. " +
                      "For other topics, politely redirect the conversation back to frontend development. " +
                      "Greetings and general pleasantries are allowed. Respond in Indonesian language."
            }]
        };
        
        // Generate request parameters
        const requestData = {
            contents: [systemPrompt].concat(chatHistory).concat([{
                role: "user",
                parts: [{text: promptText}]
            }]),
            generationConfig: {
                temperature: 0.7,      // Balance between creative and focused responses
                topK: 40,              // Consider top 40 tokens
                topP: 0.95,            // Consider tokens with 95% of probability mass
                maxOutputTokens: 1024  // Reasonable limit for chat responses
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };
        
        // Make API request
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if we have a valid response
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const botResponse = data.candidates[0].content.parts[0].text;
            
            // Update chat history for context
            chatHistory.push({
                role: "user",
                parts: [{text: promptText}]
            });
            
            chatHistory.push({
                role: "model",
                parts: [{text: botResponse}]
            });
            
            // Keep history manageable (last 10 exchanges)
            if (chatHistory.length > 20) {
                chatHistory = chatHistory.slice(chatHistory.length - 20);
            }
            
            return botResponse;
        } else {
            throw new Error("Invalid response format from API");
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Maaf, terjadi kesalahan saat menghubungi asisten AI. Silakan coba lagi nanti.";
    }
}

// Fallback responses when API fails or for quick responses
const quickResponses = {
    'html': 'HTML (HyperText Markup Language) adalah bahasa markup standar untuk dokumen yang dirancang untuk ditampilkan di browser web. Ini menggambarkan struktur halaman web menggunakan markup.',
    'css': 'CSS (Cascading Style Sheets) adalah bahasa yang digunakan untuk menggambarkan tampilan dan format dokumen yang ditulis dalam bahasa markup seperti HTML.',
    'javascript': 'JavaScript adalah bahasa pemrograman yang memungkinkan Anda mengimplementasikan fitur kompleks pada halaman web seperti konten yang diperbarui secara dinamis, kontrol multimedia, dan animasi.',
    'flexbox': 'Flexbox adalah model layout satu dimensi yang memungkinkan Anda untuk mengatur item dalam baris atau kolom, dan mendistribusikan ruang di antara item tersebut.',
    'grid': 'CSS Grid Layout adalah sistem layout dua dimensi untuk web yang memungkinkan Anda untuk mengatur konten dalam baris dan kolom.',
    'responsive': 'Responsive web design adalah pendekatan yang membuat halaman web terlihat baik di semua perangkat dengan berbagai ukuran layar.',
    'dom': 'DOM (Document Object Model) adalah representasi dari objek yang membentuk struktur dokumen di browser.',
};

// Check if a message is a greeting
function isGreeting(message) {
    const greetings = ['halo', 'hai', 'hello', 'hi', 'selamat pagi', 'selamat siang', 'selamat sore', 'selamat malam', 'assalamualaikum'];
    return greetings.some(greeting => message.toLowerCase().includes(greeting));
}

// Check if a message is about frontend development
function isFrontendRelated(message) {
    const frontendKeywords = ['html', 'css', 'javascript', 'js', 'react', 'vue', 'angular', 'frontend', 'front-end', 
                             'ui', 'ux', 'responsive', 'web', 'dom', 'flexbox', 'grid', 'layout', 'design', 
                             'framework', 'library', 'component', 'styling', 'sass', 'less', 'tailwind', 'bootstrap'];
    return frontendKeywords.some(keyword => message.toLowerCase().includes(keyword));
}

// Send message function
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message to UI
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('message', 'bot-message', 'typing-indicator');
    typingIndicator.textContent = 'Mengetik...';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    let botResponse;
    
    // Process message based on content
    if (isGreeting(message)) {
        // Quick response for greetings
        botResponse = "Halo! Saya asisten AI untuk membantu pembelajaran Frontend Development Anda. Ada yang bisa saya bantu?";
    } else if (!isFrontendRelated(message)) {
        // Polite redirection for non-frontend topics
        botResponse = "Maaf, saya hanya dapat membantu dengan topik seputar pengembangan frontend. Silakan tanyakan tentang HTML, CSS, JavaScript, atau topik frontend lainnya.";
    } else {
        // Call Gemini API for frontend-related questions
        botResponse = await callGeminiAPI(message);
        
        // Fallback to predefined responses if API fails or returns empty
        if (!botResponse || botResponse.trim() === "") {
            // Check for keywords in user message
            for (const [keyword, response] of Object.entries(quickResponses)) {
                if (message.toLowerCase().includes(keyword)) {
                    botResponse = response;
                    break;
                }
            }
            
            // If no keyword match found
            if (!botResponse || botResponse.trim() === "") {
                botResponse = "Maaf, saya belum memiliki informasi spesifik tentang topik tersebut. Silakan tanyakan pertanyaan lain tentang frontend development.";
            }
        }
    }
    
    // Remove typing indicator
    chatMessages.removeChild(typingIndicator);
    
    // Add bot response to UI
    addMessage(botResponse, 'bot');
}

// Add message to chat UI
function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(sender + '-message');
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Event listeners
chatButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Initialize chatbot with welcome message if no messages exist
if (chatMessages.children.length === 0) {
    addMessage("Halo! Saya asisten AI untuk membantu pembelajaran Frontend Development Anda. Ada yang bisa saya bantu?", 'bot');
}