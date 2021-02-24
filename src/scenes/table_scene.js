define(function(require) {
    
    const
        c_table = require('core/table'),
        c_card = require('core/card'),
        c_deck = require('core/deck');
    
    const 
        ASSETS = n => 'assets/' + n;
        IMGS = (n, ex) => ASSETS('img/' + n + (ex ? ex : '.png'));
    
    function preload() {
        this.load.image('box', IMGS('box'));
        this.load.image('back', IMGS('back'));
        this.load.image('bg', IMGS('bg'));
        this.load.image('icon_rotate', IMGS('icon_rotate'));
        this.load.image('icon_flip', IMGS('icon_flip'));
        this.load.image('icon_movedown', IMGS('icon_movedown'));
        this.load.image('icon_draw', IMGS('icon_draw'));
        this.load.image('icon_drawbot', IMGS('icon_drawbot'));
    }
    
    async function create() {
        let table = new c_table(this);
        let deck = new c_deck(this, async deck => {
            await table.remove_ent(deck);
        });
        table.create();
        table.set_bg('bg');
        deck.create();
        deck.set_pos([0, 300]);
        for(let i = 0; i < 5; i++) {
            let card = new c_card(this, 'box', 'back');
            await card.create();
            deck.add_card(card, true, true);
        }
        table.add_ent(deck);
        window.table = table;
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