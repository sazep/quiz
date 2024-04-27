let div_qw = document.querySelector('.quiz')
let div_ans = document.querySelector('.ans')
let ans_arr = div_ans.querySelectorAll('div')
let allowAnswerSelection = true
let questionsLog = []


function randint(min,max){// генерирует от до
    let n = Math.random()
    n = n*(max-min) + min
    n = Math.floor(n)
    return n
}

function shuffle(arr){
    for (let i = 0; i < arr.length; i++){
        let j = randint(0,arr.length)
        let a = arr[i]
        arr[i] = arr[j]
        arr[j] = a
    }
}

function choose(arr){
    let i = randint(0,arr.length)
    return arr[i]
}

class Question {
    constructor(count_qw) {
        this.qw = NaN
        this.correctAnswer = NaN
        this.ans = []
        this.symbol = ['+', '-', '*', '/']
        this.correct_count = 0
        this.wrong_count = 0
        this.totalQuestions  = count_qw
        this.createdQuestions = 0
        this.timer = null
        this.timeSpent = 0
    }
    display() {
        if (this.createdQuestions < this.totalQuestions) {
            this.newqw();
            this.createdQuestions++;
            div_qw.innerHTML = this.qw;
            shuffle(this.ans);
            for (let i = 0; i < ans_arr.length; i++) {
                ans_arr[i].innerHTML = this.ans[i];
            }
            if (this.timer) {
                this.timer.stop();
            }
            this.timer = new Timer(21, () => {
                if (allowAnswerSelection) {
                    allowAnswerSelection = false;
                    ans_arr.forEach(ans => ans.classList.add('time-up'));
                    setTimeout(() => {
                        ans_arr.forEach(ans => ans.classList.remove('time-up'));
                        qws.wrong_count++;
                        qws.display();
                        allowAnswerSelection = true;
                    }, 2000);
                }
            });
            this.timer.start();
            for (let ans of ans_arr) {
                ans.addEventListener('click', () => {
                    if (allowAnswerSelection) {
                        allowAnswerSelection = false;
                        console.log(this.timer.seconds)
                        console.log(this.timer.maxseconds)
                        let endTime = this.timer.seconds
                        if (this.timer) {
                            this.timer.stop();
                        }
                        this.timeSpent = (this.timer.maxseconds - endTime)
                        let selectedAnswer = ans.innerHTML;
                        let questionData = {
                            question: this.qw,
                            selectedAnswer: selectedAnswer,
                            correctAnswer: this.correctAnswer,
                            allAnswers: this.ans,
                            timeSpent: this.timeSpent,
                        };
                        if (selectedAnswer == this.correctAnswer) {
                            questionData.isCorrect = true;
                            ans.classList.add('correct-answer');
                            this.correct_count++;
                        } else {
                            questionData.isCorrect = false;
                            ans.classList.add('wrong-answer');
                        }
                        questionsLog.push(questionData);
                        setTimeout(() => {
                            ans.classList.remove('correct-answer', 'wrong-answer');
                            this.display();
                            allowAnswerSelection = true;
                            console.log("Created questions:", this.createdQuestions);
                            console.log("Total questions:", this.totalQuestions);
                            if (this.createdQuestions >= this.totalQuestions) {
                                console.log("   стооооооооооой ну пожалуйста :(");
                                console.log("questionsLog:", questionsLog);
                            }
                        }, 2000);
                    }
                });
            }
        } else {
            document.querySelector('.card_qw').style.display = 'none';
            document.querySelector('.ans').style.display = 'none';
        
            let totalQuestions = this.totalQuestions;
            let errors = totalQuestions - this.correct_count;
            let percentage = Math.round((this.correct_count / totalQuestions) * 100);
            let resultText = document.getElementById('results');

            let totalElapsedTime = 0;
            questionsLog.forEach(question => {
                totalElapsedTime += question.timeSpent;
            });
            let averageTime = totalElapsedTime / this.totalQuestions;
            
            resultText.innerHTML = `
            <div class='card_qw'>
                <div>
                    <span>Вірно:</span>
                    <span>${this.correct_count}</span>
                </div>
                <div>
                    <span>Помилок:</span>
                    <span>${errors}</span>
                </div>
                <div>
                    <span>Питань:</span>
                    <span>${totalQuestions}</span>
                </div>
                <div>
                    <span>Середній час відповіді:</span>
                    <span>${averageTime.toFixed(2)} сек</span>
                </div>
                <div>
                    <span>Відсоток правильних відповідей:</span>
                    <span>${percentage}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${percentage}%;"></div>
                </div>
            </div>
            `;
            
        
            let questionsLogDisplay = document.createElement('div');
            questionsLog.forEach((questionData) => {
                let questionContainer = document.createElement('div');
                questionContainer.classList.add('card_qw');
        
                let quizDisplay = document.createElement('div')
                quizDisplay.classList.add('quiz')
                quizDisplay.textContent = `${questionData.question} Витрачений час: ${questionData.timeSpent} секунди`
                questionContainer.appendChild(quizDisplay)
        
                let ansDisplay = document.createElement('div');
                ansDisplay.classList.add('ans');
                questionData.allAnswers.forEach(answer => {
                    let answerDiv = document.createElement('div');
                    answerDiv.textContent = `${answer}`
                    if (answer == +questionData.selectedAnswer) {
                        if (questionData.isCorrect) {
                            answerDiv.classList.add('selected-correct-answer');
                        } else {
                            answerDiv.classList.add('selected-wrong-answer');
                        }
                    }
                    if (answer == questionData.correctAnswer) {
                        if (answer != questionData.selectedAnswer) {
                            answerDiv.classList.add('correct-answer');
                        }
                    }
                    ansDisplay.appendChild(answerDiv);
                });
                questionContainer.appendChild(ansDisplay);
                questionsLogDisplay.appendChild(questionContainer);
            });
        
            resultText.appendChild(questionsLogDisplay);
            document.getElementById('results').style.display = 'block';
        }
        
    }
 
