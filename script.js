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
    }
];

// Система сбора данных
let researchData = {
    participantId: generateId(),
    startTime: new Date(),
    results: [],
    group: getRandomGroup() // A - контрольная, B - экспериментальная
};

let currentEmailIndex = 0;
let score = 0;
let totalQuestions = 0;

// Элементы страницы
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
const resultsScreen = document.getElementById('results');
const gameScreen = document.getElementById('game-screen');
const restartButton = document.getElementById('restart-btn');
const researchButton = document.getElementById('research-btn'); // Добавь эту кнопку в HTML

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
    
    // Сохраняем в localStorage (чтобы данные не потерялись)
    localStorage.setItem('researchData', JSON.stringify(researchData));
}

// Проверка ответа
function checkAnswer(userAnswer) {
    const startTime = new Date();
    const email = emails[currentEmailIndex];
    const isCorrect = (userAnswer === email.isPhishing);
    
    totalQuestions++;
    const timeSpent = new Date() - startTime;
    
    // Записываем результат
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

// Анализ результатов исследования
function analyzeResearchData() {
    const results = researchData.results;
    const total = results.length;
    
    if (total === 0) return null;
    
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const successRate = Math.round((correctAnswers / total) * 100);
    
    // Анализ по сложности писем
    const easyEmails = results.filter(r => r.difficulty === 'easy');
    const mediumEmails = results.filter(r => r.difficulty === 'medium');
    const hardEmails = results.filter(r => r.difficulty === 'hard');
    
    // Самое сложное письмо
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
    
    // Находим самое сложное письмо
    const hardestEmail = Object.values(emailStats).reduce((hardest, current) => {
        return current.successRate < hardest.successRate ? current : hardest;
    });
    
    return {
        participantId: researchData.participantId,
        group: researchData.group,
        totalAnswers: total,
        correctAnswers: correctAnswers,
        successRate: successRate,
        averageTime: Math.round(results.reduce((sum, r) => sum + r.timeSpent, 0) / total),
        hardestEmail: hardestEmail,
        emailStats: emailStats,
        group: researchData.group
    };
}

// Показать результаты исследования
function showResearchResults() {
    const analysis = analyzeResearchData();
    
    if (!analysis) {
        alert('Нет данных для анализа');
        return;
    }
    
    // Создаем красивый отчет
    const report = `
Участник: ${analysis.participantId}
Группа: ${analysis.group}
Общие результаты:
- Правильных ответов: ${analysis.correctAnswers}/${analysis.totalAnswers} (${analysis.successRate}%)
- Среднее время ответа: ${analysis.averageTime} мс

Статистика по письмам:
${emails.map(email => {
    const stats = analysis.emailStats[email.id];
    return `- "${email.subject}": ${stats ? stats.successRate + '%' : 'нет данных'}`;
}).join('\n')}

Самое сложное письмо: "${analysis.hardestEmail.subject}" (${analysis.hardestEmail.successRate}% правильных ответов)
    `;
    
    // Показываем отчет (можно улучшить вывод на страницу)
    console.log('Результаты исследования:', report);
    alert('Результаты сохранены! Посмотри консоль браузера (F12) для подробного отчета.');
    
    // Для учителя: можно вывести на страницу
    displayResultsOnPage(analysis);
}

// Вывод результатов на страницу (дополнительная функция)
function displayResultsOnPage(analysis) {
    const resultsDiv = document.createElement('div');
    resultsDiv.innerHTML = `
        <h3>Результаты исследования</h3>
        <p><strong>Участник:</strong> ${analysis.participantId}</p>
        <p><strong>Группа:</strong> ${analysis.group}</p>
        <p><strong>Результат:</strong> ${analysis.correctAnswers}/${analysis.totalAnswers} (${analysis.successRate}%)</p>
        <p><strong>Самое сложное письмо:</strong> "${analysis.hardestEmail.subject}"</p>
    `;
    document.body.appendChild(resultsDiv);
}

// Следующее письмо
function nextEmail() {
    currentEmailIndex++;
    
    if (currentEmailIndex < emails.length) {
        loadEmail(currentEmailIndex);
    } else {
        showResults();
        // Автоматически показываем исследовательские результаты
        setTimeout(showResearchResults, 1000);
    }
}

// Показ игровых результатов
function showResults() {
    gameScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    finalScore.textContent = score;
    totalQuestionsDisplay.textContent = totalQuestions;
}

// Перезапуск игры
function restartGame() {
    currentEmailIndex = 0;
    score = 0;
    totalQuestions = 0;
    pointsDisplay.textContent = score;
    
    // Новые данные для нового участника
    researchData = {
        participantId: generateId(),
        startTime: new Date(),
        results: [],
        group: getRandomGroup()
    };
    
    resultsScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    loadEmail(currentEmailIndex);
}

// Загрузка сохраненных данных
function loadSavedData() {
    const saved = localStorage.getItem('researchData');
    if (saved) {
        researchData = JSON.parse(saved);
    }
}

// Назначаем обработчики событий
answerButtons[0].addEventListener('click', () => checkAnswer(false));
answerButtons[1].addEventListener('click', () => checkAnswer(true));
nextButton.addEventListener('click', nextEmail);
restartButton.addEventListener('click', restartGame);

// Добавляем кнопку для просмотра результатов (добавь в HTML)
if (researchButton) {
    researchButton.addEventListener('click', showResearchResults);
}

// Инициализация
loadSavedData();
loadEmail(currentEmailIndex);

// Для отладки: выводим данные в консоль
console.log('Исследование начато. Участник:', researchData.participantId, 'Группа:', researchData.group);
