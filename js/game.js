const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');
const progressBarFull = document.querySelector('#progressBarFull');

let currentQuestion = {}
let acceptingAnswers = true
let score = 0
let questionCounter = 0
let availableQuestions = []

let questions = [
    {
        question: "The virus was identified in the Chinese city of _______ ?",
        choice1: 'Chong Qing',
        choice2: 'Xi An',
        choice3: 'Wu Han',
        choice4: 'Nan Jing',
        answer: 3,
    },
    {
        question: "What are the most common symptoms you'll encounter when dealing with Covid-19?",
        choice1: "Rhinitis, Vomiting, Fever, Sore Throat, Cough, Weakness",
        choice2: "Fever, Vomiting, Fever, Running Nose, Sore Throat",
        choice3: "Fever, Vomiting, Fever, Cough, Running Nose, Flu",
        choice4: "Rhinitis, Vomiting, Fever, Weakness Backache",
        answer: 1,
    },
    {
        question: "Things You Should Do",
        choice1: "Close Contact with Animals",
        choice2: "Shake Hand",
        choice3: "Always Wear a Mask and Wash Hand Often",
        choice4: "None of Above",
        answer: 3,
    },
    {
        question: "How do you prevent Covid-19 ?",
        choice1: "Drink More Water",
        choice2: "To get extra vitamin C, Eat more oranges. ",
        choice3: "Drink Coconut water",
        choice4: "Every day, put on a mask and clean yourself. ",
        answer: 4,
    }
]

const SCORE_POINTS = 25
const MAX_QUESTIONS = 4


startGame = () => {
    questionCounter = 0
    score = 0
    availableQuestions = [...questions]
    getNewQuestion()
}

getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score)

        return window.location.assign('../html/end.html')
    }

    questionCounter++
    progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`
    progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}%`
    
    const questionsIndex = Math.floor(Math.random() * availableQuestions.length)
    currentQuestion = availableQuestions[questionsIndex]
    question.innerText = currentQuestion.question

    choices.forEach(choice => {
        const number = choice.dataset['number']
        choice.innerText = currentQuestion['choice' + number]
    })

    availableQuestions.splice(questionsIndex, 1)

    acceptingAnswers = true
}

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return

        acceptingAnswers = false
        const selectedChoice = e.target
        const selectedAnswer = selectedChoice.dataset['number']

        let classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'

        if(classToApply === 'correct') {
            incrementScore(SCORE_POINTS)
        }

        selectedChoice.parentElement.classList.add(classToApply)

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply)
            getNewQuestion()

        }, 1000)
    })
})

incrementScore = num => {
    score +=num
    scoreText.innerText = score
}

startGame()