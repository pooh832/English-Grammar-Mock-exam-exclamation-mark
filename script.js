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

    // 選択肢をシャッフル
    const shuffledOptions = shuffleArray([...currentQuestion.options]);

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
    }

    nextButton.style.display = 'none';
    resultElement.textContent = '';
    nextButton.style.display = 'block';
}

// 答えをチェックする関数（ボタン形式）
function checkAnswer(selected) {
    const currentQuestion = quizData[currentQuestionIndex];
    currentQuestion.selectedOption = selected;

    evaluateAnswer(selected);
}


// 答えをチェックする関数（記述式）
function submitHardAnswer() {
    const userAnswer = answerInput.value.trim();
    const currentQuestion = quizData[currentQuestionIndex]; // 現在の問題

     // 入力が空の場合または回答が間違っている場合
     if (userAnswer === '' || userAnswer !== currentQuestion.correct) {
        resultElement.textContent = `不正解！ 正解: ${currentQuestion.correct}`;
        resultElement.style.color = 'red';
    } else {
        resultElement.textContent = '正解！';
        resultElement.style.color = 'green';
        score++; // スコアを加算
    }
    
    //次へボタンを表示
    nextButton.style.display = 'block';
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

    const currentQuestion = quizData[currentQuestionIndex];

    if (mode === 'hard') {
        const userAnswer = answerInput.value.trim();

        // ユーザーが回答を入力しなかった場合、不正解とみなす
        if (userAnswer === '') {
            resultElement.textContent = `不正解！ 正解: ${currentQuestion.correct}`;
            resultElement.style.color = 'red';
        } else {
            evaluateAnswer(userAnswer);  // ユーザーの解答を評価
        }
    } else if (mode === 'easy') {
        // 選択肢形式の場合、選択されていない場合の処理
        if (!currentQuestion.selectedOption) {
            resultElement.textContent = `不正解！ 正解: ${currentQuestion.correct}`;
            resultElement.style.color = 'red';
        }
    }

    // 次の問題に進む
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
  
     // すでに再挑戦ボタンが存在するか確認
     if (!finalResultElement.querySelector('button')) {
        // 「再挑戦」ボタンを作成
        const retryButton = document.createElement('button');
        retryButton.textContent = 'もう一度挑戦する';
        retryButton.onclick = startNewQuiz;  // ボタンをクリックしたら最初からやり直す
        finalResultElement.appendChild(retryButton);
    }
}

function startNewQuiz() {
    // スコアと現在の問題番号をリセット
    score = 0;
    currentQuestionIndex = 0;

    // UIの初期化
    questionElement.style.display = 'block';
    optionsContainer.style.display = 'none';
    inputContainer.style.display = 'none';
    resultElement.textContent = '';
    resultElement.style.color = '';
    finalResultElement.style.display = 'none';
    nextButton.style.display = 'none';  // 「次へ」ボタンを非表示
    quizContent.style.display = 'none';
    levelSelection.style.display = 'block';  // レベル選択画面を表示

    // クイズデータを再読み込み
    loadQuizData();
}

// JSONデータを読み込む関数
async function loadQuizData() {
    try {
        const response = await fetch('quizData.json');
        const data = await response.json();

        // シャッフルして最初の10問を選択
        quizData = shuffleArray(data).slice(0, 10);

        // 最初の問題をロード
        loadQuestion();
    } catch (error) {
        console.error('クイズデータの読み込みに失敗しました:', error);
    }
}

// 質問を表示する関数
function loadQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];

    // 問題文の設定
    questionElement.textContent = currentQuestion.question;

    // 問題番号の表示
    const questionNumber = currentQuestionIndex + 1;
    document.getElementById('current-question').textContent = `問題 ${questionNumber} / ${quizData.length}`;

    // 簡単モードと難しいモードでUIを切り替え
    if (mode === 'easy') {
        // 簡単モード：選択肢を表示
        inputContainer.style.display = 'none';
        optionsContainer.style.display = 'block';

        // 選択肢の設定
        options.forEach((button, index) => {
            button.textContent = currentQuestion.options[index];
            button.onclick = () => checkAnswer(button.textContent);
        });
    } else {
        // 難しいモード：入力欄を表示
        optionsContainer.style.display = 'none';
        inputContainer.style.display = 'block';
        answerInput.value = '';
    }

    // 「次へ」ボタンを非表示
    nextButton.style.display = 'none';
    resultElement.style.display = '';
    resultElement.textContent = '';
}

// 答えを評価する関数
function evaluateAnswer(selected) {
    const currentQuestion = quizData[currentQuestionIndex];

    if (selected === currentQuestion.correct) {
        resultElement.textContent = "正解！";
        resultElement.style.color = "green";
        score++;
    } else {
        resultElement.textContent = `不正解！ 正解: ${currentQuestion.correct}`;
        resultElement.style.color = "red";
    }

    // 「次へ」ボタンを表示
    nextButton.style.display = 'block';
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

// 定期的にアルファベットを生成
setInterval(createAlphabet, 300);  // 0.3秒ごとに生成
