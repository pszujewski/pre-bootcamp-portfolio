$(document).ready(function() {
// Function declarations
  function setBtnCss(toActivate, deactivate1, deactivate2) {
    $("#"+toActivate).addClass("active");
    $("#"+deactivate1).removeClass("active");
    $("#"+deactivate2).removeClass("active");
  }

  function findPosition() {
    var positionNow = $(window).scrollTop();
    var aboutHeight = $(".about").height(); // locally defined
    var portfolioHeight = $(".portfolio").height() + aboutHeight;
    if (positionNow < aboutHeight) {
      setBtnCss("about", "portfolio", "contact"); // activate about btn
    } else if (positionNow >= aboutHeight && positionNow <= portfolioHeight) {
      setBtnCss("portfolio", "about", "contact"); // activate portfolio
    } else {
      setBtnCss("contact", "portfolio", "about");
    }
  }

  function intervalCallback() {
    if (didScroll) {
      findPosition();
    }
  }
// Global Variables
  var didScroll = false;
  var stopId;

  stopId = setInterval(intervalCallback, 250);
  findPosition();

  $(window).scroll(function() { didScroll = true; });

  $(".btn").on("click", function() {
    var correction;
    if ($(document).width() > 780) {
      correction = 100;
    } else {
      correction = 195;
    }
    clearInterval(stopId);
    var target = "."+$(this).attr("id");
    console.log(target);
    if (target === ".about") {
        setBtnCss("about", "portfolio", "contact");
     } else if (target === ".portfolio") {
        setBtnCss("portfolio", "about", "contact");
     } else {
        setBtnCss("contact", "portfolio", "about");
     }
    $(window).scrollTo($(target).offset().top-correction, 1000);
    setTimeout(function() {
      stopId = setInterval(intervalCallback, 250);
    }, 1050);
  });
});
