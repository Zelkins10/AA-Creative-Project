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
    url: "https://stylegan2-0a6ea5e0.hosted-models.runwayml.cloud/v1/",
    token: "Aafz1NVesYleGY22gDsnlA==",
});

let img: p5.Element
const z = []
let frameNB = 0
const NB_FRAMES_TO_EXPORT = 120
// -------------------
//       Drawing
// -------------------

function draw() {
    if(img){
        image(img, 0, 0, width, height);
    }
}

// -------------------
//    Initialization
// -------------------


function setup() {
    p6_CreateCanvas()
      //// You can use the info() method to see what type of input object the model expects
      // model.info().then(info => console.log(info));
    // const z = []
    for (let i = 0; i < 512; i++) {
        z[i] = random(-0.5, 0.5)
    }
    // const inputs = {
    //     "z": z,
    //     "truncation": 1
    // };
    // mdl.query(inputs).then(outputs => {
    //     const { image } = outputs;
    //     img = createImg(image)
    //     img.hide()
    // });
    make_request()
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
        z[1] += 0.1 //0 rend asiatique / 1 rend lumineux et joyeux
        //@ts-ignore
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