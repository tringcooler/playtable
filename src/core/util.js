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
    
    const atween = (tw, tar, dur, kargs) => {
        if(!dur) {
            for(let k in kargs) {
                if(k in tar) {
                    tar[k] = kargs[k];
                }
            }
        } else {
            return new Promise(resolve => {
                let twconf = Object.assign({}, kargs, {
                    targets: tar,
                    duration: dur,
                    onComplete: resolve,
                });
                tw.add(twconf);
            });
        }
    };
    
    const f_parr_prop_proxy = (obj, pid, cb_merge = (r, a) => r, init = undefined, vinit = undefined) => {
        let priv_pool = p => '_parr_priv_' + p;
        let prxy_hndl = {
            get(tar, prop, recv) {
                if(prop.slice?.(0, 5) !== 'parr_') {
                    return Reflect.get(tar, prop, recv);
                } else {
                    prop = prop.slice(5);
                }
                let rval = tar[priv_pool(prop)]?.[pid];
                if(rval === undefined) {
                    let tval = tar[prop];
                    if(vinit !== undefined) {
                        rval = vinit;
                    } else {
                        rval = tval;
                    }
                }
                return rval;
            },
            set(tar, prop, val, recv) {
                if(prop.slice?.(0, 5) !== 'parr_') {
                    return Reflect.set(tar, prop, val, recv);
                } else {
                    prop = prop.slice(5);
                }
                let pn = priv_pool(prop);
                let pool = tar[pn];
                if(!pool) {
                    pool = {
                        'origin': tar[prop],
                    };
                    tar[pn] = pool;
                }
                pool[pid] = val;
                //console.log('prv_set', pid, prop, val);
                let mval = init;
                for(let i in pool) {
                    mval = cb_merge(mval, pool[i]);
                }
                tar[prop] = mval;
                //console.log('tar_set', pid, prop, mval);
                return true;
            },
        };
        return new Proxy(obj, prxy_hndl);
    };
    
    return {
        'symgen': sym_gen,
        'allprops': f_get_all_props,
        'asleep': asleep,
        'atween': atween,
        'parrproxy': f_parr_prop_proxy,
    };
    
});