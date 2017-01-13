$(document).ready(function() {

  /*************************************************************

                          SIMON GAME
  Note: to reset the game during game play, turn the game 'off'
  and back on to completely reset during the game. Win the
  game by reaching a 'count' of 15. The game can be
  restarted after winning.

  *************************************************************/

  // Global variable declarations
  var count = 0;
  var countStr = ""; // To track each turn
  var sequence = []; // To track the sequence generated randomly by randomRoll
  var plyrSequence = []; // To track and compare sequence input by player
  var strict = false; // pushing strict button sets it to true
  var btnIds = ["#g1", "#r2", "#y3", "#b4"]; // btn Ids
  var winStopId; // globally store interval stop Id in declare win function
  var clickIsActive = true; // store if click events on .button items are active or not

  // ============================== Function Declarations ==================================

  // addToSequence() --> randomly generate an addition to sequence array
  function addToSequence() {
    var random = Math.floor(Math.random() * 4); // will give a number 0 - 3
    sequence.push(btnIds[random]);
  }

  // disable click events --> temporarily
  function disableClickEvents() {
    $(".button").css("pointer-events", "none");
    $(".roundBtn").css("pointer-events", "none");
    clickIsActive = false;
  }

  // playSequenceItems() --> animations to be used in a loop thru sequence, with setTimeout
  function playSequenceItems() {
    if (clickIsActive) { disableClickEvents(); }
    $(".button").css("cursor", "wait");
    $(".roundBtn").css("cursor", "wait");
    var s = 0;
    var stopId = setInterval(function() {
      var animation = animateBtn(sequence[s]); // returns an array with class names as strings
      $(sequence[s]).removeClass(animation[0]).addClass(animation[1]);
      setTimeout(function() {
        $(sequence[s]).removeClass(animation[1]).addClass(animation[0]);
        s++; // loop through sequence array
      }, 1000); // execute after one second passes
      if (s === sequence.length) { // Then end the interval
        $(".button").css("cursor", "pointer");
        $(".button").css("pointer-events", "auto");
        $(".roundBtn").css("cursor", "pointer");
        $(".roundBtn").css("pointer-events", "auto");
        clickIsActive = true;
        clearInterval(stopId);
      }
    }, 1150); // execute interval every 1.1 seconds
  }

  // displayError() --> display "!!" in counter, then display "error"
  function displayError() {
    disableClickEvents();
    plyrSequence = []; // Reset for next round
    $("#countBar").text("!!");
    setTimeout(function() {
      $("#countBar").text("Error");
    }, 800);
  }

  // resetGame() --> all global vars are reset for a new game
  function resetGame() {
    count = 0;
    countStr = count.toString();
    $("#countBar").text(countStr);
    sequence = [];
    plyrSequence = [];
  }

  // animateBtn function, returns classes to be manipulated using jQuery
  function animateBtn(btnId) {
    var currAndTemp = [];
    if (btnId === "#g1") {
      currAndTemp.push("green");
      currAndTemp.push("lightg");
      sound1.play();
    } else if (btnId === "#r2") {
      currAndTemp.push("red");
      currAndTemp.push("lightr");
      sound2.play();
    } else if (btnId === "#y3") {
      currAndTemp.push("yellow");
      currAndTemp.push("lighty");
      sound3.play();
    } else if (btnId === "#b4") {
      currAndTemp.push("blue");
      currAndTemp.push("lightb");
      sound4.play();
    }
    return currAndTemp;
  }

  // declareWin function loops through the array and shows the following msg if win is achieved
  function declareWin() {
    return setTimeout(function() {
      var victoryArr = ["click", "red", "btn", "for", "new", "game", "u win!"];
      var i = 0;
      return winStopId = setInterval(function() {
        $("#countBar").text(victoryArr[i]);
        i++;
        if (i === victoryArr.length) { i = 0; }
      }, 1200);
    }, 2000);
  }

  // ===================== End of Function Declarations ========================

  // Game play events ==========================

  $("#onSlide").on("click", function() { // main wrapper event handler
    // Add activeBlueSlider class to this ID and remove same class from #offSlide ID
    $(this).removeClass("blackSlider").addClass("activeBlueSlider");
    $("#offSlide").removeClass("activeBlueSlider").addClass("blackSlider");

    $("#strictBtn").on("click", function() {
      // toggle strict variable's value, puts game in 'strict mode'
      if (strict) {
        strict = false;
        $("#dot").removeClass("dotActive").addClass("dotNotActive");
      }
      else {
        strict = true;
        $("#dot").removeClass("dotNotActive").addClass("dotActive");
      }
    }); // End of strictBtn event

    $("#startBtn").on("click", function() { // to start the game
      if (winStopId !== undefined) { clearInterval(winStopId); } // If plyr won previous round
      resetGame(); // ensure all vars are set to default value for new game
      addToSequence(); // execute to randomly choose first sequence in game pattern.
      playSequenceItems(); // animate the sequence for the user

      // To reset the game, do the following (turn game 'off')
      $("#offSlide").on("click", function() {
        // animation
        $(this).removeClass("blackSlider").addClass("activeBlueSlider");
        $("#onSlide").removeClass("activeBlueSlider").addClass("blackSlider");
        $("#countBar").text("reset");
        // functionality
        $(".button").off("mousedown"); // to turn off for current iteration of click event...
        $(".button").off("mouseup"); // on startBtn; MUST EXECUTE THIS
      });

      // Player then is expected to input the same sequence by clicking the colored buttons
      $(".button").on("mousedown", function() {
        // player has chosen a btn and follow random pattern in sequence to succeed
        var success = true; // to track players success in executing pattern
        var btnId = "#" + $(this).attr("id"); // store player's btn choice in var
        plyrSequence.push(btnId); // store player's choice in their array and animate
        var toAnimate = animateBtn(btnId);
        $(btnId).removeClass(toAnimate[0]).addClass(toAnimate[1]);

        // Second event handler to make animation possible
        $(btnId).on("mouseup", function() {
          // finish animation
          $(btnId).removeClass(toAnimate[1]).addClass(toAnimate[0]);
          // compare player's sequence of presses to the actual sequence
          for (var j = 0; j < plyrSequence.length; j++) {
            if (plyrSequence[j] !== sequence[j]) { // then plyr made an ERROR
              if(!strict) { // not in strict mode
                success = false; // to ensure followng if statement below won't run
                displayError();
                setTimeout(function() {
                  countStr = count.toString();
                  $("#countBar").text(countStr);
                }, 3000);
                setTimeout(function() { playSequenceItems(); }, 3000);
              } else { // strict is true
                success = false; // to ensure followng if statement below won't run
                displayError();
                setTimeout(function() { resetGame(); }, 3000); // count to 0
                setTimeout(function() {
                  addToSequence(); // restart sequence array of random pattern
                  playSequenceItems();
                }, 3000);
              }
              break; // End the loop
            } // End of if statement if (plyrSequence[j] !== sequence[j])
          } // End of for loop

          if (success && plyrSequence.length === sequence.length) {
            // if plyr finishes full array and it matches (in either strict mode or not)
            plyrSequence = []; // reset this for next round
            count++;
            countStr = count.toString();
            $("#countBar").text(countStr);
            addToSequence();
            if (count === 6) { // Then the user won the game
              $("#countBar").text("u win!");
              $(".button").off("mousedown"); // for the next round, turn current mouse...
              $(".button").off("mouseup"); // events to off, else u will have duplicates !
              winStopId = declareWin(); // to pass msg to user that they won the game
            } else { // else game continues
              playSequenceItems();
            }
          } // End of success if statement

        // If player chooses to reset the game during game play, they can do following
        $("#offSlide").on("click", function() { // turn game off
          $(this).removeClass("blackSlider").addClass("activeBlueSlider");
          $("#onSlide").removeClass("activeBlueSlider").addClass("blackSlider");
          $("#countBar").text("reset");
          $(".button").off("mousedown");
          $(".button").off("mouseup");
          $("#startBtn").off("click");
        }); // End of offSlide event

        }); // End of mouseup function event handler
      }); // End of mousedown event

    }); // End of start btn click event handler
  }); // End of onSlide click event handler


}); // End of document ready
