window.app = window.app || {
    modules:{},
    modName:{}
};

(function(app, $) {

    app.Particle = function Particle()
    {
        if (!(this instanceof Particle)) {
            return new Particle();
        }

        var screenX = 0;
        var screenY = 0;

        var deg = Math.PI / 180;
        var R = 0;
        var angle = 0;
        var offsetY = 0;

        var color = '';
        var backClipping = false;

        var path = [];

        //==================================================================================
        //
        //==================================================================================
        this.enableBackclipping = function enableBackclipping(val)
        {
            backClipping = Boolean(val);
            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.setPolar = function setPolar(r, a)
        {
            R = r;
            angle = a;

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.setVerticalPosition = function setVerticalPosition(y)
        {
            offsetY = y;
            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.prepare = function prepare()
        {
            path.length = 0;

            for (var i = 0; i < 30; i++)
            {
                var ang = angle + i * 2;

                var rgb = (160 + Math.floor(80 * Math.cos(ang * deg))).toString(16);

                path.push({
                    x: Math.round(R * Math.sin(ang * deg)),
                    color: '#'+ rgb + rgb + rgb,
                    vectorAngle: ang
                });
            }

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.nextStep = function nextStep()
        {
            screenX = this.constructor.screenCenter.x + path[0].x;
            screenY = this.constructor.screenCenter.y - offsetY;

            color = path[0].color;

            if (backClipping && Math.cos(path[0].vectorAngle * deg) < 0) {
                color = '#000';
            }

            path.push(path.shift());

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.draw = function draw(ctx)
        {
            ctx.fillStyle = color;
            ctx.moveTo(screenX, screenY);
            ctx.fillRect(screenX - 2, screenY - 2, 4, 4);

            return this;
        };
    };

    /*
     *
     */
    app.Ball = function Ball($element)
    {
        if (!(this instanceof Ball)) {
            return new Ball($element);
        }

        var DEFAULT_SPHERE_RADIUS = 300;
        var KEY_HOME = 36;

        var $body = $('body');

        $element[0].width = window.innerWidth;
        $element[0].height = window.innerHeight - 16;

        var xCenter = $element.width()  >> 1;
        var yCenter = $element.height() >> 1;

        var R = DEFAULT_SPHERE_RADIUS;
        var deg = Math.PI / 180;

        var aroundXangle = 0;
        var aroundYangle = 0;
        var aroundZangle = 0;

        var vectorAngles = [];
        var particles = [];

        var clearViewport = true;

        var virtualPage = document.createElement('canvas');
            virtualPage.width  = $element.width();
            virtualPage.height = $element.height();

        var visibleCtx = $element[0].getContext('2d');
        var virtualCtx = virtualPage.getContext('2d');
            virtualCtx.globalCompositeOperation = 'lighten';


        //==================================================================================
        //
        //==================================================================================
        this.init = function init()
        {
            this.bindEvents();

            app.Particle.screenCenter = {
                x: xCenter,
                y: yCenter
            };

            for (var ang = 0; ang < 360; ang += 30) {
                vectorAngles.push(ang);
            }

            for (var i = 0; i < vectorAngles.length; i++)
            {
                var rotation = vectorAngles[i];

                aroundZangle = 0;

                for (aroundYangle = rotation; aroundYangle > (rotation - 360); aroundYangle -= 6)
                {
                    var vectorRadius = Math.round(R * Math.sin(aroundZangle * deg));
                    var y = Math.round(R * Math.cos(aroundZangle * deg));

                    aroundZangle += 3;

                    var particle = new app.Particle();
                        particle
                            .setPolar(vectorRadius, aroundYangle)
                            .setVerticalPosition(y)
                            .prepare();

                    particles.push(particle);
                }
            }

            return this.rotate();
        };

        //==================================================================================
        //
        //==================================================================================
        this.bindEvents = function bindEvents()
        {
            var _this = this;

            $(window).on('resize', $.proxy(_this.resizeWindow, _this));

            $body.on('renderCompltete', function() {
                setTimeout($.proxy(_this.rotate, _this), 30);
            });

            /*
            $('body')
                .on('mousewheel DOMMouseScroll', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var direction = e.originalEvent.detail || e.originalEvent.wheelDelta;

                    if (Math.abs(direction) === 120) {
                        direction > 0 ? _this.scale(1):_this.scale(-1);

                    } else {
                        direction < 0 ? _this.scale(1):_this.scale(-1);
                    }
                })
                .on('keydown', function(e) {
                    if (e.keyCode === KEY_HOME) {
                        R = DEFAULT_SPHERE_RADIUS;
                    }
                });
            */
        };

        //==================================================================================
        //
        //==================================================================================
        this.resizeWindow = function resizeWindow()
        {
            $element[0].width = window.innerWidth;
            $element[0].height = window.innerHeight - 16;

            xCenter = $element.width()  >> 1;
            yCenter = $element.height() >> 1;

            app.Particle.screenCenter = {
                x: xCenter,
                y: yCenter
            };

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.rotate = function rotate()
        {
            particles.forEach(function(item) {
                item.nextStep().draw(virtualCtx);
            });

            return this.render();
        };

        //==================================================================================
        //
        //==================================================================================
        this.enableBackclipping = function enableBackclipping(val)
        {
            particles.forEach(function(item) {
                item.enableBackclipping(val);
            });

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.scale = function scale(val)
        {
            R += R / (val << 4);
            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.cleanViewport = function cleanViewport(val)
        {
            clearViewport = Boolean(val);
            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.render = function render()
        {
            clearViewport && this.clear(visibleCtx);

            visibleCtx.drawImage(virtualPage, 0, 0);

            this.clear(virtualCtx);

            $body.trigger('renderCompltete');

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.clear = function clear(context)
        {
            context.clearRect(0, 0, $element.width(), $element.height());
            return this;
        };
    };

})(window.app, jQuery);