// -------------------
//  Parameters and UI
// -------------------

const gui = new dat.GUI()
const params = {
    Download_Image: () => save(),
}
gui.add(params, "Download_Image")

// Values given by Runway for the model
const ai = new rw.HostedModel({
    url: "https://landscapes-ee51eac1.hosted-models.runwayml.cloud/v1/",
    token: "CvE3T2tx1UeAlwDzGWRzww==",
});

let img//: p5.Element
//// You can use the info() method to see what type of input object the model expects
// model.info().then(info => console.log(info));

// -------------------
//       Drawing
// -------------------

function draw() {
    if (img) {
      image(img, 0, 0, width, height)
    }
}

// -------------------
//    Initialization
// -------------------

// IMAGES SUCCESSIVES AU RAFRAÎCHISSEMENT DE LA PAGE :

function setup() {
    p6_CreateCanvas()

    /*
    const z = []
    for (let i = 0; i < 512; i++) {
        z[i] = random(-0.5, 0.5)
    }
    const inputs = {
        "z": z,
        "truncation": 0.8,
    };
    ai.query(inputs).then(outputs => {
        const { image } = outputs;
        img = createImg(image)
        img.hide()
    });
    */
}


// VIDÉO :
//let img
const z = []
let frameNB = 0
const NB_FRAMES_TO_EXPORT = 120

function make_request() {
    const inputs = {
        "z": z,
        "truncation": 0.8,
    };
    ai.query(inputs).then(outputs => {
        const { image } = outputs
        img = createImg(image)
        img.hide()
        z[0] += 0.1
        p5.prototype.downloadFile(image, frameNB.toString(), "png")
        frameNB++
        if (frameNB < NB_FRAMES_TO_EXPORT) {
          make_request()
        }
    });
}


function windowResized() {
    p6_ResizeCanvas()
}

