$(document).ready(function(){
	
	$("#menu").menu()
	$("#sidebar .SortList").sidebarmenu()
})
//侧栏菜单
$.fn.sidebarmenu=function(){
	var self=$(this);
	if (self.length==0) return false;
	
	self.find("ol").prev().append("<span></span>")
	self.prev(".btn_Sort").bind("click",function(){
		if ($(this).is(".btn_Sort_open"))
		{
				$(this).removeClass("btn_Sort_open")
				self.slideUp();
		}
		else
		{
				$(this).addClass("btn_Sort_open")
				self.slideDown();
			
		}
	
		
	})
	
	
	
	self.find(">li.change").find("ol").show();
	self.find(">li>a").bind("click",function(){
		var obj=$(this).parent()
		if (obj.find("ol").length==0) { return ;}
		if (obj.is(".change"))
		{
			obj.removeClass("change")	
			obj.find("ol").slideUp()
		}
		else
		{
			obj.addClass("change")	
			obj.find("ol").slideDown()
		}
		return false;
	})
}

//主菜单
$.fn.menu=function(){
	var self=$(this);
	if (self.length==0) return false;
	self.find("ol").prev().addClass("btn_openmenu")
	self.find("ol").append("<span class='arrow'></span>")
	$(".btn_openmenu").parent()
	.bind("mouseenter",function(){
		if ($(window).width()<760){return false;}
		var ol=$(this).find("ol")
		if (ol.is(":visible"))
		{
			$(this).removeClass("openthis")
			ol.slideUp();	
		}
		else
		{
			$(this).addClass("openthis")
			ol.slideDown();	
			
		}
		
	})
	.bind("mouseleave",function(){
		if ($(window).width()<760){return false;}
		var ol=$(this).find("ol")
		if (ol.is(":visible"))
		{
			$(this).removeClass("openthis")
			ol.slideUp();	
		}
		else
		{
			$(this).addClass("openthis")
			ol.slideDown();	
			
		}
		
		
	})
	
	
	
	$(".btn_openmenu").bind("click",function(){
		if ($(window).width()>760){return false;}
		var ol=$(this).next("ol")
		if (ol.is(":visible"))
		{
			$(this).removeClass("openthis")
			ol.slideUp();	
		}
		else
		{
			$(this).addClass("openthis")
			ol.slideDown();	
			
		}
		
	})
	
	
	
	$(".btn_menu").bind("click",function(){
		
		if (self.is(":visible"))
		{
			
			$("#menu").slideUp()
		
		}
		else
		{
			$("#menu").slideDown()
			if ($(".btn_Sort_open").length>0)
			{
				$(".btn_Sort_open").trigger("click");
			}
		
		}
		
		
	})	
	
	
	
}