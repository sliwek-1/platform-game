window.addEventListener('DOMContentLoaded', () => {
    let canvas = document.querySelector('.bg');
    let ctx = canvas.getContext('2d');
    let terrainBlockArray = []
    let bullets = []

    for(let i = 0; i <= 20; i++){
        let terrain = new Terrain((i * 50), 550,50,50,ctx)
        terrainBlockArray.push(terrain)
    }

    for(let j = 0; j <= 20; j++){
        let terrain = new Terrain((j * 50), 0,50,50,ctx)
        terrainBlockArray.push(terrain)
    }

    for(let k = 0; k <= 11; k++){
        let terrain = new Terrain(0, (k * 50),50,50,ctx)
        terrainBlockArray.push(terrain)
    }

    for(let g = 0; g <= 11; g++){
        let terrain = new Terrain(950, (g * 50),50,50,ctx)
        terrainBlockArray.push(terrain)
    }

    let player = new Player(100,400,50,50,ctx,terrainBlockArray,canvas,bullets)

    function main(){
        ctx.clearRect(0,0,canvas.width,canvas.height)
        player.draw()
        player.update()
        bullets.forEach(bullet => {
            bullet.bulletDraw()
            bullet.update()
        })
        terrainBlockArray.forEach(terrain => {
            terrain.draw()
        })
        requestAnimationFrame(main)
    }
    main();
})

class Player {
    constructor(x,y,width,height,ctx,terrain,canvas,bullets){
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
        this.canvas = canvas,
        this.bullets = bullets,

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
        let isColliding = false

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

        let isCollidingX = false;

        for (let i = 0; i < this.terrain.length; i++) {
            if (this.colisons(this.terrain[i])) {
                isCollidingX = true;

                if (this.velocityX > 0) {
                    this.x = this.terrain[i].getCords().x - this.width;
                } else if (this.velocityX < 0) {
                    this.x = this.terrain[i].getCords().x + this.terrain[i].getSize().width;
                }
    
                break;
            }
        }

        if(this.isFalling){

            for(let i = 0;i < this.terrain.length; i++){
                if(this.colisons(this.terrain[i])){
                    isColliding = true
                    this.y = this.terrain[i].getCords().y - this.height;
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
            let bulletSpeed = 10
                
            let directionRadian = Math.atan2(y,x)
            let direction = directionRadian

            let bulletVelX = bulletSpeed * Math.cos(direction);
            let bulletVelY = bulletSpeed *  Math.sin(direction);
            
            let bullet = new Bullet(bulletVelX,bulletVelY,this.x,this.y,this.ctx,this.canvas,this.terrain)

            this.bullets.push(bullet)
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

class Bullet {
    constructor(velX,velY,x,y,ctx,canvas,terrain){
        this.velX = velX,
        this.velY = velY,
        this.x = x,
        this.y = y,
        this.ctx = ctx,
        this.width = 10,
        this.height = 10,
        this.canvas = canvas,
        this.terrain = terrain,
        this.isFalling = false
    }

    update(){
        let isColliding = false;
        this.x += this.velX;
        this.y += this.velY; 

        for(let i = 0; i < this.terrain.length; i++){
            if(this.colisons(this.terrain[i])){

                if (this.velX > 0) {
                    this.x = this.terrain[i].getCords().x - this.width;
                } else if (this.velX < 0) {
                    this.x = this.terrain[i].getCords().x + this.terrain[i].getSize().width;
                }
                isColliding = true

                if(this.isColliding){
                    this.velX = 0;
                    this.velY = 0;
                }
            }
        }


        if(this.isFalling){
            
        }

    }

    bulletDraw(){
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(this.x,this.y,this.width,this.height)
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