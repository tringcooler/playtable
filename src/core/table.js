define(function(require) {
    
    class c_table {
        
        constructor(scene) {
            this.scene = scene;
        }
        
        create() {
            this.go = this.scene.add.layer();
            this.bg_layer = this.scene.make.layer();
            this.ent_layer = this.scene.make.layer();
            this.group = this.scene.add.group();
            this.go.add(this.bg_layer);
            this.go.add(this.ent_layer);
        }
        
        set_bg(bgname) {
            this.bg = this.scene.make.image({key: bgname});
            this.group.add(this.bg);
            this.bg_layer.add(this.bg);
        }
        
        add_ent(ent) {
            this.group.add(ent.go);
            this.ent_layer.add(ent.go);
        }
        
        start() {
            this.bg.setInteractive();
            this.scene.input.setDraggable(this.bg);
            this.scene.input.on('drag', this.on_drag.bind(this));
        }
        
        on_drag(pointer, gameObject, dragX, dragY) {
            //console.log(pointer, gameObject, dragX, dragY);
            this.group.setXY(dragX, dragY);
        }
        
    }
    
    return c_table;
    
});