console.log("hey");
$(".pitch-scroller").scrollLeft(0);

/*probably can figure out the position of each of the boxes to make it scroll nicer*/
$("#pitch-scroll-left").click(function() {
    console.log("left");
    var leftPos = $(".pitch-scroller").scrollLeft();
    $(".pitch-scroller").animate({scrollLeft: leftPos - 350}, 500);
});

$("#pitch-scroll-right").click(function() {
    console.log("right");
    var leftPos = $(".pitch-scroller").scrollLeft();
    $(".pitch-scroller").animate({scrollLeft: leftPos + 350}, 500);
});