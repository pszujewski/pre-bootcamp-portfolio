$(document).ready(function() {

var x = Big(3);
var y = x.minus(1).toString();

console.log(x);

//Empty array to display number that is input
var numberArrStr = [];
// Empty array to store the succession of operations chosen by user
var operationsNumsArr = [];
// Define a function that returns math operation to effect a calculation
function findOperation(operator, a, b) {
  a = Big(a);
  switch (operator) {
    case "+":
      return a.plus(b).toString();
      break;
    case "-":
      return a.sub(b).toString();
      break;
    case "*":
      if (a === 0 || b === 0) {
        return 0;
      } else {
        return a.times(b).toString();
      }
      break;
    case "%":
      return a % b;
      break;
    case "division":
      return a.div(b).toString();
      break;
  };
}

// Remove and add box shadow effect when any button is clicked
$("li").click(function() {
  var $el = $(this);
  $el.removeClass("shadow").addClass("no-shadow");
  setTimeout(function() {
    $el.removeClass("no-shadow").addClass("shadow");
  }, 130);
});

//User inputs a number into the calculator, building number one button at a time
$(".number-btn").on("click", function() {
  // Number chosen is stored in variable and pushed to an array storing all user choices
  var numberVal = $(this).text();
  numberArrStr.push(numberVal);
  // Array of stringed numbers is joined into a sinlge string and displayed
  var displayNum = numberArrStr.join("");
  $("#display").text(displayNum);
});

//Operator button to store the user's chosen operation
$(".operator-btn").on("click", function() {
  // Operator button is clicked, so save the current displayed value
  //Add the last finished number to the operations array; the user finished this number
  if ($("#display").text() !== "Input new operation") {
    operationsNumsArr.push($("#display").text());
  }
  //Identify the operation to add to array
  var operation = $(this).text();
  $("#display").text(operation);
  if (operation === "/") {
    operation = "division";
  }
  operationsNumsArr.push(operation);
  numberArrStr = [];
  console.log(operationsNumsArr);
});

// Solve the current equation with the equals button
$(".equals-btn").on("click", function() {
  // Add the last input number to the operation array of strings
  var valNow = $("#display").text();
  operationsNumsArr.push(valNow);
  console.log(operationsNumsArr);

  //Take first number and convert it to a 'numbered' data item, the 1st arr item is def a num
  var number;
  var counter = Number(operationsNumsArr[0]);
  var action = "";
  for (var i = 1; i < operationsNumsArr.length; i++) {
    // Loop through operations array, storing any operation in the action variable
    if (operationsNumsArr[i] !== "0") {
      number = Number(operationsNumsArr[i]);
    } else {
      number = 0;
    }
    if (!number && number !== 0) {
      //number is NaN, so it's an operation; store it in the action variable
      action = operationsNumsArr[i];
    } else {
      //Run the find operation function and store result in the counter variable
      counter = findOperation(action, counter, number);
    }
  }
  var currentNum = counter.toString();
  if (currentNum.length >= 15) {
  //If string gets too long for display, reset all to default and alert user of reset
      alert("Digit limit reached. Please start again.");
      numberArrStr = [];
      operationsNumsArr = [];
      $("#display").text("0");
  } else {
    // Otherwise display the result and reset operations array for next input expression
    $("#display").text(counter);
    operationsNumsArr = [];
  }
});

// Clear All button, empty all arrays and return to default setting
$("#btn-ac").on("click", function() {
  numberArrStr = [];
  operationsNumsArr = [];
  $("#display").text("0");
});

// Clear last operation button
$("#btn-ce").on("click", function() {
  // Clear the current number array user was building, display 0
  numberArrStr = [];
  //$("#display").text("0");
  // Identify if the last item input into calculator was an operation
  var idx = operationsNumsArr.length - 1;
  var lastArrItem = operationsNumsArr[idx];
  // If the last item in the array is an operation, you must remove it.
  if (lastArrItem === "+" || lastArrItem === "-" || lastArrItem === "*" || lastArrItem === "division" || lastArrItem === "%") {
    operationsNumsArr.pop();
    $("#display").text("Input new operation");
  }
});

}); // End of document ready
