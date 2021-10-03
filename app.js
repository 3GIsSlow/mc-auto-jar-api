const express = require('express');
const app = express();
const axios = require('axios');
const fs = require('fs');

const PORT = 3000;
const MC_MANIFEST_URL = "https://launchermeta.mojang.com/mc/game/version_manifest.json";

app.get('/api/download/latest', async (req, res) => {
    // Retrieve the manifest data
    let response = await axios.get(MC_MANIFEST_URL);
    let data = await response.data;

    // Filter down to the selected version
    let selectedVersion = data.versions[0];

    // Retrieve meta data for selected version
    let versionMeta = await axios.get(selectedVersion.url);
    let downloadURL = versionMeta.data.downloads.server.url;

    // Create stream for download
    let fileName = `server-${selectedVersion.id}.jar`;
    let file = fs.createWriteStream(fileName);

    // Retrieve the jar and download it to the requesters computer
    let streamResponse = await axios({
        method: 'GET',
        url: downloadURL,
        responseType: 'stream'
    });

    let stream = streamResponse.data.pipe(file);
    
    stream.on('finish', () => {
        res.download(fileName);
    });
});

app.get('/api/download/:version', async (req, res) => {
    // Retrieve the manifest data
    let response = await axios.get(MC_MANIFEST_URL);
    let data = await response.data;

    // Filter down to the selected version
    let selectedVersion = data.versions.filter(x => x.id === req.params.version)[0];

    // Retrieve meta data for selected version
    let versionMeta = await axios.get(selectedVersion.url);
    let downloadURL = versionMeta.data.downloads.server.url;

    // Create stream for download
    let fileName = `server-${selectedVersion.id}.jar`;
    let file = fs.createWriteStream(fileName);

    // Retrieve the jar and download it to the requesters computer
    let streamResponse = await axios({
        method: 'GET',
        url: downloadURL,
        responseType: 'stream'
    });

    let stream = streamResponse.data.pipe(file);
    
    stream.on('finish', () => {
        res.download(fileName);
    });
});

app.get('/api/versions', async (req, res) => {
    let response = await axios.get(MC_MANIFEST_URL);
    let data = response.data;

    res.send(data);
});

app.get('/api/versions/:version', async (req, res) => {
    let response = await axios.get(MC_MANIFEST_URL);
    let data = response.data;
    let filteredData = data.versions.filter(x => x.id === req.params.version);

    res.send(filteredData);
});

app.listen(PORT, () => {
    console.log(`Server listening on: ${PORT}`);
});