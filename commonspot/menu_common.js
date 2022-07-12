function setPos(mObj, setting, e)
{
  if (HM_IE)
    eventSource = e.srcElement;
  else
    eventSource = e.target;

  obj = eventSource.offsetParent;
    
	cnt = 1;
	offsetXSUM = 0;
	offsetYSUM = 0;
	while (obj.tagName != 'BODY' && obj.tagName != 'HTML' )
	{
		// alert (obj.tagName + ' ' + obj.offsetTop);
		offsetXSUM = offsetXSUM + obj.offsetLeft;
		offsetYSUM = offsetYSUM + obj.offsetTop;
		obj = obj.offsetParent;
		cnt = cnt + 1;
		if (cnt > 500)
			break;
	}
	x = offsetXSUM + eventSource.offsetLeft;
	y = offsetYSUM + eventSource.offsetTop;
	if (setting.indexOf('right') >= 0)
	{
		x = x + eventSource.offsetWidth;
		xdiff = document.body.scrollLeft - (offsetXSUM + eventSource.offsetLeft);
		if (xdiff > 0)
			x = x - xdiff;		// fixes hier menu logic
	}
	else (setting.indexOf('left') >= 0)
	{
		xdiff = document.body.scrollLeft - (offsetXSUM + eventSource.offsetLeft);
		if (xdiff > 0)
			x = x + xdiff;
	}
	if (setting.indexOf('bottom') >= 0)
		y = y + eventSource.offsetHeight;

	if (setting.indexOf('center') >= 0)
	{
		if (setting == 'center' || setting == 'top_center' || setting == 'bottom_center')
			x = Math.round(x + (eventSource.offsetWidth / 2));
		if (setting != 'top_center' && setting != 'bottom_center')
			y = Math.round(y + (eventSource.offsetHeight / 2));
	}
	mObj.tree.MenuLeft = x;
	mObj.tree.MenuTop = y;
}


function getHMenu(menuid)
{
	tempid = menuid.replace("elMenu",HM_MenuIDPrefix);
//	alert("looking for '" + tempid + "'");
	if (HM_NS4)
		var TempMenu = eval('window.'+tempid);
	else if (HM_IE4)
		var TempMenu = document.all(tempid);
	else
		var TempMenu = document.getElementById(tempid);
	return TempMenu;
}

function overrideHandler(menuid, e)
{
	// hide for menus
	thismenu = getHMenu(menuid);
	
	//Override 'visibility:hidden' style property
	document.getElementById(thismenu.id).style.visibility = 'visible';
	
	if(!thismenu)
	{
		//alert('nothing found for menu:' + menuid);
		return;
	}
	HM_CurrentMenu = thismenu;
	if (menuPosCol[menuid] != '')
		setPos(HM_CurrentMenu, menuPosCol[menuid], e);
	else if (menuPosCol[menuid] != '')
	{
		thismenu.tree.MenuLeft = 'mouse_x_position + 20';
		thismenu.tree.MenuTop = 'mouse_y_position + 5';
	}
	HM_f_PopUp(menuid, e);
}

function overrideMouseout(menuid)
{
	HM_f_PopDown(menuid);
}

function setPopToClick(menuid, e)
{
  thismenu = getHMenu(menuid);
	if (thismenu) {  
  	HM_CurrentMenu = thismenu;
  	if (menuPosCol[menuid] != '')
  		setPos(HM_CurrentMenu, menuPosCol[menuid], e);
  	HM_CurrentMenu.tree.ClickStart = true;
	  HM_f_PopUp(menuid, e);
  } else {
    deactivateMenuLink(e);
  }
}

/**
	*
	*/
function setHideForMenusForAllFrames(stylesheetID, targetClass, propertyName, value, win)
{
	var cWin;
	var win = win ? win : window;
	var arrayWindows = [];
	var iFrames = win.document.getElementsByTagName('iframe');
	for (var i =0; i<iFrames.length; i++)
	{
		cWin = iFrames[i].contentWindow;
		try
		{
			if (cWin && cWin.document)
				arrayWindows[i] = cWin;
		}
		catch(e){};		
	}
	
	if (win.document)
		arrayWindows[iFrames.length] = win;
	for (i=0; i<arrayWindows.length; i++)
	{	
		setStyleRuleProperty(stylesheetID, targetClass, propertyName, value, arrayWindows[i]);
	}	
};
	
	/**
	 * commonspot.util.css.setStyleRuleProperty: sets a requested property of a stylesheet class
	 */
function setStyleRuleProperty(stylesheetID, targetClass, propertyName, value, win)
{	
 	// note that propertyNames need to use their js-style names, ie, 'whiteSpace', not 'white-space'
	var cssRules, ruleIndex;
	var doc = win ? win.document : document;
	var ss = doc.getElementById(stylesheetID);
	if(!ss)
		return;
	if(!ss.sheet) // IE
	{
		ss = doc.styleSheets[stylesheetID];
		cssRules = doc.styleSheets[stylesheetID].rules;
	}
	else // Firefox
	{
		cssRules = ss.sheet.cssRules;
	}
	ruleIndex = getCSSRuleIndex(cssRules, '.' + targetClass);
	if(ruleIndex != null)
	{
		cssRules[ruleIndex].style[propertyName] = value;
	}
	return;

	function getCSSRuleIndex(cssRules, selectorText)
	{
		for(var i = 0; i < cssRules.length; i++)
		{
			if(cssRules[i].selectorText == selectorText)
			{
				return i;
			}
		}
		return null;
	}
};