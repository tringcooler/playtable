define(function(require) {
    
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
            this.setup_ent(ent);
            this.group.add(ent.go);
            this.ent_layer.add(ent.go);
            ent.go.setInteractive();
            this.scene.input.setDraggable(ent.go);
            ent.go.on('drag', (p, x, y) => {
                ent.go.x = x;
                ent.go.y = y;
            });
            //this.scene.input.on('drag', (p, go, x, y) => {console.log(go, x, y);debugger;});
            //this.scene.input.on('pointerdown', (p, go) => {console.log(go);debugger;});
        }
        
    }
    
    return c_table;
    
});