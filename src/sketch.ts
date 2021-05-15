// -------------------
//  Parameters and UI
// -------------------

const gui = new dat.GUI()
const params = {
    Download_Image: () => save(),
}
gui.add(params, "Download_Image")

const NB_FRAMES_TO_EXPORT = 12

let luminositeMoyP = 0

// VISAGES :
//@ts-ignore ( = ignorer la syntaxe de la ligne suivante)
const mdlV = new rw.HostedModel({
    //url: "https://stylegan2-d754f125.hosted-models.runwayml.cloud/v1/", // Lucas
    url: "https://stylegan2-79c5c254.hosted-models.runwayml.cloud/v1/", // Maxime
    
});
let imgV: p5.Element
const zV = []
let frameNbV = 0

// PAYSAGES :
//@ts-ignore
const mdlP = new rw.HostedModel({
    //url: "https://landscapes-42d075ff.hosted-models.runwayml.cloud/v1/", // Lucas
    url: "https://landscapes-21eee1a8.hosted-models.runwayml.cloud/v1/", // Maxime
});
let imgP: p5.Element
const zP = []
let frameNbP = 0


// -------------------
//       Drawing
// -------------------

function draw(){
    if(imgV){
        image(imgV, 0, 0, width, height);
    }
    if(imgP){
        image(imgP, 0, 0, width, height);
    }
}


// -------------------
//    Initialization
// -------------------

function setup(){
    p6_CreateCanvas()

    for(let i = 0; i < 512; i++){
        zV[i] = random(-0.5, 0.5)
    }

    for(let i = 0; i < 512; i++){
        zP[i] = random(-0.5, 0.5)
    }
    
    make_request_P()
}

// PAYSAGES
function make_request_P(){
    const inputsP = {
        "z": zP,
        "truncation": 0.8,
    };
    mdlP.query(inputsP).then(outputs => {
        const { image } = outputs
        imgP = createImg(image)

        for(var x = 0; x < width; x++){
            for(var y = 0; y < height; y++){
                var couleur = get(x, y)
                luminositeMoyP = luminositeMoyP + ((red(couleur) + green(couleur) + blue(couleur))/3)
            }
        }

        imgP.hide()
        zP[0] += 1 // 0 fait coucher le soleil
        //@ts-ignore
        p5.prototype.downloadFile(image, frameNbP.toString(), "png")
        frameNbP++

        if(frameNbP < NB_FRAMES_TO_EXPORT){ // Tant que la vidéo n'est pas finie, on appelle la requête des visages
          make_request_V()
        }
    });
}

// VISAGES
function make_request_V(){
    const inputsV = {
        "z": zV,
        "truncation": 0.8,
    };
    mdlV.query(inputsV).then(outputs => {
        const { image } = outputs
        imgV = createImg(image)
        luminositeMoyP = luminositeMoyP/(width*height)
        console.log(luminositeMoyP)

        if(luminositeMoyP < 128){ // Luminosité de paysage faible => visage triste
            zV[1] -= 10 // 0 rend asiatique ; 1 rend lumineux et joyeux
        }
        else{ // Luminosité de paysage élevée => visage joyeux
            zV[1] += 10 // 0 rend asiatique ; 1 rend lumineux et joyeux
        }

        luminositeMoyP = 0
        imgV.hide()
        //@ts-ignore
        p5.prototype.downloadFile(image, frameNbV.toString(), "png")
        frameNbV++

        if(frameNbV < NB_FRAMES_TO_EXPORT){ // Tant que la vidéo n'est pas finie, on appelle la requête des paysages
          make_request_P()
        }
    });
}

function windowResized(){
    p6_ResizeCanvas()
}