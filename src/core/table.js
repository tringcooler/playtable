define(function(require) {
    
    const asleep = require('core/util').asleep;
    
    const
        IPT_TIME_TAP_D = 200,
        IPT_TIME_TAP_L = 1000,
        IPT_TIME_TAP_U = 100,
        IPT_DPOS_TAP = 5;
    
    class c_table {
        
        constructor(scene) {
            this.scene = scene;
        }
        
        create() {
            this.go = this.scene.add.layer();
            this.bg_layer = this.scene.make.layer();
            this.ent_layer = this.scene.make.layer();
            this.ui_layer = {
                icon: this.scene.add.layer(),
                zoom: this.scene.add.layer(),
            };
            this.group = this.scene.add.group();
            this.go.add(this.bg_layer);
            this.go.add(this.ent_layer);
            this.icon_go_pool = {};
            this.ent_pool = new Set();
            this.zoom_slot = null;
        }
        
        setup_ent(ent) {
            for(let act of ent.actions) {
                if(!this.icon_go_pool[act]) {
                    let go = ent.create_icon(act);
                    go.visible = false;
                    this.ui_layer.icon.add(go);
                    this.icon_go_pool[act] = go;
                }
            }
        }
        
        set_bg(bgname) {
            this.bg = this.scene.make.image({key: bgname});
            this.group.add(this.bg);
            this.bg_layer.add(this.bg);
            this.bg.setInteractive();
            this.scene.input.setDraggable(this.bg);
            this.bg.on('drag', (p, x, y) => {
                this.group.incXY(x - this.bg.x, y - this.bg.y);
            });
            this.bg.on('pointerdown', async p => {
                await this.close_all_menu();
                await this.zoom_out();
            });
        }
        
        add_ent(ent) {
            if(this.ent_pool.has(ent)) {
                return;
            }
            this.setup_ent(ent);
            this.group.add(ent.go);
            this.ent_layer.add(ent.go);
            this.hook_input(ent);
            this.ent_pool.add(ent);
        }
        
        hook_input(ent) {
            ent.go.setInteractive();
            this.scene.input.setDraggable(ent.go);
            let ipt_stat = 'idle';
            let ipt_idx = 0;
            let ipt_breakdrag = false;
            ent.go.on('drag', async (p, x, y) => {
                if(ipt_stat !== 'drag') {
                    let dpos = Math.abs(p.x - p.downX) + Math.abs(p.y - p.downY);
                    if(dpos > IPT_DPOS_TAP) {
                        ipt_stat = 'bussy';
                        await this.close_all_menu();
                        this.ent_layer.bringToTop(ent.go);
                        ipt_stat = 'drag';
                    }
                }
                if(!ipt_breakdrag) {
                    ent.go.setPosition(x, y);
                }
            });
            ent.go.on('pointerdown', async p => {
                ipt_breakdrag = false;
                if(ipt_stat === 'tapup') {
                    ipt_stat = 'dtapdown';
                    await this.zoom_out();
                } else {
                    ipt_stat = 'tapdown';
                    let cidx = ++ipt_idx;
                    let prms = [];
                    prms.push(this.zoom_out());
                    prms.push(asleep(IPT_TIME_TAP_L));
                    await Promise.all(prms);
                    if(cidx === ipt_idx && ipt_stat === 'tapdown') {
                        //console.log('long press');
                        ipt_stat = 'bussy';
                        ipt_breakdrag = true;
                        await this.close_all_menu();
                        await ent.emit('longpress', this);
                        ipt_stat = 'idle';
                    }
                }
            });
            ent.go.on('pointerup', async p => {
                if(ipt_stat === 'drag') {
                    ipt_stat = 'bussy';
                    await this.drag_done(ent);
                    ipt_stat = 'idle';
                    return;
                }
                if(p.time - p.downTime > IPT_TIME_TAP_D) {
                    ipt_stat = 'idle';
                    return;
                }
                if(ipt_stat === 'tapdown') {
                    ipt_stat = 'tapup';
                    let cidx = ipt_idx;
                    await asleep(IPT_TIME_TAP_U);
                    if(cidx === ipt_idx && ipt_stat === 'tapup') {
                        //console.log('tap');
                        ipt_stat = 'bussy';
                        await this.open_menu(ent);
                        ipt_stat = 'idle';
                    }
                } else if(ipt_stat === 'dtapdown') {
                    //console.log('double tap');
                    ipt_stat = 'bussy';
                    await this.close_all_menu();
                    await ent.emit('doubletap', this);
                    ipt_stat = 'idle';
                } else {
                    ipt_stat = 'idle';
                }
            });
        }
        
        find_top_cover(ent) {
            let top_ent = null;
            let top_idx = -1;
            for(let dent of this.ent_pool) {
                if(ent === dent) {
                    continue;
                }
                let didx = this.ent_layer.getIndex(dent.go);
                if(didx < 0) {
                    continue;
                }
                if(dent.check_covered(ent)) {
                    if(didx > top_idx) {
                        top_ent = dent;
                    }
                }
            }
            return top_ent;
        }
        
        async drag_done(ent) {
            let cover_ent = this.find_top_cover(ent);
            if(cover_ent) {
            }
        }
        
        async close_all_menu() {
            for(let act in this.icon_go_pool) {
                let go = this.icon_go_pool[act];
                go.visible = false;
                go.disableInteractive();
                go.off('pointerdown');
            }
        }
        
        async open_menu(ent) {
            await this.close_all_menu();
            for(let act of ent.actions) {
                let pos = ent.get_icon_pos(act);
                if(pos) {
                    let go = this.icon_go_pool[act];
                    go.setPosition(...pos);
                    go.visible = true;
                    go.setInteractive();
                    go.on('pointerdown', async p => {
                        await ent.act(act);
                        //await this.close_all_menu();
                    });
                }
            }
        }
        
        async zoom_in(ent, cb_zoom_in, cb_zoom_out) {
            await this.zoom_out();
            ent.go.disableInteractive();
            this.ui_layer.zoom.add(ent.go);
            this.zoom_slot = {
                ent: ent,
                cb_out: cb_zoom_out,
            }
            await cb_zoom_in();
        }
        
        async zoom_out() {
            if(!this.zoom_slot) {
                return;
            }
            let ent = this.zoom_slot.ent;
            let cb_out = this.zoom_slot.cb_out;
            this.zoom_slot = null;
            this.ent_layer.add(ent.go);
            if(cb_out instanceof Function) {
                await cb_out();
            }
            ent.go.setInteractive();
        }
        
    }
    
    return c_table;
    
});