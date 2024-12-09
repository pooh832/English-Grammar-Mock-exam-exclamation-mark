const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const options = document.querySelectorAll('.option');
const inputContainer = document.getElementById('input-container');
const answerInput = document.getElementById('answer-input');
const resultElement = document.getElementById('result');
const nextButton = document.getElementById('next-button');  // 「次へ」ボタンの参照
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

    // 現在の問題番号を表示
    const questionNumber = currentQuestionIndex + 1;  // 0から始まるインデックスを1から始まる問題番号に変換
    document.getElementById('current-question').textContent = `問題 ${questionNumber} / ${quizData.length}`;

    if (mode === 'easy') {
        // 簡単モード：ボタン表示
        inputContainer.style.display = 'none';
        optionsContainer.style.display = 'block';
        options.forEach((button, index) => {
            button.textContent = currentQuestion.options[index];
            button.onclick = () => checkAnswer(button.textContent);
            nextButton.style.display = 'block';
        });
    } else {
        // 難しいモード：記述式入力
        optionsContainer.style.display = 'none';
        inputContainer.style.display = 'block';
        answerInput.value = '';
        nextButton.style.display = 'none';
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

    nextButton.style.display = 'block';
}

function loadNextQuestion() {
    nextButton.style.display = 'none';  // 「次へ」ボタンを非表示にして、連続してクリックできないようにする
    resultElement.textContent = '';  // 結果表示をクリア

    currentQuestionIndex++;

    if (currentQuestionIndex >= quizData.length) {
        showFinalResult();  // すべての問題が終わったら結果画面を表示
    } else {
        loadQuestion();  // 次の問題を表示
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

function createAlphabet() {
    const background = document.getElementById('background');
    const alphabet = document.createElement('div');
    alphabet.classList.add('alphabet');

    // ランダムなアルファベットを生成
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
    alphabet.textContent = letter;

    // ランダムな位置に配置
    alphabet.style.left = Math.random() * 100 + 'vw';
    alphabet.style.animationDuration = Math.random() * 3 + 3 + 's'; // 3秒〜6秒のランダム速度

    background.appendChild(alphabet);

    // アニメーションが終了したら要素を削除
    setTimeout(() => {
        alphabet.remove();
    }, 5000);
}

// 定期的にアルファベットを生成する
setInterval(createAlphabet, 300);  // 0.3秒ごとに生成
