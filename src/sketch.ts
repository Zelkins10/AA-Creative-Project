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

const NB_FRAMES_TO_EXPORT = 240/3

let luminositeMoyP = 0

// VISAGES :
//@ts-ignore ( = ignorer la syntaxe de la ligne suivante)
const mdlV = new rw.HostedModel({
    url: "https://stylegan2-4c8e16cc.hosted-models.runwayml.cloud/v1/", // Maxime (john21)
    
});
let imgV: p5.Element
let zV = [] // const ?
let frameNbV = 0

// PAYSAGES :
//@ts-ignore
const mdlP = new rw.HostedModel({
    url: "https://landscapes-b3d4b050.hosted-models.runwayml.cloud/v1/", // Maxime (john20)
});
let imgP: p5.Element
let zP = [] // const ?
let frameNbP = 0

let compteur = 0

// -------------------
//       Drawing
// -------------------

function draw(){

    // randomSeed(params.randomSeed)

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
        "truncation": 0.5,
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

        // ON COUCHE LE SOLEIL
        // zP[0] += 0.002 // 0 fait coucher le soleil ; 1 marron nuageux montagneux sombre
        zP[0] += 0.125 // version MAX

        // ON FAIT FLUCTUER LES PAYSAGES
        /*
        for(let i = 0; i < 512; i++){
            params.randomSeed+=1
            randomSeed(params.randomSeed)

            // METHODE 1
            if(random() < 0.5){ // 1 chance sur 2 d'augmenter ou de diminuer la composante de zP
                zP[i]+=1;
            }
            else{
                zP[i]-=0;
            }

            // METHODE 3
            params.randomSeed+=1
            randomSeed(params.randomSeed)
            zP[i]+=random(1); // 1 chance sur 2 d'augmenter ou de diminuer la composante de zP
            
        }
        */

        // METHODE 2
        
        if(compteur == 1){
            zP[compteur-1]-=4
        }

        if(compteur > 1){
            zP[compteur-1]-=4
            zP[compteur-2]-=4
        }
        zP[compteur]+=4
        zP[compteur+1]+=4
        

        //@ts-ignore
        p5.prototype.downloadFile(image, 'p'.concat(frameNbP.toString()), "png")
        frameNbP++
        compteur+=2

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
        // Lucas dit : 1
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
        // ancien : zV[1] = map(luminositeMoyP, 90, 190, -10, 10)
        zV[1] = map(luminositeMoyP, 80, 190, 0, 10) // mapper la joie du perso depuis luminositeMoyP vers un intervalle raisonnable
        zV[31] = map(1/luminositeMoyP, 1/190, 1/80, 0, 10) // mapper la tristesse/ombre du perso

        // JOIE vLUCAS
        //zV[1] = map(luminositeMoyP, 128, 255, 0, 10)
        //zV[31] = map(luminositeMoyP, 0, 128, 0, 10)


        // VIEILLESSE
        zV[141]+=0.02*3; // Au fil de la vidéo, le visage vieillit légèrement
        //zV[85]+=0.001*6
        // 0.02 pr 240 frames

        //zV[141]+=1/20 // vLucas

        // TESTS
        //zV[1]-=1

        console.log(frameNbV + 1, zV[1], zV[31], zV[141]) // Affichage joie, tristesse, vieillesse

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
