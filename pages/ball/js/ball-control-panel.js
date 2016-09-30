window.app = window.app || {
    modules:{},
    modName:{}
};

(function(app, $) {

    app.BallControlPanel = function BallControlPanel($element) {

        if (!(this instanceof BallControlPanel)) {
            return new BallControlPanel($element);
        }

        var ball = new app.Ball($('canvas'));
            ball.init();

        var $checkboxBackclipping = $element.find('#checkbox-backclipping');
        var $checkboxClearViewport = $element.find('#checkbox-clear-viewport');

        //==================================================================================
        //
        //==================================================================================
        this.init = function init() {
            return this.bindEvents();
        };

        //==================================================================================
        //
        //==================================================================================
        this.bindEvents = function bindEvents()
        {
            $checkboxBackclipping.on('change', function(e) {
                ball.enableBackclipping($(this).is(':checked'));
            });

            $checkboxClearViewport.on('change', function(e) {
                ball.cleanViewport($(this).is(':checked'));
            });
        };
    };

    /*
    var controlBar = new app.BallControlPanel($('.ball-control-panel'));
        controlBar.init();
    */

})(window.app, jQuery);