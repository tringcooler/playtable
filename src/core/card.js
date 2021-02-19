define(function(require) {
    
    const c_entity = require('core/entity');
    const atween = require('core/util').atween;
    
    class c_card extends c_entity {
        
        constructor(scene, front, back, zoom_scale = 0.5) {
            super(scene);
            this.front_name = front;
            this.back_name = (back ?? front);
            this.zoom_scale = zoom_scale;
        }
        
        create() {
            super.create();
            this.go = this.scene.make.image({key: this.front_name});
            this.go.scale = this.zoom_scale;
        }
        
        async zoom_in(tab) {
            let zoom_out = async () => {};
            tab.move_layer(this, 'zoom', zoom_out);
            await atween(this.scene.tweens, this.go, 1000, {scale: 1});
        }
        
        action_flip() {
        }
        
        action_rotate() {
        }
        
        async on_longpress(tab) {
            await this.zoom_in(tab);
        }
        
    }
    
    return c_card;
    
});