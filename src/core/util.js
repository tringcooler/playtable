define(function(require) {
    
    const sym_gen = function*() {
        while(true) {
            yield Symbol();
        }
    };
    
    return {
        'symgen': sym_gen,
    };
    
});