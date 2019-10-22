(function () {
    let scale = 1 / window.devicePixelRatio;
    // document.write(
    //     `
    //     <meta name="viewport" content="width=device-width, 
    //     initial-scale=${scale}, minimum-scale=${scale}, user-scalable=no">
    //     `
    // )
    let unit = window.innerWidth / 750;
    document.write(`
                    <style>
                        html, body {
                            font-size: ${100 * unit}px;
                            margin: 0;
                            padding: 0;
                            width: 100%;
                            height: 100%;
                        }
                        * {
                            position: relative;
                            margin: 0;
                            padding: 0;
                            line-height: 1.6;
                            font-family: 'Microsoft Yahei',-apple-system-font,Helvetica Neue,sans-serif;
                        }

                        a {
                            text-decoration: none;   
                        }
                        .clearfix {
                            zoom: 1;
                        }
                        .clearfix:after {
                            content: ".";
                            display: block;
                            height: 0;
                            clear: both;
                            visibility: hidden;
                        }
                    </style>
                    `
    )
})()