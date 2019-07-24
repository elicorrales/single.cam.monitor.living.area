'use strict';

let pressedPlayAtLeastOnceAfterStartOfStreaming = false;
let snapAllPhotosContinuous = false;
let sendCurrentGalleryToMixed = false;
let sendCurrentBackgroundsToMixed = false;

let photoWidth = 0;
let photoHeight = 0;
let photoDispWidth = 0;
let photoDispHeight = 0;

const rightCanvasPos = {x:0, y:0}

let typeOfDiff = 'normal';

const photoCapturePanelFlashNumber = [0];
const galleryPanelFlashNumber = [0];

let prevNumImages = 0;

/******************************************************************************************************
*******************************************************************************************************
* function definitions
*******************************************************************************************************
******************************************************************************************************/
const flashPanel = (whichPanel, whichFlashNumber) => {
    switch (whichFlashNumber[0]) {
        case 0:
            whichPanel.className = 'panel panel-primary';
            whichFlashNumber[0]++;
            break;
        case 1:
            whichPanel.className = 'panel panel-info';
            whichFlashNumber[0]++;
            break;
        default:
            whichFlashNumber[0] = 0;
    }
}

const doNormalDiffThresholdValue = (slider) => {
    normalDiffThresholdValue.innerHTML = slider.value;
    mixCurrentGalleryAndBackgroundImages();
    let imagesFound = showMixedImagesSelfDifferences(typeOfDiff);
        showSingleImagesOnCanvases(imagesFound, dynamicSingleImageCanvasesContainer);
}
const doContrastValue = (slider) => {
    contrastValue.innerHTML = slider.value;
    mixCurrentGalleryAndBackgroundImages();
    let imagesFound = showMixedImagesSelfDifferences(typeOfDiff);
        showSingleImagesOnCanvases(imagesFound, dynamicSingleImageCanvasesContainer);
}
const doDiffThresholdValue = (slider) => {
    diffThresholdValue.innerHTML = slider.value;
    mixCurrentGalleryAndBackgroundImages();
    let imagesFound = showMixedImagesSelfDifferences(typeOfDiff);
        showSingleImagesOnCanvases(imagesFound, dynamicSingleImageCanvasesContainer);
}
const doAcceptableImageToImageDifferenceValue = (slider) => {
    acceptableImageToImageDifferenceValue.innerHTML = slider.value;
    mixCurrentGalleryAndBackgroundImages();
    let imagesFound = showMixedImagesSelfDifferences(typeOfDiff);
        showSingleImagesOnCanvases(imagesFound, dynamicSingleImageCanvasesContainer);
}


const doGridSquaresValue = (slider) => {
    gridSquaresValue.innerHTML = slider.value;
    mixCurrentGalleryAndBackgroundImages();
    let imagesFound = showMixedImagesSelfDifferences(typeOfDiff);
        showSingleImagesOnCanvases(imagesFound, dynamicSingleImageCanvasesContainer);
}

/*
const doBkgdValue = (slider) => {
    bkgdValue.innerHTML = slider.value;
    mixCurrentGalleryAndBackgroundImages();
    let imagesFound = showMixedImagesSelfDifferences(typeOfDiff);
        showSingleImagesOnCanvases(imagesFound, dynamicSingleImageCanvasesContainer);
}
*/

const doBgDiffValue = (slider) => {
    bgDiffValue.innerHTML = slider.value;
    mixCurrentGalleryAndBackgroundImages();
    let imagesFound = showMixedImagesSelfDifferences(typeOfDiff);
        showSingleImagesOnCanvases(imagesFound, dynamicSingleImageCanvasesContainer);
}

/*
const doClearMixedCanvas = (button) => {
    clearMixedCanvases();
}
*/

