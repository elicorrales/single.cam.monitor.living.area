
'use strict';

let myVideoInputs = [];
let playerWidth = 0;
let playerHeight = 0;
let haveDeviceInfo = false;
let someCamerasHaveBeenStarted = false;

/******************************************************************************************************
*******************************************************************************************************
* function definitions
*******************************************************************************************************
******************************************************************************************************/
const getDevicesInfo = async () => {
    await navigator.mediaDevices.enumerateDevices()
        .then(results => {
            //console.log(results);
            results.forEach(result => {
                if (result.kind === 'videoinput') {
                    //console.log(result);
                    myVideoInputs.push(result);
                }
            })
            haveDeviceInfo = true;
        })
        .catch(error => {
            console.log(error);
            haveDeviceInfo = false;
        });
}

// connects camera video stream to a vido player on html page
const startCamera = (myVideoInput, whichPlayer) => {
    if (myVideoInput === undefined) { console.log('myVideoInput is undefined'); return; }
        navigator.mediaDevices.getUserMedia( { 
            video: { 
                width: playerWidth, 
                height: playerHeight,
                deviceId: myVideoInput.deviceId,
            }
        })
        .then(stream => {
            whichPlayer.srcObject = stream;
        })
        .catch(error => {
            console.log(error);
        });
}

const cleanUp = (whichCamera) => {
    try {
        const stream = whichCamera.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    } catch (error) {
        if (someCamerasHaveBeenStarted !== false) console.log(error);


    }
}

const stopAllCameras = () => {
    cleanUp(player1);
    cleanUp(player2);
    cleanUp(player3);
    haveDeviceInfo = false;
    someCamerasHaveBeenStarted = false;
}

const startAllCameras = async () => {
    stopAllCameras();
    await getDevicesInfo()
        .then(() => {
            //startCamera(myVideoInputs[0], player1); // not going to use main laptop camera for this app
            startCamera(myVideoInputs[1], player2);
            startCamera(myVideoInputs[2], player3);
            someCamerasHaveBeenStarted = true;
        });
}

