$(document).ready(function() {

  var regexp = /\.\d\d?/g;

  function findRoughPercent(val, total) {
    var eval = val / total;
    if (eval === 1) { return "100%"; }
    else {
      var evalStr = eval.toString();
      var matchRes = evalStr.match(regexp);
      matchRes = matchRes.join();
      return matchRes.length === 3 ? matchRes[1] + matchRes[2] + "%" : matchRes[1] + "0" + "%";
    }
  }
  // Declare brief rounding function for finding a percent and displaying it as a string: findRoughPercent(val, total)

  $(".session-op").on("click", function() {
    var opValue = $(this).text();
    var sessionTimeVal = Number($("#Session").text());
    if (opValue === "-") { sessionTimeVal -= 1; }
    else { sessionTimeVal += 1; }
    var newVal = sessionTimeVal.toString();
    $("#Session").text(newVal);
  });
  $(".break-op").on("click", function() {
    var op2Value = $(this).text();
    var breakTimeVal = Number($("#Break").text());
    if (op2Value === "-") { breakTimeVal -= 1; }
    else { breakTimeVal += 1; }
    var new2Val = breakTimeVal.toString();
    $("#Break").text(new2Val);
  });
  // If click on the plus or minus associated with the p tags, then add/subtract to cooresponding number

  var counter = 0;
  var totalTime = 0;
  var t = 0;
  var timerTypeID = "#Session";
  var timerType = "Session";
  var percent = "";
  var timerDisplay = "";
  // Declare counter variable and variable to store conversion of minutes to milliseconds: totalTime in seconds, var t to track time changes in seconds, declare timerType set to 'session'; Declare percent variable set to empty string
  // declare timerDisplay variable as empty string

  var runEachSecond = function() {
    // Declare callback function for setInterval executions
    if (counter === 0) {
      $("#timerName").text(timerType);
      var timerLength = $(timerTypeID).text();
      t = Number(timerLength) * 60;
      totalTime = Number(timerLength) * 60;
      timerDisplay = timerLength + ":00";
      $("#progress").css("width", "0%");
      if (timerType === "Break") {
        $("#progress").removeClass("greenishBackground").addClass("tomatoColorBackground");
        $("#motivation").text("");
      } else {
        $("#progress").removeClass("tomatoColorBackground").addClass("greenishBackground");
        $("#motivation").text("Get at it!");
      }
    }
    // Change text of '#timerName' to timerType
    // capture value of time length for timerType $(timerType).text() in timerDisplay + ":00".
    // Convert number of minutes to seconds and store in t and totalTime
    // At beginning, t and totalTime will be equal.
    // use jQuery to set progress bar width at 0%

    var test = t % 60;
    // Evaluate t % 60
    // store the result in a test var

    if (test === 59) {
    // The minute value should be decreased by 1
      var grabTimerDisplayArr = $("#timer").text().split(":");
      grabTimerDisplayArr[0] = (Number(grabTimerDisplayArr[0]) - 1).toString();
      grabTimerDisplayArr[1] = test.toString();
      timerDisplay = grabTimerDisplayArr.join(":");
      // first split timerDisplay into an array with length 2 at the ":". Then loop through the array converting first item to a number and subtracting 1 and converting back to string, and changing the second item to num and then the setting it to 59, then change back to string. Join it with a ":"
    }

    else if (counter !== 0) {
    // The minute value does not need to be reset; only reset seconds according to test
      var grabTimerDisplayArr = $("#timer").text().split(":");
      var newSecondsVal = test.toString();
      var secondsDisplay = newSecondsVal.length > 1 ? newSecondsVal : "0" + newSecondsVal;
      grabTimerDisplayArr[1] = secondsDisplay;
      timerDisplay = grabTimerDisplayArr.join(":");
      // Find new seconds for the display by taking the result of var test expression and If the length of this string is 1, add a zero at index position 0 of the str.
      //Change the value of the second item to the new stringed seconds and then join it back into a string with ":".
    }

    t -= 1;
    if (counter < totalTime) { counter += 1; }
    percent = findRoughPercent(counter, totalTime);
    $("#timer").text(timerDisplay);
    if (counter % 2 === 0) { $("#progress").css("width", percent); }

    if (t === -1) {
    // Then first change change timerType variable value to whatever it is not (either "Session" or "Break") and reset counter to 0 and all other variables to default values
      if (timerType === "Session") {
        timerType = "Break";
        timerTypeID = "#Break";
      } else {
        timerType = "Session";
        timerTypeID = "#Session";
      }
      counter = 0;
      percent = "";
    }

    // console log tests
    console.log("==== " + counter + " ====");
    console.log(timerDisplay);
    console.log(t);
    console.log(percent);

    //End of callback function declaration
  } // End of runEachSecond function

  $("#timerName").one("click", function() {
    var stopId = setInterval(runEachSecond, 1000);
    //Execute the setInterval function with callback set at 1000 milliseconds
    // If click on reset button
    $("#resetBtn").on("click", function() {
      // Stop timer and reset to default settings
      clearInterval(stopId);
      counter = 0;
      totalTime = 0;
      t = 0;
      timerTypeID = "#Session";
      timerType = "Session";
      $("#timerName").text("START");
      $("#timer").text("00:00");
      $("#progress").css("width", "0%");
      // You can restart the timer from beginning
      $("#timerName").one("click", function() {
        stopId = setInterval(runEachSecond, 1000);
      });
    });

    // If click on pause button
    $("#pauseBtn").on("click", function() {
      // Stop timer but don't reset
      clearInterval(stopId);
      // If click on resume btn after clicking on pause button
      $("#resumeBtn").one("click", function() {
        stopId = setInterval(runEachSecond, 1000);
      });
    });
  });

}); //End of document ready
