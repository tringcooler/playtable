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
                'icon': this.scene.add.layer(),
                'card': this.scene.add.layer(),
            };
            this.group = this.scene.add.group();
            this.go.add(this.bg_layer);
            this.go.add(this.ent_layer);
            this.icon_go_pool = {};
            this.ent_pool = new Set();
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
            ent.go.on('drag', (p, x, y) => {
                if(ipt_stat !== 'idle') {
                    let dpos = Math.abs(p.x - p.downX) + Math.abs(p.y - p.downY);
                    if(dpos > IPT_DPOS_TAP) {
                        this.close_all_menu();
                        ipt_stat = 'idle';
                    }
                }
                ent.go.setPosition(x, y);
            });
            ent.go.on('pointerdown', async p => {
                if(ipt_stat === 'tapup') {
                    ipt_stat = 'dtapdown';
                } else {
                    ipt_stat = 'tapdown';
                    let cidx = ++ipt_idx;
                    await asleep(IPT_TIME_TAP_L);
                    if(cidx === ipt_idx && ipt_stat === 'tapdown') {
                        console.log('long press');
                        ipt_stat = 'idle';
                    }
                }
            });
            ent.go.on('pointerup', async p => {
                if(p.time - p.downtime > IPT_TIME_TAP_D) {
                    ipt_stat = 'idle';
                    return;
                }
                if(ipt_stat === 'tapdown') {
                    ipt_stat = 'tapup';
                    let cidx = ipt_idx;
                    await asleep(IPT_TIME_TAP_U);
                    if(cidx === ipt_idx && ipt_stat === 'tapup') {
                        console.log('tap');
                        ipt_stat = 'idle';
                    }
                } else if(ipt_stat === 'dtapdown') {
                    console.log('double tap');
                    ipt_stat = 'idle';
                }
                //this.open_menu(ent);
            });
        }
        
        close_all_menu() {
            for(let act in this.icon_go_pool) {
                let go = this.icon_go_pool[act];
                go.visible = false;
            }
        }
        
        open_menu(ent) {
            this.close_all_menu();
            for(let act of ent.actions) {
                let pos = ent.get_icon_pos(act);
                if(pos) {
                    let go = this.icon_go_pool[act];
                    go.setPosition(...pos);
                    go.visible = true;
                }
            }
        }
        
    }
    
    return c_table;
    
});