console.log("hey");
$(".pitch-scroller").scrollLeft(0);
$("#main-cont > div").each(function() {
    $(this).hide();
})
$("#canvas-container").show();

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

$(".cube").click(function() {
    $("#main-cont > div").each(function() {
        $(this).hide();
    })
    $("#canvas-container").show();
})

$(".dm").click(function() {
    $("#main-cont > div").each(function() {
        $(this).hide();
    })
    $("#dms-body").show();
})