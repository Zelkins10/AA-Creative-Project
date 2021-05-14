var gui = new dat.GUI();
var params = {
    Download_Image: function () { return save(); },
};
gui.add(params, "Download_Image");
var mdl = new rw.HostedModel({
    url: "https://stylegan2-d754f125.hosted-models.runwayml.cloud/v1/",
});
var mdl2 = new rw.HostedModel({
    url: "https://landscapes-42d075ff.hosted-models.runwayml.cloud/v1/",
});
var img;
var z = [];
var frameNB = 0;
var img2;
var z2 = [];
var frameNB2 = 0;
var NB_FRAMES_TO_EXPORT = 12;
var jauneMoy = 0;
var bleuMoy = 0;
function draw() {
    if (img) {
        image(img, 0, 0, width, height);
    }
    if (img2) {
        image(img2, 0, 0, width, height);
    }
}
function setup() {
    p6_CreateCanvas();
    for (var i = 0; i < 512; i++) {
        z[i] = random(-0.5, 0.5);
    }
    for (var i = 0; i < 512; i++) {
        z2[i] = random(-0.5, 0.5);
    }
    make_request2();
}
function make_request2() {
    var inputs2 = {
        "z": z2,
        "truncation": 0.8,
    };
    mdl2.query(inputs2).then(function (outputs) {
        var image = outputs.image;
        img2 = createImg(image);
        for (var x = 0; x < width; x = x + 1) {
            for (var y = 0; y < height; y = y + 1) {
                var couleur = get(x, y);
                jauneMoy = jauneMoy + red(couleur) + green(couleur);
                bleuMoy = bleuMoy + 2 * blue(couleur);
            }
        }
        img2.hide();
        z2[0] += 1;
        p5.prototype.downloadFile(image, frameNB2.toString(), "png");
        frameNB2++;
        if (frameNB2 < NB_FRAMES_TO_EXPORT) {
            make_request();
        }
    });
}
function make_request() {
    var inputs = {
        "z": z,
        "truncation": 0.8,
    };
    mdl.query(inputs).then(function (outputs) {
        var image = outputs.image;
        img = createImg(image);
        img.hide();
        if (jauneMoy < bleuMoy) {
            z[0] += 10;
            z[1] -= 10;
        }
        else {
            z[1] += 10;
            z[0] -= 10;
        }
        jauneMoy = 0;
        bleuMoy = 0;
        p5.prototype.downloadFile(image, frameNB.toString(), "png");
        frameNB++;
        if (frameNB < NB_FRAMES_TO_EXPORT) {
            make_request2();
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