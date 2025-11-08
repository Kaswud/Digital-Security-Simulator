// База данных писем для тренажера (10 писем)
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
        sender: "Apple <support@apple.com>",
        subject: "Подозрительная активность в iCloud",
        content: `
            <p>Уважаемый пользователь,</p>
            <p>Мы обнаружили необычную активность в вашем аккаунте iCloud. Для безопасности ваших данных требуется немедленная проверка.</p>
            <p>Пожалуйста, войдите в свой аккаунт через официальное приложение или сайт apple.com для проверки.</p>
            <p>Если вы не совершали этих действий, немедленно смените пароль.</p>
        `,
        isPhishing: false,
        explanation: "НАСТОЯЩЕЕ! Письмо от официального домена apple.com, нет прямых ссылок, рекомендация использовать официальные каналы.",
        difficulty: "medium"
    },
    {
        id: 5,
        sender: "ВКонтакте <noreply@vk-mail.ru>",
        subject: "Ваш аккаунт будет удален",
        content: `
            <p>Дорогой пользователь!</p>
            <p>Из-за нарушения правил сообщества ваш аккаунт будет удален через 48 часов.</p>
            <p>Чтобы остановить удаление, перейдите по ссылке и подтвердите данные:</p>
            <p><a href="#" onclick="return false">https://vk-security-form.com/restore</a></p>
            <p>Не отвечайте на это письмо.</p>
        `,
        isPhishing: true,
        explanation: "ФИШИНГ! Настоящий ВКонтакте использует домен vk.com, а не vk-mail.ru. Создается искусственная угроза удаления аккаунта.",
        difficulty: "hard"
    },
    {
        id: 6,
        sender: "YouTube <no-reply@youtube.com>",
        subject: "На ваше видео поступила жалоба",
        content: `
            <p>Здравствуйте!</p>
            <p>На ваше видео "Как научиться программировать" поступила жалоба о нарушении правил сообщества.</p>
            <p>Вы можете просмотреть детали жалобы в <a href="#" onclick="return false">Панели управления YouTube</a>.</p>
            <p>Если вы считаете, что это ошибка, подайте апелляцию в течение 7 дней.</p>
        `,
        isPhishing: false,
        explanation: "НАСТОЯЩЕЕ! Письмо от официального домена youtube.com, спокойный тон, реалистичный сценарий, нет срочности.",
        difficulty: "easy"
    },
    {
        id: 7,
        sender: "PayPal Security <security@paypal-verification.net>",
        subject: "Требуется верификация аккаунта",
        content: `
            <p>Уважаемый клиент PayPal,</p>
            <p>В рамках усиления мер безопасности требуется повторная верификация вашего аккаунта.</p>
            <p>Пожалуйста, перейдите по ссылке и обновите данные:</p>
            <p><a href="#" onclick="return false">https://paypal-verification.net/confirm</a></p>
            <p>В случае невыполнения требований в течение 12 часов, аккаунт будет ограничен.</p>
        `,
        isPhishing: true,
        explanation: "ФИШИНГ! Настоящий PayPal использует домен paypal.com. Мошеннический домен paypal-verification.net и искусственная срочность.",
        difficulty: "medium"
    },
    {
        id: 8,
        sender: "Instagram <security@mail.instagram.com>",
        subject: "Новый вход в ваш аккаунт",
        content: `
            <p>Привет!</p>
            <p>Мы заметили вход в ваш аккаунт Instagram с нового устройства в Москве, Россия.</p>
            <p>Устройство: iPhone 13 Pro</p>
            <p>Если это были вы, можете проигнорировать это сообщение.</p>
            <p>Если нет, <a href="#" onclick="return false">защитите аккаунт</a>.</p>
        `,
        isPhishing: false,
        explanation: "НАСТОЯЩЕЕ! Письмо содержит конкретные детали входа, нет требований срочных действий, домен mail.instagram.com - официальный.",
        difficulty: "medium"
    },
    {
        id: 9,
        sender: "Microsoft Account Team <account@microsoft-support.com>",
        subject: "СРОЧНО: Подозрительный вход обнаружен",
        content: `
            <p>СРОЧНОЕ УВЕДОМЛЕНИЕ!</p>
            <p>Обнаружен подозрительный вход в ваш аккаунт Microsoft с IP-адреса в Китае.</p>
            <p>НЕМЕДЛЕННО перейдите по ссылке для проверки:</p>
            <p><a href="#" onclick="return false">http://microsoft-support.com/secure-now</a></p>
            <p>Игнорирование приведет к блокировке аккаунта через 1 час!</p>
        `,
        isPhishing: true,
        explanation: "ФИШИНГ! Настоящий Microsoft использует домен microsoft.com. Поддельный домен, избыточная паника, ультиматумы с блокировкой.",
        difficulty: "hard"
    },
    {
        id: 10,
        sender: "Netflix <info@netflix.com>",
        subject: "Обновление способа оплаты",
        content: `
            <p>Уважаемый клиент Netflix,</p>
            <p>Не удалось обработать ваш последний платеж. Чтобы избежать прерывания обслуживания, обновите данные платежного метода.</p>
            <p>Вы можете обновить информацию в <a href="#" onclick="return false">настройках аккаунта</a>.</p>
            <p>С уважением, команда Netflix</p>
        `,
        isPhishing: false,
        explanation: "НАСТОЯЩЕЕ! Письмо от официального домена netflix.com, спокойный профессиональный тон, реалистичная ситуация с оплатой.",
        difficulty: "easy"
    }
];

