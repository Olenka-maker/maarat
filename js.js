// Мінімальні коментарі українською

const startBtn = document.getElementById("start-btn");
const quizScreen = document.getElementById("quiz-screen");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const timerEl = document.getElementById("timer");
const resultScreen = document.getElementById("result-screen");
const statsEl = document.getElementById("stats");
const restartBtn = document.getElementById("restart-btn");
const correctCountEl = document.getElementById("correct");
const difficultySelect = document.getElementById("difficulty-select");

let timer;
let timeLeft = 60;
let currentQuestion = null;
let correctAnswers = 0;
let totalQuestions = 0;
let difficulty = "medium";

startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", restartQuiz);
difficultySelect.addEventListener("change", () => difficulty = difficultySelect.value);

// Початок опитування
function startQuiz() {
  document.getElementById("start-screen").classList.add("hidden");
  quizScreen.classList.remove("hidden");
  correctAnswers = 0;
  totalQuestions = 0;
  correctCountEl.textContent = correctAnswers;
  startTimer();
  loadQuestion();
}

// Таймер
function startTimer() {
  clearInterval(timer);
  timeLeft = 60;
  timerEl.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      showResult();
    }
  }, 1000);
}

// Завантажити питання
function loadQuestion() {
  currentQuestion = generateQuestion();
  questionEl.textContent = `${currentQuestion.num1} ${currentQuestion.operation} ${currentQuestion.num2} = ?`;

  const correctAnswer = currentQuestion.correctAnswer;
  const answers = shuffleArray([correctAnswer, ...generateRandomAnswers(correctAnswer)]);

  answersEl.innerHTML = "";
  answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.classList.add("answer-btn");
    btn.textContent = answer;
    btn.addEventListener("click", () => handleAnswerClick(answer, btn));
    answersEl.appendChild(btn);
  });
}

// Обробка кліка по відповіді
function handleAnswerClick(answer, btn) {
  totalQuestions++;
  const correctAnswer = currentQuestion.correctAnswer;

  // Блокування кнопок поки перевіряємо
  Array.from(answersEl.children).forEach(b => b.disabled = true);

  if (Number(answer) === Number(correctAnswer)) {
    correctAnswers++;
    btn.classList.add("answer-correct");
  } else {
    btn.classList.add("answer-wrong");
    // показати правильну відповідь
    Array.from(answersEl.children).forEach(b => {
      if (Number(b.textContent) === Number(correctAnswer)) b.classList.add("answer-correct");
    });
  }

  correctCountEl.textContent = correctAnswers;

  // Через 700ms завантажуємо наступне питання або результат
  setTimeout(() => {
    if (timeLeft <= 0) {
      showResult();
    } else {
      loadQuestion();
    }
  }, 700);
}

// Показ результату
function showResult() {
  clearInterval(timer);
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  statsEl.textContent = `Правильних відповідей: ${correctAnswers} з ${totalQuestions}`;
}

// Рестарт
function restartQuiz() {
  resultScreen.classList.add("hidden");
  document.getElementById("start-screen").classList.remove("hidden");
}

// Генерація питання
function generateQuestion() {
  const num1 = Math.floor(Math.random() * getRange()) + 1;
  const num2 = Math.floor(Math.random() * getRange()) + 1;
  const operation = getRandomOperation();
  const correctAnswer = calculateAnswer(num1, num2, operation);
  return { num1, num2, operation, correctAnswer };
}

function getRange() {
  if (difficulty === 'easy') return 5;
  if (difficulty === 'hard') return 20;
  return 10;
}

function getRandomOperation() {
  const operations = ['+','-','*','/'];
  return operations[Math.floor(Math.random() * operations.length)];
}

function calculateAnswer(num1, num2, operation) {
  switch (operation) {
    case '+': return num1 + num2;
    case '-': return num1 - num2;
    case '*': return num1 * num2;
    case '/':
      // Округляємо до 2 знаків після коми — щоб виглядало акуратно
      return Math.round((num1 / num2) * 100) / 100;
    default: return 0;
  }
}

function generateRandomAnswers(correctAnswer) {
  const randomAnswers = [];
  // Додаємо правильну відповідь в масив тільки якщо її ще немає — але тут виклик вже містить правильну відповідь окремо
  while (randomAnswers.length < 3) {
    const delta = Math.floor(Math.random() * 12) - 6; // ±6
    let candidate = Number(correctAnswer) + delta;
    if (candidate === 0) candidate = 1;
    // для дробових відповідей даємо округлення до 2 знаків
    if (!Number.isInteger(correctAnswer)) {
      candidate = Math.round(candidate * 100) / 100;
    }
    if (candidate !== correctAnswer && !randomAnswers.includes(candidate)) {
      randomAnswers.push(candidate);
    }
  }
  return randomAnswers;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
