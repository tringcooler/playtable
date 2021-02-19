define(function(require) {
    
    const f_allprops = require('core/util').allprops;
    
    class c_entity {
        
        constructor(scene) {
            this.scene = scene;
            this.actions = this.get_actions();
        }
        
        sort_actions(acts) {
            return acts.sort();
        }
        
        get_actions() {
            let acts = [];
            for(let p of f_allprops(this)) {
                let pn = p;
                if(p.slice(0, 7) === 'action_' && this[p] instanceof Function) {
                    acts.push(p.slice(7));
                }
            }
            return this.sort_actions(acts);
        }
        
        create() {
        }
        
        create_icon(name) {
            let go = null;
            if(this.actions.includes(name)) {
                go = this.scene.make.image({key: 'icon_' + name});
            }
            return go;
        }
        
        get_size() {
            return [this.go.displayWidth, this.go.displayHeight];
        }
        
        get_icon_pos(name, spc = 60) {
            let idx = this.actions.indexOf(name);
            if(idx < 0) {
                return null;
            }
            let [w, h] = this.get_size();
            let y = this.go.y + h / 2 + spc;
            let x = this.go.x - w / 2 + idx * (w / (this.actions.length - 1));
            return [x, y];
        }
        
        async emit(name, ...args) {
            let mn = 'on_' + name;
            if(this[mn] instanceof Function) {
                await this[mn](...args);
            } else {
                console.log('missed emit:', name);
            }
        }
        
    }
    
    return c_entity;
    
});