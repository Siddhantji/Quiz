const fail = new Audio('fail.mp3');
const success = new Audio('system.mp3');
const win = new Audio('win.mp3');
const defeat = new Audio('defeat.mp3');
let triviaQuestions = [];
let score = 0;
let currentQuestionIndex = 0;
function updateProgressBar() {
  const progressBarElement = document.getElementById("progress-bar");
  const progressContainerWidth = document.querySelector(
    ".progress-container"
  ).offsetWidth;
  const totalQuestions = triviaQuestions.length - 1;
  const progress = (currentQuestionIndex / totalQuestions) * 100;
  const progressBarWidth = (progress / 100) * progressContainerWidth;
  progressBarElement.style.width = `${progressBarWidth}px`;
}

function fetchQuestions(apiUrl) {
  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      triviaQuestions = data.results; // Store fetched questions in the global variable
      displayQuestion(triviaQuestions[currentQuestionIndex]);
      return triviaQuestions;
    })
    .catch((error) => console.error("Error fetching trivia questions:", error));
}

function displayQuestion(ques) {
    let ansSelected = false;
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("question-container").style.display = "block";
  document.getElementById("question").textContent = `${ques.question}`;
  let options = document.getElementById("options");
  options.innerHTML = "";
  const allOptions = [...ques.incorrect_answers, ques.correct_answer];
  allOptions.sort(() => Math.random() - 0.5);

  allOptions.forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.classList.add("answer");
    btn.addEventListener("click",function(){
        if(!ansSelected){
            ansSelected=true;
            hightLight(btn);
            const selectedAnswer =  btn.textContent;
            const correctAnswer = ques.correct_answer;
            check(selectedAnswer,correctAnswer);
        }
    });
    options.appendChild(btn);
  });
  if (currentQuestionIndex === triviaQuestions.length - 1) {
    document.getElementById("next-button").style.display = "none";
    document.getElementById("submit").style.display = "inline";
  }
  if (currentQuestionIndex == 0) {
    document.getElementById("back-button").style.display = "none";
  } else {
    document.getElementById("back-button").style.display = "inline";
  }
}
function hightLight(selected){
    selected.style.color = "blue";
}

// document.addEventListener("click", function (event) {
//   if (event.target.classList.contains("answer")) {
//     const selectedAnswer = event.target.textContent;
//     const correctAnswer = triviaQuestions[currentQuestionIndex].correct_answer;
//     check(selectedAnswer, correctAnswer);
//   }
// });

function check(sa, ca) {
  if (sa === ca) {
    const msg = document.getElementById("msg");
    msg.style.color = "green";
    msg.style.display = "block";
    msg.textContent = "Correct Answer";
    score++;
    success.play();
  } else {
    const msg = document.getElementById("msg");
    msg.style.color = "red";
    msg.style.display = "block";
    msg.textContent = `Wrong Answer, Correct answer is ${ca}`;
    fail.play();
  }
}

document.getElementById("next-button").addEventListener("click", function () {
  currentQuestionIndex++;
  msg.style.display = "none";
  displayQuestion(triviaQuestions[currentQuestionIndex]);
  updateProgressBar();
});
document.getElementById("back-button").addEventListener("click", function () {
  currentQuestionIndex--;
  msg.style.display = "none";
  displayQuestion(triviaQuestions[currentQuestionIndex]);
  updateProgressBar();
});

document.getElementById("submit").addEventListener("click", function () {
    if(score <=3){
        defeat.play();
    }
    else{
        win.play();
    }
    const home = document.getElementById("home");
    home.style.display = "block";
    home.addEventListener("click",function(){
        window.location.reload();
    });

  let scoreDisplay = document.getElementById("score");
  document.getElementById("question").style.display = "none";
  document.getElementById("options").style.display = "none";
  document.getElementById("submit").style.display = "none";
  document.getElementById("msg").style.display = "none";
  document.getElementById("back-button").style.display = "none";
  document.getElementById("progress-container").style.display = "none";
  document.getElementById("progress-bar").style.display = "none";
  scoreDisplay.style.display = "block";
  scoreDisplay.innerHTML += ` <h3 id="blue">${score}/5</h3>`;
});
