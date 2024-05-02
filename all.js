let div_qw = document.querySelector('.quiz')
let div_ans = document.querySelector('.ans')
let ans_arr = div_ans.querySelectorAll('div')
let allowAnswerSelection = true
let display_menu = false
let qws = NaN
let selectedAnswer = true
let questionsLog = []
let resultText = NaN

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
            this.newqw()
            this.createdQuestions++
            div_qw.innerHTML = this.qw
            shuffle(this.ans)
            for (let i = 0; i < ans_arr.length; i++) {
                ans_arr[i].innerHTML = this.ans[i]
            }
            if (this.timer) {
                this.timer.stop()
            }
            this.timer = new Timer(21, () => {
                if (allowAnswerSelection) {
                    allowAnswerSelection = false
                    ans_arr.forEach(ans => ans.classList.add('time-up'))
                    setTimeout(() => {
                        ans_arr.forEach(ans => ans.classList.remove('time-up'))
                        qws.wrong_count++
                        qws.display()
                        allowAnswerSelection = true
                    }, 2000)
                }
            })
            this.timer.start()
            for (let ans of ans_arr) {
                ans.addEventListener('click', () => {
                    if (allowAnswerSelection) {
                        allowAnswerSelection = false
                        let endTime = this.timer.seconds
                        this.timeSpent = (this.timer.maxseconds - endTime)
                        let selectedAnswer = ans.innerHTML
                        let questionData = {
                            question: this.qw,
                            selectedAnswer: selectedAnswer,
                            correctAnswer: this.correctAnswer,
                            allAnswers: this.ans,
                            timeSpent: this.timeSpent,
                        }
                        if (this.timer) {
                            this.timer.stop()
                        }
                        if (selectedAnswer == this.correctAnswer) {
                            questionData.isCorrect = true
                            ans.classList.add('correct-answer')
                            this.correct_count++
                        } else {
                            questionData.isCorrect = false
                            ans.classList.add('wrong-answer')
                        }
                        questionsLog.push(questionData)
                        setTimeout(() => {
                            this.display()
                            ans.classList.remove('correct-answer','wrong-answer')
                            allowAnswerSelection = true
                        }, 1000)
                    }
                })
            }
        } else {
            document.querySelector('.card_qw').style.display = 'none'
            document.querySelector('.ans').style.display = 'none'
        
            let errors = this.totalQuestions - this.correct_count
            let percentage = Math.round((this.correct_count / this.totalQuestions) * 100)
            resultText = document.getElementById('results')
            resultText.style.display= 'block'
            console.log(resultText.style.display)

            let totalElapsedTime = 0
            questionsLog.forEach(question => {
                totalElapsedTime += question.timeSpent
            })
            let averageTime = totalElapsedTime / this.totalQuestions
            resultText.innerHTML = `
            <div class='card_qw' style="display:block">
            <h2>Ваші Результати:</h2>
            <section>
                <div class="result-item">
                    <p class="result-number">${this.correct_count}</p>
                    <p class="result-label">Вірно</p>
                </div>
                <div class="result-item">
                    <p class="result-number">${errors}</p>
                    <p class="result-label">Помилок</p>
                </div>
                <div class="result-item">
                    <p class="result-number">${averageTime.toFixed(2)}</p>
                    <p class="result-label">Середній час відповіді (сек)</p>
                </div>
                <div class="result-item">
                    <p class="result-number">${percentage}%</p>
                    <p class="result-label">Відсоток правильних відповідей</p>
                </div>
            </section>
                <span>Вірних відповідей: ${this.correct_count} із ${this.totalQuestions} Питаннь</span>
                <div class="progress-bar">
                    <div class="progress" style="width: ${percentage}%"></div>
                </div>
            </div>
            `
            
        
            let questionsLogDisplay = document.createElement('div')
            questionsLog.forEach((questionData) => {
                let questionContainer = document.createElement('div')
                questionContainer.classList.add('card_qw')
                questionContainer.style.display='block'
        
                let quizDisplay = document.createElement('div')
                quizDisplay.classList.add('quiz')
                quizDisplay.textContent = `${questionData.question} Витрачений час: ${questionData.timeSpent} секунди`
                questionContainer.appendChild(quizDisplay)
        
                let ansDisplay = document.createElement('div')
                ansDisplay.classList.add('ans')
                questionData.allAnswers.forEach(answer => {
                    let answerDiv = document.createElement('div')
                    answerDiv.textContent = `${answer}`
                    if (answer == +questionData.selectedAnswer) {
                        if (questionData.isCorrect) {
                            answerDiv.classList.add('selected-correct-answer')
                        } else {
                            answerDiv.classList.add('selected-wrong-answer')
                        }
                    }
                    if (answer == questionData.correctAnswer) {
                        if (answer != questionData.selectedAnswer) {
                            answerDiv.classList.add('correct-answer')
                        }
                    }
                    ansDisplay.appendChild(answerDiv)
                })
                questionContainer.appendChild(ansDisplay)
                questionsLogDisplay.appendChild(questionContainer)
            })
        
            resultText.appendChild(questionsLogDisplay)
            document.getElementById('results').style.display = 'block'
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
            this.seconds--
            this.updateDisplay()
            if (this.seconds <= 0) {
                this.stop()
                this.callback()
            }
        }, 1000)
        this.updateDisplay()
    }

    stop() {
        clearInterval(this.intervalId)
        this.intervalId = null
    }

    updateDisplay() {
        const minutes = Math.floor(this.seconds / 60)
        const remainingSeconds = this.seconds % 60
        this.timerDisplay.innerHTML = `${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`
    }
}

function startTimer(seconds, callback) {
    let timer = new Timer(seconds, callback)
    timer.start()
    return timer
}

function hideMenu() {
    setTimeout(function() {
        display_menu = true
        document.querySelector('.menu').style.display = 'none'
        document.querySelector('.card_qw').style.display = 'block'
    }, 100)
}
document.getElementById('btn_logo').addEventListener('click', function() {
    setTimeout(function() {
        document.querySelector('.menu').style.display = 'block'
        document.querySelector('.card_qw').style.display = 'none'
        document.querySelector('.ans').style.display = 'flex'
        resultText.style.display= 'none'
        questionsLog = []
        allowAnswerSelection = true
        resultText = NaN
    }, 100)
})
document.getElementById('btn_logo').addEventListener('click', function() {
    setTimeout(function() {
        display_menu = false;
        document.querySelector('.menu').style.display = 'block';
        document.querySelector('.card_qw').style.display = 'none';
        document.querySelector('.ans').style.display = 'flex';
        resultText.style.display= 'none';
    }, 100)
})

document.getElementById('quiz3').addEventListener('click', function() {
    hideMenu()
    qws = new Question(3)
    qws.display()
})

document.getElementById('quiz5').addEventListener('click', function() {
    hideMenu()
    qws = new Question(5)
    qws.display()
})

document.getElementById('quiz10').addEventListener('click', function() {
    hideMenu()
    qws = new Question(10)
    qws.display()
})

document.getElementById('quiz15').addEventListener('click', function() {
    hideMenu()
    qws = new Question(15)
    qws.display()
})
