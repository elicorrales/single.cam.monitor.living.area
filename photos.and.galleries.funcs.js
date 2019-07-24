'use strict';

//const backgroundDataGallery2 = [];
const hiResBackgroundGallery2 = [];
let   backgroundsCurrentIndex = 0;

//const imageDataGallery2 = [];
const imageForDispOnlyGallery2 = [];
let   imageGalleryCurrentIndex = 0;


//const snapPhoto = (whichPlayer, whichPhotoCanvas, whichPhotoDispCanvas, whichImageDataGallery, whichImageForDispOnlyGallery, categories) => {
const snapPhoto = (whichPlayer, whichPhotoDispCanvas, whichImageForDispOnlyGallery, categories) => {
    //whichPhotoCanvas.width = photoWidth; whichPhotoCanvas.height = photoHeight;
    whichPhotoDispCanvas.width = photoDispWidth; whichPhotoDispCanvas.height = photoDispHeight;
    //let imageCaptured = captureCameraImage(whichPlayer, whichPhotoCanvas);
    let imageCapturedForDisp = captureCameraImage(whichPlayer, whichPhotoDispCanvas);
    const now = new Date().getHours() + '.' + new Date().getMinutes() + '.' + new Date().getSeconds() + '.' + new Date().getMilliseconds();
    //whichImageDataGallery.push(imageCaptured);
    whichImageForDispOnlyGallery.push({time:now,categories,image:imageCapturedForDisp});
}

const snapAllPhotos = (categories) => {
    let whichSourceToUseAsNumberOfCaptures = 0;
    if (player2.srcObject !== null && player2.srcObject.active) {
        whichSourceToUseAsNumberOfCaptures=2;
        if (categories.Background !== undefined) {
            //snapPhoto(player2, photoCanvas2, photoDispCanvas2, backgroundDataGallery2, hiResBackgroundGallery2, categories);
            snapPhoto(player2, photoDispCanvas2, hiResBackgroundGallery2, categories);
        } else {
            //snapPhoto(player2, photoCanvas2, photoDispCanvas2, imageDataGallery2, imageForDispOnlyGallery2, categories);
            snapPhoto(player2, photoDispCanvas2, imageForDispOnlyGallery2, categories);
        }
    }
    switch (whichSourceToUseAsNumberOfCaptures) {
        case 1:
            break;
        case 2:
            numberOfBackgrounds.innerHTML = hiResBackgroundGallery2.length;
            numberOfImages.innerHTML = imageForDispOnlyGallery2.length;
            break;
        case 3:
            break;

    }
}

const areTheTwoMostRecentSnappedImageSame = () => {

    let comparedImages = false;
    let imagesAreTheSame = false;

    let imagesFrom2Same = true;

    if (player2.srcObject !== null) {
        let len1 = imageForDispOnlyGallery2.length;
        if (len1 > 1) {
            comparedImages = true;
            imagesFrom2Same = areTwoImagesTheSame(
                imageForDispOnlyGallery2[len1-1], imageForDispOnlyGallery2[len1-2],
                parseInt(acceptableImageToImageDifference.value));
        }
    }

    imagesAreTheSame = imagesFrom2Same ;
    return [comparedImages, imagesAreTheSame];
}


const isMostRecentSnappedImageSameAsMostRecentBackgroundImage = () => {

    let comparedImages = false;
    let imagesAreTheSame = false;

    let imagesFrom2Same = true;

    if (player2.srcObject !== null) {
        let len1 = imageForDispOnlyGallery2.length;
        let len2 = hiResBackgroundGallery2.length;
        if (len1 > 0 && len2 > 0) {
            comparedImages = true;
            imagesFrom2Same = areTwoImagesTheSame(
                imageForDispOnlyGallery2[len1-1], hiResBackgroundGallery2[len2-1],
                parseInt(acceptableImageToBackgroundDifference.value));
        }
    }

    imagesAreTheSame = imagesFrom2Same ;
    return [comparedImages, imagesAreTheSame];
}

const removeLatestCapturedImagesFromGalleriesIfSameAsPrevious = () => {
    const [compared, areSame] = areTheTwoMostRecentSnappedImageSame();
    if (compared && areSame) {
        removeLatestCapturedImagesFromGalleries(); //NOT from background galleries
    }
}


