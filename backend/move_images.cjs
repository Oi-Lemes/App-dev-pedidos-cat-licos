
const fs = require('fs');
const path = require('path');

const sourceDir = "C:/Users/pedro/.gemini/antigravity/brain/48a6379b-9338-48ef-888a-5abe0b86f8f5";
const destDir = "c:/Users/pedro/Downloads/App orações católicas/frontend/public/img/modules";

// Ensure dest dir exists (recursive)
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const mapping = {
    "mod_1_1770144671816.png": "mod_1.png",
    "mod_2_1770144687794.png": "mod_2.png",
    "mod_3_1770144703864.png": "mod_3.png",
    "mod_4_1770144717691.png": "mod_4.png",
    "mod_5_1770144732219.png": "mod_5.png",
    "mod_6_1770144770485.png": "mod_6.png",
    "mod_7_1770144785952.png": "mod_7.png",
    "mod_8_1770144801190.png": "mod_8.png",
    "mod_9_1770144815467.png": "mod_9.png",
    "mod_10_1770144829363.png": "mod_10.png",
    "mod_11_1770144864700.png": "mod_11.png",
    "mod_12_1770144878321.png": "mod_12.png",
    "mod_13_1770144891699.png": "mod_13.png",
    "mod_14_1770144906361.png": "mod_14.png",
    "mod_15_1770144920959.png": "mod_15.png",
    "mod_16_1770144959576.png": "mod_16.png",
    "mod_17_1770144974825.png": "mod_17.png"
};

console.log("Moving generated files...");
for (const [srcName, destName] of Object.entries(mapping)) {
    const src = path.join(sourceDir, srcName);
    const dst = path.join(destDir, destName);
    try {
        fs.copyFileSync(src, dst);
        console.log(`Copied ${srcName} to ${destName}`);
    } catch (e) {
        console.log(`Error copying ${srcName}: ${e.message}`);
    }
}

// Handle duplicates for 18, 19, 20
const duplicates = {
    "mod_18.png": "mod_8.png",
    "mod_19.png": "mod_6.png",
    "mod_20.png": "mod_14.png"
};

console.log("Creating duplicates for quota limit...");
for (const [newName, existingName] of Object.entries(duplicates)) {
    const src = path.join(destDir, existingName);
    const dst = path.join(destDir, newName);
    try {
        fs.copyFileSync(src, dst);
        console.log(`Created ${newName} from ${existingName}`);
    } catch (e) {
        console.log(`Error creating duplicate ${newName}: ${e.message}`);
    }
}
