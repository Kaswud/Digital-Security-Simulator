// База данных писем для тренажера
const emails = [
    {
        id: 1,
        sender: "Сбербанк России",
        subject: "Срочно! Ваш счет заблокирован",
        content: `
            <p>Уважаемый клиент!</p>
            <p>В вашем аккаунте зафиксирована подозрительная активность. Для разблокировки счета перейдите по ссылке:</p>
            <p><a href="#" onclick="return false">https://sberbank-security.ru/verify</a></p>
            <p>Если не подтвердите данные в течение 24 часов, счет будет заблокирован.</p>
        `,
        isPhishing: true,
        explanation: "ФИШИНГ! Настоящий Сбербанк использует домен sberbank.ru, а не sberbank-security.ru. Также создается искусственная срочность.",
        difficulty: "hard"
    },
    {
        id: 2,
        sender: "Google <no-reply@google.com>",
        subject: "Попытка входа в ваш аккаунт",
        content: `
            <p>Здравствуйте!</p>
            <p>Зафиксирована попытка входа в ваш аккаунт Google с нового устройства.</p>
            <p>Если это были вы, никаких действий не требуется.</p>
            <p>Если это были не вы, <a href="#" onclick="return false">проверьте активность</a> и смените пароль.</p>
        `,
        isPhishing: false,
        explanation: "НАСТОЯЩЕЕ! Письмо от официального адреса Google, нет требований срочных действий, предложение проверить активность - стандартная практика.",
        difficulty: "medium"
    },
    {
        id: 3,
        sender: "Альфа-Банк",
        subject: "Вы выиграли 100 000 рублей!",
        content: `
            <p>Поздравляем! Вы стали победителем акции!</p>
            <p>Для получения приза переведите 500 рублей на счет для подтверждения личности:</p>
            <p>Номер счета: 1234 5678 9012 3456</p>
            <p>Алексей Петров</p>
        `,
        isPhishing: true,
        explanation: "ФИШИНГ! Настоящий банк никогда не просит переводить деньги для получения выигрыша. Это классическая мошенническая схема.",
        difficulty: "easy"
    },
    {
        id: 4,
        sender: "ВКонтакте <security@vk.com>",
        subject: "Подтвердите вход в аккаунт",
        content: `
            <p>Был выполнен вход в ваш аккаунт ВКонтакте.</p>
            <p>Устройство: iPhone 13 (iOS 16.0)</p>
            <p>Местоположение: Москва, Россия</p>
            <p>Если это были вы, можете проигнорировать это письмо.</p>
            <p>Если нет, <a href="#" onclick="return false">защитите аккаунт</a>.</p>
        `,
        isPhishing: false,
        explanation: "НАСТОЯЩЕЕ! Письмо содержит конкретные детали, нет срочных требований, домен vk.com официальный.",
        difficulty: "medium"
    },
    {
        id: 5,
        sender: "Apple Support",
        subject: "Ваш Apple ID заблокирован",
        content: `
            <p>Уважаемый пользователь!</p>
            <p>Обнаружена подозрительная активность с вашим Apple ID.</p>
            <p>Для разблокировки немедленно перейдите по ссылке:</p>
            <p><a href="#" onclick="return false">https://apple-id-security.verification.com</a></p>
            <p>Срок действия: 2 часа.</p>
        `,
        isPhishing: true,
        explanation: "ФИШИНГ! Настоящий Apple использует домен apple.com. Создается искусственная срочность и паника.",
        difficulty: "hard"
    }
];

// Система сбора данных
let researchData = {
    participantId: generateId(),
    userName: '',
    startTime: new Date(),
    results: [],
    group: getRandomGroup()
};

let currentEmailIndex = 0;
let score = 0;
let totalQuestions = 0;

