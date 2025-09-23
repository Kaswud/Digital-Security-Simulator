// База данных писем для тренажера
const emails = [
    {
        sender: "Сбербанк России",
        subject: "Срочно! Ваш счет заблокирован",
        content: `
            <p>Уважаемый клиент!</p>
            <p>В вашем аккаунте зафиксирована подозрительная активность. Для разблокировки счета перейдите по ссылке:</p>
            <p><a href="#" onclick="return false">https://sberbank-security.ru/verify</a></p>
            <p>Если не подтвердите данные в течение 24 часов, счет будет заблокирован.</p>
        `,
        isPhishing: true,
        explanation: "ФИШИНГ! Настоящий Сбербанк использует домен sberbank.ru, а не sberbank-security.ru. Также создается искусственная срочность."
    },
    {
        sender: "Google <no-reply@google.com>",
        subject: "Попытка входа в ваш аккаунт",
        content: `
            <p>Здравствуйте!</p>
            <p>Зафиксирована попытка входа в ваш аккаунт Google с нового устройства.</p>
            <p>Если это были вы, никаких действий не требуется.</p>
            <p>Если это были не вы, <a href="#" onclick="return false">проверьте активность</a> и смените пароль.</p>
        `,
        isPhishing: false,
        explanation: "НАСТОЯЩЕЕ! Письмо от официального адреса Google, нет требований срочных действий, предложение проверить активность - стандартная практика."
    },
    {
        sender: "Альфа-Банк",
        subject: "Вы выиграли 100 000 рублей!",
        content: `
            <p>Поздравляем! Вы стали победителем акции!</p>
            <p>Для получения приза переведите 500 рублей на счет для подтверждения личности:</p>
            <p>Номер счета: 1234 5678 9012 3456</p>
            <p>Алексей Петров</p>
        `,
        isPhishing: true,
        explanation: "ФИШИНГ! Настоящий банк никогда не просит переводить деньги для получения выигрыша. Это классическая мошенническая схема."
    }
];

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

// Функция сброса стилей кнопок к исходному состоянию
function resetButtons() {
    answerButtons.forEach(btn => {
        // Удаляем ВСЕ классы, которые добавлялись при взаимодействии
        btn.classList.remove('disabled', 'user-choice', 'correct', 'incorrect', 'correct-answer');

        // Восстанавливаем исходные классы по data-атрибутам
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

    // Сбрасываем кнопки к исходному состоянию
    resetButtons();

    feedback.classList.add('hidden');
}

// Проверка ответа
function checkAnswer(userAnswer) {
    const email = emails[currentEmailIndex];
    const isCorrect = (userAnswer === email.isPhishing);

    totalQuestions++;

    // Подсвечиваем кнопки
    answerButtons.forEach(btn => {
        btn.disabled = true;
        btn.classList.add('disabled');

        // Определяем, какой это тип кнопки
        const isRealButton = btn.getAttribute('data-answer') === 'real';
        const isUserChoice = (isRealButton && userAnswer === false) || (!isRealButton && userAnswer === true);

        // Помечаем выбор пользователя
        if (isUserChoice) {
            btn.classList.add('user-choice');
            if (isCorrect) {
                btn.classList.add('correct');
            } else {
                btn.classList.add('incorrect');
            }
        }

        // Помечаем правильный ответ для этого письма
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

// Следующее письмо
function nextEmail() {
    currentEmailIndex++;

    if (currentEmailIndex < emails.length) {
        loadEmail(currentEmailIndex);
    } else {
        showResults();
    }
}

// Показ результатов
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

    resultsScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    loadEmail(currentEmailIndex);
}

// Назначаем обработчики событий
answerButtons[0].addEventListener('click', () => checkAnswer(false)); // "Настоящее" = false
answerButtons[1].addEventListener('click', () => checkAnswer(true));  // "Фишинг" = true

nextButton.addEventListener('click', nextEmail);
restartButton.addEventListener('click', restartGame);

// Начальная загрузка
loadEmail(currentEmailIndex);