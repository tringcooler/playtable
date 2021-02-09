define(function(require) {
    
    const 
        ASSETS = n => 'assets/' + n;
        IMGS = (n, ex) => ASSETS('img/' + n + (ex ? ex : '.png'));
    
    function preload() {
        this.load.image('box', IMGS('box'));
    }
    
    function create() {
        var box = this.add.image(320, 240, 'box').setInteractive();
        this.input.setDraggable(box);
        this.input.topOnly = false;
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
    }
    
    function update(time, delta) {
        
    }
    
    return {
        key: 'table',
        preload: preload,
        create: create,
        update: update,
    };
    
});