// Система сбора данных
let researchData = {
    participantId: '',
    userName: '',
    startTime: null,
    endTime: null,
    results: [],
    group: '',
    analysis: null,
    currentEmailIndex: 0,
    score: 0,
    totalQuestions: 0,
    testStarted: false,
    testCompleted: false,
    currentState: 'start'
};

let emailStartTimes = [];

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
    
    emailStartTimes[index] = new Date();
    
    researchData.currentEmailIndex = index;
    researchData.currentState = 'answering';
    saveResearchData();
    
    console.log(`Загружено письмо ${index + 1}: ${email.subject}, состояние: ${researchData.currentState}`);
}

// Сохранение данных исследования
function saveResearchData() {
    localStorage.setItem('researchData', JSON.stringify(researchData));
}

// Загрузка сохраненных данных
function loadSavedData() {
    const saved = localStorage.getItem('researchData');
    if (saved) {
        try {
            const savedData = JSON.parse(saved);
            
            // Восстанавливаем только основные данные, сбрасываем состояние теста
            researchData.participantId = savedData.participantId || generateId();
            researchData.userName = savedData.userName || '';
            researchData.startTime = savedData.startTime ? new Date(savedData.startTime) : null;
            researchData.endTime = savedData.endTime ? new Date(savedData.endTime) : null;
            researchData.results = savedData.results || [];
            researchData.group = savedData.group || getRandomGroup();
            researchData.analysis = savedData.analysis || null;
            
            // Сбрасываем состояние теста, если он не был завершен
            if (savedData.testCompleted) {
                researchData.testStarted = false;
                researchData.testCompleted = true;
                researchData.currentEmailIndex = 0;
                researchData.score = savedData.score || 0;
                researchData.totalQuestions = savedData.totalQuestions || 0;
                researchData.currentState = 'completed';
            } else {
                researchData.testStarted = false; // Всегда сбрасываем начатое состояние
                researchData.testCompleted = false;
                researchData.currentEmailIndex = 0;
                researchData.score = 0;
                researchData.totalQuestions = 0;
                researchData.currentState = 'start';
            }
            
            if (researchData.userName) {
                userNameInput.value = researchData.userName;
            }
            
            console.log('Данные загружены:', {
                testCompleted: researchData.testCompleted,
                resultsCount: researchData.results.length,
                score: researchData.score,
                totalQuestions: researchData.totalQuestions
            });
            
            return true;
        } catch (e) {
            console.error('Ошибка загрузки данных:', e);
            return false;
        }
    }
    return false;
}

