define(function(require) {
    
    const f_allprops = require('core/util').allprops;
    
    class c_entity {
        
        constructor(scene) {
            this.scene = scene;
            this.actions = this.get_actions();
        }
        
        get_actions() {
            let acts = new Set();
            for(let p of f_allprops(this)) {
                let pn = p;
                if(p.slice(0, 7) === 'action_' && this[p] instanceof Function) {
                    acts.add(p.slice(7));
                }
            }
            return acts;
        }
        
        create() {
        }
        
        create_icon(name) {
            let go = null;
            if(this.actions.has(name)) {
                go = this.scene.make.image({key: 'icon_' + name});
            }
            return go;
        }
        
    }
    
    return c_entity;
    
});