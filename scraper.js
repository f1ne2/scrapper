const axios = require('axios').default;
const cheerio = require('cheerio');
const fs = require('fs');

let visited = [];
let URL = [];
let link = ['http://www.tut.by/'];
URL.push('http://www.tut.by/');

async function parse(url) {
    let getHTML = async (url) => {
        let { data } = await axios.get(url)
            return cheerio.load(data)
    }
    try {
        const $ = await getHTML(url[0]);
    $('link[rel="dns-prefetch"]').each(function (i, e) {
        link.push($(this).attr("href"));
    });
    $('a').each(function (j, e) {
        if ($(this).attr('href') != null)
            link.push([$(this).attr('href')]);
        if ($(this).attr('data-url-1') != null)
            link.push([$(this).attr('data-url-1')]);
        if ($(this).attr('data-url-2') != null)
            link.push([$(this).attr('data-url-2')]);
    });
    let template = new RegExp('^((ftp|http|https):\\/\\/)www.*.tut.*');
    for (let i=0; i<link.length; i++) {
        if (visited.indexOf(link[i]) == -1 && template.test(link[i])) {
            visited.push(link[i])
            URL.push(link[i])

        }
    }
    fs.appendFileSync('./visited.json', JSON.stringify(url[0]));
    fs.appendFileSync('./visited.json', "\n")
    URL.shift()
    } catch (error) {
        fs.appendFileSync('./crashed.json', JSON.stringify(url[0]));
        fs.appendFileSync('./crashed.json', "\n")
        URL.shift()
    }

    while (URL.length !== 0) {
        await parse(URL[0])
    }

}

parse(URL);
