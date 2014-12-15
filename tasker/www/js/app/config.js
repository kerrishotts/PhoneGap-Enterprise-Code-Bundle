define(function (require, exports, module) {
    "use strict";

    module.exports = {
        // change this to your local server, or you'll contact my server instead
        // which is probably /not/ what you want.
        baseURL: "https://pge-as.photokandy.com:4443",

        // replace with the SHA1 fingerprints from your certificates
        certificateFingerprints: [
            "A6 23 05 42 A6 D5 D7 99 DA 1C 43 1E E8 57 01 6C 4B FA EB 21"
        ]
    };
});
