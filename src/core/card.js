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
            this.go = this.scene.add.container(0, 200);
            let card = this.scene.make.image({key: this.front_name});
            this.go.add(card);
            this.go.setSize(card.width, card.height);
        }
        
    }
    
    return c_card;
    
});