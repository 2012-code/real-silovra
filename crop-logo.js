const sharp = require('sharp');
const path = require('path');

const inputPath = 'c:/Users/abdal/Desktop/anti first app/ultra-links/public/silovra-logo.png';
const outputPath = 'c:/Users/abdal/Desktop/anti first app/ultra-links/src/app/icon.png';

async function cropLogo() {
    try {
        const metadata = await sharp(inputPath).metadata();
        const { width, height } = metadata;

        // Assuming the icon is a square on the left. 
        // We'll take a square based on the height.
        const size = height;

        await sharp(inputPath)
            .extract({ left: 0, top: 0, width: size, height: size })
            .toFile(outputPath);

        console.log('Successfully cropped icon-only logo to src/app/icon.png');
    } catch (err) {
        console.error('Error cropping logo:', err);
    }
}

cropLogo();
