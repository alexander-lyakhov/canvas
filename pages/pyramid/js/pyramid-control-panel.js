window.app = window.app || {};

(function(app, $) {

    app.PyramidControlPanel = function PyramidControlPanel($element) {

        if (!(this instanceof PyramidControlPanel)) {
            return new PyramidControlPanel($element);
        }

        var $checkboxAutoRotate   = $element.find('#checkbox-auto-rotate');
        var $checkboxShowVertexes = $element.find('#checkbox-show-vertexes');
        var $checkboxShowEdges    = $element.find('#checkbox-show-edges');
        var $checkboxShowPolygons = $element.find('#checkbox-show-polygons');

        var pyramid = new app.Pyramid($(canvas));
            pyramid.init();

        //==================================================================================
        //
        //==================================================================================
        this.init = function init()
        {
            var flags = pyramid.getFlags();

            $checkboxShowVertexes.prop('checked', Boolean(flags.showVertexes));
            $checkboxShowEdges   .prop('checked', Boolean(flags.showEdges));
            $checkboxShowPolygons.prop('checked', Boolean(flags.showPolygons));

            this.bindEvents();

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.bindEvents = function bindEvents()
        {
            $checkboxAutoRotate.on('change', function(e) {
                pyramid.enableAutoRotation($(this).is(':checked'));
            });

            $checkboxShowVertexes.on('change', function(e) {
                pyramid.showVertexes($(this).is(':checked'));
            });

            $checkboxShowEdges.on('change', function(e) {
                pyramid.showEdges($(this).is(':checked'));
            });

            $checkboxShowPolygons.on('change', function(e) {
                pyramid.showPolygons($(this).is(':checked'));
            });

            return this;
        };
    };

    var controlPanel = new app.PyramidControlPanel($('.pyramid-control-panel'));
        controlPanel.init();

})(window.app, jQuery);