//this places image from video player into canvas AND
// can return the image (for manipulation?)
// using the returned image is not required. 
// (example - when saving to file, we first call this func, then
// separately do a canvas-to-blob -> to save)
const captureCameraImage = (camera, canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.drawImage(camera, 0, 0, canvas.width, canvas.height);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const putImageOnCanvas = (image, canvas) => {
    canvas.getContext('2d').putImageData(image, 0, 0);
}

const createDifference = (image1, image2) => {
    const data1 = image1.data;
    const data2 = image2.data;
    if (data1.length !== data2.length) {
        throw 'createDifference: Image1 and Image2 lengths do Not match';
    }
    if (image1.width !== image2.width) {
        throw 'createDifference: Image1 and Image2 widths do Not match';
    }
    if (image1.height !== image2.height) {
        throw 'createDifference: Image1 and Image2 heights do Not match';
    }

    let newData = [];
    for (let i=0; i<data1.length; i+=4) {
        newData[i] = 255 - Math.abs(data1[i] - data2[i]);
        newData[i+1] = 255 - Math.abs(data1[i+1] - data2[i+1]);
        newData[i+2] = 255 - Math.abs(data1[i+2] - data2[i+2]);
        newData[i+3] = 255;
    }

    return new ImageData(new Uint8ClampedArray(newData), image1.width, image1.height);
}

const modification = (data, parms) => {

    if (parms.normDiffThres === undefined) { 
        throw 'highlightSelfDifference: missing param : normDiffThres';
    }
    let normDiffThres = parms.normDiffThres;

    if (parms.contrast === undefined) { 
        throw 'highlightSelfDifference: missing param : contrast';
    }
    let contrast = parms.contrast;

    if (parms.typeOfDiff === undefined) { 
        throw 'highlightSelfDifference: missing param : typeOfDiff';
    }
    let typeOfDiff = parms.typeOfDiff;

    if (parms.threshold === undefined) { 
        throw 'highlightSelfDifference: missing param : threshold';
    }
    let threshold = parms.threshold;

    let newData = [];
    for (let i=0; i<data.length; i+=4) {

        //NORMAL DIFF MODE -----------
        if (normDiffThres > 0 && typeOfDiff === 'normal') {
            let min = Math.min(data[i], data[i+1], data[i+2]);
            newData[i] = data[i] > normDiffThres ? 255 : data[i];
            newData[i+1] = data[i+1] > normDiffThres ? 255 : data[i+1];
            newData[i+2] = data[i+2] > normDiffThres ? 255 : data[i+2];
        }


        //CONTRAST MODE ------------- works on COLOR MONOCHROME modes
        if (contrast > 0 && typeOfDiff  === 'color') {
            newData[i] = data[i] > 128 ? data[i] + contrast : data[i] - contrast;
            newData[i] = newData[i] > 255? 255 : newData[i];
            newData[i] = newData[i] < 0? 0 : newData[i];
            newData[i+1] = data[i+1] > 128 ? data[i+1] + contrast : data[i+1] - contrast;
            newData[i+1] = newData[i+1] > 255? 255 : newData[i+1];
            newData[i+1] = newData[i+1] < 0? 0 : newData[i+1];
            newData[i+2] = data[i+2] > 128 ? data[i+2] + contrast : data[i+2] - contrast;
            newData[i+2] = newData[i+2] > 255? 255 : newData[i+2];
            newData[i+2] = newData[i+2] < 0? 0 : newData[i+2];
        }

        //MONOCHROME MODE ------------- also impacted by above CONTRAST
        if (contrast > 0 && typeOfDiff  === 'mono') {
            let min = Math.min(data[i], data[i+1], data[i+2]);
            newData[i] = data[i] > 128 ? data[i] + contrast : data[i] - contrast;
            newData[i] = newData[i] > 255? 255 : newData[i];
            newData[i] = newData[i] < 0? 0 : newData[i];
            newData[i+1] = newData[i];
            newData[i+2] = newData[i];
        }


        //SOLID MODE -- has just two levels, a color, and no color (red or white)
        //(image or background)
        //this means we see only red or white.. no inbetween, no other colors
        //red is the diff (the image), white is the background
        if (typeOfDiff === 'solid') {
            let min = Math.min(data[i], data[i+1], data[i+2]);
            newData[i] = 255;   //leave Red at max
            if (min < threshold) {
                newData[i+1] = 255 - threshold;
                newData[i+2] = 255 - threshold;
            } else {
                newData[i+1] = 255;
                newData[i+2] = 255;
            }
        }


        newData[i+3] = 255; //leave alpha at max
    }
    return newData;
}


const mixTwoImagesOntoCanvas = (image1, image2, canvas, mixFunc) => {
    let mixedImage = mixFunc(image1, image2);
    canvas.getContext('2d').putImageData(mixedImage, 0, 0);
    return canvas.toDataURL('image/jpeg',1.0);
}

const stepOneDistinguishImagesFromBackground = (canvas, parms) => {
    let ctx = canvas.getContext('2d');
    let image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = image.data;
    let newData = modification(data, parms);
    let newImage = new ImageData(new Uint8ClampedArray(newData), image.width, image.height);
    ctx.putImageData(newImage, 0, 0);
}


const stepTwoConvertOnlyImagesToGridSquares = (canvas, parms, gridCanvas) => {
    if (parms.gridSquares === undefined) { 
        throw 'highlightSelfDifference: missing param : gridSquares';
    }
    let gridSquares = parms.gridSquares;


    if (parms.bgDiffValue === undefined) { 
        throw 'highlightSelfDifference: missing param : bgDiffValue';
    }
    let bgDiffValue = parms.bgDiffValue;

    let width = canvas.width;
    let height = canvas.height;
    let hRes = Math.round(width/gridSquares);
    
    if (width >= 2 * height) {
        hRes = Math.round(width/(gridSquares*2));
    }
 
    let vRes = Math.round(height/gridSquares);

    let ctx = canvas.getContext('2d');
    let ctxGrid = gridCanvas.getContext('2d');


    let numSquares = 0;

    ctxGrid.clearRect(0, 0, width, height);

    let markedGridSquares = [];

    let gridSquareRow = 0;
    for (let row=0; row<height; row+=vRes) {
        markedGridSquares[gridSquareRow] = [];
        let gridSquareCol = 0;
        for (let col=0; col<width; col+=hRes) {
            let data = ctx.getImageData(col, row, hRes, vRes).data;
            let totalDifference = getTotalNonBackgroundValueInImage(data);
            if (totalDifference > bgDiffValue) {
                ctxGrid.fillRect(col, row, hRes, vRes);
                markedGridSquares[gridSquareRow][gridSquareCol] = 1;
            } else {
                markedGridSquares[gridSquareRow][gridSquareCol] = 0;
            }
            numSquares++;
            gridSquareCol++;
        }
        gridSquareRow++;
    }

    return markedGridSquares;
}

const stepThreeConvertGridSquaresIntoImages = (markedGridSquares, canvas, parms) => {
    if (parms.gridSquares === undefined) { 
        throw 'highlightSelfDifference: missing param : gridSquares';
    }
    let gridSquares = parms.gridSquares;

    let imagesFound = findAllIndividualImagesInGridSquares(markedGridSquares);

    let width = canvas.width;
    let height = canvas.height;
    let hRes = Math.round(width/gridSquares);
    
    if (width >= 2 * height) {
        hRes = Math.round(width/(gridSquares*2));
    }
 
    let vRes = Math.round(height/gridSquares);

    imagesFound.forEach(image => {
        console.table(image);
        let x = hRes * image.topX;
        let y = vRes * image.topY;
        let imgWidth = hRes * (image.botX - image.topX + 1);
        let imgHeight = vRes * (image.botY - image.topY + 1);
        let canvasImage = canvas.getContext('2d').getImageData(x, y, imgWidth, imgHeight);
        image.canvasImage = canvasImage;
    })

    console.log('imagesFound:',imagesFound.length);

    return imagesFound;
}

const modifyImageOnCanvas = (canvas, parms, gridCanvas) => {
    stepOneDistinguishImagesFromBackground(canvas, parms);
    let markedGridSquares = stepTwoConvertOnlyImagesToGridSquares(canvas,parms, gridCanvas);
    let imagesFound = stepThreeConvertGridSquaresIntoImages(markedGridSquares, canvas, parms);
    return imagesFound;
}

const getTotalDifferenceValueBetweenTwoImages = (image1, image2) => {
    const data1 = image1.data;
    const data2 = image2.data;
    if (data1.length !== data2.length) {
        throw 'createDifference: Image1 and Image2 lengths do Not match';
    }
    if (image1.width !== image2.width) {
        throw 'createDifference: Image1 and Image2 widths do Not match';
    }
    if (image1.height !== image2.height) {
        throw 'createDifference: Image1 and Image2 heights do Not match';
    }
    let totalDifference = 0;
    for (let i=0; i<data1.length; i+=4) {
        totalDifference += Math.abs(data1[i] - data2[i]);
        totalDifference += Math.abs(data1[i+1] - data2[i+1]);
        totalDifference += Math.abs(data1[i+2] - data2[i+2]);
    }
    let diffVolume = data1.length / 10;
    return totalDifference / diffVolume;
}

const getTotalNonBackgroundValueInImage = (data) => {
    //const data = image.data;
    let totalDifference = 0;
    for (let i=0; i<data.length; i+=4) {
        //totalDifference += Math.abs(data[i] - diffValue);
        //totalDifference += Math.abs(data[i+1] - diffValue);
        //totalDifference += Math.abs(data[i+2] - diffValue);
        totalDifference += 255 - data[i];
        totalDifference += 255 - data[i+1];
        totalDifference += 255 - data[i+2];
    }
    let diffVolume = data.length;
    return totalDifference / diffVolume;
}


//const areTwoImagesTheSame = (canvas1, canvas2, acceptableDifference) => {
const areTwoImagesTheSame = (image1, image2, acceptableDifference) => {
    if (image1.image.width !== image2.image.width || image1.image.height !== image2.image.height) {
        throw 'Images are not same width or height';
    }
    let totalDifference = getTotalDifferenceValueBetweenTwoImages(image1.image, image2.image);
    return (totalDifference < acceptableDifference);
}



/******************************************************************************************************
 * execution
 *****************************************************************************************************/
stopAllCameras();