window.app = window.app || {
    modules:{},
    modName:{}
};

(function(app, $) {

    $('[data-module-type]').each(function()
    {
        var moduleType = $(this).data('module-type');
        var moduleName = $(this).data('module-name');

        if (!app.modules[moduleType]) {
            app.modules[moduleType] = [];
        }

        var module = new app[moduleType]($(this));

        app.modules[moduleType].push(module);

        if (moduleName) {
            app.modName[moduleName] = module;
        }

        module.init && module.init();
    });

})(window.app, jQuery);