// Элементы страницы
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultsScreen = document.getElementById('results');
const userForm = document.getElementById('user-form');
const userNameInput = document.getElementById('user-name');
const emailSender = document.getElementById('sender');
const emailSubject = document.getElementById('subject');
const emailContent = document.getElementById('email-content');
const answerButtons = document.querySelectorAll('.answer-btn');
const feedback = document.getElementById('feedback');
const resultText = document.getElementById('result-text');
const explanation = document.getElementById('explanation');
const nextButton = document.getElementById('next-btn');
const pointsDisplay = document.getElementById('points');
const finalScore = document.getElementById('final-score');
const totalQuestionsDisplay = document.getElementById('total-questions');
const personalResult = document.getElementById('personal-result');
const restartButton = document.getElementById('restart-btn');
const copyResultsBtn = document.getElementById('copy-results-btn');
const saveResultsBtn = document.getElementById('save-results-btn');
const copyMessage = document.getElementById('copy-message');

// Генератор ID участника
function generateId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

// Случайное распределение по группам
function getRandomGroup() {
    return Math.random() > 0.5 ? 'A' : 'B';
}

// Функция сброса стилей кнопок
function resetButtons() {
    answerButtons.forEach(btn => {
        btn.classList.remove('disabled', 'user-choice', 'correct', 'incorrect', 'correct-answer');
        const answerType = btn.getAttribute('data-answer');
        if (answerType === 'real') {
            btn.classList.add('btn-real');
        } else if (answerType === 'phishing') {
            btn.classList.add('btn-phishing');
        }
        btn.disabled = false;
    });
}

// Загрузка письма
function loadEmail(index) {
    const email = emails[index];
    emailSender.textContent = email.sender;
    emailSubject.textContent = email.subject;
    emailContent.innerHTML = email.content;
    resetButtons();
    feedback.classList.add('hidden');
}

// Запись результата в базу данных
function recordResult(emailIndex, userAnswer, isCorrect, timeSpent) {
    const email = emails[emailIndex];
    
    researchData.results.push({
        emailId: email.id,
        emailSubject: email.subject,
        userAnswer: userAnswer,
        correctAnswer: email.isPhishing,
        isCorrect: isCorrect,
        timeSpent: timeSpent,
        timestamp: new Date().toLocaleString(),
        difficulty: email.difficulty
    });
    
    localStorage.setItem('researchData', JSON.stringify(researchData));
}

// Проверка ответа
function checkAnswer(userAnswer) {
    const startTime = new Date();
    const email = emails[currentEmailIndex];
    const isCorrect = (userAnswer === email.isPhishing);
    
    totalQuestions++;
    const timeSpent = new Date() - startTime;
    
    recordResult(currentEmailIndex, userAnswer, isCorrect, timeSpent);
    
    // Подсвечиваем кнопки
    answerButtons.forEach(btn => {
        btn.disabled = true;
        btn.classList.add('disabled');
        
        const isRealButton = btn.getAttribute('data-answer') === 'real';
        const isUserChoice = (isRealButton && userAnswer === false) || (!isRealButton && userAnswer === true);
        
        if (isUserChoice) {
            btn.classList.add('user-choice');
            if (isCorrect) {
                btn.classList.add('correct');
            } else {
                btn.classList.add('incorrect');
            }
        }
        
        if ((isRealButton && !email.isPhishing) || (!isRealButton && email.isPhishing)) {
            btn.classList.add('correct-answer');
        }
    });
    
    if (isCorrect) {
        score++;
        resultText.textContent = "Правильно! 🎉";
        feedback.classList.add('good');
        feedback.classList.remove('bad');
    } else {
        resultText.textContent = "Неправильно! 😔";
        feedback.classList.add('bad');
        feedback.classList.remove('good');
    }
    
    explanation.textContent = email.explanation;
    feedback.classList.remove('hidden');
    pointsDisplay.textContent = score;
}

