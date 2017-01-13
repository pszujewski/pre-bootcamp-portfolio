$(document).ready(function() {
  // sort array according to online, offline, and closed account
  // global variables
  var userArray = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"];
  var btnIdArr = ["btnOnline", "btnOffline", "btnAll"];

  // call functions

  for (i = 0; i < userArray.length; i++) {
    jsonCall("streams", userArray[i], findData);
  }

  $(".btn").on("click", function() {
    var btnId = $(this).attr("id");
    if (btnId === "btnOnline") {
      $(".online").show();
      $(".offline").hide();
    } else if (btnId === "btnOffline") {
      $(".offline").show();
      $(".online").hide();
    } else if (btnId === "btnAll") {
      $(".offline").show();
      $(".online").show();
    }
    for (var a = 0; a < btnIdArr.length; a++) {
      if (btnIdArr[a] === btnId) {
        btnId = "#" + btnId;
        $(btnId).removeClass("inActive").addClass("active");
      } else {
        var id = "#" + btnIdArr[a];
        $(id).removeClass("active").addClass("inActive");
      }
    }
  });

  $(".smlBtn").on("click", function() {
    var searchVal = $("#search").val();
    if (searchVal !== " ") {
      searchVal = convertVal(searchVal);
      var result = searchForVal(searchVal);
      console.log(result);
      if (result !== undefined) {
        for (var i = 0; i < userArray.length; i++) {
          var checkId = convertVal(userArray[i]);
          if (checkId !== result) {
            var jqId = "#"+checkId;
            $(jqId).parent().hide();
            $("#search").val(" ");
          }
        }
      } else {
        alert("Error: no results found");
      }
      return false;
    }
  });
  /*$(document).on("click", ".profile .profileText", function() {
    var showId = $(this).attr("id");
    console.log(showId);
  });*/

  // ============================= Create DOM content functions =============================

  function profileHtml(onOrOff, logo, status) {
    if (onOrOff === "on") {
      return "<div class='profile online'><img class='logoPic' src="+logo+">"+status+"</div>";
    } else {
      return "<div class='profile offline'><img class='logoPic' src="+logo+">"+status+"</div>";
    }
  }

  function makeProfile(onOrOff, name, linkUrl, game, logo) {
    var status = "";
    var idName = name.toLowerCase().split("");
    idName = idName.filter(function(val) {
      return val !== " " && val !== "_" && val !== "-";
    }).join("");
    if (onOrOff === "on") {
      status = "<p class='profileText' id='"+idName+"'><a href='"+linkUrl+"'>"+name+"</a> is now streaming "+game+"</p>";
    } else if (onOrOff === "off"){ // it is equal to 'off'
      status = "<p class='profileText' id='"+idName+"'><a href='"+linkUrl+"'>"+name+"</a> is currently offline</p>";
    } else { // it is equal to error
      status = "<p class='profileText' id='"+idName+"'>"+name+" has closed their account</p>";
      logo = "./images/bruceLee.jpg";
    }
    return profileHtml(onOrOff, logo, status);
  }

  // ============================= api call function declarations ============================

  function jsonCall(type, user, callback) {
    $.getJSON("https://wind-bow.gomix.me/twitch-api/"+type+"/" + user, function(data) {
        callback(user, data);
    });
  }

  function findData(user, data) {
    if (data.stream !== null) { // user is online
      var htmlOn = makeProfile("on", data.stream.channel.display_name, data.stream.channel.url, data.stream.channel.game, data.stream.channel.logo);
      $(".profilesBin").append(htmlOn);
    } else { // user is offline or no longer exists
      jsonCall("channels", user, updateOffline);
    }
  }

  function updateOffline(user, data) {
    if (data.status === 404) {
      var htmlErr = makeProfile("error", user);
      $(".profilesBin").append(htmlErr);
    } else {
      var htmlOff = makeProfile("off", data.display_name, data.url, data.game, data.logo);
      $(".profilesBin").append(htmlOff);
    }
  }

  // search functionality
  function convertVal(val) {
    val = val.toLowerCase().split("");
    return val = val.filter(function(item) {
      return item !== " " && item !== "_" && item !== "-";
    }).join("");
  } // End of function

  function searchForVal(val) {
    for (var i = 0; i < userArray.length; i++) {
      var userArr = [];
      var user = userArray[i].toLowerCase().split("");
      for (var a = 0; a < user.length; a++) {
        if (user[a] !== " " && user[a] !== "_" && user[a] !== "-") {
            userArr.push(user[a]);
        }
      }
      if (val === userArr.join("")) {
        return userArr.join("");
      }
    } // End of first for loop
  } // end of function

}); // End of document ready
