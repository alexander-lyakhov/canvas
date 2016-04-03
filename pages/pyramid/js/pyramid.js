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

        var rotateZY = 0;
        var rotateXZ = 0;
        var rotateXY = 0;

        var rotate = false;
        var rotateStep = 3;

        var shape =
        {
            vectors: [
                {rotateXY: 330, rotateXZ: 90,  rotateZY: 0},
                {rotateXY: 330, rotateXZ: 210, rotateZY: 0},
                {rotateXY: 330, rotateXZ: 330, rotateZY: 0},
                {rotateXY:  90, rotateXZ: 90,  rotateZY: 0}
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
                var x0 = Math.cos(vector.rotateXY * deg);

                var x = x0 * Math.cos(vector.rotateXZ * deg);
                var y =  1 * Math.sin(vector.rotateXY * deg);
                var z = x0 * Math.sin(vector.rotateXZ * deg);

                shape.vertexes.push({
                    x0: x,
                    y0: y,
                    z0: z,
                    x:  x,
                    y:  y,
                    z:  z,
                    k: 1
                });
            });


            polygons.push(
                [shape.vertexes[0], shape.vertexes[1], shape.vertexes[2]],
                [shape.vertexes[0], shape.vertexes[3], shape.vertexes[1]],
                [shape.vertexes[1], shape.vertexes[3], shape.vertexes[2]],
                [shape.vertexes[2], shape.vertexes[3], shape.vertexes[0]]
            );

            polygons.forEach(function(polygon) {
                shape.normals.push(_this.getNormal(polygon));
            });

            console.log(shape);

            //return this.draw(virtualCtx);
            return this.rotate();
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
                        rotateXZ = rotateXZ + ((e.clientX - x) >> 1) % 360;
                        rotateZY = rotateZY + ((e.clientY - y) >> 1) % 360;

                        x = e.clientX;
                        y = e.clientY;

                        _this.rotate();
                    }
                })
                .on('mouseup', function() {
                    rotate = 0;
                })
                .on('mousewheel DOMMouseScroll', function(e)
                {
                    e.preventDefault();
                    e.stopPropagation();

                    var direction = e.originalEvent.detail || e.originalEvent.wheelDelta;

                    Math.abs(direction) === 120 ?
                        direction > 0 ? _this.scale(1):_this.scale(-1):
                        direction < 0 ? _this.scale(1):_this.scale(-1);
                })
                .on('keydown', function(e)
                {
                    if (e.keyCode < 36 || e.keyCode > 40) {
                        return;
                    }

                    if (e.keyCode === KEY.LEFT) {
                        //rotateZY = 0;
                        rotateXZ = (rotateXZ + rotateStep) % 360;
                    }

                    if (e.keyCode === KEY.RIGHT) {
                        //rotateZY = 0;
                        rotateXZ = (rotateXZ - rotateStep) % 360;
                    }

                    if (e.keyCode === KEY.UP) {
                        rotateZY = (rotateZY + rotateStep) % 360;
                        //rotateXZ = 0;
                    }

                    if (e.keyCode === KEY.DOWN) {
                        rotateZY = (rotateZY - rotateStep) % 360;
                        //rotateXZ = 0;
                    }

                    _this.rotate();
                });
        };

        //==================================================================================
        //
        //==================================================================================
        this.rotate = function rotate()
        {
            //rotateXZ  = (rotateXZ + 3) % 360;
            //rotateZY  = (rotateZY + 3) % 360;

            var cos_ay = Math.cos(rotateXZ * deg);
            var sin_ay = Math.sin(rotateXZ * deg);

            var cos_ax = Math.cos(rotateZY * deg);
            var sin_ax = Math.sin(rotateZY * deg);

            shape.vertexes.forEach(function(vertex)
            {
                var z =  vertex.z0 * cos_ay + vertex.x0 * sin_ay;
                var x = -vertex.z0 * sin_ay + vertex.x0 * cos_ay;

                vertex.x = x;
                vertex.z = z;

                var z = vertex.z * cos_ax - vertex.y0 * sin_ax;
                var y = vertex.z * sin_ax + vertex.y0 * cos_ax;

                vertex.y = y;
                vertex.z = z;

                vertex.k = f / (f + vertex.z * R);
            });

            for (var i = 0; i < polygons.length; i++) {
                shape.normals[i] = this.getNormal(polygons[i]);
            };

            return this.draw(virtualCtx);
        };

        //==================================================================================
        // a * b = {ay * bz - az * by;  az * bx - ax * bz;  ax * by - ay * bx}
        //==================================================================================
        this.getNormal = function getNormal(polygon)
        {
            var A = polygon[0];
            var O = polygon[1];
            var B = polygon[2];

            var a = {
                x: A.x * A.k - O.x * O.k,
                y: A.y * A.k - O.y * O.k,
                z: A.z * A.k - O.z * O.k
            };

            var b = {
                x: B.x * B.k - O.x * O.k,
                y: B.y * B.k - O.y * O.k,
                z: B.z * B.k - O.z * O.k
            };

            var normal = {
                //dx: a.y * b.z - a.z * b.y,
                //dy: a.z * b.x - a.x * b.z,
                dz: a.x * b.y - a.y * b.x
            };

            return normal;
        }

        //==================================================================================
        //
        //==================================================================================
        this.scale = function scale(val)
        {
            R += R / (val << 4);
            return this.draw(virtualCtx);
        };

        //==================================================================================
        //
        //==================================================================================
        this.draw = function draw(ctx)
        {
            var x0 = xCenter;
            var y0 = yCenter;

            shape.vertexes.forEach(function(vertex)
            {

                var k = vertex.k;

                var x = Math.round(k * vertex.x * R);
                var y = Math.round(k * vertex.y * R);

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

                if (shape.normals[index].dz > 0)
                {
                    for (var i = 0; i < polygon.length; i++)
                    {
                        k = polygon[i].k;

                        i === 0 ?
                            ctx.moveTo(x0 + Math.round(k * R * polygon[i].x), y0 - Math.round(k * R * polygon[i].y)):
                            ctx.lineTo(x0 + Math.round(k * R * polygon[i].x), y0 - Math.round(k * R * polygon[i].y));
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