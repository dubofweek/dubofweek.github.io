$(function() {
    btnBurger();

    $(window).on("resize", function() {
        if ($(window).width() <= 1024) {
            $(".header").removeClass("active");
        }
    });

    $(window).on("scroll", function() {
        if ($(window).width() > 1024) {
            $(".header").removeClass("active");
        }
    });
});


function btnBurger() {
    $(".burger").on("click", function() {
        const $this = $(this),
            $parent = $this.parents(".header");

        if ($parent.hasClass("active")) {
            $parent.removeClass("active");
        } else {
            if ($(window).width() <= 1024) {
                $("html, body").animate({ scrollTop: 0 }, "fast");
            }
            $parent.addClass("active");
        }
    });
}
