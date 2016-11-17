window.app = window.app || {
    modules:{},
    modName:{}
};

(function(app, $) {

    app.MenuSwitcher = function MenuSwitcher($element)
    {
        if (!(this instanceof MenuSwitcher)) {
            return new MenuSwitcher($element);
        }

        this.$element = $element;

        this.init = function init()
        {
            console.log('MenuSwitcher')
            return this.bindEvents();
        };

        this.bindEvents = function bindEvents()
        {
            return this;
        };
    };

})(window.app, jQuery)