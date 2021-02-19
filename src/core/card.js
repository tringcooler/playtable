define(function(require) {
    
    const c_entity = require('core/entity');
    
    class c_card extends c_entity {
        
        constructor(scene, front, back) {
            super(scene);
            this.front_name = front;
            this.back_name = (back ?? front);
        }
        
        create() {
            super.create();
            this.go = this.scene.make.image({key: this.front_name});
            this.go.scale = 0.5;
        }
        
        action_flip() {
        }
        
        action_rotate() {
        }
        
    }
    
    return c_card;
    
});