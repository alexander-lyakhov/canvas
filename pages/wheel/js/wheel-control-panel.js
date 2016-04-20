window.app = window.app || {};

(function(app, $) {

    app.WheelControlPanel = function WheelControlPanel($element) {

        if (!(this instanceof WheelControlPanel)) {
            return new WheelControlPanel($element);
        }

        var $body = $('body');

        var $checkboxReverse      = $element.find('#checkbox-reverse');
        var $checkboxShowCircle   = $element.find('#checkbox-show-circle');
        var $checkboxShowRays     = $element.find('#checkbox-show-rays');
        var $checkboxEnableColors = $element.find('#checkbox-enable-colors');

        var $tooltip = $('.tooltip');
        var $buttonShowHelp = $element.find('.button-show-help');

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
        this.showTooltip = function showTooltip()
        {
            $tooltip.addClass('flipped');
            return this;
        }

        this.hideTooltip = function hideTooltip()
        {
            $tooltip.removeClass('flipped');
            return this;
        }

        //==================================================================================
        //
        //==================================================================================
        this.bindEvents = function bindEvents()
        {
            var _this = this;

            $buttonShowHelp
                .on('mouseover', $.proxy(_this.showTooltip, _this))
                .on('mouseout',  $.proxy(_this.hideTooltip, _this));

            $body.on('keydown keyup', function(e)
            {
                if (e.keyCode === 191) // forward slash
                {
                    e.type === 'keydown' ?
                        _this.showTooltip():
                        _this.hideTooltip();
                }
            });

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

    var controlPanel = new app.WheelControlPanel($('.wheel-control-panel'));
        controlPanel.init();

})(window.app, jQuery);