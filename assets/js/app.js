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
var player1 = false;
var player2 = false;
var playerName="";
var playerWin1="";
var playerWin2="";
var playerMessage= $("#messageInput").val().trim();


database.ref("/players").on("value", function(snapshot) {
  if (snapshot.child("player1").exists()){
    player1=true;
    console.log("player1True");
  }
  if (snapshot.child("player2").exists()){
    player2=true;
    console.log("player2True");
  }
});

$('#setPlayerNameSend').on("click", function(event){
  event.preventDefault();
  playerName= $("#setPlayerName").val().trim();

  var setPlayer = function(x){
    var isConnected = database.ref("players/"+ x);

    database.ref("players/" + x).set({
      playerName: playerName,
      playerWins: 0
    });
    isConnected.onDisconnect().remove();
    playerName= "";
  };

  if ((player1 == false)) {
    setPlayer("player1");
    console.log("player1hit");
  }
  else if(player1 && (player2 == false)){
    setPlayer("player2");
    console.log("player2hit");
  }else{
    alert("Sorry, game session is full. Please try later!");
  }

});

$('#messageSend').on("click", function(event){
  event.preventDefault();

});
