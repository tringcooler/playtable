define(function(require) {
    
    const
        c_table = require('core/table'),
        c_card = require('core/card');
    
    const 
        ASSETS = n => 'assets/' + n;
        IMGS = (n, ex) => ASSETS('img/' + n + (ex ? ex : '.png'));
    
    function preload() {
        this.load.image('box', IMGS('box'));
        this.load.image('back', IMGS('back'));
        this.load.image('bg', IMGS('bg'));
        this.load.image('icon_rotate', IMGS('icon_rotate'));
        this.load.image('icon_flip', IMGS('icon_flip'));
    }
    
    function create() {
        let table = new c_table(this);
        let card1 = new c_card(this, 'box', 'back');
        table.create();
        card1.create();
        table.set_bg('bg');
        table.add_ent(card1);
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