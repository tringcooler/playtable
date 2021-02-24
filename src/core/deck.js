define(function(require) {
    
    const c_entity = require('core/entity');
    const vec2 = require('core/util').vec2;
    const atween = require('core/util').atween;
    const parr_proxy = require('core/util').parrproxy;
    const c_semaphore = require('core/util').semaphore;
    
    const
        SPC_BTWN_CARDS = [-1, -2],
        ANIM_TIME_COMM = 100;
    
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
        
        async add_card(card, top = true, skip = false) {
            let anim_time = skip ? 0 : ANIM_TIME_COMM;
            let nidx;
            if(top) {
                this.go.add(card.go);
                card.go.setPosition(card.go.x - this.go.x, card.go.y - this.go.y);
                let [nx, ny] = vec2.dot(this.cards_pool.length, SPC_BTWN_CARDS);
                await atween(this.scene.tweens, card.go, anim_time, {
                    x: nx,
                    y: ny,
                });
                this.cards_pool.push(card);
                this.cards_group.add(card.go);
            } else {
                this.go.addAt(card.go, 0);
                card.go.setPosition(card.go.x - this.go.x, card.go.y - this.go.y);
                let prms = [];
                prms.push(atween(this.scene.tweens, card.go, anim_time, {
                    x: 0,
                    y: 0,
                }));
                prms.push(atween(this.scene.tweens, {
                    x: 0, y: 0,
                    last_x: 0, last_y: 0,
                }, anim_time, {
                    x: SPC_BTWN_CARDS[0],
                    y: SPC_BTWN_CARDS[1],
                    onUpdate: (tw, tar) => {
                        let delt_x = tar.x - tar.last_x;
                        let delt_y = tar.y - tar.last_y;
                        tar.last_x = tar.x;
                        tar.last_y = tar.y;
                        this.cards_group.incXY(delt_x, delt_y);
                    },
                }));
                await Promise.all(prms);
                this.cards_pool.unshift(card);
                this.cards_group.add(card.go);
            }
            let size_changed = false;
            let [cw, ch] = card.get_size();
            if(cw > this.max_size[0]) {
                this.max_size[0] = cw;
                size_changed = true;
            }
            if(ch > this.max_size[1]) {
                this.max_size[1] = ch;
                size_changed = true;
            }
            if(size_changed) {
                this.go.setSize(...this.max_size);
            }
        }
        
        async pop_card(top = true) {
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
        
        async action_draw(tab) {
        }
        
    }
    
    return c_deck;
    
});