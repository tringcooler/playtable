define(function(require) {
    
    const
        c_table = require('core/table'),
        c_card = require('core/card');
    
    const 
        ASSETS = n => 'assets/' + n;
        IMGS = (n, ex) => ASSETS('img/' + n + (ex ? ex : '.png'));
    
    function preload() {
        this.load.image('box', IMGS('box'));
        this.load.image('bg', IMGS('bg'));
    }
    
    function create() {
        let table = new c_table(this);
        let card1 = new c_card(this, 'box');
        table.create();
        card1.create();
        table.set_bg('bg');
        table.add_ent(card1);
        /*var box = this.add.image(320, 240, 'box').setInteractive();
        this.input.setDraggable(box);
        this.input.topOnly = false;
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });*/
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