window.addEventListener('DOMContentLoaded', () => {
    let canvas = document.querySelector('.bg');
    let ctx = canvas.getContext('2d');
    let terrainBlockArray = []

    for(let i = 0; i <= 10; i++){
        let terrain = new Terrain((i * 50), 570,50,50,ctx)
        terrainBlockArray[i] = terrain
    }

    let player = new Player(100,400,50,50,ctx,terrainBlockArray,canvas)

    function main(){
        ctx.clearRect(0,0,canvas.width,canvas.height)
        player.draw()
        player.update()
        player.bulletDraw()
        terrainBlockArray.forEach(terrain => {
            terrain.draw()
        })
        requestAnimationFrame(main)
    }
    main();
})

class Player {
    constructor(x,y,width,height,ctx,terrain,canvas){
        this.x = x,
        this.y = y,
        this.width = width,
        this.height = height,
        this.ctx = ctx,
        this.velocityX = 0,
        this.velocityY = 0,
        this.gravity = 0.3,
        this.initialVelocity = 0,
        this.maxVelocity = 10,
        this.playerSpeed = 5,
        this.isJumping = false,
        this.isFalling = true,
        this.terrain = terrain,
        this.bulletX = x,
        this.bulletY = y,
        this.bullets = [],
        this.canvas = canvas

        this.initControls()
        this.strike()
    }

    initControls(){
        window.addEventListener('keydown', (e) => {
            let clickedKey = e.key;

            switch(clickedKey){
                case "w":
                    this.jump()
                    break;
                case "a":
                    this.velocityX = -1
                    break;
                case "d": 
                    this.velocityX = 1
                    break;
                default:
                    return
            }
        })  

        window.addEventListener('keyup', () => {
            this.velocityX = 0
        })
    }

    update(){
        this.x += this.velocityX * this.playerSpeed
        
        if(!this.isJumping && !this.isFalling){
            this.velocityY = 0;
        }else{
            this.velocityY += 0.3
        }

        if(this.isJumping){
            this.y -= this.initialVelocity
            this.initialVelocity -= this.gravity

            if(this.initialVelocity <= 0){
                this.isJumping = false;
                this.isFalling = true
            }
        }   

        if(this.isFalling){
            let isColliding = false

            for(let i = 0;i < this.terrain.length; i++){
                if(this.colisons(this.terrain[i])){
                    isColliding = true
                    break;
                }
            }

            if(!isColliding){
                this.y += this.initialVelocity
                this.initialVelocity += this.gravity
            }else{
                this.isFalling = false
            }
        }
    }

    strike(){
        window.addEventListener('click', (e) => {
            let mouseX = e.clientX;
            let mouseY = e.clientY;
            let x = mouseX - this.x;
            let y = mouseY - this.y;
            let bulletSpeed = 5
            
            let directionRadian = Math.atan2(y,x)
            let direction = directionRadian

            this.bulletX = this.x;
            this.bulletY = this.y

            let bulletVelX = bulletSpeed * Math.cos(direction);
            let bulletVelY = bulletSpeed *  Math.sin(direction);
            this.bullets.push([bulletVelX,bulletVelY])
            console.log(this.bullets)
        })
        
    }

    bulletDraw(){
        this.bullets.forEach(bullet => {
            this.bulletX += bullet[0]
            this.bulletY += bullet[1]
    
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(this.bulletX,this.bulletY,10,10)

            if(this.bulletX > this.canvas.width || this.bulletX < 0 || this.bulletY > this.canvas.height || this.bulletY < 0 ){
                this.bullets.pop(bullet)
            }
        })
    }

    draw(){
        this.ctx.fillStyle = "green"
        this.ctx.fillRect(this.x,this.y,this.width,this.height)
    }

    jump(){
        if(!this.isJumping && !this.isFalling){
            this.isJumping = true;
            this.initialVelocity = this.maxVelocity;
        }
    }

    colisons(element){
        let elementX = element.getCords().x
        let elementY = element.getCords().y
        let elementWidth = element.getSize().width
        let elementHeight = element.getSize().height

        if(
            this.x < elementX + elementWidth &&
            this.x + this.width > elementX && 
            this.y < elementY + elementHeight &&
            this.y + this.height > elementY
        ){
            return true
        }

        return false
    }
}

class Terrain {
    constructor(x,y,width,height,ctx){
        this.x = x,
        this.y = y,
        this.width = width,
        this.height = height,
        this.ctx = ctx
    }

    getCords(){
        return {
            x: this.x,
            y: this.y
        }
    }

    getSize(){
        return{
            width: this.width,
            height: this.height
        }
    }

    draw(){
        this.ctx.fillStyle = "blue"
        this.ctx.fillRect(this.x,this.y,this.width,this.height)
    }
}