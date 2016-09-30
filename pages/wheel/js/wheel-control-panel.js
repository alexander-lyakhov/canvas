window.app = window.app || {
    modules:{},
    modName:{}
};

(function(app, $) {

    app.WheelControlPanel = function WheelControlPanel($element) {

        if (!(this instanceof WheelControlPanel)) {
            return new WheelControlPanel($element);
        }

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

})(window.app, jQuery);