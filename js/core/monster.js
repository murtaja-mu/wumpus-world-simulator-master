/**************************************************
** THE RIVAL MONSTER CLASS (FULLY FIXED)
**************************************************/

var Monster = function(env, x, y) {

    this.x = x * env.width;
    this.y = y * env.height;
    this.env = env;
    this.speed = this.env.height; 
    this.direction = 2; // 1:Up, 2:Down, 3:Left, 4:Right

    this.lastKnownPos = null;

    this.chaseTurnCounter = 0;

    this.STATE_PATROL = 1;
    this.STATE_CHASE = 2;
    this.STATE_SEARCH = 3;

    this.currentState = this.STATE_PATROL;

    this.searchDelay = 0; 
    this.maxSearchTurns = 5; 
    
    this.jumpDelay = 0;
    this.maxJumpDelay = 2; 

    this.getPosI = function(){ return Math.floor(this.x / this.env.width); };
    this.getPosJ = function(){ return Math.floor(this.y / this.env.height); };

    // ==========================================
    //The logic of vision 
    // ==========================================
    this.canSeePlayer = function(player) {
        let mx = this.getPosI();
        let my = this.getPosJ();
        let px = player.getPosI();
        let py = player.getPosJ();
        let dist = Math.sqrt(Math.pow(mx - px, 2) + Math.pow(my - py, 2));

        let closeRange = 0;
        let forwardRange = 0;

        if (this.currentState === this.STATE_CHASE) {
            closeRange = 2; 
            forwardRange = 10; 
        } else if (this.currentState === this.STATE_SEARCH) {
            closeRange = 3; 
            forwardRange = 7; 
        } else { 
            closeRange = 2.5; 
            forwardRange = 7; 
        }
        
        if (dist <= closeRange) {
            return true;
        }

        if (mx !== px && my !== py) return false;

        let isInFront = false;
        if (this.direction === 1 && py < my) isInFront = true;       
        else if (this.direction === 2 && py > my) isInFront = true; 
        else if (this.direction === 3 && px < mx) isInFront = true; 
        else if (this.direction === 4 && px > mx) isInFront = true; 

        if (isInFront && dist <= forwardRange) { 
            return true;
        }

        return false;
    };

    // ==========================================
    // Movement towards the goal    
    // ==========================================
    this.moveTowardsTarget = function(targetI, targetJ) {
        let mx = this.getPosI();
        let my = this.getPosJ();
        let dx = 0, dy = 0;

        if (Math.abs(mx - targetI) > Math.abs(my - targetJ)) {
             if (mx < targetI) dx = 1; else if (mx > targetI) dx = -1;
        } else {
             if (my < targetJ) dy = 1; else if (my > targetJ) dy = -1;
        }
       
        this.tryMove(dx, dy); 
    };
    
    // ==========================================
    // Random Movement
    // ==========================================

    this.moveRandomly = function() {
        let dirs = [[0,1], [0,-1], [1,0], [-1,0]];
    
        let rand = dirs[Math.floor(Math.random() * dirs.length)];
        
        
        this.tryMove(rand[0], rand[1]);
    };
    // ==========================================
    // Movement Function (TRY MOVE)
    // ==========================================
    this.tryMove = function(dx, dy) {
        let newI = this.getPosI() + dx;
        let newJ = this.getPosJ() + dy;

        if (newI < 0 || newI >= this.env.i || newJ < 0 || newJ >= this.env.j) return;
        


        this.x = newI * this.env.width;
        this.y = newJ * this.env.height;


        if (dx > 0) this.direction = 4;
        if (dx < 0) this.direction = 3;
        if (dy > 0) this.direction = 2;
        if (dy < 0) this.direction = 1;
    };

    // ==========================================
    // Update (chase/search/patrol)
    // ==========================================
this.update = function(player) {
        let seePlayer = this.canSeePlayer(player);

        
        if (seePlayer) {
            if (this.currentState !== this.STATE_CHASE) {
                this.chaseTurnCounter = 0; 
            }
            this.currentState = this.STATE_CHASE;
            this.lastKnownPos = { i: player.getPosI(), j: player.getPosJ() };
        } 
        else if (this.currentState === this.STATE_CHASE) {
            this.currentState = this.STATE_SEARCH;
        }

       
        if (this.currentState === this.STATE_CHASE) {
            

            let targetI = player.getPosI();
            let targetJ = player.getPosJ();
            let mx = this.getPosI();
            let my = this.getPosJ();
            let dx = 0, dy = 0;
            
            if (Math.abs(mx - targetI) > Math.abs(my - targetJ)) {
                if (mx < targetI) dx = 1; else if (mx > targetI) dx = -1;
            } else {
                if (my < targetJ) dy = 1; else if (my > targetJ) dy = -1;
            }
            
            let movesToMake = 1;

            for (let k = 0; k < movesToMake; k++) {
                this.tryMove(dx, dy); 
                

                if (this.getPosI() === player.getPosI() && this.getPosJ() === player.getPosJ()) {
                    return true;
                }
            }
        } 
        

        else if (this.currentState === this.STATE_SEARCH) {
            if (this.lastKnownPos) {
                this.moveTowardsTarget(this.lastKnownPos.i, this.lastKnownPos.j);
                
                if (this.getPosI() === this.lastKnownPos.i && this.getPosJ() === this.lastKnownPos.j) {
                    this.lastKnownPos = null; 
                    this.searchDelay = this.maxSearchTurns; 
                }
            } else if (this.searchDelay > 0) {
                this.moveRandomly();
                this.searchDelay--;
                if (this.searchDelay <= 0) {
                    this.currentState = this.STATE_PATROL; 
                }
            } else {
                this.currentState = this.STATE_PATROL;
            }
        } 
        

        else {
            this.moveRandomly();
        }


        if (this.getPosI() === player.getPosI() && this.getPosJ() === player.getPosJ()) {
            return true;
        }
        return false;
    };

    // ==========================================
    // Draw Function
    // ==========================================
    this.draw = function(ctx) {
        let imgName = 'rival-down';
        if (this.direction === 1) imgName = 'rival-up';
        if (this.direction === 2) imgName = 'rival-down';
        if (this.direction === 3) imgName = 'rival-left';
        if (this.direction === 4) imgName = 'rival-right';

        let isVisible = this.env.hasVisited(this.getPosI(), this.getPosJ());
        
        if (isVisible) {
            ctx.drawImage(resources.images[imgName], this.x, this.y, this.env.width, this.env.height);
        }

        if (this.currentState === this.STATE_CHASE) {
            ctx.fillStyle = "red"; 
            ctx.font = "bold 20px Arial";
            ctx.fillText("!", this.x + 20, this.y);
        }
    };
};