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
            let old_info = {
                scale: this.go.scale,
                x: this.go.x,
                y: this.go.y,
            };
            await tab.zoom_in(this, async () => {
                await atween(this.scene.tweens, this.go, 100, {
                    scale: 1,
                    x: this.scene.cameras.main.centerX,
                    y: this.scene.cameras.main.centerY,
                });
            }, async () => {
                await atween(this.scene.tweens, this.go, 100, old_info);
            });
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