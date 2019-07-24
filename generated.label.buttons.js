'use strict';

const categories = [
    'Background',
    'Ed',
    'Cat',
    'La',
    'TV'
];

const addCategoryToGalleryPhoto = (button) => {
    const category = button.innerHTML;
    if (imageForDispOnlyGallery1.length > 0) {
        delete imageForDispOnlyGallery1[imageGalleryCurrentIndex].categories.none;
        if (category !== 'Background') { delete imageForDispOnlyGallery1[imageGalleryCurrentIndex].categories.Background; }
        imageForDispOnlyGallery1[imageGalleryCurrentIndex].categories[category] = category;
    }
    if (imageForDispOnlyGallery2.length > 0) {
        delete imageForDispOnlyGallery2[imageGalleryCurrentIndex].categories.none;
        if (category !== 'Background') { delete imageForDispOnlyGallery2[imageGalleryCurrentIndex].categories.Background; }
        imageForDispOnlyGallery2[imageGalleryCurrentIndex].categories[category] = category;
    }
    if (imageForDispOnlyGallery3.length > 0) {
        delete imageForDispOnlyGallery3[imageGalleryCurrentIndex].categories.none;
        if (category !== 'Background') { delete imageForDispOnlyGallery3[imageGalleryCurrentIndex].categories.Background; }
        imageForDispOnlyGallery3[imageGalleryCurrentIndex].categories[category] = category;
    }
    displayImagesFromGallery(imageGalleryCurrentIndex);
}
const generateCategoryButtons = () => {
    let html = '';
    categories.forEach(category => {
        html += '<button class="btn btn-default" id="category-' + category +'" onclick="addCategoryToGalleryPhoto(this)">' + category + '</button>';
    })
    return html;
}