// -------COUNTER------- //

function GetADC() {
  var xhttp = new XMLHttpRequest();
      var adc=0;
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    adc = Number(this.responseText);
          gauges.forEach(function (gauge) {			
        console.log(adc)
            gauge.write(adc);
          });
    }
  };
  xhttp.open("GET", "/getADC", false);
  xhttp.send();
}

// -------ANIMATIONS------- //

// $("#main")
// .bind("touchstart", function() {
//   $(this).addClass("active");
// })
// .bind("touchend", function() {
//   $(this).removeClass("active");
// });
// var mode = "home";

// $('#main').click(function() {
// if (mode == "home") {
//   TweenMax.to($('#home'), 0.4, {
//     y: -360
//   })
//   TweenMax.fromTo($('#car'), 0.4, {
//     y: 360,
//     autoAlpha: 1
//   }, {
//     y: 0

//   })
//   mode = "car";
// } else if (mode == "car") {
//   TweenMax.to($('#car'), 0.4, {
//     y: -360
//   })
//   TweenMax.fromTo($('#cardva'), 0.4, {
//     y: 360,
//     autoAlpha: 1
//   }, {
//     y: 0
  

//   })
//   mode = "cardva";
//   } else if (mode == "cardva") {
//   TweenMax.to($('#home'), 0.2, {
//     y: 0
//   })
//   TweenMax.fromTo($('#cardva'), 0.2, {
//     y: 0,
//     autoAlpha: 1
//   }, {
//     y: 360
//   })
//   mode = "home";

// }
// })

// ----- On render -----
$(function() {

makeRadial({
el: $('#radial'),
radials: 100
})
});

function makeRadial(options) {
if (options && options.el) {
var el = options.el;
var radials = 60;
if (options.radials) {
  radials = options.radials;
}
var degrees = 360 / radials;
var i = 0;
for (i = 0; i < (radials / 2); i++) {
  var newTick = $('<div class="tick"></div>').css({
    '-moz-transform': 'rotate(' + (i * degrees) + 'deg)'
  }).css({
    '-webkit-transform': 'rotate(' + (i * degrees) + 'deg)'
  }).css({
    'transform': 'rotate(' + (i * degrees) + 'deg)'
  })
  el.prepend(newTick);
}
}
}

