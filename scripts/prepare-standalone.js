const fs = require('fs-extra');
const path = require('path');

async function prepareStandalone() {
    const rootDir = path.resolve(__dirname, '..');
    const standaloneDir = path.join(rootDir, '.next', 'standalone');

    if (!fs.existsSync(standaloneDir)) {
        console.warn('.next/standalone not found. Doing nothing.');
        return;
    }

    // Next.js standalone server looks for .next/static and public in the same folder as the server.js
    const targets = [
        { src: path.join(rootDir, '.next', 'static'), dest: path.join(standaloneDir, '.next', 'static') },
        { src: path.join(rootDir, 'public'), dest: path.join(standaloneDir, 'public') },
        { src: path.join(rootDir, 'node_modules', '.prisma'), dest: path.join(standaloneDir, 'node_modules', '.prisma') }
    ];

    for (const { src, dest } of targets) {
        if (fs.existsSync(src)) {
            console.log(`Copying ${src} to ${dest}...`);
            await fs.ensureDir(path.dirname(dest));
            await fs.copy(src, dest, { overwrite: true });
        } else {
            console.warn(`Source path ${src} does not exist.`);
        }
    }

    console.log('Standalone build prepared successfully for Hostinger.');
}

prepareStandalone().catch(err => {
    console.error('Error preparing standalone build:', err);
    process.exit(1);
});
