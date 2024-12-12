function submitQuiz() {
    const form = document.getElementById('quiz-form');
    const answers = {
        q1: 'a',
        q2: 'b'
        // Add correct answers for more questions here
    };
    let score = 0;
    
    for (const [question, correctAnswer] of Object.entries(answers)) {
        const selectedAnswer = form.querySelector(`input[name="${question}"]:checked`);
        if (selectedAnswer && selectedAnswer.value === correctAnswer) {
            score++;
        }
    }
    
    const results = document.getElementById('quiz-results');
    const scoreText = document.getElementById('score');
    scoreText.textContent = `You scored ${score} out of ${Object.keys(answers).length}!`;
    results.style.display = 'block';
}