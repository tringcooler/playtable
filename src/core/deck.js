define(function(require) {
    
    const c_entity = require('core/entity');
    const vec2 = require('core/util').vec2;
    const atween = require('core/util').atween;
    const parr_proxy = require('core/util').parrproxy;
    const c_semaphore = require('core/util').semaphore;
    
    const
        SPC_BTWN_CARDS = [-1, -2],
        SPC_DRAW_CARD = [-20, -20],
        ANIM_TIME_COMM = 100;
    
    class c_deck extends c_entity {
        
        constructor(scene, cb_destroy = null) {
            super(scene, 'deck');
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
            rcard.go.setPosition(rcard.go.x + this.go.x, rcard.go.y + this.go.y);
            this.cards_group.remove(rcard.go);
            if(this.cards_pool.length === 0) {
                if(this.cb_destroy instanceof Function) {
                    await this.cb_destroy(this);
                }
                this.destroy();
            }
            return rcard;
        }
        
        async draw_card(tab, top = true, skip = false) {
            let anim_time = skip ? 0 : ANIM_TIME_COMM;
            let card = await this.pop_card(top);
            tab.add_ent(card);
            let prms = [];
            if(!top) {
                tab.move_to_last(card, true);
                prms.push(atween(this.scene.tweens, {
                    x: 0, y: 0,
                    last_x: 0, last_y: 0,
                }, anim_time, {
                    x: - SPC_BTWN_CARDS[0],
                    y: - SPC_BTWN_CARDS[1],
                    onUpdate: (tw, tar) => {
                        let delt_x = tar.x - tar.last_x;
                        let delt_y = tar.y - tar.last_y;
                        tar.last_x = tar.x;
                        tar.last_y = tar.y;
                        this.cards_group.incXY(delt_x, delt_y);
                    },
                }));
            }
            let [nx, ny] = vec2.add(this.get_pos(), SPC_DRAW_CARD);
            prms.push(atween(this.scene.tweens, card.go, anim_time, {
                x: nx,
                y: ny,
            }));
            await Promise.all(prms);
            if(this.cards_pool.length === 1) {
                let bot_card = await this.pop_card(top);
                tab.add_ent(bot_card);
                if(top) {
                    tab.move_to_last(bot_card, true);
                }
            }
        }
        
        async action_draw(tab) {
            await this.draw_card(tab, true);
        }
        
        async action_drawbot(tab) {
            await this.draw_card(tab, false);
        }
        
        async on_doubletap(tab) {
            await this.draw_card(tab, true);
        }
        
        async on_coveredby(tab, ent) {
            if(!(ent instanceof c_entity) || ent.type !== 'card') {
                return;
            }
            await tab.remove_ent(ent);
            await this.add_card(ent, true);
        }
        
        async on_coverwith(tab, ent) {
            if(!(ent instanceof c_entity) || ent.type !== 'card') {
                return;
            }
            await tab.remove_ent(ent);
            await this.add_card(ent, false);
        }
        
    }
    
    return c_deck;
    
});