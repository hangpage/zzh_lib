(function(window, jQuery) {
	window.zzh = {
		version: 1.0,
		_index: 0,
		HTML5: window['applicationCache'],
		//��֤�ͻ��˷���
		Android: function() {
			return navigator.userAgent.match(/Android/i) ? true: false;
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i) ? true: false;
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true: false;
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i) ? true: false;
		},
		any: function() {
			return (zzh.Android() || zzh.BlackBerry() || zzh.iOS() || zzh.Windows());
		},
		getUUID: function(prefix) {
			prefix = prefix || 'zzh';
			var id = prefix + '-' + this._index++;
			return id;
		},
		getValid: function() {
			var array = Array.prototype.slice.call(arguments);
			for (var i = 0; i < array.length; i++) {
				if (o !== undefined && o !== null || (jQuery.type(o) == "number" && !isNaN(o))) {
					return o;
				}
			}
		},
		//TODO ��װextend�̳з���
		/**
		 * @step1 �����̳���Ĺ��캯��
		 * @step2 ���ü̳����ԭ����Ϊ���๹�캯��
		 * @step3 �����̳���Ĺ��캯��
		 * @step4 �����̳���
		 
		 * �̳У����ɴ��ݵ�ֵ�����Ƿ񸲸�ԭ���������
		 * ���صĶ�����Ҳ������ override() ���������ڸ���ʵ���ĳ�Ա  
		 * @param { Object } subclass ���࣬���ڼ̳У�����̳��˸����������ԣ������շ��ظö���  
		 * @param { Object } superclass ���࣬���̳�  
		 * @param { Object } overrides ���ò�����ѡ�� һ�����󣬽�������Я�������Զ�������и���
		 * @method extend 
		 */
		extend: function(subFun, superFun, overrides) {
			var superClass = function() {};
			superClass.prototype = superFun.prototype;
			//����(���м����)��ʵ���˶Ը���ļ̳�
			superClass.constructor = superFun.constructor;
			//����������JS�м򵥼̳з���
			superClass.prototype.constructor = superFun;
			subFun.prototype = new superClass();

			subFun.prototype.constructor = subFun;
			//�ı�superClassʵ�������constructorʹ��ָ������,��Ϊ����subFunԭ�͵�constructor����superClass��constructor
			if (overrides) {
				for (var key in overrides) {
					subFun.prototype[key] = overrides[key];
				}
			}
			subFun.superClass = superFun.prototype;
			//����superClass���Ա��游��ԭ��
			// �������superclass.prototype.constructorû�б��Զ��壬���Զ���
			if (superFun.prototype.constructor == Object.prototype.constructor) {
				superFun.prototype.constructor = superFun;
			}
		},
		isDate: function(value) {
			return !!(value && value.getTime);
		},
		isArray: function(value) {
			return !!(value && !!value.push);
		},
		isNull: function(value) {
			return value === null || value === undefined;
		},
		isNumber: function(value) {
			return !isNaN(value) && typeof value == 'number';
		},
		/*
			*�����ڸ�ʽ���ķ�����չ
			*zzh.formatDate('yyyy-mm-dd hh:mi:ss',new Date) => 2017-03-24 15:41:40
		*/
		formatDate: function(format, time, returnDate) {
			if (time == undefined || time == '') {
				return "";
			}
			if (jQuery.type(time) == 'string') {
				if (/^\w+.+\d{4}$/i.test(time)) {
					time = new Date(time);
				}
			}
			if (jQuery.type(time) == 'string') {
				time = time.replace(/T/i, " "); // ���date���Ͳ�ѯʱ���T
				time = time.replace(/\.\d+/i, ""); // ���IE ��Ӧ���ݿ�datetime
				time = time.replace(/-/g, "/");
				time = time.replace(/T/i, " "); // ���date���Ͳ�ѯʱ���T
				time = time.replace(/\.\d+/i, ""); // ���IE ��Ӧ���ݿ�datetime
				time = time.replace(/-/g, "/");
				var _T = time.split(" ");
				var _d = _T[0],
					_t = _T[1];
				if (/:/.test(_d)) {
					_d = undefined;
					_t = _T[0];
				}
				var __D = new Date();
				if (_t && _d) {
					var _ds = _d.split("/"),
						_ts = _t.split(":");
					time = new Date(Number(_ds[0] || __D.getFullYear()), Number(_ds[1] ? _ds[1] - 1 : __D.getMonth()),
						Number(_ds[2] || __D.getDate()), Number(_ts[0] || __D.getHours()), Number(_ts[1] || __D.getMinutes()), Number(_ts[2] || __D.getSeconds()));
				} else if (_d) {
					var _ds = _d.split("/");
					time = new Date(Number(_ds[0] || __D.getFullYear()), Number(_ds[1] ? _ds[1] - 1 : __D.getMonth()),
						Number(_ds[2] || __D.getDate()), 0, 0, 0);
				} else if (_t) {
					var _ts = _t.split(":");
					time = new Date(__D.getFullYear(), __D.getMonth(), __D.getDate(), Number(_ts[0] || __D.getHours()),
						Number(_ts[1] || __D.getMinutes()), Number(_ts[2] || __D.getSeconds()));
				}

				if (returnDate) {
					return time;
				}
			}
			var Week = ['��', 'һ', '��', '��', '��', '��', '��'];
			format = format.replace(/YYYY/i, time.getFullYear());
			format = format.replace(/YY/i, (time.getYear() % 100) > 9 ? (time.getYear() % 100).toString() : '0' + (time.getYear() % 100));
			format = format.replace(/MM/i, (time.getMonth() + 1) > 9 ? (time.getMonth() + 1).toString() : '0' + (time.getMonth() + 1));
			format = format.replace(/W/g, Week[time.getDay()]);
			format = format.replace(/DD/i, time.getDate() > 9 ? time.getDate().toString() : '0' + time.getDate());
			format = format.replace(/HH/i, time.getHours() > 9 ? time.getHours().toString() : '0' + time.getHours());
			format = format.replace(/MI/i, time.getMinutes() > 9 ? time.getMinutes().toString() : '0' + time.getMinutes());
			format = format.replace(/SS/i, time.getSeconds() > 9 ? time.getSeconds().toString() : '0' + time.getSeconds());
			if (returnDate) {
				return this.formatDate('yyyy/mm/dd', format, true);
			}
			return format;
		}
	}
	//TODO �û���Ϊ����
	zzh.UserUtils = {
		copy: function(id){
			if(id.indexOf('#') == -1){
				id = '#' + id;
			}
			var area = $(id);
			area.select();
			document.execCommand("Copy");
			alert('���Ƴɹ�����ֱ��ճ��');
		},
		/*
			@param {String}
			@oncopy 	   ������Ϊ
			@onpaste 	   ճ����Ϊ
			@oncut         ������Ϊ
			@oncontextmenu �һ��˵���Ϊ
			@onselectstart ѡ����Ϊ
		*/
		preventUserBehavior: function(eventName){
			document[eventName] = function (event){
				if(window.event){
					event = window.event;
				}try{
					var the = event.srcElement;
					if (!((the.tagName == "INPUT" && the.type.toLowerCase() == "text") || the.tagName == "TEXTAREA")){
						return false;
					}
					return true;
				}catch (e){
					return false;
				}
			}
		}

	}

	zzh.OpenUrl(url) = function {
		var a = document.createElement('a');
		a.target = '_blank';
		a.href = url;
		a.style.display = 'none';
		var body = document.getElementsByTagName('body').item(0);
		body.appendChild(a);
		a.click();
		body.removeChild(a);
	}
	
	zzh.Img = function(){
		this.el = $('body');
		this.imgs = [];
//		this._init(); //Ĭ�ϲ�����init����  ����鿴ͼƬʱ�򴥷�
	}
	zzh.Img.prototype = {
		_init: function(){
			this.modalEl = jQuery('<div class="dialog-modal" style="position: fixed;left: 0;top: 0;width: 100%;height: 100%;opacity: .5;background: #000;"></div>');
			this.modalEl.appendTo(this.el);
			this.borderEl = jQuery('<div class="zzh-img notice-border dialog-border" style="position: absolute;top: 50px;left: 230px;right:20px;bottom:50px;background: #F5F5F5;width:800px;height:612px;padding: 0 10px;"></div>');
			this.borderEl.appendTo(this.el);
			this.titleBox = jQuery('<div class="title-box"><div class="icon icon-remove"></div></div>');
			this.titleBox.appendTo(this.borderEl);
			this.imgBox = jQuery('<div class="img-box"></div>');
			this.imgBox.appendTo(this.borderEl);
			this.loader = jQuery('<div class="img-loader"></div>').appendTo(this.imgBox);
			this.showImg = jQuery('<img src="" alt="">');
			this.showImg.appendTo(this.imgBox);
			//<div class="icon icon-zoom-in"></div><div class="icon icon-zoom-out"></div> ���ǷŴ���С
			this._renderImgNav();
			this.toolBox = jQuery('<div class="tool-box"><div class="icon icon-repeat"></div><div class="icon icon-zoom-in"></div><div class="icon icon-zoom-out"></div></div>');
			this.toolBox.appendTo(this.borderEl);
			this.left = jQuery('<div class="left"><div class="pre icon icon-chevron-left"></div></div>');
			this.right = jQuery('<div class="right"><div class="next icon icon-chevron-right"></div></div>');
			this.left.appendTo(this.borderEl);
			this.right.appendTo(this.borderEl);
			this._index = 0;
			this._rotate = 0;
			this._scale = 1;
			this._render();
			this._bindEvents();
		},
		_render: function(){
			this._setAttr(this.imgs[this._index]);
		},
		_imgLoad: function(){
			this.loader.show();
		},
		_renderImgNav: function(){
			var html = [];
			var width = this.imgs.length * 72 + 'px';
			this.imgNav = jQuery('<ul class="clear-fix" style="margin-top:14px;margin-left: auto;margin-right: auto;width:'+ width +'"></ul>');
			for(var i = 0; i < this.imgs.length; i++){
				html.push('<li class="small-img-box" style="float:left;width:60px;height:60px;overflow:hidden;border:1px solid #fff;cursor: pointer;margin-right: 12px"><img style="width:60px;" src="'+ this.imgs[i] +'"></li>');
			}
			this.imgNav.append(jQuery(html.join('')));
			this.imgNav.appendTo(this.borderEl);
		},
		_setAttr: function(url){
			var that = this;
			this._rotate = 0;
			this.showImg.css('transform', 'rotate('+ this._rotate +'deg) translate(-50%,-50%) scale('+ this._scale +')');
			this.loader.show();
			this.showImg.attr('src', url);
			this.showImg.bind('load', function(e){
				if(e.currentTarget.complete){
					that.loader.hide();
				}
			})
			$('.small-img-box').eq(this._index).css('border', '1px solid #9A353B').siblings().css('border', '1px solid #FFF');
		},
		_hide: function(){
			this.borderEl.addClass('animate fadeOutUp');
			this.borderEl.remove();
			this.modalEl.addClass('animate fadeOutUp');
			this.modalEl.remove();
		},
		_preImg: function(){
			this._index--;
			if(this._index < 0){
				this._index = this.imgs.length -1;
			}
			this._setAttr(this.imgs[this._index]);
		},
		_nextImg: function(){
			this._index++;
			if(this._index == this.imgs.length){
				this._index = 0;
			}
			this._setAttr(this.imgs[this._index]);
		},
		_rotateImg: function(){
			this._rotate += 90;
			this.showImg.css('transform', 'rotate('+ this._rotate +'deg) translate(-50%,-50%) scale('+ this._scale +')');
		},
		_enlargeImg: function(){
			this._scale += 0.1;
			this.showImg.css('transform', 'rotate('+ this._rotate +'deg) translate(-50%,-50%) scale('+ this._scale +')');
		},
		_narrowImg: function(){
			if(this._scale <= 0.2){
				return;
			}
			this._scale -= 0.1;
			this.showImg.css('transform', 'rotate('+ this._rotate +'deg) translate(-50%,-50%) scale('+ this._scale +')');
		},
		_switchImg: function(e){
			this._index = $(e.currentTarget).index();
			this._setAttr(this.imgs[this._index]);
		},
		_bindEvents:function(){
			var that = this;
	        this.borderEl.delegate('.icon-remove', 'click', function(e){
	        	that._hide();
	        })
	        this.modalEl.bind('click', function(){
	        	that._hide();
	        })
	        this.borderEl.delegate('.icon-chevron-left', 'click', function(e){
	        	that._preImg();
	        })
	        this.borderEl.delegate('.icon-chevron-right', 'click', function(e){
	        	that._nextImg();
	        })
	        this.borderEl.delegate('.icon-repeat', 'click', function(e){
	        	that._rotateImg();
	        })
	        this.borderEl.delegate('.icon-zoom-in', 'click', function(e){
	        	that._enlargeImg();
	        })
	        this.borderEl.delegate('.icon-zoom-out', 'click', function(e){
	        	that._narrowImg();
	        })
	        this.borderEl.delegate('.small-img-box', 'click', function(e){
	        	that._switchImg(e);
	        })
	        
	    },
		
	}
})(window, jQuery)