// Анализ результатов
function analyzeResearchData() {
    const results = researchData.results;
    const total = results.length;
    
    if (total === 0) return null;
    
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const successRate = Math.round((correctAnswers / total) * 100);
    
    // Анализ по письмам
    const emailStats = {};
    emails.forEach(email => {
        const emailResults = results.filter(r => r.emailId === email.id);
        const correct = emailResults.filter(r => r.isCorrect).length;
        emailStats[email.id] = {
            subject: email.subject,
            total: emailResults.length,
            correct: correct,
            successRate: emailResults.length > 0 ? Math.round((correct / emailResults.length) * 100) : 0
        };
    });
    
    // Самое сложное письмо
    const hardestEmail = Object.values(emailStats).reduce((hardest, current) => {
        return current.successRate < hardest.successRate ? current : hardest;
    }, {successRate: 100, subject: 'Нет данных'});
    
    // Среднее время
    const averageTime = Math.round(results.reduce((sum, r) => sum + r.timeSpent, 0) / total);
    
    return {
        participantId: researchData.participantId,
        userName: researchData.userName,
        group: researchData.group,
        totalQuestions: total,
        correctAnswers: correctAnswers,
        successRate: successRate,
        averageTime: averageTime,
        hardestEmail: hardestEmail,
        emailStats: emailStats
    };
}

// Показать детальные результаты
function showDetailedResults() {
    const analysis = analyzeResearchData();
    const userName = researchData.userName || 'Участник';
    const completionTime = new Date() - researchData.startTime;
    const minutes = Math.floor(completionTime / 60000);
    const seconds = Math.floor((completionTime % 60000) / 1000);
    
    personalResult.innerHTML = `
        <div class="result-card">
            <h3>📊 Детальные результаты</h3>
            <p><strong>👤 Имя участника:</strong> ${userName}</p>
            <p><strong>🆔 ID тестирования:</strong> ${analysis.participantId}</p>
            <p><strong>📅 Дата прохождения:</strong> ${new Date().toLocaleDateString('ru-RU')}</p>
            <p><strong>⏱️ Время прохождения:</strong> ${minutes} мин ${seconds} сек</p>
            
            <p><strong>🎯 Правильных ответов:</strong> ${analysis.correctAnswers} из ${analysis.totalQuestions}</p>
            <p><strong>📈 Процент правильных:</strong> ${analysis.successRate}%</p>
            <p><strong>⚡ Среднее время ответа:</strong> ${analysis.averageTime} мс</p>
            <p><strong>🔍 Самое сложное письмо:</strong> "${analysis.hardestEmail.subject}"</p>
            <p><strong>🏆 Уровень подготовки:</strong> ${getSkillLevel(analysis.successRate)}</p>
        </div>
    `;
}

// Определение уровня навыков
function getSkillLevel(percentage) {
    if (percentage >= 90) return 'Эксперт 👑';
    if (percentage >= 70) return 'Продвинутый 🚀';
    if (percentage >= 50) return 'Средний 👍';
    return 'Новичок 🌱';
}

// Копирование результатов в буфер обмена
async function copyResultsToClipboard() {
    const analysis = analyzeResearchData();
    const userName = researchData.userName || 'Участник';
    
    const text = `Результаты теста по кибербезопасности
─────────────────────────────
👤 Участник: ${userName}
🆔 ID: ${analysis.participantId}
📅 Дата: ${new Date().toLocaleDateString('ru-RU')}

🎯 Результат: ${analysis.correctAnswers} из ${analysis.totalQuestions}
📈 Процент правильных: ${analysis.successRate}%
⚡ Среднее время ответа: ${analysis.averageTime} мс
🔍 Самое сложное письмо: "${analysis.hardestEmail.subject}"
🏆 Уровень: ${getSkillLevel(analysis.successRate)}

💡 Рекомендация: ${getRecommendation(analysis.successRate)}`;

    try {
        await navigator.clipboard.writeText(text);
        
        // Показываем сообщение об успехе
        copyMessage.classList.remove('hidden');
        copyMessage.style.display = 'block';
        
        // Скрываем сообщение через 3 секунды
        setTimeout(() => {
            copyMessage.classList.add('hidden');
        }, 3000);
        
    } catch (err) {
        console.error('Ошибка копирования: ', err);
        alert('Не удалось скопировать результаты. Скопируйте текст вручную.');
    }
}

