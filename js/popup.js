function makeMoney(e) {
    document.addEventListener("DOMContentLoaded", function(o) {
        var t = !1;
        document.querySelector("a,body,input").addEventListener("click", o => {
            if (!t) {
                t = !0;
                var n = getCookie("nopop");
                if (setCookie("nopop", (n = n ? parseInt(n) : 1) + 1, 1), 1 == n) {
                    window.open(e, "", "width=1024,height=768,location=yes,toolbar=yes,menubar=yes,status=yes,scrollbars=yes,resizable=yes,top=1,left=1").blur(),
                    window.focus()
                }
            }
        })
    })
}
function setCookie(e, o, t) {
    var n = new Date;
    n.setHours(n.getHours() + 1);
    var s = escape(o) + (null == t ? "" : "; expires=" + n.toUTCString());
    document.cookie = e + "=" + s
}
function getCookie(e) {
    var o, t, n, s = document.cookie.split(";");
    for (o = 0; o < s.length; o++) if (t = s[o].substr(0, s[o].indexOf("=")), n = s[o].substr(s[o].indexOf("=") + 1), (t = t.replace(/^\s+|\s+$/g, "")) == e) return unescape(n)
}