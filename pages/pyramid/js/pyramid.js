window.app = window.app || {};

(function(app, $) {

    /*
     *
     */
    app.Pyramid = function Pyramid($element)
    {
        if (!(this instanceof Pyramid)) {
            return new Pyramid($element);
        }

        var DEFAULT_SPHERE_RADIUS = 200;

        var KEY = {
            HOME:  36,
            LEFT:  37,
            RIGHT: 39,
            UP:    38,
            DOWN:  40
        };

        var $body = $('body');

        $element[0].width = window.innerWidth;
        $element[0].height = window.innerHeight - 16;

        var xCenter = $element.width()  >> 1;
        var yCenter = $element.height() >> 1;

        var R = DEFAULT_SPHERE_RADIUS;
        var deg = Math.PI / 180;
        var f = 1600; // k = f / (f + item.z);

        var aroundX = 0;
        var aroundY = 0;
        var aroundZ = 0;

        var rotate = false;
        var rotateStep = 6;

        var shape =
        {
            vectors: [
                {aroundX: -30, aroundY: 90,  aroundZ: 0},
                {aroundX: -30, aroundY: 210, aroundZ: 0},
                {aroundX: -30, aroundY: 330, aroundZ: 0},
                {aroundX:  90, aroundY: 90,  aroundZ: 0}
            ],
            vertexes: [],
            normals:  []
        };

        var polygons = [];

        var colors = ['#cce', '#ecc', '#eec', '#cec'];

        var virtualPage = document.createElement('canvas');
            virtualPage.width  = $element.width();
            virtualPage.height = $element.height();

        var visibleCtx = $element[0].getContext('2d');
        var virtualCtx = virtualPage.getContext('2d');
            //virtualCtx.globalCompositeOperation = 'lighten';

        //==================================================================================
        //
        //==================================================================================
        this.init = function init()
        {
            var _this = this;

            this.bindEvents();

            shape.vectors.forEach(function(vector)
            {
                shape.vertexes.push({
                    x: R * Math.cos(vector.aroundY * deg),
                    y: R * Math.sin(vector.aroundX * deg),
                    z: R * Math.cos(vector.aroundX * deg) * Math.sin(vector.aroundY * deg),
                    k: 1
                });
            });

            polygons.push(
                [shape.vertexes[0], shape.vertexes[1], shape.vertexes[2]],
                [shape.vertexes[0], shape.vertexes[3], shape.vertexes[1]],
                [shape.vertexes[1], shape.vertexes[3], shape.vertexes[2]],
                [shape.vertexes[2], shape.vertexes[3], shape.vertexes[0]]
            );

            /*
            polygons.forEach(function(polygon) {
                shape.normals.push(_this.getNormal(polygon));
            });
            */

            shape.normals.push(
                this.getNormal(polygons[0]),
                this.getNormal(polygons[1]),
                this.getNormal(polygons[2]),
                this.getNormal(polygons[3])
            );

            console.log(shape);

            return this.draw(virtualCtx);
        };

        //==================================================================================
        //
        //==================================================================================
        this.bindEvents = function bindEvents()
        {
            var _this = this;

            var x = 0;
            var y = 0;

            $(window).on('resize', $.proxy(_this.resizeWindow, _this));

            $body
                .on('renderCompltete', function() {
                    setTimeout($.proxy(_this.rotate, _this), 30);
                })
                .on('mousedown', function(e) {
                    rotate = 1;
                    x = e.clientX;
                    y = e.clientY;
                })
                .on('mousemove', function(e)
                {
                    if (rotate) {
                        aroundY = (e.clientX - x) >> 1;
                        aroundX = (e.clientY - y) >> 1;

                        x = e.clientX;
                        y = e.clientY;

                        _this.rotate();
                    }
                })
                .on('mouseup', function() {
                    rotate = 0;
                })
                .on('keydown', function(e)
                {
                    if (e.keyCode < 36 || e.keyCode > 40) {
                        return;
                    }

                    if (e.keyCode === KEY.LEFT) {
                        aroundX = 0;
                        aroundY = rotateStep;
                    }

                    if (e.keyCode === KEY.RIGHT) {
                        aroundX = 0;
                        aroundY = -rotateStep;
                    }

                    if (e.keyCode === KEY.UP) {
                        aroundX = rotateStep;
                        aroundY = 0;
                    }

                    if (e.keyCode === KEY.DOWN) {
                        aroundX = -rotateStep;
                        aroundY = 0;
                    }

                    _this.rotate();
                });
        };

        //==================================================================================
        // b * c = {by * cz - bz * cy;  bz * cx - bx * cz;  bx * cy - by * cx}
        //==================================================================================
        this.getNormal = function getNormal(polygon)
        {
            var A = polygon[0];
            var B = polygon[1];
            var C = polygon[2];

            var b = {
                x: B.x - A.x,
                y: B.y - A.y,
                z: B.z - A.z
            };

            var c = {
                x: C.x - A.x,
                y: C.y - A.y,
                z: C.z - A.z
            };

            var normal = {
                //dx: b.y * c.z - b.z * c.y,
                //dy: b.z * c.x - b.x * c.z,
                dz: b.x * c.y - b.y * c.x
            };

            return normal;
        }

        //==================================================================================
        //
        //==================================================================================
        this.rotate = function rotate()
        {
            var cos_ay = Math.cos(aroundY * deg);
            var sin_ay = Math.sin(aroundY * deg);

            var cos_ax = Math.cos(aroundX * deg);
            var sin_ax = Math.sin(aroundX * deg);

            shape.vertexes.forEach(function(vertex)
            {
                var z =  vertex.z * cos_ay + vertex.x * sin_ay;
                var x = -vertex.z * sin_ay + vertex.x * cos_ay;

                vertex.x = x;
                vertex.z = z;

                var z = vertex.z * cos_ax - vertex.y * sin_ax;
                var y = vertex.z * sin_ax + vertex.y * cos_ax;

                vertex.y = y;
                vertex.z = z;

                vertex.k = f / (f + vertex.z);
            });

            for (var i = 0; i < polygons.length; i++) {
                shape.normals[i] = this.getNormal(polygons[i]);
            };

            return this.draw(virtualCtx);
        };

        //==================================================================================
        //
        //==================================================================================
        this.draw = function draw(ctx)
        {
            var x0 = xCenter;
            var y0 = yCenter;

            shape.vertexes.forEach(function(item)
            {
                var k = item.k;

                var x = Math.round(k * item.x);
                var y = Math.round(k * item.y);

                ctx.fillStyle = '#fff';
                ctx.moveTo(x0 + x, y0 - y);
                ctx.fillRect(x0 + x - 2, y0 - y - 2, 4, 4);
            });

            //return this.render();

            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;

            polygons.forEach(function(polygon, index)
            {
                ctx.fillStyle = colors[index];
                ctx.beginPath();

                if (shape.normals[index].dz < 0)
                {
                    for (var i = 0; i < polygon.length; i++)
                    {
                        k = polygon[i].k;

                        i === 0 ?
                            ctx.moveTo(x0 + Math.round(k * polygon[i].x), y0 - Math.round(k * polygon[i].y)):
                            ctx.lineTo(x0 + Math.round(k * polygon[i].x), y0 - Math.round(k * polygon[i].y));
                    }

                    ctx.fill();
                    //ctx.stroke();
                    ctx.closePath();
                }
            });

            return this.render();
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

            return this;
        };

        //==================================================================================
        //
        //==================================================================================
        this.render = function render()
        {
            this.clear(visibleCtx);

            visibleCtx.drawImage(virtualPage, 0, 0);

            this.clear(virtualCtx);

            //$body.trigger('renderCompltete');

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

    var p = new app.Pyramid($(canvas));
        p.init();

})(window.app, jQuery);