// Обновление счетчиков на основе результатов
function updateCounters() {
    researchData.totalQuestions = researchData.results.length;
    researchData.score = researchData.results.filter(r => r.isCorrect).length;
    
    console.log('Обновлены счетчики:', {
        totalQuestions: researchData.totalQuestions,
        score: researchData.score
    });
}

// Запись результата в базу данных
function recordResult(emailIndex, userAnswer, isCorrect, timeSpent) {
    const email = emails[emailIndex];
    
    // Удаляем предыдущий результат для этого письма, если он есть
    researchData.results = researchData.results.filter(result => result.emailId !== email.id);
    
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
    
    // Обновляем счетчики после добавления нового результата
    updateCounters();
    
    saveResearchData();
}

// Проверка ответа
function checkAnswer(userAnswer) {
    const answerTime = new Date();
    const emailIndex = researchData.currentEmailIndex;
    
    const startTime = emailStartTimes[emailIndex];
    let timeSpent = 0;
    
    if (startTime) {
        timeSpent = answerTime - startTime;
    }
    
    const email = emails[emailIndex];
    const isCorrect = (userAnswer === email.isPhishing);
    
    recordResult(emailIndex, userAnswer, isCorrect, timeSpent);
    
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
    pointsDisplay.textContent = researchData.score;
    
    researchData.currentState = 'showing_feedback';
    saveResearchData();
    
    console.log('Ответ записан:', {
        email: email.subject,
        isCorrect: isCorrect,
        currentScore: researchData.score,
        totalQuestions: researchData.totalQuestions
    });
}

// Анализ результатов
function analyzeResearchData() {
    const results = researchData.results;
    const total = results.length;
    
    if (total === 0) return null;
    
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const successRate = Math.round((correctAnswers / total) * 100);
    
    // Находим все неправильно отвеченные письма
    const wrongAnswers = results.filter(r => !r.isCorrect);
    
    let hardestEmail = null;
    
    if (wrongAnswers.length > 0) {
        const randomWrongAnswer = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
        hardestEmail = {
            subject: randomWrongAnswer.emailSubject
        };
    } else {
        const hardEmails = emails.filter(email => email.difficulty === "hard");
        if (hardEmails.length > 0) {
            const randomHardEmail = hardEmails[Math.floor(Math.random() * hardEmails.length)];
            hardestEmail = {
                subject: randomHardEmail.subject
            };
        } else {
            const randomEmail = emails[Math.floor(Math.random() * emails.length)];
            hardestEmail = {
                subject: randomEmail.subject
            };
        }
    }
    
    const validTimes = results.filter(r => r.timeSpent > 0).map(r => r.timeSpent);
    const averageTime = validTimes.length > 0 ? Math.round(validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length) : 0;
    
    // Время прохождения
    const endTime = researchData.endTime || new Date();
    const startTime = researchData.startTime || new Date();
    const completionTime = endTime - startTime;
    const minutes = Math.max(0, Math.floor(completionTime / 60000));
    const seconds = Math.max(0, Math.floor((completionTime % 60000) / 1000));
    
    return {
        participantId: researchData.participantId,
        userName: researchData.userName,
        group: researchData.group,
        totalQuestions: total,
        correctAnswers: correctAnswers,
        successRate: successRate,
        averageTime: averageTime,
        averageTimeSeconds: (averageTime / 1000).toFixed(1),
        hardestEmail: hardestEmail,
        completionTime: completionTime,
        minutes: minutes,
        seconds: seconds
    };
}