// Сохранение результатов в файл
function saveResultsToFile() {
    const analysis = analyzeResearchData();
    const userName = researchData.userName || 'Участник';
    
    const text = `Результаты теста по кибербезопасности
=================================
Участник: ${userName}
ID тестирования: ${analysis.participantId}
Дата прохождения: ${new Date().toLocaleDateString('ru-RU')}
Время прохождения: ${new Date(researchData.startTime).toLocaleTimeString('ru-RU')}

ОБЩИЕ РЕЗУЛЬТАТЫ:
-----------------
Правильных ответов: ${analysis.correctAnswers} из ${analysis.totalQuestions}
Процент правильных: ${analysis.successRate}%
Среднее время ответа: ${analysis.averageTime} мс
Уровень подготовки: ${getSkillLevel(analysis.successRate)}

ДЕТАЛЬНАЯ СТАТИСТИКА:
--------------------
Самое сложное письмо: "${analysis.hardestEmail.subject}"
${analysis.hardestEmail.successRate}% правильных ответов

РЕКОМЕНДАЦИИ:
-------------
${getRecommendation(analysis.successRate)}

СТАТИСТИКА ПО ПИСЬМАМ:
----------------------
${emails.map((email, index) => {
    const stats = analysis.emailStats[email.id];
    return `${index + 1}. "${email.subject}": ${stats ? stats.successRate + '% правильных' : 'не отвечено'}`;
}).join('\n')}`;

    // Создаем и скачиваем файл
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    
    const date = new Date().toISOString().split('T')[0];
    const fileName = researchData.userName ? 
        `Результат_${researchData.userName}_${date}.txt` : 
        `Результат_теста_${date}.txt`;
    
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Рекомендации по результатам
function getRecommendation(percentage) {
    if (percentage >= 90) {
        return 'Отличный результат! Вы хорошо разбираетесь в кибербезопасности. Продолжайте следить за новыми видами мошенничества.';
    } else if (percentage >= 70) {
        return 'Хороший результат! Обращайте внимание на домены сайтов и не поддавайтесь на искусственную срочность.';
    } else if (percentage >= 50) {
        return 'Неплохо, но есть куда расти! Изучите основные признаки фишинговых писем: подозрительные ссылки, грамматические ошибки, требования срочных действий.';
    } else {
        return 'Рекомендуем пройти обучение по кибербезопасности. Обращайте внимание на отправителя, ссылки и тон письма.';
    }
}

// Следующее письмо
function nextEmail() {
    currentEmailIndex++;
    
    if (currentEmailIndex < emails.length) {
        loadEmail(currentEmailIndex);
    } else {
        showResults();
    }
}

// Показ финальных результатов
function showResults() {
    gameScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    finalScore.textContent = score;
    totalQuestionsDisplay.textContent = totalQuestions;
    
    showDetailedResults();
}

// Перезапуск игры
function restartGame() {
    currentEmailIndex = 0;
    score = 0;
    totalQuestions = 0;
    pointsDisplay.textContent = score;
    
    researchData = {
        participantId: generateId(),
        userName: researchData.userName, // Сохраняем имя
        startTime: new Date(),
        results: [],
        group: getRandomGroup()
    };
    
    resultsScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}

// Обработчик отправки формы
function handleFormSubmit(event) {
    event.preventDefault();
    
    const userName = userNameInput.value.trim();
    if (userName) {
        researchData.userName = userName;
        localStorage.setItem('researchData', JSON.stringify(researchData));
        
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        loadEmail(currentEmailIndex);
    } else {
        alert('Пожалуйста, введите ваше имя.');
    }
}

// Загрузка сохраненных данных
function loadSavedData() {
    const saved = localStorage.getItem('researchData');
    if (saved) {
        const savedData = JSON.parse(saved);
        researchData.userName = savedData.userName || '';
        if (researchData.userName) {
            userNameInput.value = researchData.userName;
        }
    }
}

// Инициализация
function init() {
    loadSavedData();
    
    startScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    
    // Назначаем обработчики
    userForm.addEventListener('submit', handleFormSubmit);
    answerButtons[0].addEventListener('click', () => checkAnswer(false));
    answerButtons[1].addEventListener('click', () => checkAnswer(true));
    nextButton.addEventListener('click', nextEmail);
    restartButton.addEventListener('click', restartGame);
    copyResultsBtn.addEventListener('click', copyResultsToClipboard);
    saveResultsBtn.addEventListener('click', saveResultsToFile);
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', init);
