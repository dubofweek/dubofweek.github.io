window.addEventListener('load', function () {

    var intervalID = window.setInterval(myCallback, 10000);
    function myCallback() {
        var loImages = document.getElementsByClassName('js-img-to-reload');
        for (i = 0; i < loImages.length; i++) {
            var childDiv = loImages[i];
            loImages[i].src = loImages[i].src + '?' + new Date().getTime()
        }
    }

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    var $navbarDropdowns = Array.prototype.slice.call(document.querySelectorAll('.navbar-item.has-dropdown'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) { // Add a click event on each of them
        $navbarBurgers.forEach(el => {
            el.addEventListener('click', () => { // Get the target from the "data-target" attribute
                const target = el.dataset.target;
                const $target = document.getElementById(target);
                // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
            });
        });
        // Check if there are any navbar dropdowns
        if ($navbarDropdowns.length > 0) { // Add a click event on each of them
            $navbarDropdowns.forEach(function ($el) {
                $el.addEventListener('click', function () { // Toggle the class on "navbar dropdown"
                    $el.classList.toggle('is-active');
                });
            });
        }
    }

})


var nextPage = 2,
totalPages = document.getElementById("total-pages"),
loadMoreButton = document.getElementById("load-more-button"),
loadMoreUrl = loadMoreButton ? loadMoreButton.dataset.url : null;
let isLoading = !1,
loadedPages = [];
function initPhotosPage() {
    function e() {
        let e = document.getElementById("footer") ? document.getElementById("footer").offsetHeight : 0;
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 600 - e && (isLoading || loadedPages.includes(nextPage) || (loadedPages.push(nextPage), isLoading = !0, fetch(loadMoreUrl.replace("0", nextPage)).then(e => e.text()).then(e => {
            if ("" === e.trim()) {
                isLoading = !1;
                return
            } (function e(t) {
                let o = document.createElement("div");
                o.innerHTML = t;
                let n = Array.from(o.childNodes),
                a = document.querySelector("#photo-container");
                a && n.forEach(e => {
                    a.appendChild(e)
                })
            })(e),
            nextPage++,
            isLoading = !1
        }).
        catch(e => {
            console.error("Error loading more photos:", e),
            isLoading = !1
        })))
    }
    window.addEventListener("scroll", e, {
        passive: !0
    }),
    window.addEventListener("beforeunload", () => {
        window.removeEventListener("scroll", e, {
            passive: !0
        })
    })
}
window.addEventListener("load", function() {
    document.getElementById("photos-page-js") && initPhotosPage()
});