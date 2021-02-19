define(function(require) {
    
    const c_entity = require('core/entity');
    const atween = require('core/util').atween;
    
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
        
        async flip(back = null, nscale = null) {
            if(back === null) {
                back = !this.flip_back;
            } else {
                back = !!back;
                if(this.flip_back === back) {
                    return;
                }
            }
            let old_sx;
            if(nscale === null) {
                old_sx = this.go.scaleX;
            } else {
                old_sx = nscale;
            }
            await atween(this.scene.tweens, this.go, ANIM_TIME_COMM / 2, {
                scaleX: 0,
            });
            this.go.setTexture(back ? this.back_name : this.front_name);
            await atween(this.scene.tweens, this.go, ANIM_TIME_COMM / 2, {
                scaleX: old_sx,
            });
            this.flip_back = back;
        }
        
        async zoom_in(tab) {
            let old_info = {
                scale: this.go.scale,
                angle: this.go.angle,
                x: this.go.x,
                y: this.go.y,
            };
            let old_flip = this.flip_back;
            await tab.zoom_in(this, async () => {
                let prms = [];
                prms.push(atween(this.scene.tweens, this.go, ANIM_TIME_COMM, {
                    scale: 1,
                    angle: 0,
                    x: this.scene.cameras.main.centerX,
                    y: this.scene.cameras.main.centerY,
                }));
                prms.push(this.flip(false, 1));
                await Promise.all(prms);
            }, async () => {
                let prms = [];
                prms.push(atween(this.scene.tweens, this.go, ANIM_TIME_COMM, old_info));
                prms.push(this.flip(old_flip, old_info.scale));
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