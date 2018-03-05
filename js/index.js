        /**
         * 在画布中获取特定颜色的像素数量
         * @param  {object} canvas  canvas对象
         * @param  {r:0,g:0,b:0} color color对象 
         * @return {number} amount
         */
        function getPixelAmount(canvas,color){
               var ctx = canvas.getContext('2d');
               var pixels = ctx.getImageData(0,0,canvas.width,canva.height);
               var all = pixels.data.length;         
               var amount = 0;
              for(i = 0;i<all;i+= 4){
                  if(pixels.data[i] === color.r&&
                    pixels.data[i] === color.g&&
                    pixels.data[i] === color.b){
                        amount++;
                    }
              }
              return amount;
        }
         /**
         * 获取画布中某一个像素的颜色
         * @param  {object} canvas  canvas对象
         * @param  {number} x x坐标
         * @param  {number} y y坐标
         * @return {object} {r:0,g:0,b:0,a:0} 颜色对象
         */
        function getPixelColour(canvas,x,y){
            var ctx = canvas.getContext('2d');
            var pixel = ctx.getImageData(x,y,1,1);
            return {
                r:pixel.data[0],
                g:pixel.data[1],
                b:pixel.data[2],
                a:pixel.data[3]
            };
        }
        