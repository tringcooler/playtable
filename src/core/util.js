define(function(require) {
    
    const sym_gen = function*() {
        while(true) {
            yield Symbol();
        }
    };
    
    const f_get_all_props = function*(obj) {
        for(let k of Object.getOwnPropertyNames(obj)) {
            if(k === 'constructor') continue;
            yield k;
        }
        let prt = Object.getPrototypeOf(obj);
        if(prt && prt.constructor !== Object) {
            yield* f_get_all_props(prt);
        }
    };
    
    const asleep = ms => new Promise(resolve => {
        setTimeout(resolve, ms);
    });
    
    return {
        'symgen': sym_gen,
        'allprops': f_get_all_props,
        'asleep': asleep,
    };
    
});