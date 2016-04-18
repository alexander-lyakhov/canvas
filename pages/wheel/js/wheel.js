window.app = window.app || {};

(function(app, $) {

    /*
     *
     */
    app.Wheel = function Wheel($element)
    {
        if (!(this instanceof Wheel)) {
            return new Wheel($element);
        }

        app.BaseCanvas.apply(this, arguments);

        var DEFAULT_SPHERE_RADIUS = 200;
        var KEY = this.KEY;

        var deg = this.deg;
        var R = DEFAULT_SPHERE_RADIUS;
        var stepAngle = 3;

        var virtualCtx = this.virtualCtx;
        var visibleCtx = this.visibleCtx;

        var dots = [];
        var rays = 12;

        var flags = {
            showCircle: 1,
            showRays: 1,
            enableColors: 0
        };

        //==================================================================================
        //
        //==================================================================================
        this.getFlags = function getFlags() {
            return flags;
        };

        this.showCircle = function showCircle(val)
        {
            flags.showCircle = Boolean(val);
            return this;
        };

        this.showRays = function showRays(val)
        {
            flags.showRays = Boolean(val);
            return this;
        };

        this.enableColors = function enableColors(val)
        {
            flags.enableColors = Boolean(val);
            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.bindEvents = function bindEvents()
        {
            var _this = this;

            $(window).on('resize', $.proxy(_this.resizeWindow, _this));

            this.$body
                .on('renderCompltete', function() {
                    setTimeout($.proxy(_this.action, _this), 30);
                })
                .on('mousewheel DOMMouseScroll', function(e)
                {
                    e.preventDefault();
                    e.stopPropagation();

                    var direction = e.originalEvent.detail || e.originalEvent.wheelDelta;

                    Math.abs(direction) === 120 ?
                        direction > 0 ? _this.incriseRays():_this.decriseRays():
                        direction < 0 ? _this.incriseRays():_this.decriseRays();
                });

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.init = function init()
        {
            this
                .bindEvents()
                .setDots()
                .action();

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.setDots = function setDots()
        {
            dots.length = 0;

            for (var i = 0; i < rays; i++)
            {
                var angle = i * 180 / rays;

                var r = 80 + Math.round(Math.random() * 128);
                var g = 80 + Math.round(Math.random() * 128);
                var b = 80 + Math.round(Math.random() * 128);

                var color = '#' + r.toString(16) + g.toString(16) + b.toString(16);

                dots.push({
                    x: 0,
                    y: 0,
                    pathAngle: angle,
                    phase: angle,
                    color: color
                });
            }

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.composeWheel = function composeWheel()
        {
            var ctx = virtualCtx;

            var x0 = this.xCenter;
            var y0 = this.yCenter;

            /*
             *  draw rays
             */
            if (flags.showRays)
            {
                ctx.strokeStyle = '#808080';
                ctx.lineWidth = 1;
                ctx.beginPath();

                for (var i = 0; i < rays; i++)
                {
                    var dot = dots[i];

                    var x = Math.round(R * Math.cos(dot.pathAngle * deg));
                    var y = Math.round(R * Math.sin(dot.pathAngle * deg));

                    ctx.moveTo(x0 + x, y0 + y);
                    ctx.lineTo(x0 - x, y0 - y);
                }

                ctx.stroke();
                ctx.closePath();
            }

            /*
             *  draw circle
             */
            if (flags.showCircle)
            {
                ctx.strokeStyle = '#505050';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x0, y0, R, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.closePath();
            }

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.action = function action()
        {
            dots.forEach(function(dot)
            {
                dot.phase = (dot.phase - stepAngle) % 360;

                var pathPosition = R * Math.cos(dot.phase * deg);

                dot.x = Math.round(pathPosition * Math.cos(dot.pathAngle * deg));
                dot.y = Math.round(pathPosition * Math.sin(dot.pathAngle * deg));
            });

            this.composeWheel();
            this.draw();

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.reverse = function reverse()
        {
            stepAngle *= -1;
            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.resizeWindow = function resizeWindow()
        {
            this.$element[0].width = window.innerWidth;
            this.$element[0].height = window.innerHeight - 16;

            this.xCenter = this.$element.width()  >> 1;
            this.yCenter = this.$element.height() >> 1;

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.incriseRays = function incriseRays()
        {
            if (rays < 12)
            {
                if (180 % ++rays) {
                    return this.incriseRays();
                }

                return this.setDots();
            }
        };

        this.decriseRays = function decriseRays()
        {
            if (rays > 1)
            {
                if (180 % --rays) {
                    return this.decriseRays();
                }

                return this.setDots();
            }
        };

        //==================================================================================
        //
        //==================================================================================
        this.draw = function draw(ctx)
        {
            ctx = ctx || virtualCtx;

            var x0 = this.xCenter;
            var y0 = this.yCenter;

            dots.forEach(function(dot, index)
            {
                ctx.fillStyle = flags.enableColors ? dot.color:'#fff';
                ctx.fillRect(x0 + dot.x - 6, y0 + dot.y - 6, 12, 12);
            });

            return this.render();
        };
    };

    app.Wheel.prototype = Object.create(app.BaseCanvas.prototype);
    app.Wheel.prototype.constructor = app.BaseCanvas;

})(window.app, jQuery);