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
    userName: '', // Добавляем поле для имени
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
const exportButton = document.getElementById('export-btn');
const researchButton = document.getElementById('research-btn');

// Переменная для хранения финального результата
let finalResultText = '';

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
    
    // Сохраняем в localStorage
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
    }, {successRate: 100});
    
    return {
        participantId: researchData.participantId,
        userName: researchData.userName,
        group: researchData.group,
        totalAnswers: total,
        correctAnswers: correctAnswers,
        successRate: successRate,
        averageTime: Math.round(results.reduce((sum, r) => sum + r.timeSpent, 0) / total),
        hardestEmail: hardestEmail,
        emailStats: emailStats
    };
}

// Подготовка текста для экспорта
function prepareExportText() {
    const analysis = analyzeResearchData();
    const userName = researchData.userName || 'Аноним';
    const currentDate = new Date().toLocaleDateString('ru-RU');
    
    let exportText = `
РЕЗУЛЬТАТ ТЕСТА "ТРЕНАЖЕР ПО КИБЕРБЕЗОПАСНОСТИ"
=========================================
Участник: ${userName}
ID участника: ${researchData.participantId}
Группа: ${researchData.group}
Дата прохождения: ${currentDate}

ОБЩИЕ РЕЗУЛЬТАТЫ:
-----------------
Правильных ответов: ${analysis.correctAnswers} из ${analysis.totalAnswers}
Процент правильных: ${analysis.successRate}%
Среднее время ответа: ${analysis.averageTime} мс

ДЕТАЛЬНАЯ СТАТИСТИКА:
--------------------
`;
    
    // Добавляем статистику по каждому письму
    emails.forEach((email, index) => {
        const stats = analysis.emailStats[email.id];
        exportText += `\n${index + 1}. "${email.subject}"\n`;
        exportText += `   Сложность: ${getDifficultyText(email.difficulty)}\n`;
        exportText += `   Правильных ответов: ${stats ? stats.successRate + '%' : 'нет данных'}\n`;
    });
    
    exportText += `\nСАМОЕ СЛОЖНОЕ Письмо:\n`;
    exportText += `"${analysis.hardestEmail.subject}" - ${analysis.hardestEmail.successRate}% правильных ответов\n\n`;
    
    exportText += `ВРЕМЯ ПРОХОЖДЕНИЯ: ${researchData.startTime.toLocaleString('ru-RU')}`;
    
    return exportText;
}

function getDifficultyText(difficulty) {
    const difficulties = {
        'easy': 'Легкая',
        'medium': 'Средняя', 
        'hard': 'Сложная'
    };
    return difficulties[difficulty] || difficulty;
}

// Экспорт результатов в файл
function exportResults() {
    const exportText = prepareExportText();
    
    // Создаем Blob объект для текста
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    
    // Создаем временную ссылку для скачивания
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    
    // Генерируем имя файла с именем пользователя и датой
    const userName = researchData.userName || 'Аноним';
    const date = new Date().toISOString().split('T')[0];
    link.download = `Результат_теста_${userName}_${date}.txt`;
    
    // Кликаем по ссылке для запуска скачивания
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Показать результаты исследования
function showResearchResults() {
    const analysis = analyzeResearchData();
    
    if (!analysis) {
        alert('Нет данных для анализа');
        return;
    }
    
    const report = `
Участник: ${analysis.userName || analysis.participantId}
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
    
    console.log('Результаты исследования:', report);
    alert('Результаты сохранены! Посмотри консоль браузера (F12) для подробного отчета.');
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

// Показ игровых результатов
function showResults() {
    gameScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    finalScore.textContent = score;
    totalQuestionsDisplay.textContent = totalQuestions;
    
    // Показываем персональный результат с именем
    const userName = researchData.userName || 'Участник';
    personalResult.innerHTML = `
        <p><strong>${userName}</strong>, вы успешно завершили тест!</p>
        <p>Ваш результат сохранен для анализа.</p>
    `;
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
        userName: researchData.userName, // Сохраняем имя для повторных попыток
        startTime: new Date(),
        results: [],
        group: getRandomGroup()
    };
    
    resultsScreen.classList.add('hidden');
    startScreen.classList.remove('hidden'); // Возвращаем к форме ввода имени
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

// Назначаем обработчики событий
userForm.addEventListener('submit', handleFormSubmit);
answerButtons[0].addEventListener('click', () => checkAnswer(false));
answerButtons[1].addEventListener('click', () => checkAnswer(true));
nextButton.addEventListener('click', nextEmail);
restartButton.addEventListener('click', restartGame);
exportButton.addEventListener('click', exportResults);
researchButton.addEventListener('click', showResearchResults);

// Инициализация
function init() {
    loadSavedData();
    
    // Показываем стартовый экран с формой
    startScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');
}

// Запускаем инициализацию при загрузке страницы
document.addEventListener('DOMContentLoaded', init);

// Для отладки
console.log('Тренажер загружен. Ожидание ввода имени участника.');
