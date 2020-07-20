import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
const url: string = "https://my.callofduty.com/content/atvi/callofduty/mycod/web/en/data/json/iq-content-xweb.js";

function filter(obj, predicate): object {
    let result = {}, key;

    for (key in obj) {
        if (obj.hasOwnProperty(key) && !predicate(obj[key])) {
            result[key] = obj[key];
        }
    }
    return result;
};


(async () => {
    let browser = await puppeteer.launch();

    let page = await browser.newPage();

    await console.log("Loading Page...");
    await page.goto(url, { waitUntil: 'networkidle2' }).then((response) => {
        response.buffer().then((data: any) => {
            
            data = data.toString();
            let jsonObj: object = JSON.parse(data);
            let entries = Object.entries(jsonObj);
            let mwVals: string = "# Gamemode Items\n";
            let mwMapVals: string = "# Map Items\n";
            let mwWeapVals: string = "# Weapon Items\n";
            let mwSKUVals: string = "# General Items\n";
            entries.forEach(element => {
                if(element[0].startsWith("game-modes:mw")) {
                    mwVals += `${element[0].replace("game-modes:mw-", "").replace(":1", "")} = ${element[1]}\n`;
                }
                if(element[0].startsWith("maps:mw")) {
                    mwMapVals += `${element[0].replace("maps:mw-", "").replace(":1", "")} = ${element[1]}\n`;
                }
                if(element[0].startsWith("arsenal:weapons_iw8")) {
                    mwWeapVals += `${element[0].replace("arsenal:", "").replace(":1", "")} = ${element[1]}\n`;
                }
                if(element[0].startsWith("general:sku-")) {
                    mwSKUVals += `${element[0].replace(":1", "")} = ${element[1]}\n`;
                }
            });
            
            mwVals += mwMapVals += mwWeapVals += mwSKUVals;
            if(mwVals.endsWith("\n")) mwVals = mwVals.substr(0, mwVals.length -1);
            fs.writeFileSync('mappedmodes.txt', mwVals);
            console.log("DOM loaded. Done.");
        });
    }).catch((err) => {
        console.log(err.message);
    });
    await browser.close();
})();