
document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://opentdb.com/api.php?amount=10&category=21&difficulty=medium'; // Ajusta la URL de la API según sea necesario
    const app = document.getElementById('app');
    let currentQuestionIndex = 0;
    let score = 0;
    let incorrectAttempts = 0;
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
        const options = shuffle([...question.incorrect_answers, question.correct_answer]).slice(0, 4);
        options.push(question.correct_answer);

        app.innerHTML = `
            <h2>${question.category}</h2>
            <p>${question.question}</p>
            <div id="options">
                ${shuffle(options).map(answer => `<button class="option">${answer}</button>`).join('')}
            </div>
        `;

        // Adjunta el evento a todos los botones de respuesta
        const optionButtons = document.querySelectorAll('#options .option');
        optionButtons.forEach(button => {
            button.addEventListener('click', () => {
                checkAnswer(button.textContent, question.correct_answer);
            });
        });
    }

    function checkAnswer(selectedAnswer, correctAnswer) {
        if (selectedAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            score++;
            alert('Correct!');
        } else {
            incorrectAttempts++;
            alert('Incorrect. The correct answer is: ' + correctAnswer);

            if (incorrectAttempts === 4) {
                endGame();
                return;
            }
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

    // Función para mezclar aleatoriamente un array
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    startGame();
});