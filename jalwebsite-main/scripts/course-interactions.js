document.addEventListener('DOMContentLoaded', function() {
  // Quiz Interaction
  const quizContainer = document.querySelector('.bg-gray-100');
  const quizButtons = quizContainer.querySelectorAll('button');
  const correctAnswer = '2.5%';

  quizButtons.forEach(button => {
      button.addEventListener('click', function() {
          // Reset previous selections
          quizButtons.forEach(btn => btn.classList.remove('bg-blue-200'));
          
          // Highlight current selection
          this.classList.add('bg-blue-200');

          // Create result div if not exists
          let resultDiv = quizContainer.querySelector('.quiz-result');
          if (!resultDiv) {
              resultDiv = document.createElement('div');
              resultDiv.classList.add('quiz-result', 'mt-4', 'text-center');
              quizContainer.appendChild(resultDiv);
          }

          // Check answer
          if (this.textContent === correctAnswer) {
              resultDiv.innerHTML = '<p class="text-green-600">Correct! 2.5% of Earth\'s water is freshwater.</p>';
          } else {
              resultDiv.innerHTML = '<p class="text-red-600">Incorrect. The correct answer is 2.5%.</p>';
          }
      });
  });

  // Community Discussion
  const textarea = document.querySelector('textarea');
  const postButton = document.querySelector('button[class*="Post Comment"]');
  const commentsContainer = document.querySelector('.bg-white.p-6.rounded-lg.shadow-md > div:last-child');

  postButton.addEventListener('click', function() {
      const commentText = textarea.value.trim();
      if (commentText) {
          const newCommentDiv = document.createElement('div');
          newCommentDiv.classList.add('bg-gray-100', 'p-4', 'rounded-lg', 'mb-4');
          newCommentDiv.innerHTML = `<p><strong>Anonymous</strong>: ${commentText}</p>`;
          
          commentsContainer.appendChild(newCommentDiv);
          textarea.value = ''; // Clear textarea
      }
  });
});