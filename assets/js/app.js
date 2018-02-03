// firebase Configuration
var config = {
  apiKey: "AIzaSyAbghlHIN-16KX33fcIQlb77AYBn0pH3EM",
  authDomain: "ut-rps-multiplayer.firebaseapp.com",
  databaseURL: "https://ut-rps-multiplayer.firebaseio.com",
  projectId: "ut-rps-multiplayer",
  storageBucket: "",
  messagingSenderId: "908941483304"
};
firebase.initializeApp(config);

var database = firebase.database();

//global variables
var playerId = "";
var player1 = false;
var player2 = false;
var playerName = "";
var playerMessage = $("#messageInput").val().trim();

//toogles players presence
database.ref("/players").on("value", function(snapshot) {
  if (snapshot.child("player1").exists()) {
    player1 = true;
  }
  if (snapshot.child("player2").exists()) {
    player2 = true;
  }
});

//defaults turn to player one
database.ref("turn").set({turn: false});

//toggles modal on at load
$(window).on('load', function() {
  $('#myModal').modal('show');
});

//Sets up player on submission in Firebase, populates DOM depending on player number
$('#setPlayerNameSend').on("click", function(event) {
  event.preventDefault();
  $('.playerCreation').hide();
  playerName = $("#setPlayerName").val().trim();

  var setPlayer = function(x) {
    var isConnected = database.ref("players/" + x);

    database.ref("players/" + x).set({playerName: playerName, playerWins: 0, playerChoice: "null"});
    isConnected.onDisconnect().remove();
    welcome(playerName);
  };

  if ((player1 == false)) {
    setPlayer("player1");
    playerId = "player1";
    $(".gameControls1").append('<div class="btn-group" role="group" aria-label="Basic example">' + '<button type="button" id="player1Rock" class="btn btn-secondary player1Button"><i class="far fa-hand-rock"></i> Rock</button>' + '<button type="button" id="player1Paper" class="btn btn-secondary player1Button"><i class="far fa-hand-paper"></i> Paper</button>' + '<button type="button" id="player1Scissors" class="btn btn-secondary player1Button"><i class="far fa-hand-scissors"></i> Scissors</button>' + '</div>');
  } else if (player1 && (player2 == false)) {
    setPlayer("player2");
    playerId = "player2";
    $(".gameControls2").append('<div class="btn-group" role="group" aria-label="Basic example">' + '<button type="button" id="player2Rock" class="btn btn-secondary player2Button"><i class="far fa-hand-rock"></i> Rock</button>' + '<button type="button" id="player2Paper" class="btn btn-secondary player2Button"><i class="far fa-hand-paper"></i> Paper</button>' + '<button type="button" id="player2Scissors" class="btn btn-secondary player2Button"><i class="far fa-hand-scissors"></i> Scissors</button>' + '</div>');
    $(".player2Button").prop("disabled", true);
    //waiting on player one.
  } else {
    alert("Sorry, game session is full. Please try later!");
  }
});

//Sends Welcome message
var welcome = function(name) {
  database.ref("messages").push({
    playerName: "GAME",
    playerMessage: "Welcome " + name + ", you are now in the game!",
    playerId: "GAME"
  });
};

//listens to hear if 2 players are in the game and then sets the game
database.ref("players").on("value", function(childSnapshot) {
  var numberPlayers = childSnapshot.numChildren();
  if (numberPlayers === 2) {
    gameStart();
  }
});

//Listens for players and adds a waiting on other player text
database.ref("players/player1/playerName").on("value", function(childSnapshot) {
  if (childSnapshot.val()) {
    $(".playerTitle1").html("<h2>" + childSnapshot.val() + "</h2>");
  } else {
    $(".playerTitle1").html("<h2>waiting for other player</h2>");
  }
});
database.ref("players/player2/playerName").on("value", function(childSnapshot) {
  if (childSnapshot.val()) {
    $(".playerTitle2").html("<h2>" + childSnapshot.val() + "</h2>");
  } else {
    $(".playerTitle2").html("<h2>waiting for other player</h2>");
  }
});

//Player wins population of DOM
database.ref("players/player1/playerWins").on("value", function(childSnapshot) {
  $("#player1Score").html(childSnapshot.val());
});

database.ref("players/player2/playerWins").on("value", function(childSnapshot) {
  $("#player2Score").html(childSnapshot.val());
});

//Starts the Game, player one gets to choose play
var gameStart = function() {
  $("body").on("click", '#player1Rock', function(e) {
    e.preventDefault();
    $(".player1Button").prop("disabled", true);
    database.ref("turn/turn").set(true);
    database.ref("players/player1/playerChoice").set("rock");
  });

  $("body").on("click", '#player1Paper', function(e) {
    e.preventDefault();
    $(".player1Button").prop("disabled", true);
    database.ref("turn/turn").set(true);
    database.ref("players/player1/playerChoice").set("paper");
  });

  $("body").on("click", '#player1Scissors', function(e) {
    e.preventDefault();
    $(".player1Button").prop("disabled", true);
    database.ref("turn/turn").set(true);
    database.ref("players/player1/playerChoice").set("scissors");
  });
};