// Показать детальные результаты
function showDetailedResults() {
    const analysis = analyzeResearchData();
    const userName = researchData.userName || 'Участник';
    
    personalResult.innerHTML = `
        <div class="result-card">
            <h3>📊 Детальные результаты</h3>
            <p><strong>👤 Имя участника:</strong> ${userName}</p>
            <p><strong>🆔 ID тестирования:</strong> ${analysis.participantId}</p>
            <p><strong>📅 Дата прохождения:</strong> ${new Date().toLocaleDateString('ru-RU')}</p>
            <p><strong>⏱️ Время прохождения:</strong> ${analysis.minutes} мин ${analysis.seconds} сек</p>
            
            <p><strong>🎯 Правильных ответов:</strong> ${analysis.correctAnswers} из ${analysis.totalQuestions}</p>
            <p><strong>📈 Процент правильных:</strong> ${analysis.successRate}%</p>
            <p><strong>⚡ Среднее время ответа:</strong> ${analysis.averageTimeSeconds} сек</p>
            <p><strong>🔍 Самое сложное письмо:</strong> "${analysis.hardestEmail.subject}"</p>
            <p><strong>🏆 Уровень подготовки:</strong> ${getSkillLevel(analysis.successRate)}</p>
        </div>
    `;
    
    console.log('Показаны результаты:', {
        correctAnswers: analysis.correctAnswers,
        totalQuestions: analysis.totalQuestions,
        time: `${analysis.minutes} мин ${analysis.seconds} сек`
    });
}

// Определение уровня навыков
function getSkillLevel(percentage) {
    if (percentage >= 90) return 'Эксперт 👑';
    if (percentage >= 75) return 'Продвинутый 🚀';
    if (percentage >= 60) return 'Средний 👍';
    if (percentage >= 40) return 'Начинающий 📚';
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
⏱️ Время прохождения: ${analysis.minutes} мин ${analysis.seconds} сек

🎯 Результат: ${analysis.correctAnswers} из ${analysis.totalQuestions}
📈 Процент правильных: ${analysis.successRate}%
⚡ Среднее время ответа: ${analysis.averageTimeSeconds} сек
🔍 Самое сложное письмо: "${analysis.hardestEmail.subject}"
🏆 Уровень: ${getSkillLevel(analysis.successRate)}

💡 Рекомендация: ${getRecommendation(analysis.successRate)}`;

    try {
        await navigator.clipboard.writeText(text);
        
        copyMessage.classList.remove('hidden');
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
Время прохождения: ${analysis.minutes} мин ${analysis.seconds} сек

ОБЩИЕ РЕЗУЛЬТАТЫ:
-----------------
Правильных ответов: ${analysis.correctAnswers} из ${analysis.totalQuestions}
Процент правильных: ${analysis.successRate}%
Среднее время ответа: ${analysis.averageTimeSeconds} сек
Уровень подготовки: ${getSkillLevel(analysis.successRate)}

ДЕТАЛЬНАЯ СТАТИСТИКА:
--------------------
Самое сложное письмо: "${analysis.hardestEmail.subject}"

РЕКОМЕНДАЦИИ:
-------------
${getRecommendation(analysis.successRate)}

СТАТИСТИКА ПО ПИСЬМАМ:
----------------------
${emails.map((email, index) => {
    const userResult = researchData.results.find(r => r.emailId === email.id);
    return `${index + 1}. "${email.subject}": ${userResult ? (userResult.isCorrect ? 'Правильно ✓' : 'Неправильно ✗') : 'Не отвечено'}`;
}).join('\n')}`;

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
        return 'Отличный результат! Вы отлично разбираетесь в кибербезопасности и можете обучать других.';
    } else if (percentage >= 75) {
        return 'Очень хороший результат! Вы хорошо определяете фишинг, но продолжайте быть внимательным к новым схемам мошенников.';
    } else if (percentage >= 60) {
        return 'Хороший результат! Обращайте больше внимания на домены отправителей и не поддавайтесь на искусственную срочность.';
    } else if (percentage >= 40) {
        return 'Неплохо, но есть куда расти! Изучите основные признаки фишинга: подозрительные ссылки, грамматические ошибки, требования срочных действий.';
    } else {
        return 'Рекомендуем пройти обучение по кибербезопасности. Обращайте внимание на отправителя, ссылки и тон письма.';
    }
}

