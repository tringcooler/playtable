define(function(require) {

    function preload() {
        this.load.image('logo', 'assets/img/tst01.png');
    }

    function create() {
        let logo = this.add.image(320, 240, 'logo');
        let go_nxt = e => {
            console.log('goto table');
            this.scene.start('table');
        };
        this.input.keyboard.on('keydown', go_nxt);
        this.input.on('pointerdown', go_nxt);
    }
    
    function update() {
    }
    
    return {
        key: 'title',
        preload: preload,
        create: create,
        update: update,
    };
    
});