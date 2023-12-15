
document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://opentdb.com/api.php?amount=100&category=21&difficulty=medium'; // Ajusta la URL de la API según sea necesario
    const app = document.getElementById('app');
    let currentQuestionIndex = 0;
    let score = 0;
    let incorrectAttempts = 0;
    let questions = [];
    
    const CATEGORIA = document.getElementById("categoria");
    const PREGUNTA = document.getElementById("pregunta");
    const OPCION = document.getElementById("opciones");
    const RESPUESTA = document.getElementById("respuesta");
    const NEXT = document.getElementById("botonSiguiente");

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
        //options.push(question.correct_answer);

        CATEGORIA.innerHTML= `<h2>${question.category}</h2>`;
        PREGUNTA.innerHTML=`<p>${question.question}</p>`;
        OPCION.innerHTML=`${shuffle(options).map(answer => `<button class="option">${answer}</button>`).join('')}`;

        // Adjunta el evento a todos los botones de respuesta
        const optionButtons = document.querySelectorAll('#opciones .option'); //'#options .option'
        optionButtons.forEach(button => {
            button.addEventListener('click', () => {
                checkAnswer(button.textContent, question.correct_answer);
            });
        });
    }

    function checkAnswer(selectedAnswer, correctAnswer) {
        RESPUESTA.style.display="block";
        OPCION.disa

        if (selectedAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
            score++;
            RESPUESTA.innerHTML='Correct!😎';

            NEXT.style.display="block";
            NEXT.addEventListener("click", nextQuestion)
            
        } else {
            incorrectAttempts++;
            RESPUESTA.innerHTML= 'Incorrect 😒. The correct answer is 👉' + correctAnswer + "👈";

            if (incorrectAttempts === 4) {
                endGame();
                return;
            }

            NEXT.style.display="block";
            NEXT.addEventListener("click", nextQuestion)
        }
    }

    function nextQuestion(){
        NEXT.style.display="none";
        RESPUESTA.style.display="none";
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
        //RESPUESTA.innerHTML= 'Incorrect. The correct answer is: ' + correctAnswer;
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