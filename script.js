
document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://opentdb.com/api.php?amount=10&category=21&difficulty=medium'; // Ajusta la URL de la API según sea necesario
    const app = document.getElementById('app');
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];

    async function fetchQuestions() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching trivia questions:', error);
        }
    }

    async function startGame() {
        questions = await fetchQuestions();
        if (questions) {
            showQuestion(questions[currentQuestionIndex]);
        }
    }

    function showQuestion(question) {
        app.innerHTML = `
            <h2>${question.category}</h2>
            <p>${question.question}</p>
            <ul>
                ${question.incorrect_answers.map(answer => `<li>${answer}</li>`).join('')}
                <li>${question.correct_answer}</li>
            </ul>
            <button id="nextButton">Next Question</button>
        `;

        // Adjunta el evento al botón después de la creación del HTML
        const nextButton = document.getElementById('nextButton');
        nextButton.addEventListener('click', () => {
            checkAnswer(question.correct_answer);
        });
    }

    function checkAnswer(correctAnswer) {
        const selectedAnswer = prompt('Enter your answer:'); // Puedes mejorar esto con una interfaz más interactiva
        if (selectedAnswer && selectedAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            score++;
            alert('Correct!');
        } else {
            alert('Incorrect. The correct answer is: ' + correctAnswer);
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < 10) {
            showQuestion(questions[currentQuestionIndex]);
        } else {
            endGame();
        }
    }

    function endGame() {
        app.innerHTML = `
            <h2>Game Over</h2>
            <p>Your final score is: ${score}</p>
        `;
    }

    startGame();
});
