window.app = window.app || {};

(function(app, $) {

    app.WheelControlPanel = function WheelControlPanel($element) {

        if (!(this instanceof WheelControlPanel)) {
            return new WheelControlPanel($element);
        }

        app.BaseControlPanel.apply(this, arguments);

        var $checkboxReverse      = $element.find('#checkbox-reverse');
        var $checkboxShowCircle   = $element.find('#checkbox-show-circle');
        var $checkboxShowRays     = $element.find('#checkbox-show-rays');
        var $checkboxEnableColors = $element.find('#checkbox-enable-colors');

        var wheel = new app.Wheel($(canvas));
            wheel.init();

        //==================================================================================
        //
        //==================================================================================
        this.init = function init()
        {
            var flags = wheel.getFlags();

            $checkboxShowCircle  .prop('checked', Boolean(flags.showCircle));
            $checkboxShowRays    .prop('checked', Boolean(flags.showRays));
            $checkboxEnableColors.prop('checked', Boolean(flags.enableColors));

            this.bindEvents();

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.bindEvents = function bindEvents()
        {
            app.BaseControlPanel.prototype.bindEvents.apply(this);

            $checkboxReverse.on('change', function(e) {
                wheel.reverse();
            });

            $checkboxShowCircle.on('change', function(e) {
                wheel.showCircle($(this).is(':checked'));
            });

            $checkboxShowRays.on('change', function(e) {
                wheel.showRays($(this).is(':checked'));
            });

            $checkboxEnableColors.on('change', function(e) {
                wheel.enableColors($(this).is(':checked'));
            });

            return this;
        };
    };

    app.WheelControlPanel.prototype = Object.create(app.BaseControlPanel.prototype);
    app.WheelControlPanel.prototype.constructor = app.BaseControlPanel;

    var controlPanel = new app.WheelControlPanel($('.wheel-control-panel'));
        controlPanel.init();

})(window.app, jQuery);