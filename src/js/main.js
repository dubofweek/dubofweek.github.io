$(function() {
    btnBurger();

    $(window).on("resize", function() {
        if ($(window).width() <= 1024) {
            $(".header").removeClass("active");
            $('body').removeClass("no-scroll");
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
            if ($(window).width() <= 1024) {
                $('body').removeClass("no-scroll");
            }
            $parent.removeClass("active");
        } else {
            if ($(window).width() <= 1024) {
                $('body').addClass("no-scroll");

                $("html, body").animate({ scrollTop: 0 }, "fast");
            }
            $parent.addClass("active");
        }
    });
}