const doChangePlayerWidth = (input) => {
    if (input.value !== undefined && input.value != '') {
        showMessages('warning','All Camera Feeds Stopping..');
        stopAllCameras();
        startStopAllCameras.innerHTML = 'Stream All';
        startStopAllCameras.className = 'btn btn-default';
        pauseAllPlayers();
        playPauseAllPlayers.disabled = true;
        hideAllPlayers();
        playerWidth = document.getElementById('playerWidth').value;
        playerHeight = document.getElementById('playerHeight').value;
        pressedPlayAtLeastOnceAfterStartOfStreaming = false;
    }
}

const doChangePlayerHeight = (input) => {
    if (input.value !== undefined && input.value != '') {
        showMessages('warning','All Camera Feeds Stopping..');
        stopAllCameras();
        startStopAllCameras.innerHTML = 'Stream All';
        startStopAllCameras.className = 'btn btn-default';
        pauseAllPlayers();
        playPauseAllPlayers.disabled = true;
        hideAllPlayers();
        playerWidth = document.getElementById('playerWidth').value;
        playerHeight = document.getElementById('playerHeight').value;
        pressedPlayAtLeastOnceAfterStartOfStreaming = false;
    }
}

const doStartStopAllCameras = (button) => {
    try {
        if (button.innerHTML === 'Stream All') {
            startAllCameras();
            showMessages('info','Camera Feeds Starting....');
            button.innerHTML = 'Stop All';
            button.className = 'btn btn-primary';
            playPauseAllPlayers.disabled = false;
            //photoCanvas2.style.display = 'inline';
            photoDispCanvas2.style.display = 'inline';
            galleryDispCanvas2.style.display = 'inline';
            backgroundsDispCanvas2.style.display = 'inline';
            backgroundsPlusGalleriesDispCanvas2.style.display = 'inline';
        } else {
            stopAllCameras();
            showMessages('info','Camera Feeds Stopping....');
            button.innerHTML = 'Stream All';
            button.className = 'btn btn-default';
            pauseAllPlayers();
            playPauseAllPlayers.disabled = true;
            hideAllPlayers();
        }
    } catch (error) {
        showMessages('danger',error);
    }
    pressedPlayAtLeastOnceAfterStartOfStreaming = false;
}

const doStopCamera = (button) => {
    const id = button.id;
    switch (id) {
        case 'stopPlayer1':
                player1.controls = false;
                player1.hidden = true;
                cleanUp(player1);
                break;
        case 'stopPlayer2':
                player2.controls = false;
                player2.hidden = true;
                //photoCanvas2.style.display = 'none';
                photoDispCanvas2.style.display = 'none';
                galleryDispCanvas2.style.display = 'none';
                backgroundsDispCanvas2.style.display = 'none';
                backgroundsPlusGalleriesDispCanvas2.style.display = 'none';
                cleanUp(player2);
                break;
        case 'stopPlayer3':
                player3.controls = false;
                player3.hidden = true;
                cleanUp(player3);
                break;
    }
}

const showAllPlayers = () => {
        showHideAllPlayers.innerHTML = 'Hide';
        showHideAllPlayers.className = 'btn btn-primary';
        player1.controls = true;  //not going to use main laptop camera for this app
        player1.hidden = false; //not going to use main laptop camera for this app
        player2.controls = true;
        player2.hidden = false;
        player3.controls = true;
        player3.hidden = false;
}
const hideAllPlayers = () => {
        showHideAllPlayers.innerHTML = 'Show';
        showHideAllPlayers.className = 'btn btn-default';
        player1.controls = false;
        player2.controls = false;
        player3.controls = false;
        player1.hidden = true;
        player2.hidden = true;
        player3.hidden = true;
}
const doShowHideAllPlayers = () => {
    if (showHideAllPlayers.innerHTML === 'Show') {
        showAllPlayers();
    } else {
        hideAllPlayers();
    }
}

