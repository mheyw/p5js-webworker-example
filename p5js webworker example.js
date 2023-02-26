const s = (p) => {
    
    const pWork = "onmessage = function(e) { \
        let pixels = e.data[0];\
        let width = e.data[1];\
        let height = e.data[2];\
        let density = e.data[3]\
        for (let y = 0; y < height * density; y++) {\
            for (let x = 0; x < width * density; x++) {\
                let index = (x + y * width * density)*4;\
                if((pixels[index+0] + pixels[index+1] + pixels[index+2]) > 760){\
                    pixels[index+3] = 0;\
                }\
            }\
        }\
        postMessage(pixels); \
    }";
    let pWorker
    
    p.setup = function () {
        // Creating and positioning the canvas
        const cnv = p.createCanvas(600, 600);
        cnv.id('my-canvas');

        let pBlob = new Blob([pWork]);
        pWorker = new Worker(window.URL.createObjectURL(pBlob));
        pWorker.onmessage = function(e) {
            p.pixels = e.data;
        };
    };
    // The sketch draw method
    p.draw = function () {

        let density = p.pixelDensity();
        p.loadPixels();
        pWorker.postMessage([p.pixels, p.width, p.height, density]);
        p.updatePixels();
    };
};

let myp5 = new p5(s, 'canvas-wrapper');