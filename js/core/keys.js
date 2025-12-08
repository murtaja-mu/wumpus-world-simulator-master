/**************************************************
** GAME KEYBOARD CLASS (UPDATED FOR WASD)
**************************************************/
var Keys = function(up, left, right, down, space, enter) {
    var up = up || false,
        left = left || false,
        right = right || false,
        down = down || false,
        space = space || false,
        enter = enter || false;

    var onKeyDown = function(e) {
        if(!isAlive || isFinished){
            return;
        }

        var that = this,
            c = e.keyCode;

        switch (c) {
            // Controls (Arrows)
            case 37: that.left = true; break;
            case 38: that.up = true; break;
            case 39: that.right = true; break;
            case 40: that.down = true; break;
            
            // New Controls (WASD for Dash)
            case 87: that.w = true; break; // W
            case 65: that.a = true; break; // A
            case 83: that.s = true; break; // S
            case 68: that.d = true; break; // D

            case 32: that.space = true; break;
            case 13: that.enter = true; break;
        };
    };

    var onKeyUp = function(e) {
        var that = this,
            c = e.keyCode;
        switch (c) {
            // Reset Arrows
            case 37: that.left = false; break;
            case 38: that.up = false; break;
            case 39: that.right = false; break;
            case 40: that.down = false; break;
            
            // Reset WASD
            case 87: that.w = false; break;
            case 65: that.a = false; break;
            case 83: that.s = false; break;
            case 68: that.d = false; break;

            case 32: that.space = false; break;
            case 13: that.enter = false; break;
        };
    };

    return {
        up: up,
        left: left,
        right: right,
        down: down,
        // new controls (WASD)
        w: false,
        a: false,
        s: false,
        d: false,
        
        space: space,
        enter: enter,
        onKeyDown: onKeyDown,
        onKeyUp: onKeyUp
    };
};