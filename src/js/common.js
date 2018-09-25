/*
	放置公共函数
 */
/**
 * [生成任意范围内的随机整数]
 * @param  {Number} min [最小值]
 * @param  {Number]} max [最大]
 * @return {Number}     [返回min到max间的随机整数]
 */
function randomNumber(min,max){
	return parseInt(Math.random()*(max-min+1))+min;//0.999
}

/**
 * [随机颜色]
 * @return {String} [返回rgb格式随机颜色]
 */
function randomColor(num){
	if(num === 16){
		var str = '0123456789abcdef';
		var res = '#';

		for(var i=0;i<6;i++){
			// 获取随机索引值
			var idx = parseInt(Math.random()*str.length);
			res += str.charAt(idx);
		}

		return res;
	}

	var r = parseInt(Math.random()*256);
	var g = parseInt(Math.random()*256);
	var b = parseInt(Math.random()*256);

	return 'rgb('+r+','+g+','+b+')';//rgb(244,12,23)
}


// 用于获取元素的css样式，兼容所有浏览器
// getCss(box,'font-size');
function getCss(ele,attr){
	if(window.getComputedStyle){
		// 标准浏览器
		return getComputedStyle(ele)[attr]
	}else if(ele.currentStyle){
		// IE6,7,8
		return ele.currentStyle[attr]
	}else{
		// 内联样式
		return ele.style[attr];
	}
}


/**
 * [给元素绑定事件的效果,同名事件不覆盖]
 * @param  {Node}  ele       [绑定事件的节点]
 * @param  {String}  type      [事件类型]
 * @param  {Function}  handler   [事件处理函数]
 * @param  {Boolean} isCapture [是否捕获]
 */
function bind(ele,type,handler,isCapture){
	// 判断当前是否支持addEventListener
	if(ele.addEventListener){
		// 标准浏览器
		ele.addEventListener(type,handler,isCapture);
	}else if(ele.attachEvent){
		// IE8-
		ele.attachEvent('on'+type,handler)
	}else{
		// 其他浏览器
		ele['on' + type] = handler;
	}
}

// 给元素绑定事件的效果
// 同名事件不覆盖
// bind(box,'click',function(){},true)


// Cooie的操作
var Cookie = {
	/**
	 * [获取cookie]
	 * @param  {String} name [cookie名]
	 * @return {String}      [返回name对应的cookie值]
	 */
	get:function(name){
		// 获取所有cookie
		var cookies = document.cookie;//

		// 声明变量，用于保存结果
		var res = '';

		// 转成数组
		cookies = cookies.split('; ');

		// 遍历cookie找出name对应的值
		for(var i=0;i<cookies.length;i++){
			// 获取当前cookie
			var arr = cookies[i].split('=');

			// 找出name对应的cookie
			if(arr[0] === name){
				res = arr[1];
			}
		}

		// 返回name对应的值
		// 无则返回cookie
		return res;
	},
	/**
	 * [删除cookie]
	 * @param  {[type]} name [description]
	 * @return {[type]}      [description]
	 */
	remove:function(name){
		var now = new Date();
		now.setDate(now.getDate()-1);

		// document.cookie = name + '=x;expires='+now.toUTCString()
		this.set(name,'x',{expires:now});
	},
	/**
	 * [设置Cookie]
	 * @param {String} name  [cookie名]
	 * @param {String} value [cookie值]
	 * @param {[Object]} prop  [参数]
	 	* expires
	 	* path
	 	* domain
	 	* secure
	 */
	set:function(name,value,prop){
		// cookie必写部分
		var str = name + '=' + value;

		// 不传参数时避免报错
		if(prop === undefined){
			prop = {};
		}

		// 有效期
		if(prop.expires){
			str += ';expires=' + prop.expires.toUTCString();
		}

		// 保存路径
		if(prop.path){
			str +=';path=' + prop.path
		}

		// 域名
		if(prop.domain){
			str +=';domain=' + prop.domain
		}

		// 安全性
		if(prop.secure){
			str += ';secure';
		}

		// 写入cookie
		document.cookie = str;
	},

}

// Cookie.get('username');//laoxie
// Cookie.set('passowrd','123456',{path:'/'});//laoxie
// Cookie.set('passowrd','abcd',{expires:now,path:'/',secure:true});//laoxie
// Cookie.remove()


function animate(ele,opt,callback){
	// 记录属性数量
	var timerLen = 0;

	for(var attr in opt){
		// 每循环一个属性+1
		timerLen++;

		(function(attr){
			// 获取目标值
			var target = opt[attr];

			var timerName = attr + 'timer';

			// 避免抖动
			clearInterval(ele[timerName]);

			ele[timerName] = setInterval(function(){
				// 获取当前值
				// var current = getComputedStyle(ele)[attr];
				var current = getCss(ele,attr);//可能达到的值：-165px,200px,0.5,1,45deg,#1258bc

				// 提取单位
				var unit = current.match(/^([\-\d\.]+)([a-z]*)$/);//null

				if(!unit){
					// 如果得到null,意味动画无法进行，直接退出
					clearInterval(ele[timerName]);
					return;
				}

				// 提取值和单位
				current = unit[1]*1;
				unit = unit[2];

				// 计算缓冲速度
				var speed = (target-current)/10;//0.6->1，-0.6->-1

				// speed不能为0
				speed = speed<0 ? Math.floor(speed) : Math.ceil(speed);

				// 针对opacity处理speed
				if(attr === 'opacity'){
					speed = speed<0 ? -0.05 : 0.05;
				}

				current += speed;

				// 判断结束条件
				if(current === target){
					clearInterval(ele[timerName]);

					// 重置目标值
					current = target;

					// 每结束一个定时器，数量-1
					timerLen--;

					// 执行背景颜色改变
					if(typeof callback === 'function' && timerLen===0){
						callback();
					}
				}

				// 设置样式
				ele.style[attr] = current + unit;
			},30);

		})(attr);
	}
}