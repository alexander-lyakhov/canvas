window.app = window.app || {};

(function(app, $) {

    app.BallControlBar = app.BallControlPanel = function BallControlPanel($element) {

        if (!(this instanceof BallControlPanel)) {
            return new BallControlPanel($element);
        }

        app.BaseControlPanel.apply(this, arguments);

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
            app.BaseControlPanel.prototype.bindEvents.apply(this);

            $checkboxBackclipping.on('change', function(e) {
                ball.enableBackclipping($(this).is(':checked'));
            });

            $checkboxClearViewport.on('change', function(e) {
                ball.cleanViewport($(this).is(':checked'));
            });
        };
    };

    app.BallControlBar.prototype = Object.create(app.BaseControlPanel.prototype);
    app.BallControlBar.prototype.constructor = app.BaseControlPanel;

    var controlBar = new app.BallControlPanel($('.ball-control-panel'));
        controlBar.init();

})(window.app, jQuery);