const playAllPlayers = () => {
        playPauseAllPlayers.innerHTML = 'Pause All';
        playPauseAllPlayers.className = 'btn btn-primary';
        if (showHideAllPlayers.innerHTML === 'Show') {//hidden at moment
            hideAllPlayers();
        }
        //player1.play();
        player2.play();
        //player3.play();
        pressedPlayAtLeastOnceAfterStartOfStreaming = true;
}
const pauseAllPlayers = () => {
        playPauseAllPlayers.innerHTML = 'Play All';
        playPauseAllPlayers.className = 'btn btn-default';
        player1.pause();
        player2.pause();
        player3.pause();
}
const doPlayPauseAllPlayers = (button) => {
    if (button.innerHTML === 'Pause All') {
        pauseAllPlayers();
    } else {
        playAllPlayers();
    }
}

const doChangePhotoWidth = (input) => {
    if (input.value !== undefined && input.value != '') {
        photoWidth = document.getElementById('photoWidth').value;
        //photoHeight = document.getElementById('photoHeight').value;
        photoHeight = photoWidth/2;
    }
}

const doChangePhotoHeight = (input) => {
    if (input.value !== undefined && input.value != '') {
        //photoWidth = document.getElementById('photoWidth').value;
        photoHeight = document.getElementById('photoHeight').value;
        photoWidth = photoHeight*2;
    }
}

const doChangeDispPhotoWidth = (input) => {
    if (input.value !== undefined && input.value != '') {
        photoDispWidth = document.getElementById('photoDispWidth').value;
        //photoDispHeight = document.getElementById('photoDispHeight').value;
        photoDispHeight = photoDispWidth/2;
    }
}

const doChangeDispPhotoHeight = (input) => {
    if (input.value !== undefined && input.value != '') {
        photoDispHeight = document.getElementById('photoDispHeight').value;
        //photoDispWidth = document.getElementById('photoDispWidth').value;
        photoDispWidth = photoDispHeight*2;
    }
}

const doShowHideSnapAllPhotos = (button) => {
    if (button.innerHTML === 'Hide') {
        snapAllPhotosArea.style.display = 'none';
        button.innerHTML = 'Show';
        button.className = 'btn btn-default';
    } else {
        snapAllPhotosArea.style.display = 'block';
        button.innerHTML = 'Hide';
        button.className = 'btn btn-primary';
    }
}


const doSnapAllPhotos = (snapParams) => {

    let categories;
    let removeCapturedImagesIfSame;

    if (snapParams !== undefined) {
        categories = snapParams.categories;
        removeCapturedImagesIfSame = snapParams.removeCapturedImagesIfSame;
    }

    try {
        if (!pressedPlayAtLeastOnceAfterStartOfStreaming) {
            showMessages('warning','You havent pressed Play since started streaming.');
            return;
        }

        snapAllPhotos(categories === undefined ? {'none':'none'} : categories);

        removeLatestCapturedImagesFromGalleriesIfSameAsPrevious();


        let numImages = parseInt(numberOfImages.innerHTML);
        if (prevNumImages < numImages) {
            flashPanel(galleryPanel, galleryPanelFlashNumber);
            prevNumImages = numImages;
        }

    } catch (error) {
        showMessages('danger',error);
        console.log(error);
    }

    if (snapAllPhotosContinuous) {
        setTimeout(() => { 
            doSnapAllPhotos(snapParams);
        }, 250);
    }

}

const doSnapAllPhotosContinuous = () => {
    snapAllPhotosContinuous = true;
    doSnapAllPhotos({});
}

const doSnapAllPhotosContinuousSaveMovement = () => {
    snapAllPhotosContinuous = true;
    doSnapAllPhotos({removeCapturedImagesIfSame:true});
}

const doStopSnapAllPhotosContinuous = () => {
    snapAllPhotosContinuous = false;
}

const doSnapBackgroundAll = () => {
    doSnapAllPhotos({'categories':{'Background':'Background'}});
}


const doShowHideGallery = (button) => {
    if (button.innerHTML === 'Hide') {
        galleryArea.style.display = 'none';
        button.innerHTML = 'Show';
        button.className = 'btn btn-default';
    } else {
        galleryArea.style.display = 'block';
        button.innerHTML = 'Hide';
        button.className = 'btn btn-primary';
    }
}

