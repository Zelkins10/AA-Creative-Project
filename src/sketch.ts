// -------------------
//  Parameters and UI
// -------------------

const gui = new dat.GUI()
const params = {
    randomSeed: 4,
    Download_Image: () => save(),
}
gui.add(params, "randomSeed", 1, 100, 1)
gui.add(params, "Download_Image")

const NB_FRAMES_TO_EXPORT = 20

let luminositeMoyP = 0

// VISAGES :
//@ts-ignore ( = ignorer la syntaxe de la ligne suivante)
const mdlV = new rw.HostedModel({
    //url: "https://stylegan2-d754f125.hosted-models.runwayml.cloud/v1/", // Lucas
    //url: "https://stylegan2-79c5c254.hosted-models.runwayml.cloud/v1/", // Maxime
    url: "https://stylegan2-1f8986af.hosted-models.runwayml.cloud/v1/", // Maxime (john15)
    
});
let imgV: p5.Element
const zV = []
let frameNbV = 0

// PAYSAGES :
//@ts-ignore
const mdlP = new rw.HostedModel({
    //url: "https://landscapes-42d075ff.hosted-models.runwayml.cloud/v1/", // Lucas
    //url: "https://landscapes-21eee1a8.hosted-models.runwayml.cloud/v1/", // Maxime
    url: "https://landscapes-26fdedfa.hosted-models.runwayml.cloud/v1/", // Maxime (john14)
});
let imgP: p5.Element
const zP = []
let frameNbP = 0


// -------------------
//       Drawing
// -------------------

function draw(){

    randomSeed(params.randomSeed)

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
        //zP[1] += 1 // 0 fait coucher le soleil ; 1 marron nuageux montagneux sombre

        for(let i = 0; i < 512; i++){
            if(random() < 0.5){ // 1 chance sur 2 d'augmenter ou de diminuer la composante de zP
                zP[i]+=2;
            }
            else{
                zP[i]-=2;
            }
        }

        //@ts-ignore
        p5.prototype.downloadFile(image, 'p'.concat(frameNbP.toString()), "png")
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
        
        /*
        if(luminositeMoyP < 150){ // Luminosité de paysage faible => visage triste
            zV[1] -= 0.5
        }
        else{ // Luminosité de paysage élevée => visage joyeux
            zV[1] += 0.5 // 0 rend asiatique ; 1 lumineux/joyeux ; 2 malgache ; 3 allemand/blond aux yeux bleus ; 4 vieux ; 5 occidental et non barbu et qq autres paramètres difficiles à déterminer ; 7 : fille blonde yeux bleus et couvre-chef ; 100 : bébé blanc triste
        }
        */

        // JOIE
        zV[1] = map(luminositeMoyP, 90, 160, -10, 10) // mapper la joie du perso depuis luminositeMoyP vers un intervalle raisonnable

        // VIEILLESSE
        //zV[4]+=0.3; // Au fil de la vidéo, le visage vieillit légèrement
        // 0.3/6 pr 240 frames

        // TESTS
        //zV[1]-=1

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