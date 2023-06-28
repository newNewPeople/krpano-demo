export const getQueryString = (url, paraName) => {
    const arrObj = url.split('?')
    if (arrObj.length > 1) {
        const arrPara = arrObj[1].split('&')
        let arr
        for (let i = 0; i < arrPara.length; i++) {
            arr = arrPara[i].split('=')
            // eslint-disable-next-line eqeqeq
            if (arr != null && arr[0] == paraName) {
                return arr[1]
            }
        }
        return ''
    } else {
        return ''
    }
}

export const getTime = () => {
    var dd = new Date();
    var y = dd.getFullYear();
    var m =
        dd.getMonth() + 1 < 10 ?
        "0" + (dd.getMonth() + 1) :
        dd.getMonth() + 1;
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
    var h = dd.getHours() < 10 ? "0" + dd.getHours() : dd.getHours();
    var min =
        dd.getMinutes() < 10 ? "0" + dd.getMinutes() : dd.getMinutes();
    var s =
        dd.getSeconds() < 10 ? "0" + dd.getSeconds() : dd.getSeconds();
    return y + "-" + m + "-" + d + " " + h + ":" + min + ":" + s;
}

export const isMobile = () => {
    (function () {
        var f = /iPhone/i,
            j = /iPod/i,
            p = /iPad/i,
            g = /\bAndroid(?:.+)Mobile\b/i,
            i = /Android/i,
            d = /\bAndroid(?:.+)SD4930UR\b/i,
            e = /\bAndroid(?:.+)(?:KF[A-Z]{2,4})\b/i,
            c = /Windows Phone/i,
            h = /\bWindows(?:.+)ARM\b/i,
            k = /BlackBerry/i,
            l = /BB10/i,
            m = /Opera Mini/i,
            n = /\b(CriOS|Chrome)(?:.+)Mobile/i,
            o = /Mobile(?:.+)Firefox\b/i;

        function b($, a) {
            return $.test(a)
        }

        function a($) {
            var a = ($ = $ || ("undefined" != typeof navigator ? navigator.userAgent : "")).split("[FBAN");
            void 0 !== a[1] && ($ = a[0]), void 0 !== (a = $.split("Twitter"))[1] && ($ = a[0]);
            var r = {
                apple: {
                    phone: b(f, $) && !b(c, $),
                    ipod: b(j, $),
                    tablet: !b(f, $) && b(p, $) && !b(c, $),
                    device: (b(f, $) || b(j, $) || b(p, $)) && !b(c, $)
                },
                amazon: {
                    phone: b(d, $),
                    tablet: !b(d, $) && b(e, $),
                    device: b(d, $) || b(e, $)
                },
                android: {
                    phone: !b(c, $) && b(d, $) || !b(c, $) && b(g, $),
                    tablet: !b(c, $) && !b(d, $) && !b(g, $) && (b(e, $) || b(i, $)),
                    device: !b(c, $) && (b(d, $) || b(e, $) || b(g, $) || b(i, $)) || b(/\bokhttp\b/i, $)
                },
                windows: {
                    phone: b(c, $),
                    tablet: b(h, $),
                    device: b(c, $) || b(h, $)
                },
                other: {
                    blackberry: b(k, $),
                    blackberry10: b(l, $),
                    opera: b(m, $),
                    firefox: b(o, $),
                    chrome: b(n, $),
                    device: b(k, $) || b(l, $) || b(m, $) || b(o, $) || b(n, $)
                },
                any: !1,
                phone: !1,
                tablet: !1
            };
            return r.any = r.apple.device || r.android.device || r.windows.device || r.other.device, r.phone = r.apple.phone || r.android.phone || r.windows.phone, r.tablet = r.apple.tablet || r.android.tablet || r.windows.tablet, r
        }
        window.isMobile = a();
    })();
    return window.isMobile.any
}