var http = new XMLHttpRequest();
var appid = "&APPID=e027b55814f16a9161e2fcff45bd2b97";

http.open("GET", "http://api.openweathermap.org/data/2.5/weather?id=2172797"+appid, true);
http.onload = function() {
  console.log(http.responseText);
};
http.send();

console.log(http);
