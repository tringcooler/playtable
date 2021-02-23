define(function(require) {
    
    const c_entity = require('core/entity');
    const vec2 = require('core/util').vec2;
    const atween = require('core/util').atween;
    const parr_proxy = require('core/util').parrproxy;
    const c_semaphore = require('core/util').semaphore;
    
    const
        SPC_BTWN_CARDS = [-1, -2];
    
    class c_deck extends c_entity {
        
        constructor(scene, cb_destroy = null) {
            super(scene);
            this.cards_pool = [];
            this.cb_destroy = cb_destroy;
            this.max_size = [0, 0];
        }
        
        create() {
            super.create();
            this.go = this.scene.make.container();
            this.cards_group = this.scene.add.group();
        }
        
        destroy() {
            super.destroy();
            this.cards_group.destroy();
        }
        
        add_card(card, top = true) {
            let nidx;
            if(top) {
                card.go.setPosition(...vec2.dot(this.cards_pool.length, SPC_BTWN_CARDS));
                this.cards_pool.push(card);
                this.go.add(card.go);
                this.cards_group.add(card.go);
            } else {
                card.go.setPosition(0, 0);
                this.cards_group.incXY(...SPC_BTWN_CARDS);
                this.cards_pool.unshift(card);
                this.go.addAt(card.go, 0);
                this.cards_group.add(card.go);
            }
            let size_changed = false;
            if(card.go.width > this.max_size[0]) {
                this.max_size[0] = card.go.width;
                size_changed = true;
            }
            if(card.go.height > this.max_size[1]) {
                this.max_size[1] = card.go.height;
                size_changed = true;
            }
            if(size_changed) {
                this.go.setSize(...this.max_size);
            }
        }
        
        pop_card(top = true) {
            let rcard;
            if(top) {
                rcard = this.cards_pool.pop();
            } else {
                rcard = this.cards_pool.shift();
            }
            this.go.remove(rcard.go);
            this.cards_group.remove(rcard.go);
            if(this.cards_pool.length === 0) {
                if(this.cb_destroy instanceof Function) {
                    this.cb_destroy(this);
                }
                this.destroy();
            }
            return rcard;
        }
        
    }
    
    return c_deck;
    
});