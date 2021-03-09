requirejs.config({
    baseUrl: 'src',
    paths: {
        jquery: '../lib/jquery-3.5.1.min',
        Phaser: location.hostname == '127.0.0.1' ? '../lib/phaser'/*.min'*/ : '//cdn.jsdelivr.net/npm/phaser@3.53.1/dist/phaser.min',
        core: 'core',
        scenes: 'scenes',
    },
    shim: {
        'main': ['jquery', 'Phaser'],
    },
});

requirejs(['main']);
