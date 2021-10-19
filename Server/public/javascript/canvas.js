function canvas() {

    var activeButtons = {}
    var images = {}
    var vectors = {}
    const c = document.getElementById("gameWindow")
    const ctx = c.getContext("2d")

    const buttons = {
        startButton: {
            x: 200,
            y: 420,
            width: 100,
            height: 50,
            color: "lime",
            text: {
                offsetX: 15,
                offsetY: 35,
                font: "30px Arial",
                color: "black",
                text: "Start"
            },
            action: () => {
                console.log("Game Started")
                manageButtons("startButton", "remove")
                manageImages("factory", "remove")
                vectors.floor = () => {
                    ctx.fillStyle = "#ffc078"
                    ctx.fillRect(0, 326, 500, 174)
                }
                // vectors.wall = () => {
                //     ctx.fillStyle = 
                // }
                manageImages({
                    name: "belt",
                    src: `${url}/static/images/belt.png`,
                    data: {
                        x: 0,
                        y: 43,
                        wMultiplier: 0.8,
                        hMultiplier: 0.8,
                        animation: {
                            active: false
                        }
                    }
                })
                manageImages({
                    name: "crusherBody",
                    src: `${url}/static/images/crusherBody.png`,
                    data: {
                        x: 187,
                        y: 300,
                        wMultiplier: 0.8,
                        hMultiplier: 0.8,
                        animation: {
                            active: false
                        }
                    }
                })
                for (let i = 0; i < 10; i++) {
                    manageImages({
                        name: `rock${i}`,
                        src: `${url}/static/images/rocks.png`,
                        data: {
                            x: -55 - i * 50,
                            y: 238,
                            wMultiplier: 0.04,
                            hMultiplier: 0.04,
                            animation: {
                                active: false,
                                type: "horizontalMove",
                                val: 0,
                                maxVal: 255  + i * 50,
                                speed: 1
                            }
                        }
                    })
                }
                manageImages({
                    name: "wheel",
                    src: `${url}/static/images/hjul.png`,
                    data: {
                        x: 184,
                        y: 158,
                        wMultiplier: 0.8,
                        hMultiplier: 0.8,
                        animation: {
                            active: false,
                            type: "spin",
                            val: 0,
                            speed: 3
                        }
                    }
                })
                manageButtons("bauxiteCrusher")

            }
        },
        bauxiteCrusher: {
            x: 200,
            y: 420,
            width: 100,
            height: 50,
            color: "lime",
            text: {
                offsetX: 15,
                offsetY: 35,
                font: "30px Arial",
                color: "black",
                text: "Knus"
            },
            action: () => {
                images.wheel.data.animation.active = !images.wheel.data.animation.active
                
                vectors.text = () => {
                    ctx.fillStyle = "black"
                    ctx.font = "15px Arial"
                    ctx.fillText("Bauxitt malm blir knust", 80, 100)
                    ctx.fillText("for å redusere partikkel størrelse", 80, 120)
                }
                for (let i = 0; i < 10; i++) {
                    images[`rock${i}`].data.animation.active = !images[`rock${i}`].data.animation.active
                }
            }
        }
    }

    function isInButton(pos, rect) {
        return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y 
    }

    function getMousePos(c, evt) {
        const rect = c.getBoundingClientRect()
        return {
            x: (evt.clientX - rect.left) * 0.625,
            y: (evt.clientY - rect.top) * 0.625
        }
    }

    function manageButtons(button, mode="add") {
        if (mode == "add") {
            activeButtons[button] = buttons[button]
        }
        else if (mode == "remove") {
            delete activeButtons[button]
        }
    }

    function manageImages(imageData, mode="add") {
        if (mode == "add") {
            const img = new Image()
            img.src = imageData.src
            imgLoaded = false

            console.log(imageData.name)
            images[imageData.name] = {
                image: img,
                data: imageData.data
            }
            images[imageData.name].src = imageData.url
        }
        else if (mode == "remove") {
            delete images[imageData]
        }
    }

    function drawButtons(buttons) {
        for (const [k, v] of Object.entries(buttons)) {
            ctx.fillStyle = v.color
            ctx.strokeStyle = "black"
            ctx.fillRect(v.x, v.y, v.width, v.height)
            ctx.lineWidth = 4
            ctx.strokeRect(v.x, v.y, v.width, v.height)
            ctx.font = v.text.font
            ctx.fillStyle = v.text.color
            ctx.fillText(v.text.text, v.x+v.text.offsetX, v.y+v.text.offsetY)
        }
    }

    function drawImages(images) {
        for (const [k, v] of Object.entries(images)) {
            if (v.data.animation.active) {
                if (v.data.animation.type == "spin") {
                    drawImageRot(v.image, v.data.x, v.data.y, v.image.width * v.data.wMultiplier, v.image.height * v.data.hMultiplier, v.data.animation.val)
                    v.data.animation.val = v.data.animation.val + v.data.animation.speed
                }
                else if (v.data.animation.type == "horizontalMove") {
                    if (v.data.animation.val > v.data.animation.maxVal) {
                        for (let i = 0; i < 10; i++) {
                            v.data.hMultiplier = 0.01
                            v.data.y = 258
                        }
                    }
                    ctx.drawImage(v.image, v.data.x + v.data.animation.val, v.data.y, v.image.width * v.data.wMultiplier, v.image.height * v.data.hMultiplier)
                    v.data.animation.val = v.data.animation.val + v.data.animation.speed
                }
            }
            else {
                ctx.drawImage(v.image, v.data.x, v.data.y, v.image.width * v.data.wMultiplier, v.image.height * v.data.hMultiplier)
            }
        }
    }

    function drawVectors(vectors) {
        for (const [k, v] of Object.entries(vectors)) {
            v()
        }
    }

    function drawImageRot(img,x,y,width,height,deg){
        // Store the current context state (i.e. rotation, translation etc..)
        ctx.save()
    
        //Convert degrees to radian 
        var rad = deg * Math.PI / 180;
    
        //Set the origin to the center of the image
        ctx.translate(x + width / 2, y + height / 2);
    
        //Rotate the canvas around the origin
        ctx.rotate(rad);
    
        //draw the image    
        ctx.drawImage(img,width / 2 * (-1),height / 2 * (-1),width,height);
    
        // Restore canvas state as saved from above
        ctx.restore();
    }

    manageImages({
        name: "factory", 
        src: `${url}/static/images/slazzer-edit-image.png`,
        data: {
            x: 0,
            y: 0,
            wMultiplier: 1.002,
            hMultiplier: 1.002,
            animation: {
                active: false
            }
        }
    })
    setInterval(() => {
        ctx.strokeStyle = "#FF0000"
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, 500, 500) // Fill background with white
        drawVectors(vectors)
        drawImages(images)
        drawButtons(activeButtons)
    }, 10)

    c.addEventListener("click", (evt) => {
        const mousePos = getMousePos(c, evt)
        for (const [k, v] of Object.entries(activeButtons))
        if (isInButton(mousePos, v)) {
            v.action()
        }
        else {
            console.log(mousePos)
        }
    })

    manageButtons("startButton")

}canvas()