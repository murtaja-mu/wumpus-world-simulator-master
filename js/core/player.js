/**************************************************
** GAME PLAYER CLASS (WITH DASH ABILITY)
**************************************************/

var FACING_TO_UP = 1,
    FACING_TO_DOWN = 2,
    FACING_TO_LEFT = 3,
    FACING_TO_RIGHT = 4;

var Player = function(env, x, y) {

    this.x = x;
    this.y = y;
    this.env = env;
    this.speed = this.env.height;
    this.direction = FACING_TO_DOWN;
    this.score = 0;
    this.arrow = 10;

    // ---(Dash Charge) ---
    this.dashCharge = 3; 
    this.maxCharge = 3;  

    this.markAsVisible = function(){
        this.env.visible[this.getPosI()][this.getPosJ()] = 1;
    }

    this.tryMove = function(newX, newY) {
        if (newX >= 0 && newX < this.env.i * this.env.width &&
            newY >= 0 && newY < this.env.j * this.env.height) {
            this.x = newX;
            this.y = newY;
            resources.play("move");
            return true;
        }
        return false;
    };

    this.kill = function(keys) {
        var deadWumpus = null;
        if (keys.space) {
            if (this.arrow == 0) { return false; }
            this.arrow--;
            keys.space= false;
            var pos = null;
            if(this.direction == FACING_TO_UP) pos = {i:this.getPosI(), j:this.getPosJ()-1};
            if(this.direction == FACING_TO_DOWN) pos = {i:this.getPosI(), j:this.getPosJ()+1};
            if(this.direction == FACING_TO_LEFT) pos = {i:this.getPosI()-1, j:this.getPosJ()};
            if(this.direction == FACING_TO_RIGHT) pos = {i:this.getPosI()+1, j:this.getPosJ()};

            deadWumpus = this.env.get(this.env.wumpus, pos.i, pos.j);

            if (deadWumpus) { resources.play("arrow"); }
            else { resources.play("error"); }
        }
        return deadWumpus;
    };

    this.capture = function(keys) {
        var capturedGold = null;
        if (keys.enter) {
            keys.enter = false;
            capturedGold = this.env.get(this.env.golds, this.getPosI(), this.getPosJ());
        }
        return capturedGold;
    };

    this.update = function(keys) {

        // Previous position
        var prevX = this.x,
            prevY = this.y;

        var movedNormal = false;
        var movedDash = false;


        if (this.dashCharge >= this.maxCharge) {
            if (keys.w) {
                this.direction = FACING_TO_UP;
                if (this.tryMove(this.x, this.y - (this.speed * 2))) movedDash = true;
            } else if (keys.s) {
                this.direction = FACING_TO_DOWN;
                if (this.tryMove(this.x, this.y + (this.speed * 2))) movedDash = true;
            } else if (keys.a) {
                this.direction = FACING_TO_LEFT;
                if (this.tryMove(this.x - (this.speed * 2), this.y)) movedDash = true;
            } else if (keys.d) {
                this.direction = FACING_TO_RIGHT;
                if (this.tryMove(this.x + (this.speed * 2), this.y)) movedDash = true;
            }
        }

        if (!movedDash) {
            if (keys.up) {
                this.direction = FACING_TO_UP;
                if (this.tryMove(this.x, this.y - this.speed)) movedNormal = true;
            } else if (keys.down) {
                this.direction = FACING_TO_DOWN;
                if (this.tryMove(this.x, this.y + this.speed)) movedNormal = true;
            } else if (keys.left) {
                this.direction = FACING_TO_LEFT;
                if (this.tryMove(this.x - this.speed, this.y)) movedNormal = true;
            } else if (keys.right) {
                this.direction = FACING_TO_RIGHT;
                if (this.tryMove(this.x + this.speed, this.y)) movedNormal = true;
            }
        }

        // --- (Charge Logic) ---
        if (movedDash) {
           
            this.dashCharge = 0;
            
            keys.w = keys.s = keys.a = keys.d = false;
        } else if (movedNormal) {
            
            if (this.dashCharge < this.maxCharge) {
                this.dashCharge++;
            }
        }

        this.markAsVisible();

        // Reset keys
        keys.up = keys.down = keys.left = keys.right = false;
        keys.w = keys.s = keys.a = keys.d = false;

        return (prevX != this.x || prevY != this.y) ? true : false;
    };

    this.evaluate = function(){

    };

    this.getPosI = function(){
        return Math.floor(this.x / this.env.width);
    };

    this.getPosJ = function(y){
        return Math.floor(this.y / this.env.height);
    };

    this.draw = function(ctx) {
        if(this.direction == FACING_TO_DOWN){
            ctx.drawImage(resources.images['facing_to_down'], this.x, this.y, this.env.width, this.env.height);
        }else if(this.direction == FACING_TO_UP){
            ctx.drawImage(resources.images['facing_to_up'], this.x, this.y, this.env.width, this.env.height);
        }else if(this.direction == FACING_TO_LEFT){
            ctx.drawImage(resources.images['facing_to_left'], this.x, this.y, this.env.width, this.env.height);
        }else if(this.direction == FACING_TO_RIGHT){
            ctx.drawImage(resources.images['facing_to_right'], this.x, this.y, this.env.width, this.env.height);
        }


        ctx.textAlign = "center";
        ctx.font = "bold 14px Arial";

        if (this.dashCharge >= this.maxCharge) {

            ctx.fillStyle = "#00FF00"; 
            ctx.fillText("DASH!", this.x + 32, this.y - 5);
        } else {
 
            ctx.fillStyle = "yellow";
            var dots = "";
            for(var k=0; k < this.dashCharge; k++) dots += ".";
            ctx.fillText(dots, this.x + 32, this.y - 5);
        }
    };
};