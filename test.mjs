import captureWebsite from 'capture-website';
await captureWebsite.file('https://twitter.com/95rn16/status/1607052360773402624', './screenshot/screenshot.png', {
    // emulateDevice: 'Desktop',
    fullPage: true, 
    darkMode: true, width: 2400, height: 1080, overwrite: true
    // , userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1'
});