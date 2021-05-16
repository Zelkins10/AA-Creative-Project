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
    url: "https://stylegan2-41afb750.hosted-models.runwayml.cloud/v1/", // Maxime (john17)
    
});
let imgV: p5.Element
let zV = [] // const ?
let frameNbV = 0

// PAYSAGES :
//@ts-ignore
const mdlP = new rw.HostedModel({
    //url: "https://landscapes-42d075ff.hosted-models.runwayml.cloud/v1/", // Lucas
    //url: "https://landscapes-21eee1a8.hosted-models.runwayml.cloud/v1/", // Maxime
    url: "https://landscapes-c8c0cdf9.hosted-models.runwayml.cloud/v1/", // Maxime (john16)
});
let imgP: p5.Element
let zP = [] // const ?
let frameNbP = 0

let compteur = 0

// -------------------
//       Drawing
// -------------------

function draw(){

    // randomSeed(params.randomSeed) // crée un bug ?

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
        zP[0] += 0.002 // 0 fait coucher le soleil ; 1 marron nuageux montagneux sombre

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
        if(compteur > 0){
            zP[compteur-1]-=5
        }
        zP[compteur]+=5

        //@ts-ignore
        p5.prototype.downloadFile(image, 'p'.concat(frameNbP.toString()), "png")
        frameNbP++
        compteur++

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
        // ancien : zV[1] = map(luminositeMoyP, 90, 190, -10, 10)
        zV[1] = map(luminositeMoyP, 80, 190, 0, 10) // mapper la joie du perso depuis luminositeMoyP vers un intervalle raisonnable
        zV[31] = map(1/luminositeMoyP, 1/190, 1/80, 0, 10) // mapper la tristesse/ombre du perso

        // VIEILLESSE
        //zV[141]+=0.001*6; // Au fil de la vidéo, le visage vieillit légèrement
        //zV[85]+=0.001*6
        // 0.002 pr 240 frames

        // TESTS
        //zV[1]-=1

        //luminositeMoyP = 0 // crée un bug ?
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

















//------------------------------ VERSION LUCAS ------------------------------















// // -------------------
// //  Parameters and UI
// // -------------------

// const gui = new dat.GUI()
// const params = {
//     Download_Image: () => save(),
// }
// gui.add(params, "Download_Image")

// //@ts-ignore
// //visage :
// // const mdl = new rw.HostedModel({
// //     url: "https://stylegan2-d754f125.hosted-models.runwayml.cloud/v1/",
// // });
// //@ts-ignore
// const mdl2 = new rw.HostedModel({
//     url: "https://landscapes-c8c0cdf9.hosted-models.runwayml.cloud/v1/", // Maxime (john16)
// });

// let img: p5.Element
// const z = []
// let frameNB = 0
// let img2: p5.Element
// const z2 = []
// let frameNB2 = 0
// const NB_FRAMES_TO_EXPORT = 20
// let luminositeMoy = 0
// let i=0
// // -------------------
// //       Drawing
// // -------------------

// function draw() {
//     if(img){
//         image(img, 0, 0, width, height);
//     }
//     if(img2){
//         image(img2, 0, 0, width, height);
//     }
// }

// // -------------------
// //    Initialization
// // -------------------


// function setup() {
//     p6_CreateCanvas()

//     // for (let i = 0; i < 512; i++) {
//     //     z[i] = random(-0.5, 0.5)
//     // }
//     for (let i = 0; i < 512; i++) {
//         z2[i] = random(-0.5, 0.5)
//     }
    
//     make_request2()
//     // make_request()
// }
// function make_request2() {
//     const inputs2 = {
//         "z": z2,
//         "truncation": 0.8,
//     };
//     mdl2.query(inputs2).then(outputs => {
//         const { image } = outputs
//         img2 = createImg(image)
//         for (var x = 0; x < width; x = x + 1) {
//             for (var y = 0; y < height; y = y + 1) {
//                 var couleur = get(x, y)
//                 luminositeMoy = luminositeMoy+((red(couleur)+green(couleur)+blue(couleur))/3)
//             }
//         }
//         img2.hide()
//         z2[i] += 5 // 0 fait coucher le soleil
//         //@ts-ignore
//         p5.prototype.downloadFile(image, frameNB2.toString(), "png")
//         frameNB2++
//         i++
//         if (frameNB2 < NB_FRAMES_TO_EXPORT) {
//           make_request2()
//         }
//     });
// }
// // function make_request() {
// //     const inputs = {
// //         "z": z,
// //         "truncation": 0.8,
// //     };
// //     mdl.query(inputs).then(outputs => {
// //         const { image } = outputs
// //         img = createImg(image)
// //         // if(i>0){
// //         //     z[i-1] -= 20
// //         // }
// //         // z[i] += 20
// //         // luminositeMoy = luminositeMoy / (width*height)
// //         // console.log(luminositeMoy)
// //         // if (luminositeMoy<128) {
// //         //     z[1] -= 10 // 0 rend asiatique / 1 rend lumineux et joyeux
// //         // }
// //         // else {
// //         //     z[1] += 10 // 0 rend asiatique / 1 rend lumineux et joyeux
// //         // }
// //         // luminositeMoy = 0
// //         img.hide()
// //         //@ts-ignore
// //         p5.prototype.downloadFile(image, frameNB.toString(), "png")
// //         i++
// //         frameNB++
// //         if (frameNB < NB_FRAMES_TO_EXPORT) {
// //         //   make_request2()
// //         make_request()
// //         }
// //     });
// // }

// function windowResized() {
//     p6_ResizeCanvas()
// }