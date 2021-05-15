var gui = new dat.GUI();
var params = {
    randomSeed: 2,
    Download_Image: function () { return save(); },
};
gui.add(params, "randomSeed", 1, 100, 1);
gui.add(params, "Download_Image");
var NB_FRAMES_TO_EXPORT = 240;
var luminositeMoyP = 0;
var mdlV = new rw.HostedModel({
    url: "https://stylegan2-c5d338dc.hosted-models.runwayml.cloud/v1/",
});
var imgV;
var zV = [];
var frameNbV = 0;
var mdlP = new rw.HostedModel({
    url: "https://landscapes-21eee1a8.hosted-models.runwayml.cloud/v1/",
});
var imgP;
var zP = [];
var frameNbP = 0;
function draw() {
    randomSeed(params.randomSeed);
    if (imgV) {
        image(imgV, 0, 0, width, height);
    }
    if (imgP) {
        image(imgP, 0, 0, width, height);
    }
}
function setup() {
    p6_CreateCanvas();
    for (var i = 0; i < 512; i++) {
        zV[i] = random(-0.5, 0.5);
    }
    for (var i = 0; i < 512; i++) {
        zP[i] = random(-0.5, 0.5);
    }
    make_request_P();
}
function make_request_P() {
    var inputsP = {
        "z": zP,
        "truncation": 0.8,
    };
    mdlP.query(inputsP).then(function (outputs) {
        var image = outputs.image;
        imgP = createImg(image);
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                var couleur = get(x, y);
                luminositeMoyP = luminositeMoyP + ((red(couleur) + green(couleur) + blue(couleur)) / 3);
            }
        }
        imgP.hide();
        for (var i = 0; i < 512; i++) {
            if (random() < 0.5) {
                zP[i] += 0.5;
            }
            else {
                zP[i] -= 0.5;
            }
        }
        p5.prototype.downloadFile(image, 'p'.concat(frameNbP.toString()), "png");
        frameNbP++;
        if (frameNbP < NB_FRAMES_TO_EXPORT) {
            make_request_V();
        }
    });
}
function make_request_V() {
    var inputsV = {
        "z": zV,
        "truncation": 0.8,
    };
    mdlV.query(inputsV).then(function (outputs) {
        var image = outputs.image;
        imgV = createImg(image);
        luminositeMoyP = luminositeMoyP / (width * height);
        console.log(luminositeMoyP);
        zV[4] += 0.1;
        luminositeMoyP = 0;
        imgV.hide();
        p5.prototype.downloadFile(image, frameNbV.toString(), "png");
        frameNbV++;
        if (frameNbV < NB_FRAMES_TO_EXPORT) {
            make_request_P();
        }
    });
}
function windowResized() {
    p6_ResizeCanvas();
}
var __ASPECT_RATIO = 1;
var __MARGIN_SIZE = 25;
function __desiredCanvasWidth() {
    var windowRatio = windowWidth / windowHeight;
    if (__ASPECT_RATIO > windowRatio) {
        return windowWidth - __MARGIN_SIZE * 2;
    }
    else {
        return __desiredCanvasHeight() * __ASPECT_RATIO;
    }
}
function __desiredCanvasHeight() {
    var windowRatio = windowWidth / windowHeight;
    if (__ASPECT_RATIO > windowRatio) {
        return __desiredCanvasWidth() / __ASPECT_RATIO;
    }
    else {
        return windowHeight - __MARGIN_SIZE * 2;
    }
}
var __canvas;
function __centerCanvas() {
    __canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
}
function p6_CreateCanvas() {
    __canvas = createCanvas(__desiredCanvasWidth(), __desiredCanvasHeight());
    __centerCanvas();
}
function p6_ResizeCanvas() {
    resizeCanvas(__desiredCanvasWidth(), __desiredCanvasHeight());
    __centerCanvas();
}
var p6_SaveImageSequence = function (durationInFrames, fileExtension) {
    if (frameCount <= durationInFrames) {
        noLoop();
        var filename_1 = nf(frameCount - 1, ceil(log(durationInFrames) / log(10)));
        var mimeType = (function () {
            switch (fileExtension) {
                case 'png':
                    return 'image/png';
                case 'jpeg':
                case 'jpg':
                    return 'image/jpeg';
            }
        })();
        __canvas.elt.toBlob(function (blob) {
            p5.prototype.downloadFile(blob, filename_1, fileExtension);
            setTimeout(function () { return loop(); }, 100);
        }, mimeType);
    }
};
//# sourceMappingURL=../src/src/build.js.map