const doShowHideBackgrounds = (button) => {
    if (button.innerHTML === 'Hide') {
        backgroundsArea.style.display = 'none';
        button.innerHTML = 'Show';
        button.className = 'btn btn-default';
    } else {
        backgroundsArea.style.display = 'block';
        button.innerHTML = 'Hide';
        button.className = 'btn btn-primary';
    }
}

const doShowNextPrevImageFromGallery = (button) => {
    try {
        if (button.id === 'showPrevImageFromGallery') {
            showPrevImageFromGallery();
        } else {
            showNextImageFromGallery();
        }
        let imagesFound = showMixedImagesSelfDifferences(typeOfDiff);
        showSingleImagesOnCanvases(imagesFound, dynamicSingleImageCanvasesContainer);
    } catch (error) {
        showMessages('danger',error);
        console.log(error);
    }
}

const doShowNextPrevImageFromBackgrounds = (button) => {
    try {
        if (button.id === 'showPrevImageFromBackgrounds') {
            showPrevImageFromBackgrounds();
        } else {
            showNextImageFromBackgrounds();
        }
        let imagesFound = showMixedImagesSelfDifferences(typeOfDiff);
        showSingleImagesOnCanvases(imagesFound, dynamicSingleImageCanvasesContainer);
    } catch (error) {
        showMessages('danger',error);
        console.log(error);
    }
}

const doShowHideBackgroundsPlusGalleries = (button) => {
    if (button.innerHTML === 'Hide') {
        backgroundsPlusGalleriesArea.style.display = 'none';
        button.innerHTML = 'Show';
        button.className = 'btn btn-default';
    } else {
        backgroundsPlusGalleriesArea.style.display = 'block';
        button.innerHTML = 'Hide';
        button.className = 'btn btn-primary';
    }
}


const doShowHideMixedImagesSelfNormalDifferences = (button) => {
    if (button.innerHTML === 'Normal') {
        colorMode.innerHTML = 'Normal - (Diff)';
        button.className = 'btn btn-primary';
        showHideSelfColorDifference.innerHTML = 'Color';
        showHideSelfColorDifference.className = 'btn btn-default';
        showHideSelfMonoDifference.innerHTML = 'Monochrome';
        showHideSelfMonoDifference.className = 'btn btn-default';
        showHideSelfSolidDifference.innerHTML = 'Solid';
        showHideSelfSolidDifference.className = 'btn btn-default';
        typeOfDiff = 'normal';
        mixCurrentGalleryAndBackgroundImages();
        let imagesFound = showMixedImagesSelfDifferences(typeOfDiff);
        showSingleImagesOnCanvases(imagesFound, dynamicSingleImageCanvasesContainer);
    }
}


const doShowHideMixedImagesSelfColorDifferences = (button) => {
    if (button.innerHTML === 'Color') {
        colorMode.innerHTML = 'Color - (Contrast)';
        button.className = 'btn btn-primary';
        showHideSelfNormalDifference.innerHTML = 'Normal';
        showHideSelfNormalDifference.className = 'btn btn-default';
        showHideSelfMonoDifference.innerHTML = 'Monochrome';
        showHideSelfMonoDifference.className = 'btn btn-default';
        showHideSelfSolidDifference.innerHTML = 'Solid';
        showHideSelfSolidDifference.className = 'btn btn-default';
        typeOfDiff = 'color';
        mixCurrentGalleryAndBackgroundImages();
        let imagesFound = showMixedImagesSelfDifferences(typeOfDiff);
        showSingleImagesOnCanvases(imagesFound, dynamicSingleImageCanvasesContainer);
    }
}

