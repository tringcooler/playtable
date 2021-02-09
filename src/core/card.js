define(function(require) {
    
    const c_entity = require('core/entity');
    
    class c_card extends c_entity {
        
        constructor(scene, front, back) {
            super(scene);
            this.front_name = front;
            this.back_name = back;
        }
        
        create() {
            super.create();
            this.go = this.scene.make.image({key: this.front_name});
        }
        
    }
    
    return c_card;
    
});