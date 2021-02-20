define(function(require) {
    
    const c_entity = require('core/entity');
    const atween = require('core/util').atween;
    const parr_proxy = require('core/util').parrproxy;
    
    const
        ANIM_TIME_COMM = 100;
    
    class c_card extends c_entity {
        
        constructor(scene, front, back, zoom_scale = 0.5) {
            super(scene);
            this.front_name = front;
            this.back_name = (back ?? front);
            this.zoom_scale = zoom_scale;
            this.flip_back = false;
        }
        
        create() {
            super.create();
            this.go = this.scene.make.image({key: this.front_name});
            this.go.scale = this.zoom_scale;
        }
        
        async flip(back = null) {
            if(back === null) {
                back = !this.flip_back;
            } else {
                back = !!back;
                if(this.flip_back === back) {
                    return;
                }
            }
            this.flip_back = back;
            let parr_go = parr_proxy(this.go, 'flip', (r, a) => r * a, 1, 1);
            await atween(this.scene.tweens, parr_go, ANIM_TIME_COMM / 2, {
                parr_scaleX: 0,
            });
            this.go.setTexture(back ? this.back_name : this.front_name);
            await atween(this.scene.tweens, parr_go, ANIM_TIME_COMM / 2, {
                parr_scaleX: 1,
            });
        }
        
        async zoom_in(tab) {
            let old_info = {
                parr_scaleX: this.go.scale,
                scaleY: this.go.scale,
                angle: this.go.angle,
                x: this.go.x,
                y: this.go.y,
            };
            let old_flip = this.flip_back;
            let parr_go = parr_proxy(this.go, 'origin', (r, a) => r * a, 1);
            await tab.zoom_in(this, async () => {
                let dscale = 1;
                let prms = [];
                prms.push(atween(this.scene.tweens, parr_go, ANIM_TIME_COMM, {
                    parr_scaleX: dscale,
                    scaleY: dscale,
                    angle: 0,
                    x: this.scene.cameras.main.centerX,
                    y: this.scene.cameras.main.centerY,
                }));
                prms.push(this.flip(false));
                await Promise.all(prms);
            }, async () => {
                let prms = [];
                prms.push(atween(this.scene.tweens, parr_go, ANIM_TIME_COMM, old_info));
                prms.push(this.flip(old_flip));
                await Promise.all(prms);
            });
        }
        
        async action_flip() {
            await this.flip();
        }
        
        async action_rotate() {
            await atween(this.scene.tweens, this.go, ANIM_TIME_COMM, {
                angle: '-=90',
            });
        }
        
        async on_longpress(tab) {
            await this.zoom_in(tab);
        }
        
    }
    
    return c_card;
    
});