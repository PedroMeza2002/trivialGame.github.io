document.addEventListener('DOMContentLoaded', () => {
    //Variables del juego.
    const apiUrl = 'https://opentdb.com/api.php?amount=100&category=21&difficulty=medium'; // Ajusta la URL de la API según sea necesario
    let currentQuestionIndex = 0;
    let score = 0;
    let incorrectAttempts = 0;
    let questions = [];
    
    //Variables de los IDs.
    const app = document.getElementById('app');
    const CATEGORIA = document.getElementById("categoria");
    const PREGUNTA = document.getElementById("pregunta");
    const OPCION = document.getElementById("opciones");
    const RESPUESTA = document.getElementById("respuesta");
    const NEXT = document.getElementById("botonSiguiente");
    
    //Funcion para obtener valores del API.
    async function fetchQuestions() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching trivia questions:', error);
        }
    }

    //Funcion de inicio del juego.
    async function startGame() {
        questions = await fetchQuestions();
        if (questions) {
            showQuestion(questions[currentQuestionIndex]);
        }
    }

    //Funcion donde se muestra las preguntas.
    function showQuestion(question) {
        const options = shuffle([...question.incorrect_answers, question.correct_answer]).slice(0, 4);

        //Se agrega contenido a la pagina.
        CATEGORIA.innerHTML= `<h2>${question.category}</h2>`;
        PREGUNTA.innerHTML=`<p>${question.question}</p>`;
        OPCION.innerHTML=`${shuffle(options).map(answer => `<button class="option">${answer}</button>`).join('')}`;

        //Adjunta el evento a todos los botones de respuesta
        const optionButtons = document.querySelectorAll('#opciones .option'); //'#options .option'
        optionButtons.forEach(button => {
            button.addEventListener('click', () => {
                checkAnswer(button.textContent, question.correct_answer);
            });
        });
    }

    //Funcion para chequear las respuesta.
    function checkAnswer(selectedAnswer, correctAnswer) {
        RESPUESTA.style.display="block";
        
        //Deshabilita todos los botones de opción después de hacer clic en uno
        const optionButtons = document.querySelectorAll('#opciones .option');
        optionButtons.forEach(button => {
            button.disabled = true; 
        });

        //Para donde se hace la comprobacion de la respuesta.
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

    //Funcion para pasar a la siguiente pregunta.
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

    //Funcion para finalizar el juego.
    function endGame() {
        app.innerHTML = `
            <h2>Game Over</h2>
            <p>Your final score is: ${score}</p>
        `;
    }

    //Función para mezclar aleatoriamente un array
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    startGame();
});