from boggle import Boggle
from flask import Flask, request, session, render_template, jsonify

app = Flask(__name__)
app.config["SECRET_KEY"] = "fdfgkjtjkkg45yfdb"

boggle_game = Boggle()

@app.route("/")
def homepage():
  board = boggle_game.make_board()
  session["board"] = board
  highscore = session.get("highscore", 0)
  timesPlayed = session.get("timesPlayed", 0)
  return render_template("index.html", board=board)


@app.route("/check")
def check_word():

  word = request.args["word"]
  board = session["board"]
  response = boggle_game.check_valid_word(board, word)

  return jsonify({'result': response})


@app.route("/post-score", methods=["POST"])
def end_game():
  score = request.json["score"]
  highscore = session.get("highscore", 0)
  
  timesPlayed = session.get("timesPlayed", 0)
  
  session['timesPlayed']  = timesPlayed + 1
  session['highscore'] = max(score, highscore)

  return jsonify(brokeRecord=score > highscore)