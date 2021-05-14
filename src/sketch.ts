// -------------------
//  Parameters and UI
// -------------------

const gui = new dat.GUI()
const params = {
    Download_Image: () => save(),
}
gui.add(params, "Download_Image")

//@ts-ignore
//visage :
const mdl = new rw.HostedModel({
    url: "https://stylegan2-d754f125.hosted-models.runwayml.cloud/v1/",
});
//@ts-ignore
const mdl2 = new rw.HostedModel({
    url: "https://landscapes-42d075ff.hosted-models.runwayml.cloud/v1/",
});

let img: p5.Element
const z = []
let frameNB = 0
let img2: p5.Element
const z2 = []
let frameNB2 = 0
const NB_FRAMES_TO_EXPORT = 12
let jauneMoy = 0
let bleuMoy = 0
// -------------------
//       Drawing
// -------------------

function draw() {
    if(img){
        image(img, 0, 0, width, height);
    }
    if(img2){
        image(img2, 0, 0, width, height);
    }
}

// -------------------
//    Initialization
// -------------------


function setup() {
    p6_CreateCanvas()

    for (let i = 0; i < 512; i++) {
        z[i] = random(-0.5, 0.5)
    }
    for (let i = 0; i < 512; i++) {
        z2[i] = random(-0.5, 0.5)
    }
    
    make_request2()
}
function make_request2() {
    const inputs2 = {
        "z": z2,
        "truncation": 0.8,
    };
    mdl2.query(inputs2).then(outputs => {
        const { image } = outputs
        img2 = createImg(image)
        for (var x = 0; x < width; x = x + 1) {
            for (var y = 0; y < height; y = y + 1) {
                var couleur = get(x, y)
                jauneMoy = jauneMoy+red(couleur)+green(couleur)
                bleuMoy = bleuMoy+2*blue(couleur)
            }
        }
        img2.hide()
        z2[0] += 1 // 0 fait coucher le soleil
        //@ts-ignore
        p5.prototype.downloadFile(image, frameNB2.toString(), "png")
        frameNB2++
        if (frameNB2 < NB_FRAMES_TO_EXPORT) {
          make_request()
        }
    });
}
function make_request() {
    const inputs = {
        "z": z,
        "truncation": 0.8,
    };
    mdl.query(inputs).then(outputs => {
        const { image } = outputs
        img = createImg(image)
        img.hide()
        if (jauneMoy<bleuMoy) {
            z[0] += 10 // 0 rend asiatique / 1 rend lumineux et joyeux
            z[1] -= 10 // 0 rend asiatique / 1 rend lumineux et joyeux
        }
        else {
            z[1] += 10 // 0 rend asiatique / 1 rend lumineux et joyeux
            z[0] -= 10 // 0 rend asiatique / 1 rend lumineux et joyeux
        }
        jauneMoy = 0
        bleuMoy = 0
        //@ts-ignore
        p5.prototype.downloadFile(image, frameNB.toString(), "png")
        frameNB++
        if (frameNB < NB_FRAMES_TO_EXPORT) {
          make_request2()
        }
    });
}

function windowResized() {
    p6_ResizeCanvas()
}