const doShowHideMixedImagesSelfMonoDifferences = (button) => {
    if (button.innerHTML === 'Monochrome') {
        colorMode.innerHTML = 'Monochrome - (Contrast)';
        button.className = 'btn btn-primary';
        showHideSelfNormalDifference.innerHTML = 'Normal';
        showHideSelfNormalDifference.className = 'btn btn-default';
        showHideSelfColorDifference.innerHTML = 'Color';
        showHideSelfColorDifference.className = 'btn btn-default';
        showHideSelfSolidDifference.innerHTML = 'Solid';
        showHideSelfSolidDifference.className = 'btn btn-default';
        typeOfDiff = 'mono';
        mixCurrentGalleryAndBackgroundImages();
        let imagesFound = showMixedImagesSelfDifferences(typeOfDiff);
        showSingleImagesOnCanvases(imagesFound, dynamicSingleImageCanvasesContainer);
    }
}

const doShowHideMixedImagesSelfSolidDifferences = (button) => {
    if (button.innerHTML === 'Solid') {
        colorMode.innerHTML = 'Solid - (Threshold)';
        button.className = 'btn btn-primary';
        showHideSelfNormalDifference.innerHTML = 'Normal';
        showHideSelfNormalDifference.className = 'btn btn-default';
        showHideSelfColorDifference.innerHTML = 'Color';
        showHideSelfColorDifference.className = 'btn btn-default';
        showHideSelfMonoDifference.innerHTML = 'Monochrome';
        showHideSelfMonoDifference.className = 'btn btn-default';
        typeOfDiff = 'solid';
        mixCurrentGalleryAndBackgroundImages();
        let imagesFound = showMixedImagesSelfDifferences(typeOfDiff);
        showSingleImagesOnCanvases(imagesFound, dynamicSingleImageCanvasesContainer);
    }
}


const doSendFromGalleryToMixed = (button) => {
    if (button.innerHTML === 'Mix') {
        button.innerHTML = 'No Mix';
        button.className = 'btn btn-primary';
        sendCurrentGalleryToMixed = true;
    } else {
        button.innerHTML = 'Mix';
        button.className = 'btn btn-default';
        sendCurrentGalleryToMixed = false;
    }
}

const doSendFromBackgroundsToMixed = (button) => {
    if (button.innerHTML === 'Mix') {
        button.innerHTML = 'No Mix';
        button.className = 'btn btn-primary';
        sendCurrentBackgroundsToMixed = true;
    } else {
        button.innerHTML = 'Mix';
        button.className = 'btn btn-default';
        sendCurrentBackgroundsToMixed = false;
    }
}

const doLeftRightAlign = (slider) => {

    let value = parseInt(slider.value);

    let delta = Math.abs(value - prevMoveVal);
    if (value < prevMoveVal) { // moved left
        rightCanvasPos.x -= delta;
    } else {                   // moved right
        rightCanvasPos.x += delta;
    }
    prevMoveVal = value;
    mergeImagesRightToLeft(rightCanvasPos);
}

/******************************************************************************************************
 * execution
 *****************************************************************************************************/
playerWidth = document.getElementById('playerWidth').value;
playerHeight = document.getElementById('playerHeight').value;
//playerHeight = playerWidth/2;
photoWidth = document.getElementById('photoWidth').value;
//photoHeight = document.getElementById('photoHeight').value;
photoHeight = photoWidth/2;
photoDispWidth = document.getElementById('photoDispWidth').value;
photoDispHeight = document.getElementById('photoDispHeight').value;
photoDispHeight = photoDispWidth/2;
hideAllPlayers();
//generatedCategoryButtonsForSnapShot.innerHTML = generateCategoryButtons();
//generatedCategoryButtonsForGalleryImage.innerHTML = generateCategoryButtons();
//acceptableImageToBackgroundDifferenceValue.innerHTML = acceptableImageToBackgroundDifference.value;
acceptableImageToImageDifferenceValue.innerHTML = acceptableImageToImageDifference.value;
normalDiffThresholdValue.innerHTML = normalDiffThreshold.value;
contrastValue.innerHTML = contrast.value;
diffThresholdValue.innerHTML = diffThreshold.value;
gridSquaresValue.innerHTML = gridSquares.value;
//bkgdValue.innerHTML = bkgd.value;
bgDiffValue.innerHTML = bgDiff.value;