//Starts player 2 turn, on boolean (turn)
database.ref("turn/turn").on("value", function(childSnapshot) {
  if (childSnapshot.val() == true) {

    $(".player2Button").removeAttr("disabled");

    $("body").on("click", '#player2Rock', function(e) {
      e.preventDefault();
      $(".player2Button").prop("disabled", true);
      database.ref("players/player2/playerChoice").set("rock");
      fight();
    });

    $("body").on("click", '#player2Paper', function(e) {
      e.preventDefault();
      $(".player2Button").prop("disabled", true);
      database.ref("players/player2/playerChoice").set("paper");
      fight();
    });

    $("body").on("click", '#player2Scissors', function(e) {
      e.preventDefault();
      $(".player2Button").prop("disabled", true);
      database.ref("players/player2/playerChoice").set("scissors");
      fight();
    });
  }
  if (childSnapshot.val() == false) {
    $(".player1Button").removeAttr("disabled");
  }
});

// Function to determine winner.
var fight = function() {

  var player1Choice;
  var player2Choice;
  var player1Wins;
  var player2Wins;

  database.ref("players/player1/playerChoice").once('value', function(childSnapshot) {
    player1Choice = childSnapshot.val();
  });
  database.ref("players/player2/playerChoice").once('value', function(childSnapshot) {
    player2Choice = childSnapshot.val();
  });
  database.ref("players/player1/playerWins").once('value', function(childSnapshot) {
    player1Wins = childSnapshot.val();
  });
  database.ref("players/player2/playerWins").once('value', function(childSnapshot) {
    player2Wins = childSnapshot.val();
  });

  if ((player1Choice === "rock") && (player2Choice === "scissors")) {
    player1Wins++;
    database.ref("players/player1/playerWins").set(player1Wins);
    database.ref("messages").push({playerName: "GAME", playerMessage: "Player 1 wins - Rock vs Scissors", playerId: "GAME"});
    restart();
  } else if ((player1Choice === "rock") && (player2Choice === "paper")) {
    player2Wins++;
    database.ref("players/player2/playerWins").set(player2Wins);
    database.ref("messages").push({playerName: "GAME", playerMessage: "Player 2 wins - Rock vs Paper", playerId: "GAME"});
    restart();
  } else if ((player1Choice === "scissors") && (player2Choice === "rock")) {
    player2Wins++;
    database.ref("players/player2/playerWins").set(player2Wins);
    database.ref("messages").push({playerName: "GAME", playerMessage: "Player 2 wins - Scissors vs Rock", playerId: "GAME"});
    restart();
  } else if ((player1Choice === "scissors") && (player2Choice === "paper")) {
    player1Wins++;
    database.ref("players/player1/playerWins").set(player1Wins);
    database.ref("messages").push({playerName: "GAME", playerMessage: "Player 1 wins - Scissors vs Paper", playerId: "GAME"});
    restart();
  } else if ((player1Choice === "paper") && (player2Choice === "rock")) {
    player1Wins++;
    database.ref("players/player1/playerWins").set(player1Wins);
    database.ref("messages").push({playerName: "GAME", playerMessage: "Player 1 wins - Paper vs Rock", playerId: "GAME"});
    restart();
  } else if ((player1Choice === "paper") && (player2Choice === "scissors")) {
    player2Wins++;
    database.ref("players/player2/playerWins").set(player2Wins);
    database.ref("messages").push({playerName: "GAME", playerMessage: "Player 2 wins - Paper vs Scissors", playerId: "GAME"});
    restart();
  } else if ((player1Choice === player2Choice)) {
    database.ref("messages").push({playerName: "GAME", playerMessage: "Tie!", playerId: "GAME"});
    restart();
  }
};

// Function to restart next round.
var restart = function() {
  $(".player1Button").removeAttr("disabled");
  database.ref("turn").set({turn: false});
  database.ref("players/player2/playerChoice").set("null");
  database.ref("players/player1/playerChoice").set("null");
};

/* Chat Logic */

$('#messageSend').on("click", function(event) {
  event.preventDefault();
  playerMessage = $("#messageInput").val().trim();

  database.ref("messages").push({playerName: playerName, playerMessage: playerMessage, playerId: playerId});

  $("#messageInput").val('');
});

database.ref("messages").on("child_added", function(childSnapshot) {

  $(".messages").append('<p><span class="bubble ' + childSnapshot.val().playerId + '"><span class="chatName">' + childSnapshot.val().playerName + ': </span>' + childSnapshot.val().playerMessage + '</span></p>');

  $(".messages").stop().animate({
    scrollTop: $(".messages")[0].scrollHeight
  }, 1000);
});
