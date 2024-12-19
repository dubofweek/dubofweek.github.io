document.addEventListener("DOMContentLoaded", function () {
    const grid = document.querySelector('.link-items');
    imagesLoaded(grid, function () {
        new Masonry(grid, {
            itemSelector: '.link',
            percentPosition: true,
            columnWidth: '.link',
            gutter: 0
        });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll('.link img');

    images.forEach(img => {
        img.onload = function () {
            const aspectRatio = img.naturalHeight / img.naturalWidth;
            const container = img.parentElement;
            container.style.height = `${container.offsetWidth * aspectRatio}px`;
        };
    });
});


document.addEventListener("DOMContentLoaded", function () {
    var adsBlock = document.querySelector(".ads");
    var itemList1 = document.querySelector(".item-list1");
    var screenHeight = window.screen.height;
    var scrollY = window.scrollY;
    var aElements = document.querySelectorAll('.link-items div');
    var numberOfLinks = aElements.length;

    if (itemList1 && (numberOfLinks <= 10 || screenHeight >= 900 || scrollY > 500)) {
        itemList1.style.display = "block";
    }

    if (adsBlock && (numberOfLinks <= 10 || screenHeight >= 900 || scrollY > 500)) {
        addSriptToDom();
    }

    function addSriptToDom() {
        var script = document.createElement('script');
        script.async = true;
        script.type = 'application/javascript';
        script.src = 'https://a.magsrv.com/ad-provider.js';
        document.body.appendChild(script);
    }

    function addCodeOnScroll() {

        if (!addCodeOnScroll.hasScrolled) {
            if (itemList1) {
                itemList1.style.display = "block";
            }
            if (adsBlock) {
                addSriptToDom();
            }
            addCodeOnScroll.hasScrolled = true;
        }
    }

    if (itemList1 || adsBlock) {
        window.addEventListener('scroll', addCodeOnScroll);
    }
});
