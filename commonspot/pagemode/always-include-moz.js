// always-include-moz.js  Copyright 1998-2005 PaperThin, Inc. All rights reserved.

bName = navigator.appName;
bVer = parseInt(navigator.appVersion);

var bCanRollover=0
if (bName == "Netscape")
{
	if(bVer >= 3)
		bCanRollover=1;
}
else if (bName == "Microsoft Internet Explorer")
{
	if(bVer >= 4)
		bCanRollover=1;
}

function ImageSet(imgID,newTarget)
{
	if (bCanRollover)
	{
		document[imgID].src=newTarget;
		
		// Display picture tag if webP is enabled, else display img tag
		if( document.getElementsByName(imgID + "_webP").length > 0 )
		{
			var imgURLArr = newTarget.split('.');
			document.getElementsByName(imgID + "_webP")[0].srcset = imgURLArr[0] + '.webp';
		}
	}
}

// Error handler to handle the case when the webp image is missing
function onErrorRenderImg(obj)
{
	if (bCanRollover)
		obj.previousElementSibling.srcset = '';
	
	obj.removeAttribute("onerror");
}

function clearStatus()
{
	window.status = "";
}
function setStatbar(statbar)
{
// #22793 - no-op because browsers don't honor the assignment
//	var strStatbar=unescape(statbar);
//	window.status=strStatbar;
}
function onLoadComplete()
{
	if( menus_included == 1 )
		document.onmouseover = document_mouseover;	// defined in menu_ie.js
}
function HandleLink(parentID,link,displaylink)
{
	// links are in one of the following formats:
	// 		cpe_60_0,CP___PAGEID=100
	// 		CPNEWWIN:WindowName^params@CP___
	// 			CPNEWWIN:child^top=110:left=130:ww=140:hh=150:tb=1:loc=1:dir=0:stat=1:mb=1:sb=1:rs=1@CP___PAGEID=3811,Adv-Search-2,1
	// displaylink is the server relative URL or fully qualified URL
		windowname = "";
		windowparams = "";

		// "CPNEWWIN:" & NewWindowName & "^" & params & "@" & linkStruct.LinkURL;
		pos = link.indexOf ("CPNEWWIN:");
		if (pos != -1)
		{
			pos1 = link.indexOf ("^");
			windowname = link.substring (pos+9, pos1);
			pos2 = link.indexOf ("@");
			windowparams = link.substring (pos1 + 1, pos2);
			link = link.substring (pos2 + 1, link.length);
		}

		if( displaylink && displaylink != "" )
		{
			if (windowname == "")
				window.location = displaylink;
			else
			{
				windowparams = FormatWindowParams(windowparams);
				window.open (displaylink, windowname, windowparams);
			}
		}
		else
		{
			targetLink = link;

			if (link.indexOf ("CP___") != -1)
			{

				httpPos = -1;
				commaPos = link.indexOf(",");
				if (commaPos != -1)
				{
					targetUrl = link.substr(commaPos + 1);
					if (targetUrl.indexOf("://") != -1 || targetUrl.indexOf("/") == 0)
					{
							httpPos = commaPos + 1;
					}
				}


				if (httpPos != -1)
				{
					targetLink = link.substr(httpPos);

					commaPos = targetLink.indexOf(",");
					if (commaPos != -1)
						targetLink = targetLink.substr(0, commaPos);
				}
				else
					targetLink = jsDlgLoader + "?CSRF_Token=" + top.commonspot.util.cookie.readCookie('CSRFTOKEN') + "&csModule=utilities/handle-link&thelink=" + link;

				if (windowname == "")
					window.location = targetLink;
				else
				{
					windowparams = FormatWindowParams(windowparams);
					window.open (targetLink, windowname, windowparams);
				}
			}
			else
			{
				//commaPos = link.indexOf(",");
				//if (commaPos != -1)
				//link = link.substr(0, commaPos);

				if (windowname == "")
					window.location = link;
				else
				{
					windowparams = FormatWindowParams(windowparams);
					window.open (link, windowname, windowparams);
				}
			}
		}
}
function doWindowOpen(href,name,params)
{
	if (params != '')
	window.open (href, name, params);
	else
		window.open (href, name);
}

// 	CPNEWWIN:child^top=110:left=130:ww=140:hh=150:tb=1:loc=1:dir=0:stat=1:mb=1:sb=1:rs=1@CP___PAGEID=3811,Adv-Search-2,1
function FormatWindowParams(windowparams)
{
	if( windowparams.indexOf(":loc=") != -1 || windowparams.indexOf(":ww=") != -1 || windowparams.indexOf(":hh=") != -1 ||
	    windowparams.indexOf(":left=") != -1 || windowparams.indexOf(":top=") != -1 )
	{
		windowparams = substringReplace(windowparams,':left=',',left=');
		windowparams = substringReplace(windowparams,'left=','left=');
		windowparams = substringReplace(windowparams,':ww=',',width=');
		windowparams = substringReplace(windowparams,'ww=','width=');
		windowparams = substringReplace(windowparams,':hh=',',height=');
		windowparams = substringReplace(windowparams,'hh=','height=');
		windowparams = substringReplace(windowparams,':loc=',',location=');
		windowparams = substringReplace(windowparams,'loc=','location=');
		windowparams = substringReplace(windowparams,':dir=',',directories=');
		windowparams = substringReplace(windowparams,'dir=','directories=');
		windowparams = substringReplace(windowparams,':tb=',',toolbar=');
		windowparams = substringReplace(windowparams,'tb=','toolbar=');
		windowparams = substringReplace(windowparams,':stat=',',status=');
		windowparams = substringReplace(windowparams,':mb=',',menubar=');
		windowparams = substringReplace(windowparams,':sb=',',scrollbars=');
		windowparams = substringReplace(windowparams,':rs=',',resizable=');
	}
	return windowparams;
}