const removeLatestCapturedImagesFromGalleriesIfSameAsBackground = () => {
    const [compared, areSame] = isMostRecentSnappedImageSameAsMostRecentBackgroundImage();
    if (compared && areSame) {
        removeLatestCapturedImagesFromGalleries(); //NOT from background galleries
    }
}

const removeLatestCapturedImagesFromGalleries = () => { //NOT from background galleries
    //imageDataGallery2.length = imageDataGallery2.length-1 > 0? imageDataGallery2.length - 1 : imageDataGallery2.length;
    imageForDispOnlyGallery2.length = imageForDispOnlyGallery2.length-1 > 0? imageForDispOnlyGallery2.length -1 : imageForDispOnlyGallery2.length;
    imageGalleryCurrentIndex = 0;
}

const putImageOnDynamicCanvas = (image) => {
   let canvas = document.getElementById('dynSingleImgCanvas'+image.key);
   putImageOnCanvas(image.canvasImage, canvas);
}
const createDynamicCanvas = (image) => {
    let width = image.canvasImage.width;
    let height = image.canvasImage.height;
    let html = ''
            + '<canvas id="dynSingleImgCanvas'+image.key+'" width="'+width+'" height="'+height+'"></canvas>';
    return html;
}
const showSingleImagesOnCanvases = (imagesFound, dynCanvasesContainer) => {
    let html = '';
    imagesFound.forEach(image => {
        html += createDynamicCanvas(image);
    });
    dynCanvasesContainer.innerHTML = html;
    imagesFound.forEach(image => {
        putImageOnDynamicCanvas(image);
    });
}

const showMixedImagesSelfDifferences = (typeOfDiff) => {
    let imagesFound;
    if (player2.srcObject !== null && imageForDispOnlyGallery2.length >0 && hiResBackgroundGallery2.length > 0) {
        imagesFound = 
        modifyImageOnCanvas(backgroundsPlusGalleriesDispCanvas2,
            {threshold:parseInt(diffThreshold.value), contrast:parseInt(contrast.value), normDiffThres:parseInt(normalDiffThreshold.value), 
                typeOfDiff, gridSquares:parseInt(gridSquares.value), bgDiffValue:parseInt(bgDiff.value)},
                gridDispCanvas2
        );
    }
    return imagesFound;
}

const mixCurrentGalleryAndBackgroundImages = () => {
    if (player2.srcObject !== null && imageForDispOnlyGallery2.length >0 && hiResBackgroundGallery2.length > 0) {
        //backgroundsPlusGalleriesDispImg2.src =
        mixTwoImagesOntoCanvas(
            imageForDispOnlyGallery2[imageGalleryCurrentIndex].image, hiResBackgroundGallery2[backgroundsCurrentIndex].image, 
            backgroundsPlusGalleriesDispCanvas2, createDifference);
    }
}


const displayGalleryImageInfo = (whichImageForDispOnlyGallery, whichGalleryDispCanvas, index, whichCategories) => {
    let ctx = whichGalleryDispCanvas.getContext('2d');
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, whichGalleryDispCanvas.width, whichGalleryDispCanvas.height);
    if (whichImageForDispOnlyGallery.length > 0 ) {
        putImageOnCanvas(whichImageForDispOnlyGallery[index].image, whichGalleryDispCanvas);
        whichCategories.style.backgroundColor = whichImageForDispOnlyGallery[index].categories.none !== undefined ?'red':'';
        whichCategories.innerHTML = JSON.stringify(whichImageForDispOnlyGallery[index].categories);
    }
}

const displayImagesFromGallery = (index) => {
    displayGalleryImageInfo(imageForDispOnlyGallery2, galleryDispCanvas2, index, categories2);
}

const getWhichGallery = () => {
    let len2 = imageForDispOnlyGallery2.length;
    let whichImageGallery;
    if (len2>0) {
        whichImageGallery = imageForDispOnlyGallery2;
    } else {
        throw 'No Image Gallery';
    }
    return whichImageGallery;
}