    newqw(){
        let operation = choose(this.symbol)
        let n1 = randint(0,101)
        let n2 = randint(0,101) 
        if (operation == '+') {
            this.correctAnswer = n1 + n2
            } 
        if (operation == '-'){
            this.correctAnswer = n1 - n2
        }
        if (operation == '*') {
            this.correctAnswer = n1 * n2
        } 
        if (operation == '/'){
            n2 = randint(1,101)
            while(n1%n2 !=0){
                n2 = randint(1,101)
            }
            this.correctAnswer = n1 / n2
        }
        this.qw = `${n1} ${operation} ${n2}`

        this.ans = [this.correctAnswer]

        while (this.ans.length < 5) { 
            let incorrectAnswer = this.correctAnswer + randint(0,20)-randint(0,20)
            if (incorrectAnswer != this.correctAnswer && incorrectAnswer != this.ans.includes(incorrectAnswer)) {
                this.ans.push(incorrectAnswer)
            }
        }
    }
}
class Timer {
    constructor(seconds, callback) {
        this.maxseconds = seconds
        this.seconds = seconds
        this.callback = callback
        this.timerDisplay = document.getElementById('timer')
        this.intervalId = null
    }

    start() {
        this.intervalId = setInterval(() => {
            this.seconds--;
            this.updateDisplay();
            if (this.seconds <= 0) {
                this.stop();
                this.callback();
            }
        }, 1000);
        this.updateDisplay();
    }

    stop() {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    updateDisplay() {
        const minutes = Math.floor(this.seconds / 60);
        const remainingSeconds = this.seconds % 60;
        this.timerDisplay.innerHTML = `${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
    }
}

function startTimer(seconds, callback) {
    let timer = new Timer(seconds, callback);
    timer.start();
    return timer;
}
let qws = new Question(3)
qws.display()
for (let ans of ans_arr) {
    ans.addEventListener('click', function() {
        if (allowAnswerSelection) {
            allowAnswerSelection = false;
            let selectedAnswer = this.innerHTML; // Внутри функции используем this
            let questionData = {
                question: qws.qw,
                selectedAnswer: selectedAnswer,
                correctAnswer: qws.correctAnswer,
                allAnswers: qws.ans,
                //timeSpent: timeSpent
            };
            if (selectedAnswer == qws.correctAnswer) {
                questionData.isCorrect = true;
                this.classList.add('correct-answer', 'selected-correct-answer');
                qws.correct_count++;
            } else {
                questionData.isCorrect = false;
                this.classList.add('wrong-answer', 'selected-wrong-answer');
            }
            questionsLog.push(questionData);
            setTimeout(() => {
                this.classList.remove('correct-answer', 'wrong-answer');
                qws.display();
                allowAnswerSelection = true;
                console.log("Created questions:", qws.createdQuestions);
                console.log("Total questions:", qws.totalQuestions);
                if (qws.createdQuestions >= qws.totalQuestions) {
                    console.log("стооооооооооой ну пожалуйста :(");
                    console.log("questionsLog:", questionsLog);
                }
            }, 1000);
            timer.seconds = 21;
        }
    });
}
