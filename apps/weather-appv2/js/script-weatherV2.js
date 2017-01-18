$(document).ready(function() {

  $(".container").hide();

  var appid = "&APPID=e027b55814f16a9161e2fcff45bd2b97";
  var unitsF = "&units=imperial";
  var unitsC = "&units=metric";
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  var date = new Date();
  var hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  var mins = date.getMinutes().toString().length < 2 ? "0"+date.getMinutes().toString() : date.getMinutes().toString();
  var amOrPm = date.getHours() >= 12 ? "pm":"am";
  var month = months[date.getMonth()];
  var day = days[date.getDay()];
  var dayInMo = date.getDate().toString();
  var year = date.getFullYear().toString();

  var stopId = setInterval(function() {
    var check = $(".wait").text();
    if (check.length === 7) {
      $(".wait").text("Working.");
    } else if (check.length === 8) {
      $(".wait").text("Working..");
    } else if (check.length === 9) {
      $(".wait").text("Working...");
    } else if (check.length === 10) {
      $(".wait").text("Working....");
    } else {
      $(".wait").text("Working");
    }
  }, 500);

  if("geolocation" in navigator) {
	   navigator.geolocation.getCurrentPosition(function(position) {
		     ajaxCall(position); // depends on param of API return
	   });
  } else {
    clearInterval(stopId);
    $(".wait").text("Error: Please try again!");
    alert("To ensure the app works, please use either Chrome or Firefox and be sure to 'allow' the browser access to your location. Please reload the page.");
  }

  function ajaxCall(position) {
    $.ajax({
      type:"GET",
      url: "http://api.openweathermap.org/data/2.5/find?lat="+position.coords.latitude+"&lon="+position.coords.longitude+"&units=imperial&cnt=1"+appid,
      success: function(data) {
        console.log(data);
        var units = "imperial";
        var city = data.list[0].name;
        var displayDate = month+" "+dayInMo+", "+year;
        var currTime = hour.toString()+":"+mins+" "+amOrPm;
        var temp = Math.round(data.list[0].main.temp);
        var maxTemp = Math.round(data.list[0].main.temp_max);
        var minTemp = Math.round(data.list[0].main.temp_min);
        var humidity = data.list[0].main.humidity.toString() + " %";
        var weather =  data.list[0].weather[0].main;
        var apiIcon = data.list[0].weather[0].icon;
        // Adjust Temperatures and get icon
        var tempNow = setTemp(temp, units);
        var iconClass = "wi " + getIcon(apiIcon);
        var maxTempNow = setTemp(maxTemp, units);
        var minTempNow = setTemp(minTemp, units);

        if (city.length > 18) {
          var cityAdjust = city.split("").slice(0, 13).join("") + "...";
          city = cityAdjust;
        }
        if (weather.length > 22) {
          $("#description").css("font-size", "20px");
        }

        $("#glyph i").addClass(iconClass);
        $("#city").text(city);
        $("#day").text(day);
        $("#moDayYear").text(displayDate);
        $("#time").text(currTime);
        $("#tempNow").text(tempNow);
        $("#maxTempVal").text(maxTempNow);
        $("#minTempVal").text(minTempNow);
        $("#humidity").text(humidity);
        $("#description").text(weather);

        $(".container").fadeIn("slow");
        $(".wait").hide();
        clearInterval(stopId);

        $("#tempNow").on("click", function() {
          if (units === "imperial") { units = "metric"; }
          else { units = "imperial"; }
          tempNow = setTemp(temp, units);
          maxTempNow = setTemp(maxTemp, units);
          minTempNow = setTemp(minTemp, units);
          $("#tempNow").text(tempNow);
          $("#maxTempVal").text(maxTempNow);
          $("#minTempVal").text(minTempNow);
        }); // End of event handler

      } // End success function
    });
  } // end of ajaxCall function declaration

  function setTemp(temp, units) {
    var farDeg = " °F";
    var celDeg = " °C";
    if (units === "imperial") {
      return temp.toString() + farDeg;
    } else {
      var tempInC = convertToC(temp);
      return tempInC.toString() + celDeg;
    }
  }

  function convertToC(num) {
    return Math.round((num - 32) * 0.56);
  }

  function getIcon(iconId) {
    switch (iconId) {
      case "01d":
        return "wi-day-sunny";
        break;
      case "01n":
        return "wi-night-clear";
        break;
      case "02d":
        return "wi-day-cloudy";
        break;
      case "02n":
        return "wi-night-alt-cloudy";
        break;
      case "03d":
      case "03n":
        return "wi-cloud";
        break;
      case "04d":
      case "04n":
        return "wi-cloudy";
        break;
      case "09d":
      case "09n":
        return "wi-showers";
        break;
      case "10d":
        return "wi-day-rain";
        break;
      case "10n":
        return "wi-night-rain";
        break;
      case "11d":
      case "11n":
        return "wi-storm-showers";
        break;
      case "13d":
      case "13n":
        return "wi-snow";
        break;
      case "50d":
      case "50n":
        return "wi-fog";
        break;
      default:
        return "wi-wind-direction";
        break;
    }
  }

}); // End of doc ready
