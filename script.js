const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const options = document.querySelectorAll('.option');
const inputContainer = document.getElementById('input-container');
const answerInput = document.getElementById('answer-input');
const resultElement = document.getElementById('result');
const finalResultElement = document.getElementById('final-result');
const scoreElement = document.getElementById('score');
const quizContent = document.getElementById('quiz-content');
const levelSelection = document.getElementById('level-selection');

let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let mode = 'easy';  // デフォルトは簡単モード

// レベル選択時のモード設定
function setMode(selectedMode) {
    mode = selectedMode;
    levelSelection.style.display = 'none';
    quizContent.style.display = 'block';
    loadQuizData();
}

// JSONデータを読み込む関数
async function loadQuizData() {
    try {
        const response = await fetch('quizData.json');
        const data = await response.json();
        quizData = shuffleArray(data).slice(0, 10);
        loadQuestion();
    } catch (error) {
        console.error('クイズデータの読み込みに失敗しました:', error);
    }
}

// 質問を表示する関数
function loadQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;

    if (mode === 'easy') {
        // 簡単モード：ボタン表示
        inputContainer.style.display = 'none';
        optionsContainer.style.display = 'block';
        options.forEach((button, index) => {
            button.textContent = currentQuestion.options[index];
            button.onclick = () => checkAnswer(button.textContent);
        });
    } else {
        // 難しいモード：記述式入力
        optionsContainer.style.display = 'none';
        inputContainer.style.display = 'block';
        answerInput.value = '';
    }
}

// 答えをチェックする関数（ボタン形式）
function checkAnswer(selected) {
    evaluateAnswer(selected);
}

// 答えをチェックする関数（記述式）
function submitHardAnswer() {
    const userAnswer = answerInput.value.trim();
    evaluateAnswer(userAnswer);
}

// 回答の評価
function evaluateAnswer(selected) {
    const currentQuestion = quizData[currentQuestionIndex];
    if (selected === currentQuestion.correct) {
        resultElement.textContent = "正解！";
        resultElement.style.color = "green";
        score++;
    } else {
        resultElement.textContent = "不正解！ 正解: " + currentQuestion.correct;
        resultElement.style.color = "red";
    }

    currentQuestionIndex++;
    if (currentQuestionIndex >= quizData.length) {
        setTimeout(showFinalResult, 2000);
    } else {
        setTimeout(() => {
            resultElement.textContent = "";
            loadQuestion();
        }, 2000);
    }
}

// 結果発表画面を表示する関数
function showFinalResult() {
    questionElement.style.display = 'none';
    optionsContainer.style.display = 'none';
    inputContainer.style.display = 'none';
    resultElement.style.display = 'none';
    finalResultElement.style.display = 'block';
    scoreElement.textContent = `あなたのスコアは ${score} / 10 です！`;
}

// 配列をシャッフルする関数（Fisher-Yatesアルゴリズム）
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}