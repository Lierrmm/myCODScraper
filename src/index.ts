import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

import { URL } from 'url';

const blockedTypes: string[] = ["font", "image", "media", "other", "xhr", "fetch", "stylesheet"];
const allowedHosts: string[] = ["my.callofduty.com", "profile.callofduty.com"];

function genString(length): string {
    let result: string           = '';
    const characters: string       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength: number = characters.length;
    for ( var i = 0; i < length; i++ ) result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
}

async function cleanFolder() {
    const directory = 'output/javascript';
    if(!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    } else {
        var files = await fs.readdirSync(directory);
        for await (const file of files) {
            fs.unlinkSync(path.join(directory, file));
        }
    }
}

(async () => {
    let browser = await puppeteer.launch();

    let page = await browser.newPage();

    let UserAgent: string = genString(256);
    await console.log(`Generated Random UserAgent: ${UserAgent}`);
    await page.setUserAgent(UserAgent);

    await console.log("Setting up Interception...");
    await page.setRequestInterception(true)

    await console.log("Loading Page...");

    await console.log("Blocking non JS files...");
    await page.on('request', async (request) => {
        if (blockedTypes.includes(request.resourceType())) request.abort();
        else request.continue();
    });
    await cleanFolder();
    await console.log("Hooking Responses...");
    await page.on('response', async (response) => {
        const url = new URL(response.url());
        let fileNameArr = url.pathname.split('/');
        let concatFile = fileNameArr[fileNameArr.length - 2] + "_" + fileNameArr[fileNameArr.length - 1];
        let filePath = `./output/javascript/${concatFile}`;
        if(filePath.endsWith(".js") && allowedHosts.includes(url.hostname)) {
            let buffer = await response.buffer();
            console.log("Writing", buffer.length, "bytes >", filePath);
            await fs.writeFileSync(filePath, buffer);
        }
    });

    await page.goto("https://my.callofduty.com/login", { waitUntil: 'networkidle2' }).then(() => {
        console.log("DOM loaded. Done.");
    }).catch((err) => {
        console.log(err.message);
    });
    await browser.close();
})();