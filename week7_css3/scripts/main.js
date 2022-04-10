class RigidBody{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    detectCollision(body) {
        if(Math.abs(this.x - body.x) < (this.width + body.width) / 2
            && Math.abs(this.y - body.y) < (this.height + body.height) / 2){
                return true;
            }
        else return false;
    }
}

class Animal extends RigidBody{
    /*
     * Group is used to distinguish ally from enemy.
     */
    constructor(x, y, width, height, htmlElem, group){
        super(x, y, width, height);
        this.htmlElem = htmlElem;
        this.group = group;
        this.hp = 100;
    }

    fireBullet(bullet, bulletList, angle, speed){
        bullet.x = this.x;
        bullet.y = this.y;
        bullet.vx = speed * Math.sin(angle);
        bullet.vy = speed * Math.cos(angle);
        bullet.move();
        bullet.activate();
        bulletList.push(bullet);
    }

    takeDamage(damage){
        this.hp -= damage;
        this.htmlElem.querySelector('.hp-bar').style.width = `${this.hp}%`;
    }
}

class Bullet extends RigidBody{
    constructor(width, height, htmlElem, group, atk){
        super(0, 0, width, height);
        this.htmlElem = htmlElem;
        this.group = group;
        this.atk = atk;
        this.active = false;
        this.gravity = -1;
        this.vx = 0;
        this.vy = 0;
        this.active = false;
    }

    move(){
        this.x += this.vx;
        this.y += this.vy;
        
        this.vy += this.gravity;

        this.htmlElem.style.bottom = `${this.y}px`;
        this.htmlElem.style.left = `${this.x}px`;
    }

    activate(){
        this.active = true;
        this.htmlElem.classList.remove('hidden');
    }

    deactivate(){
        this.active = false;
        this.htmlElem.classList.add('hidden');
    }
}

class Game{
    constructor(){
        this.player = new Animal(
            140, 60,
            80, 120,
            document.getElementById('cat'),
            'player'
        );
        this.bot = new Animal(
            840, 60,
            80, 120,
            document.getElementById('dog'),
            'bot'
        );
        this.fishBullet = new Bullet(
            30, 30,
            document.getElementById('fish-bullet'),
            'player', 50
        );
        this.boneBullet = new Bullet(
            30, 30,
            document.getElementById('bone-bullet'),
            'bot', 30
        );
        this.bulletList = [];
        this.animalList = [this.player, this.bot];
    }

    start(){
        this.chooseAngle();
        this.physicsId = setInterval(this.physics.bind(this), 50);
    }

    physics(){
        for (var i = 0; i < this.bulletList.length; i++){
            var bullet = this.bulletList[i];
            bullet.move();
            for (var j = 0; j < this.animalList.length; j++){
                var animal = this.animalList[j];
                if (bullet.detectCollision(animal) && bullet.group != animal.group){
                    animal.takeDamage(bullet.atk);
                    bullet.deactivate();
                    if (animal.hp <= 0){
                        this.gameOver();
                    }
                }
            }
            if (bullet.x < 0 || bullet.x > 1000 || bullet.y < 0 || bullet.y > 550)
                bullet.deactivate();
        }
        
        this.bulletList = this.bulletList.filter((bullet)=>bullet.active);
    }

    /* Game phase:
     * chooseAngle -> choosePower -> playerShoot -> enemyShoot
     * -> chooseAngle
     * 
     * If hp reduced to zero in bulletFlying, then
     * -> gameOver
     */
    chooseAngle(){
        angleButton.disabled = false;
        powerButton.disabled = true;
    }

    choosePower(){
        angleButton.disabled = true;
        powerButton.disabled = false;
    }

    playerShoot(){
        angleButton.disabled = true;
        powerButton.disabled = true;
        this.player.fireBullet(
            this.fishBullet,
            this.bulletList,
            angle,
            power * 30
        );
        setTimeout(this.enemyShoot.bind(this), 2000);
    }

    enemyShoot(){
        var botAngle = - Math.random() * Math.PI / 2;
        this.bot.fireBullet(
            this.boneBullet,
            this.bulletList,
            botAngle,
            25
        )
        setTimeout(this.chooseAngle.bind(this), 2000);
    }

    gameOver(){
        clearInterval(this.physicsId);

        var popUp = document.querySelector('.pop-up');
        var mask = document.querySelector('.mask');

        popUp.classList.remove('hidden');
        mask.classList.remove('hidden');
    }
}

function toggleChangeShadow(){
    var active = false;
    return function(e){
        if (active == false){
            active = true;
            e.currentTarget.classList.add("change-shadow-animation");
        }
        else{
            active = false;
            e.currentTarget.classList.remove("change-shadow-animation");
        }
    }
}

function chooseAngle(){
    var active = false;
    var intervalId = null;
    return function(e){
        if (active == false){
            active = true;
            intervalId = setInterval(changeAngle(), 50);
        }
        else{
            active = false;
            clearInterval(intervalId);
            game.choosePower();
        }
    }
}

function changeAngle(){
    var delta = 0.1;
    return function(e){
        if (angle > Math.PI / 2 || angle < 0){
            delta = -delta;
        }
        angle = angle + delta;
        angleStick.style.transform = `rotate(${angle}rad)`;
    }
}

function choosePower(){
    var active = false;
    var intervalId = null;
    return function(e){
        if (active == false){
            active = true;
            intervalId = setInterval(changePower(), 50);
        }
        else{
            active = false;
            clearInterval(intervalId);
            game.playerShoot();
        }
    }
}

function changePower(){
    var delta = 0.1;
    return function(e){
        if (power > 0.9){
            delta = -0.1;
        }
        if (power < 0){
            delta = 0.1
        }
        power = power + delta;
        powerStick.style.height = `${power * 100}%`;
    }
}

var angle = 0;
var power = 0;
var angleButton = document.getElementById("angle-button");
var powerButton = document.getElementById("power-button");
var angleStick = document.getElementById("angle-stick");
var powerStick = document.getElementById("power-stick");

angleButton.addEventListener('click', toggleChangeShadow());
angleButton.addEventListener('click', chooseAngle());

powerButton.addEventListener('click', toggleChangeShadow());
powerButton.addEventListener('click', choosePower());

var restartButton = document.getElementById("restart-button");
restartButton.addEventListener('click', function(){
    location.reload();
})

var game = new Game();
game.start();