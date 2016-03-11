window.app = window.app || {};

(function(app, $) {

    app.BallControlPanel = function BallControlPanel($element) {

        if (!(this instanceof BallControlPanel)) {
            return new BallControlPanel($element);
        }

        var ball = new app.Ball($('canvas'));
            ball.init();

        var $checkboxBackclipping = $element.find('#checkbox-backclipping');

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
        };
    };

    var controlPanel = new app.BallControlPanel($('.ball-control-panel'));
        controlPanel.init();

})(window.app, jQuery);