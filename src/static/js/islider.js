/**
 * Interface Elements for jQuery
 * Slider
 * 
 * http://interface.eyecon.ro
 * 
 * Copyright (c) 2006 Stefan Petre
 * Dual licensed under the MIT (MIT-LICENSE.txt) 
 * and GPL (GPL-LICENSE.txt) licenses.
 *   
 *
 */

jQuery.iSlider = {
	tabindex : 1,
	set : function (values)
	{
		var values = values;
		return this.each(
			function()
			{
				this.slideCfg.sliders.each(
					function (key) 
					{ 
						jQuery.iSlider.dragmoveBy(this,values[key]);
					}
				);
			}
		);
	},
	
	modifyContainer : function (elm)
	{
		if (elm.SliderContainer.slideCfg.restricted ) {
			next = elm.SliderContainer.slideCfg.sliders.get(elm.SliderIteration+1);
			if (next) {
				elm.dragCfg.cont.w = parseInt(jQuery(next).css('left')) + elm.dragCfg.oC.wb;
				elm.dragCfg.cont.h = parseInt(jQuery(next).css('top')) + elm.dragCfg.oC.hb;
			}
			prev = elm.SliderContainer.slideCfg.sliders.get(elm.SliderIteration-1);
			if (prev) {
				elm.dragCfg.cont.x += parseInt(jQuery(prev).css('left'));
				elm.dragCfg.cont.y += parseInt(jQuery(prev).css('top'));
				elm.dragCfg.cont.w -= parseInt(jQuery(prev).css('left'));
				elm.dragCfg.cont.h -= parseInt(jQuery(prev).css('top'));
			}
		}
		elm.dragCfg.maxx = elm.dragCfg.cont.w - elm.dragCfg.oC.wb;
		elm.dragCfg.maxy = elm.dragCfg.cont.h - elm.dragCfg.oC.hb;
		if(elm.dragCfg.fractions) {
			elm.dragCfg.gx = ((elm.dragCfg.cont.w - elm.dragCfg.oC.wb)/elm.dragCfg.fractions) || 1;
			elm.dragCfg.gy = ((elm.dragCfg.cont.h - elm.dragCfg.oC.hb)/elm.dragCfg.fractions) || 1;
			elm.dragCfg.fracW = elm.dragCfg.maxx / elm.dragCfg.fractions;
			elm.dragCfg.fracH = elm.dragCfg.maxy / elm.dragCfg.fractions;
		}
		
		elm.dragCfg.cont.dx = elm.dragCfg.cont.x - elm.dragCfg.oR.x;
		elm.dragCfg.cont.dy = elm.dragCfg.cont.y - elm.dragCfg.oR.y;
		
		jQuery.iDrag.helper.css('cursor', 'default');
	},
	
	onSlide : function(elm, x, y)
	{
		if (elm.dragCfg.fractions) {
				xfrac = parseInt(x/elm.dragCfg.fracW);
				xproc = xfrac * 100 / elm.dragCfg.fractions;
				yfrac = parseInt(y/elm.dragCfg.fracH);
				yproc = yfrac * 100 / elm.dragCfg.fractions;
		} else {
			xproc = parseInt(x * 100 / elm.dragCfg.maxx);
			yproc = parseInt(y * 100 / elm.dragCfg.maxy);
		}
		elm.dragCfg.lastSi = [xproc||0, yproc||0, x||0, y||0];
		if (elm.dragCfg.onSlide)
			elm.dragCfg.onSlide.apply(elm, elm.dragCfg.lastSi);
	},
	
	dragmoveByKey : function (event)
	{
		pressedKey = event.charCode || event.keyCode || -1;
		
		switch (pressedKey)
		{
			//end
			case 35:
				jQuery.iSlider.dragmoveBy(this.dragElem, [2000, 2000] );
			break;
			//home
			case 36:
				jQuery.iSlider.dragmoveBy(this.dragElem, [-2000, -2000] );
			break;
			//left
			case 37:
				jQuery.iSlider.dragmoveBy(this.dragElem, [-this.dragElem.dragCfg.gx||-1, 0] );
			break;
			//up
			case 38:
				jQuery.iSlider.dragmoveBy(this.dragElem, [0, -this.dragElem.dragCfg.gy||-1] );
			break;
			//right
			case 39:
				jQuery.iSlider.dragmoveBy(this.dragElem, [this.dragElem.dragCfg.gx||1, 0] );
			break;
			//down;
			case 40:
				jQuery.iDrag.dragmoveBy(this.dragElem, [0, this.dragElem.dragCfg.gy||1] );
			break;
		}
	},
	
	dragmoveBy : function (elm, position) 
	{
		if (!elm.dragCfg) {
			return;
		}
		
		elm.dragCfg.oC = jQuery.extend(
			jQuery.iUtil.getPosition(elm),
			jQuery.iUtil.getSize(elm)
		);
		
		elm.dragCfg.oR = {
			x : parseInt(jQuery.css(elm, 'left'))||0,
			y : parseInt(jQuery.css(elm, 'top'))||0
		};
		
		elm.dragCfg.oP = jQuery.css(elm, 'position');
		if (elm.dragCfg.oP != 'relative' && elm.dragCfg.oP != 'absolute') {
			elm.style.position = 'relative';
		}
		
		jQuery.iDrag.getContainment(elm);
		jQuery.iSlider.modifyContainer(elm);		
		
		dx = parseInt(position[0]) || 0;
		dy = parseInt(position[1]) || 0;
		
		nx = elm.dragCfg.oR.x + dx;
		ny = elm.dragCfg.oR.y + dy;
		if(elm.dragCfg.fractions) {
			newCoords = jQuery.iDrag.snapToGrid.apply(elm, [nx, ny, dx, dy]);
			if (newCoords.constructor == Object) {
				dx = newCoords.dx;
				dy = newCoords.dy;
			}
			nx = elm.dragCfg.oR.x + dx;
			ny = elm.dragCfg.oR.y + dy;
		}
		
		newCoords = jQuery.iDrag.fitToContainer.apply(elm, [nx, ny, dx, dy]);
		if (newCoords && newCoords.constructor == Object) {
			dx = newCoords.dx;
			dy = newCoords.dy;
		}
		nx = elm.dragCfg.oR.x + dx;
		ny = elm.dragCfg.oR.y + dy;
		
		if (elm.dragCfg.si && (elm.dragCfg.onSlide || elm.dragCfg.onChange)) {
			jQuery.iSlider.onSlide(elm, nx, ny);
		}
		nx = !elm.dragCfg.axis || elm.dragCfg.axis == 'horizontally' ? nx : elm.dragCfg.oR.x;
		ny = !elm.dragCfg.axis || elm.dragCfg.axis == 'vertically' ? ny : elm.dragCfg.oR.y;
		
		elm.style.left = nx + 'px';
		elm.style.top = ny + 'px';
	},
	
	build : function(o) {
		return this.each(
			function()
			{
				if (this.isSlider == true || !o.accept || !jQuery.iUtil || !jQuery.iDrag || !jQuery.iDrop){
					return;
				}
				toDrag = jQuery(o.accept, this);
				if (toDrag.size() == 0) {
					return;
				}
				params = {
					containment: 'parent',
					si : true,
					onSlide : o.onSlide && o.onSlide.constructor == Function ? o.onSlide : null,
					onChange : o.onChange && o.onChange.constructor == Function ? o.onChange : null,
					handle: this,
					opacity: o.opacity||false
				};
				if (o.fractions && parseInt(o.fractions)) {
					params.fractions = parseInt(o.fractions)||1;
					params.fractions = params.fractions > 0 ? params.fractions : 1;
				}
				if (toDrag.size() == 1)
					toDrag.Draggable(params);
				else {
					jQuery(toDrag.get(0)).Draggable(params);
					params.handle = null;
					toDrag.Draggable(params);
				}
				toDrag.keydown(jQuery.iSlider.dragmoveByKey);
				toDrag.attr('tabindex',jQuery.iSlider.tabindex++);	
				
				this.isSlider = true;
				this.slideCfg = {};
				this.slideCfg.onslide = params.onslide;
				this.slideCfg.fractions = params.fractions;
				this.slideCfg.sliders = toDrag;
				this.slideCfg.restricted = o.restricted ? true : false;
				sliderEl = this;
				sliderEl.slideCfg.sliders.each(
					function(nr)
					{
						this.SliderIteration = nr;
						this.SliderContainer = sliderEl;
					}
				);
				if (o.values && o.values.constructor == Array) {
					for (i = o.values.length -1; i>=0;i--) {
						if (o.values[i].constructor == Array && o.values[i].length == 2) {
							el = this.slideCfg.sliders.get(i);
							if (el.tagName) {
								jQuery.iSlider.dragmoveBy(el, o.values[i]);
							}
						}
					}
				}
			}
		);
	}
};


jQuery.fn.extend(
	{
		Slider : jQuery.iSlider.build,
		SliderSetValues : jQuery.iSlider.set
	}
);