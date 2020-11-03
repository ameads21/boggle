$("#guessBtn").on("click", checkWord)

let wordsGuessed = [];
let words = new Set();
let score = 0;
let timerLength = 60;
$(".timer").text(timerLength)

timer = setInterval(timeFunction, 1000)

async function checkWord(e){
  e.preventDefault()
  const $word = $("#inputGuess", this.board);
  let word = $word.val();
  if(!word) return;

  let res = await axios.get("/check", {params: {word: word}});
  console.log(res);
  

  //If the results are a word, but not on the board
  if (res.data.result === "not-on-board"){
    showMessage(`"${word}" is not on the board`, "error")
  }

  //If the results aren't even a word
  else if (res.data.result === "not-word"){
    showMessage(`"${word}" is not a word`, "error")
  } else {
    //If it comes back as a word and on the board
    if (words.has(word)){
      showMessage(`You already found ${word}`, "found")
    } else {
      showMessage(`"${word}" was added!`, "success")
      addingWord(word)
      scoreFunction(word);
    }
  }
  $("#inputGuess").val("")
}

function addingWord(word){
  words.add(word)
  $(".words").append(`<li> ${word} </li>`)
}


//Showing the messages
function showMessage(msg, cls) {
  $(".messageBlock")
    .text(msg)
    .removeClass()
    .addClass(`messageBlock ${cls}`);
}

//Timer
function timeFunction(){
  timerLength -= 1;
  $(".timer").text(timerLength)
  if (timerLength <= 0){
    clearInterval(timer);
    $("#guessBtn").prop("disabled", true);
    alert("Times up!")
    endGame()
  }
}

//Score
function scoreFunction(word){
  score += word.length;
  $(".score").text(score)
}

//End of game
async function endGame(){
  let res = await axios.post("/post-score", {score: score});
  console.log(res)
  if (res.data.brokeRecord){
    showMessage(`New Record! Your score is ${score}`, 'success')
  } else {
    showMessage(`Final Score: ${score}`, 'success')
  }
}