// Следующее письмо
function nextEmail() {
    researchData.currentEmailIndex++;
    
    if (researchData.currentEmailIndex < emails.length) {
        loadEmail(researchData.currentEmailIndex);
    } else {
        showResults();
    }
}

// Показ финальных результатов
function showResults() {
    gameScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    finalScore.textContent = researchData.score;
    totalQuestionsDisplay.textContent = researchData.totalQuestions;
    
    researchData.endTime = new Date();
    researchData.testStarted = false;
    researchData.testCompleted = true;
    researchData.currentState = 'completed';
    saveResearchData();
    
    showDetailedResults();
}

// Перезапуск игры
function restartGame() {
    // Полностью сбрасываем все данные
    researchData = {
        participantId: generateId(),
        userName: researchData.userName,
        startTime: new Date(),
        endTime: null,
        results: [],
        group: getRandomGroup(),
        analysis: null,
        currentEmailIndex: 0,
        score: 0,
        totalQuestions: 0,
        testStarted: false,
        testCompleted: false,
        currentState: 'start'
    };
    
    emailStartTimes = [];
    saveResearchData();
    
    resultsScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
}

// Обработчик отправки формы
function handleFormSubmit(event) {
    event.preventDefault();
    
    const userName = userNameInput.value.trim();
    if (userName) {
        // Полностью сбрасываем данные для нового теста
        researchData = {
            participantId: generateId(),
            userName: userName,
            startTime: new Date(),
            endTime: null,
            results: [],
            group: getRandomGroup(),
            analysis: null,
            currentEmailIndex: 0,
            score: 0,
            totalQuestions: 0,
            testStarted: true,
            testCompleted: false,
            currentState: 'answering'
        };
        
        saveResearchData();
        emailStartTimes = [];
        
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        loadEmail(researchData.currentEmailIndex);
    } else {
        alert('Пожалуйста, введите ваше имя.');
    }
}

// Восстановление состояния при загрузке
function restoreState() {
    const hasSavedData = loadSavedData();
    
    console.log('Восстановление состояния:', {
        hasSavedData,
        testCompleted: researchData.testCompleted,
        resultsCount: researchData.results.length
    });
    
    if (hasSavedData && researchData.testCompleted) {
        // Показываем результаты завершенного теста
        console.log('Показываем результаты завершенного теста');
        startScreen.classList.add('hidden');
        gameScreen.classList.add('hidden');
        resultsScreen.classList.remove('hidden');
        finalScore.textContent = researchData.score;
        totalQuestionsDisplay.textContent = researchData.totalQuestions;
        showDetailedResults();
    } else {
        // Всегда начинаем с начала
        console.log('Начинаем новый тест');
        startScreen.classList.remove('hidden');
        gameScreen.classList.add('hidden');
        resultsScreen.classList.add('hidden');
        
        // Очищаем старые данные если они есть
        if (hasSavedData && !researchData.testCompleted) {
            researchData = {
                participantId: generateId(),
                userName: researchData.userName,
                startTime: null,
                endTime: null,
                results: [],
                group: getRandomGroup(),
                analysis: null,
                currentEmailIndex: 0,
                score: 0,
                totalQuestions: 0,
                testStarted: false,
                testCompleted: false,
                currentState: 'start'
            };
            saveResearchData();
        }
    }
}

// Назначение обработчиков для кнопок результатов
function setupResultButtons() {
    if (restartButton) {
        restartButton.addEventListener('click', restartGame);
    }
    
    if (copyResultsBtn) {
        copyResultsBtn.addEventListener('click', copyResultsToClipboard);
    }
    
    if (saveResultsBtn) {
        saveResultsBtn.addEventListener('click', saveResultsToFile);
    }
}

// Инициализация
function init() {
    userForm.addEventListener('submit', handleFormSubmit);
    answerButtons[0].addEventListener('click', () => checkAnswer(false));
    answerButtons[1].addEventListener('click', () => checkAnswer(true));
    nextButton.addEventListener('click', nextEmail);
    
    setupResultButtons();
    
    restoreState();
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', init);