const showNextImageFromGallery = () => {
    let whichImageGallery = getWhichGallery();
    if (imageGalleryCurrentIndex > whichImageGallery.length -2) {
        imageGalleryCurrentIndex = 0;
    } else {
        imageGalleryCurrentIndex++;
    }
    displayImagesFromGallery(imageGalleryCurrentIndex);
    if (sendCurrentGalleryToMixed) {
        mixCurrentGalleryAndBackgroundImages();
    }
}

const showPrevImageFromGallery = () => {
    let whichImageGallery = getWhichGallery();
    if (imageGalleryCurrentIndex < 1) {
        imageGalleryCurrentIndex = whichImageGallery.length - 1;
    } else {
        imageGalleryCurrentIndex--;
    }
    displayImagesFromGallery(imageGalleryCurrentIndex);
    if (sendCurrentGalleryToMixed) {
        mixCurrentGalleryAndBackgroundImages();
    }
}


const getWhichBackgrounds = () => {
    let len2 = hiResBackgroundGallery2.length;
    let whichBackgrounds;
    if (len2>0) {
        whichBackgrounds = hiResBackgroundGallery2;
    } else {
        throw 'No Backgrounds';
    }
    return whichBackgrounds;
}

const displayBackgroundsImageInfo = (whichHiResBackgroundGallery, whichBackgroundDispCanvas, index) => {
    let ctx = whichBackgroundDispCanvas.getContext('2d');
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, whichBackgroundDispCanvas.width, whichBackgroundDispCanvas.height);
    if (whichHiResBackgroundGallery.length > 0 ) {
        putImageOnCanvas(whichHiResBackgroundGallery[index].image, whichBackgroundDispCanvas);
    }
}

const displayImagesFromBackgrounds = (index) => {
    displayBackgroundsImageInfo(hiResBackgroundGallery2, backgroundsDispCanvas2, index) 
}


const showNextImageFromBackgrounds = () => {
    let whichBackgrounds = getWhichBackgrounds();
    if (backgroundsCurrentIndex > whichBackgrounds.length -2) {
        backgroundsCurrentIndex = 0;
    } else {
        backgroundsCurrentIndex++;
    }
    displayImagesFromBackgrounds(backgroundsCurrentIndex);
    if (sendCurrentBackgroundsToMixed) {
        mixCurrentGalleryAndBackgroundImages();
    }
}

const showPrevImageFromBackgrounds = () => {
    let whichBackgrounds = getWhichBackgrounds();
    if (backgroundsCurrentIndex < 1) {
        backgroundsCurrentIndex = whichBackgrounds.length - 1;
    } else {
        backgroundsCurrentIndex--;
    }
    displayImagesFromBackgrounds(backgroundsCurrentIndex);
    if (sendCurrentBackgroundsToMixed) {
        mixCurrentGalleryAndBackgroundImages();
    }
}

const mergeImagesRightToLeft = (leftCanvas, rightCanvas, rightPos) => {
    let image1 = leftCanvas.getContext('2d').getImageData(0, 0, leftCanvas.width, leftCanvas.height);
    let image2 = rightCanvas.getContext('2d').getImageData(0, 0, rightCanvas.width, rightCanvas.height);

    workingCanvas.getContext('2d').putImageData(image1, 0, 0);
    workingCanvas.getContext('2d').putImageData(image2, rightPos.x, rightPos.y);

    // does right image overlap left image?
    if (leftCanvas.width > rightPos.x) {
        let overlap = leftCanvas.width -  rightPos.x;
        let overlapSummedImg = makeOverlappedSummedImage(leftCanvas, rightCanvas, overlap);
        workingCanvas.getContext('2d').putImageData(overlapSummedImg, rightPos.x - overlap, rightPos.y);
        summedCanvas.getContext('2d').putImageData(overlapSummedImg, 0 , 0);
        let overlapDifferenceImg = makeOverlappedDifferenceImage(leftCanvas, rightCanvas, overlap);
        differenceCanvas.getContext('2d').putImageData(overlapDifferenceImg, 0 , 0);
        numDiff.value = (getNumDiff(differenceCanvas, overlap) * 100).toFixed(2);
        numDiffVal.innerHTML = numDiff.value;
        allNumDiffs[(overlap - rightCanvas.width)] = numDiff.value;
    }
}
