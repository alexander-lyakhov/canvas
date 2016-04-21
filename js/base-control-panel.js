window.app = window.app || {};

window.app.BaseControlPanel = (function(app, $) {

    console.log('BaseControlPanel');

    var BaseControlPanel = function BaseControlPanel($element)
    {
        if (!(this instanceof BaseControlPanel)) {
            return new BaseControlPanel($element);
        }

        this.$element = $element;
        this.$body = $('body');

        this.$tooltip = $('.tooltip');
        this.$buttonTooltip = $element.find('.button-tooltip');
    };

    //==================================================================================
    //
    //==================================================================================
    BaseControlPanel.prototype.bindEvents = function bindEvents()
    {
        var _this = this;

        this.$buttonTooltip
            .on('mouseover', $.proxy(_this.showTooltip, _this))
            .on('mouseout',  $.proxy(_this.hideTooltip, _this));

        this.$body.on('keydown keyup', function(e)
        {
            if (e.keyCode === 191) // forward slash
            {
                e.type === 'keydown' ?
                    _this.showTooltip():
                    _this.hideTooltip();
            }
        });
    };

    //==================================================================================
    //
    //==================================================================================
    BaseControlPanel.prototype.showTooltip = function showTooltip()
    {
        this.$tooltip.addClass('flipped');
        return this;
    };

    //==================================================================================
    //
    //==================================================================================
    BaseControlPanel.prototype.hideTooltip = function hideTooltip()
    {
        this.$tooltip.removeClass('flipped');
        return this;
    };

    return BaseControlPanel;

})(window.app, jQuery);