$(document).ready(function() {
  $("#newGame").hide();
  // ================== Declare variables ================== //
  var player;
  var game = "";
  // Use following to track player moves; each player is an object
  var PlayerOne = { name: "p1", sign: "", sqsClaimed: [] };
  var PlayerTwo = { name: "p2", sign: "", sqsClaimed: [] };
  var Comp = { name: "comp", sign: "", sqsClaimed: [] };
  // Use following to track the sqs that are claimed
  var usedSquares = [];
  // Use following array to check if players have achieved a winning combo of sqs
  var winningCombos = [["#1", "#2", "#3"], ["#1", "#4", "#7"], ["#1", "#5", "#9"], ["#2", "#5", "#8"], ["#3", "#6", "#9"], ["#3", "#5", "#7"], ["#7", "#8", "#9"], ["#4", "#5", "#6"]];

  //For player one game only
  // Will track remaining possible win scenarios for Player One
  var p1WinningCombos = [["#1", "#2", "#3"], ["#1", "#4", "#7"], ["#1", "#5", "#9"], ["#2", "#5", "#8"], ["#3", "#6", "#9"], ["#3", "#5", "#7"], ["#7", "#8", "#9"], ["#4", "#5", "#6"]];
  // Same as above, but will track remaining possible win scenarios for the computer and also help computer determine if player is close to achieving victory
  var compsWinningArr = [["#1", "#2", "#3"], ["#1", "#4", "#7"], ["#1", "#5", "#9"], ["#2", "#5", "#8"], ["#3", "#6", "#9"], ["#3", "#5", "#7"], ["#7", "#8", "#9"], ["#4", "#5", "#6"]];
  // If comp is one sq from a win, if true take it
  var oneFromWin = false;
  // If defense is true, p1 is one sq from victory and comp must take it
  var defense = false;
  // For storing the mover's choice each turn in one player game
  var sqChoice = "";

  // ================== Start the game ================== //

  // Game setup prompts for two player game choice

  $("#btn-two").one("click", function() {
    if (game === "") {
    game = "v2plyr";
    $("#prompt").text("Would player one like to be X or O?");
    $("#btn-one").text("X");
    $(this).text("O");
    // To randomly assign first player to play
    var randomRoll = Math.floor(Math.random() * 2 + 1);
    player = randomRoll > 1 ? PlayerOne : PlayerTwo;
    // Second phase of prompt appears
    $(".btn").on("click", function() {
      var signChoice = $(this).text();
      if (signChoice === "O") {
        PlayerOne.sign = "O";
        PlayerTwo.sign = "X";
      } else {
        PlayerOne.sign = "X";
        PlayerTwo.sign = "O";
      }
      $(".faded").fadeOut("slow");
      // Game begins with first turn
      playerNotification();

      $(".sq").on("click", function() {
          sqChoice = "#" + $(this).attr("id");
          if (player !== "") {
            // If player variable is not set to "" then do the following
            claimSquare(sqChoice, player);
            notificationEnd();
            var gameCondition = winCheck(player);
            if (gameCondition === "End game") {
              resetVarstoDefault(); // Resets main varibles for a new game
            }
          } // If player variable is not set to ""
      });

// ========================= Game Ends For 2 player ============================= //
    return false;
  }); // End of sign choice
  return false;
  } // End of game conditional
}); // End of Game


// =====
// SPACE
// =====


// ========================= ONE PLAYER GAME ============================= //


$("#btn-one").one("click", function() {
if (game === "") {
  game = "v1plyr";
  $("#prompt").text("Would player like to be X or O?");
  $(this).text("X");
  $("#btn-two").text("O");
  // To randomly assign first player to play
  var randomRoll = Math.floor(Math.random() * 2 + 1);
  player = randomRoll > 1 ? PlayerOne : Comp;
  // Second phase of prompt appears
  $(".btn").on("click", function() {
    var signChoice = $(this).text();
    if (signChoice === "O") {
      PlayerOne.sign = "O";
      Comp.sign = "X";
    } else {
      PlayerOne.sign = "X";
      Comp.sign = "O";
    }
    $(".faded").fadeOut("slow");
    $("#scNm").text("Computer");
    $("#notify2").text("Computer's Turn");
    // Game begins with first turn
    playerNotification();

    // If it's Computer's turn
    if (player === Comp) {
      disableClickEvents();
      setTimeout(computersMove, 1000);
    }

    // if it's player one's turn
      $(".sq").on("click", function() {
        sqChoice = "#" + $(this).attr("id");
        //console.log("Player gets: " + sqChoice);
        p1WinningCombos = moverUpdateArr(sqChoice, p1WinningCombos);
        compsWinningArr = nonMoverUpdateArr(sqChoice, compsWinningArr);
        if (player !== "") {
          // If player variable is not set to "" then do the following
          claimSquare(sqChoice, player);
          notificationEnd();
          var gameCondition = winCheck(player);
          if (gameCondition === "End game") {
            resetVarstoDefault();
          } else if (gameCondition !== "End game") {
            // game condition is not equal to end game, so continue w/ comp's turn
            disableClickEvents();
            setTimeout(computersMove, 1000);
          }
        } // If player variable is not set to ""
      }); // End of sq one click event handler

// ========================= Game Ends For 1 player ============================= //
    return false;
  }); // End of .btn on
  return false;
  } // End of game conditional
}); // End of btn-one 'one' initial click

// ================= Function Declarations for one player game ========

// ====================== is close to win function =============

function isCloseToWin() {
  //First loop thru comps winnning arr to see if comp is one sq from winning. If yes, take it
  for (var p = 0; p < compsWinningArr.length; p++) {
    var localGrabbedArr = compsWinningArr[p];
    if (localGrabbedArr.length === 1) {
      // if yes, save sqId and end the function
      sqChoice = localGrabbedArr[0];
      oneFromWin = true;
    }
  }
} // end of function
//======================== Defense function =======================

function compDefenseAI() {
  // Evaluate p1WinningCombos to see if p1 is one sq from victory
  // Else var deferense will remain false
  for (var i = 0; i < p1WinningCombos.length; i++) {
    if (p1WinningCombos[i].length === 1) {
      sqChoice = p1WinningCombos[i][0];
      defense = true;
    }
  }
}

//======================== Main function =======================
function machineAI () {

  // variable declarations
  var randomRoll = 0;
  var i;
  var allTheSqs = ["#1", "#2", "#3", "#4", "#5", "#6", "#7", "#8", "#9"];
  // vars for first round of loops to determine initial options
  var options = [];
  var sqId = "";
  var numAppearances = 0;
  // For second round of loops to narrow down to THE best or best options
  var grabbedArr;
  var highestNumAppearances = 0;
  var bestOptions = [];

  if (compsWinningArr.length === 0) {
    // The array is empty; no win combos available to comp
    // Set it equal to p1WinningCombos. It will then just compete with player for the remaining 'best' options
    compsWinningArr = p1WinningCombos;
    if (p1WinningCombos.length === 0) {
      // No one can win, just find an available square
      for (i = 0; i < allTheSqs.length; i++) {
        if (usedSquares.indexOf(allTheSqs[i]) < 0) { // sq is still available
          return allTheSqs[i];
        }
      }
    }
  }

  // Concat the array of arrays -> winning combos for comp
  var currentComps = compsWinningArr.reduce(function(a, b) {
    return a.concat(b);
  });

  // Create an array holding each individual square id
  var onlyOnce = [];
  for (i = 0; i < currentComps.length; i++) {
    if (onlyOnce.indexOf(currentComps[i]) < 0) {
      onlyOnce.push(currentComps[i]);
    }
  }

  // First round of loops to determine the highest num appearances among sqIds
  for(i = 0; i < onlyOnce.length; i++) {
    sqId = onlyOnce[i];
    for (var a = 0; a < currentComps.length; a++) {
      if (sqId === currentComps[a]) {
        numAppearances += 1;
      }
    }
    if (numAppearances > 1) {
      options.push([sqId, numAppearances]);
    }
    numAppearances = 0;
  }
  // However, if there are no options after first loop round
  // That means each remaining option only has one appearance among win combos
  if (options.length === 0) {
    for (i = 0; i < onlyOnce.length; i++) {
      options.push([onlyOnce[i], 1]);
    }
  }

  // Second round of loops to narrow down to best options that appear the most
  for (i = 0; i < options.length; i++) {
    grabbedArr = options[i];
    if (grabbedArr[1] > highestNumAppearances) {
      // Find the number with most appearances; reset var each time if higher
      highestNumAppearances = grabbedArr[1];
    }
  }

  // Only the square Ids that appear the most frequently are pushed to bestOptions arr
  for (i = 0; i < options.length; i++) {
    grabbedArr = options[i];
    if (grabbedArr[1] === highestNumAppearances) {
      bestOptions.push(grabbedArr);
    }
  }

  if (bestOptions.length > 1) {
    // Then there are multiple 'best' options to go through, with equally high num appearances
    var bestOfBest = "";
    var reduceFilterBest = bestOptions.reduce(function(a,b) {
      return a.concat(b); }).filter(function(val){
      return isNaN(val);
    });

    var noLength3 = compsWinningArr.filter(function(val) {
      if (val.length < 3) { return val; }
    });

    if (noLength3.length === 0) {
      // Then comp didn't have first turn and this is the 2nd overall turn
      randomRoll = Math.floor(Math.random() * 4);
      return reduceFilterBest[randomRoll]; // Just return one of the options
      // This ends the function if this statement runs true
    }

    // Loop through to see which arrays have items that are both present in best
    for(i = 0; i < noLength3.length; i++) {
      grabbedArr = noLength3[i];
      var check1 = reduceFilterBest.indexOf(grabbedArr[0]);
      var check2 = reduceFilterBest.indexOf(grabbedArr[1]);
      if (check1 !== -1 && check2 !== -1) {
        // Then both array's items are in the best choices array
        bestOfBest = grabbedArr; // Array with length 2 (2 options)
      }
      if (i === noLength3.length - 1 && bestOfBest === "") {
        // Then none of the arrays passed the test, so just take any 1
        bestOfBest = noLength3[0]; // Array with length 2 (2 options)
      }
    }
    if (bestOfBest.length > 1) {
      randomRoll = Math.floor(Math.random() * 2); // Pick one of 2 options
      return bestOfBest[randomRoll];
    } else {
      return bestOfBest[0];
    }
  } // End of if (bestOptions.length > 1) conditional statement

  else {
    // There is only one best option
    return bestOptions[0][0];
  }

}
// ====================== End of main function =======================

// Function to update the array that tracks available win combos for the mover after their turn
function moverUpdateArr(sqId, winArr) {
  var newWinningArr = [];
  var newItemArr = [];
  for(var i = 0; i < winArr.length; i++) {
    var array = winArr[i]; // Grab each array within the array
    for(var j = 0; j < array.length; j++) {
      if (array[j] !== sqId) {
        newItemArr.push(array[j]);
      }
    }
    newWinningArr.push(newItemArr);
    newItemArr = [];
  }
  return newWinningArr;
}
// End of Mover function

// Function for Non Mover
function nonMoverUpdateArr(sqId, winArr) {
  return winArr.filter(function(val) {
    if (val.indexOf(sqId) < 0) { // if sqId is present in array (val), don't return val
      return val;
    }
  });
}

// ======= End of function declarations - One player game ====

// Function Declarations for Game ==============

// =================== Function Declarations ================== //
// Notify players Turn
function playerNotification() {
  if (player === PlayerOne) { $("#notify1").animate({ top: "0px" }, "slow"); }
  else { $("#notify2").animate({ top: "0px" }, "slow"); }
}
function notificationEnd() {
  if (player === PlayerOne) { $("#notify1").animate({ top: "45px" }, "slow"); }
  else { $("#notify2").animate({ top: "45px" }, "slow"); }
}

// Declare pToggle function to toggle between players at end of turn, set equal to player var
function pToggle() {
  if (player === PlayerOne) { player = PlayerTwo; }
  else if (player === PlayerTwo) { player = PlayerOne; }
}
// For one player game
function pToggleV1Plyr() {
  if (player === PlayerOne) { player = Comp; }
  else if (player === Comp) { player = PlayerOne; }
}

// Declare claimSquare function to update tracking arrays and mark squares with player sign
function claimSquare(sqId, currentPlyr) {
  var checkIfUsed = usedSquares.indexOf(sqId);
  if (checkIfUsed > -1) {
    alert("Hey! Don't try to claim squares that are already taken. You lose a turn!");
  } else { // The square is available to claim
    currentPlyr['sqsClaimed'].push(sqId);
    usedSquares.push(sqId);
    $(sqId).children().text(currentPlyr['sign']);
  }
}

// Function for determing info to pass to user
function forInfoWin(player) {
  if (player === PlayerOne) {
    return "Player one wins!";
  } else if (player === "draw") {
    return "It's a draw!";
  } else if (player === Comp) {
    return "Computer wins!";
  } else {
    return "Player two wins!";
  }
}

// Function to update the score
function updateScore(scr) {
  var toNum = Number(scr);
  toNum += 1;
  return toNum.toString();
}

// Declare winCheck function to check at end of turn if player won
// Loop through winning combos and see if player has any winning combos among their sqsClaimed
function winCheck(player) {
  var winCombo = [];
  var finalCombo = [];
  for (var i = 0; i < winningCombos.length; i++) {
    var winArr = winningCombos[i];
    for (var a = 0; a < winArr.length; a++ ) {
        var indexCheck = player['sqsClaimed'].indexOf(winArr[a]);
        if (indexCheck !== -1) {
          finalCombo.push(winArr[a]);
        }
        if (a === winArr.length - 1) { // test length of final combo array
          var winTest = finalCombo.length === 3 ? "win" : "no win";
          if (winTest !== "win") { finalCombo = []; }
          else {
            for (var n = 0; n < finalCombo.length; n++) { winCombo.push(finalCombo[n]); }
            finalCombo = [];
          } }
    } } // ======= end of for loops =======
  if (winCombo.length === 3) {
    $(winCombo[0]).css("background-color", "#ffff99");
    $(winCombo[1]).css("background-color", "#ffff99");
    $(winCombo[2]).css("background-color", "#ffff99");
    var info = forInfoWin(player); // to generate info for the user
    $("#info").text(info);
    if (info === "Player one wins!") {
      var score = $("#oneNumScore").text(); // update score
      score = updateScore(score);
      $("#oneNumScore").text(score);
    } else { // player two or computer wins
      var score = $("#twoNumScore").text(); // update the score
      score = updateScore(score);
      $("#twoNumScore").text(score);
    }
    return "End game"; // returned value at end of function
  }

  else if (winTest === "no win" && usedSquares.length === 9) {
        var infoDraw = forInfoWin("draw"); // to generate info for the user
        $("#info").text(infoDraw);
        return "End game"; // returned value at end of function
  }

  else if (winTest === "no win" && usedSquares.length < 9) {
    // Then continue the game; switch to other player
    if (game === "v2plyr") { pToggle(); }
    else { pToggleV1Plyr(); }
    playerNotification(); // Notify player that it's their turn
    return "Game continues"; // returned value at end of function
  }

} // End of win check function declaration

// ===== Reset vars to default after end game code (for a new game) ==============

function resetVarstoDefault() {
  console.log(player);
  disableClickEvents();
  player = ""; // important to set this to empty to prevent duplication when click on newGame
  $("#newGame").fadeIn("slow"); // New game btn appears
  $("#newGame").one("click", function() { // When you click on new game btn, reset to default
    // Variables
    usedSquares = [];
    PlayerOne['sqsClaimed'] = [];
    PlayerTwo['sqsClaimed'] = [];
    Comp['sqsClaimed'] = [];
    p1WinningCombos = winningCombos;
    compsWinningArr = winningCombos;
    sqChoice = "";
    oneFromWin = false;
    defense = false;
    // jQuery appearance in DOM
    enableClicks();
    $("#info").text("");
    $(".sqContent").text("");
    $(".sq").css("background-color", "transparent");
    $("#newGame").fadeOut("slow");
    randomRoll = Math.floor(Math.random() * 2 + 1);
    if (game === "v2plyr") { // randomly asign player for new game
      player = randomRoll > 1 ? PlayerOne : PlayerTwo;
    } else {
      player = randomRoll > 1 ? PlayerOne : Comp;
    }
    playerNotification(); // Notify first player of their turn
    if (player === Comp) {
      // if it's comp's turn, it should have its move now
      disableClickEvents();
      setTimeout(computersMove, 1000); // Fire comp's first move if it's their turn
    }
  }); // End of new game button
}
// End of reset vars to default function

// disable click events --> temporarily
function disableClickEvents() {
  $(".sq").css("pointer-events", "none");
  $(".sq").css("cursor", "wait");
}
function enableClicks() {
  $(".sq").css("pointer-events", "auto");
  $(".sq").css("cursor", "pointer");
}

// ======== Computers Move function ===========================

var computersMove = function() {
  enableClicks();
  // If comp is one sq from winning, take it
  isCloseToWin(); // Sets oneFromWin to true if comp can win now and gives a val to sqChoice
  if (!oneFromWin) {
    // if oneFromWin remains false (comp is not 1 sq from win), check need for defense
    compDefenseAI(); // Sets defense to true if P1 is 1 sq from winning and gives sqChoice
    if (!defense) {
      // If oneFromWin and defense are false, Comp must make a choice among available squares
      sqChoice = machineAI(); // Launches decision process function and returns a single sq str
    }
  }
  // Update the win combo arrays for both Comp and Player One based on sqChoice
  compsWinningArr = moverUpdateArr(sqChoice, compsWinningArr); // Comp was the mover
  p1WinningCombos = nonMoverUpdateArr(sqChoice, p1WinningCombos); // player non-mover
  // Reset defense and oneFromWin vars to default for next turn
  oneFromWin = false;
  defense = false;
  // Execute jQuery to input visually
  if (player !== "") {
    // If player variable is not set to "" then do the following
    claimSquare(sqChoice, player); // Inputs sqChoice into the DOM visually and stores in vars
    notificationEnd();
    var gameCondition = winCheck(player); // this toggles the player at the end if game continues
    if (gameCondition === "End game") { resetVarstoDefault(); }
  } // If player variable is not set to ""

} // computers move function end (end of function declaration)

}); // End of document ready
