/*!
 * VeataoSlide v0.0.1
 * 轻松解决响应式网站图片切换大部分特效展示问题
 * 详尽信息请看官网：http://www.ry361.com/
 * Copyright 2011-2020, 破碎梦镜
 * 请尊重原创，保留头部版权
 * 在保留版权的前提下可应用于个人或商业用途
 */

(function($){
        $.fn.touchswipe1=function(opt){
           var defaults = {
                slidebox:"#slidebox",
                slide:"#slide",
                slidehoverli:'slide-hoverli',
                prev:".prev", //上一页
                next:".next", //下一页
                pagecontex:true,  //是否显示小图标*/
                autoplay:false, //是否自动切换*/
                autotime:3000,   //自动切换的时间*/
                pc_handtime:2000,   //PC手动切换的时间*/
                ipad_handtime:1000,   //IPAd手动切换的时间*/
                mob_handtime:500,   //mobile手动切换的时间*/
                pcnumber:1,  //pc显示个数*/
                ipadnumber:1,  //ipad显示个数*/
                mobnumber:1, //手机显示个数
                pc_row:1, //pc显示行数
                ipad_row:1, //ipad显示行数
                mob_row:1, //手机显示行数
                content_ys:false,
                content_box:".content-box",
                lazyload:false
            };

            //参数初始化
            var opts = $.extend(defaults,opt);
            var slidebox=opts.slidebox;
            var slide=opts.slide;
            var slidehoverli = opts.slidehoverli;
            var prev = opts.prev;
            var next = opts.next;
            var pagecontex = opts.pagecontex;
            var autoplay = opts.autoplay;
            var autotime = opts.autotime;
            var pc_handtime = opts.pc_handtime;
            var ipad_handtime = opts.ipad_handtime;
            var mob_handtime = opts.mob_handtime;
            var pcnumber =opts.pcnumber;
            var ipadnumber =opts.ipadnumber;
            var mobnumber = opts.mobnumber;
            var pc_row = opts.pc_row;
            var ipad_row = opts.ipad_row;
            var mob_row = opts.mob_row;
            var content_ys = opts.content_ys;
            var content_box = opts.content_box;
            var lazyload = opts.lazyload;
            var picTimer=0;

            window_resize();

            $(window).resize(function(){
                window_resize();
            });

            function slidescroll(number,auto_time,hand_time,display_rownum){
                var nowpage = 0;
                var len = $(slidebox+" "+ slide).find("li").length;
                var length = $(slidebox+" "+ slide + " li:first .page").length;
                $(slide).css({"left":0});

                //本例为左右滚动，即
                if(length<number)
                {
                    $(slide).css({"width":len*100+"%"}).find("li").css({"width":100/len+"%"}).find(".page").css({"width":100/(number/display_rownum)+"%"});
                    if(content_ys)
                    {
                            var con_len = $(content_box+" ul li").length;
                            $(content_box+" ul").css({"width":con_len*100+"%"}).find("li").css({"width":100/con_len+"%"});
                    }
                }
                else
                {
                    $(slide).css({"width":len*100+"%"}).find("li").css({"width":100/len+"%"}).find(".page").css({"width":100/(length/display_rownum)+"%"});
                    if(content_ys)
                    {
                            var con_len = $(content_box+" ul li").length;
                            $(content_box+" ul").css({"width":con_len*100+"%"}).find("li").css({"width":100/con_len+"%"});
                    }
                }
                if(pagecontex)
                {
                    var btn = "<div class='slidehoverli' id='"+ slidehoverli +"'>";
                    for(var i=0; i < len; i++) {
                        var ii = i+1;
                        if(i==0)
                        {
                           btn += "<span class='on'>"+ii+"</span>";
                        }
                        else
                        {
                           btn += "<span>"+ii+"</span>";
                        }
                    }
                    btn += "</div>";
                    $("#"+slidehoverli).remove();
                    $(slidebox).append(btn);
                }

                //为小按钮添加鼠标滑入事件，以显示相应的内容
                $("#"+ slidehoverli +" span").mouseenter(function() {
                    nowpage = $("#"+slidehoverli +" span").index(this);
                    showPics(nowpage,content_ys);
                }).eq(0).trigger("mouseenter");

                //上一页按钮
                $(prev).click(function() {
                    nowpage -= 1;
                    if(nowpage == -1) {nowpage = len - 1;}
                    showPics(nowpage,content_ys);
                });

                //下一页按钮
                $(next).click(function() {
                    nowpage += 1;
                    if(nowpage == len) {nowpage = 0;}
                    showPics(nowpage,content_ys);
                });


                //鼠标滑上焦点图时停止自动播放，滑出时开始自动播放
                if(autoplay)
                {
                    $(slidebox).hover(function() {
                        clearInterval(picTimer);
                    },function() {
                        clearInterval(picTimer);
                        picTimer = setInterval(function() {
                            showPics(nowpage,content_ys);
                            nowpage++;
                            if(nowpage == len) {nowpage = 0;}
                        },auto_time); //此4000代表自动播放的间隔，单位：毫秒
                    }).trigger("mouseleave");
                }

                //给class为slidebox的容器加上触滑监听事件
               /* $(slidebox).swipe({
                    swipeLeft:function(){
                        nowpage += 1;
                        if(nowpage == len) {nowpage = 0;}
                        showPics(nowpage,content_ys);
                    },
                    swipeRight:function() {
                        nowpage -= 1;
                        if(nowpage == -1) { nowpage = len-1;}
                        showPics(nowpage,content_ys);
                    }
                });*/


                function showPics(nowpage,a){
                    $(slide ).stop(true,false).animate({"left": nowpage * -100 + "%"},hand_time);//根据当前记数器滚动到相应的高度
                    $("#"+ slidehoverli +" span").stop(true,false).removeClass("on").eq(nowpage).addClass("on"); //为当前的按钮切换到选中的效果
                    if(a)
                    {
                        $(content_box+" ul").stop(true,false).animate({"left": nowpage * -100 + "%"},hand_time);
                    }
                }
            }

            function window_resize()
            {
                //alert($("body").outerWidth());
                if($("body").outerWidth()>992 )
                {
                   deatalbit(pcnumber,autotime,pc_handtime,pc_row);
                }
                else if($("body").outerWidth()<993 && $("body").outerWidth()>580)
                {
                   deatalbit(ipadnumber,autotime,ipad_handtime,ipad_row);
                }
                else if($("body").outerWidth() <= 580)
                {
                   deatalbit(mobnumber,autotime,mob_handtime,mob_row);
                }

            }

            function deatalbit(num,a,b,c)
            {
                    var n = $(slidebox).find(slide +' .page').length;
                    var contpage="";
                    /*if(lazyload)
                    {
                        $(slidebox + " .page img").each(function(){
                            if(typeof($(this).attr("data-original"))=="undefined")
                            {
                                var that = $(this);
                                var re=/(.+?.(jpg|bmp|png|jepg|gif))/i;
                                href = that.attr("src");
                                if (re.test(href)) {
                                    that.attr("data-original",href);//转移原图片中的真链接到data-original
                                    href =href.replace(re, "http://abc.prykweb.com/images/public/grey.gif");//定义未加载前的图片
                                    that.attr("src",href);
                                }
                            }
                        });

                    }*/

                    if(n < num)
                    {

                        contpage += "<li>";
                        for(var j=0; j<n; j++)
                        {
                            contpage +="<div class='page'>"+ $(slidebox).find(slide +' .page').eq(j).html() +"</div>";
                        }
                        contpage += "</li>";

                    }
                    else
                    {
                        if(n%num==0)
                        {

                            for(var i=0; i< n/num; i++)
                            {
                                contpage += "<li>";
                                for(var j=0; j<num; j++)
                                {
                                    contpage +="<div class='page'>"+ $(slidebox).find(slide +' .page').eq(i*num+j).html() +"</div>";
                                }
                                contpage += "</li>";
                            }
                        }
                       else
                        {
                            for(var i=0; i< Math.ceil(n/num); i++)
                            {
                                if(i == (Math.ceil(n/num)-1))
                                {

                                   contpage += "<li>";
                                   for(var j=0; j < n-(Math.floor(n/num)*num); j++)
                                    {
                                        contpage += "<div class='page'>"+ $(slidebox).find(slide +' .page').eq(i*num + j).html() +"</div>";
                                    }
                                   contpage += "</li>";
                                }
                                else
                                {
                                    contpage += "<li>";
                                    for(var j=0; j<num; j++)
                                    {
                                        contpage += "<div class='page'>"+ $(slidebox).find(slide +' .page').eq(i*num + j).html() +"</div>";
                                    }
                                    contpage += "</li>";
                                }
                            }
                        }
                    }
                   $(slidebox).find(slide +" ul li").remove();
                   $(slidebox).find(slide +" ul").append(contpage);
                   slidescroll(num,a,b,c);
            }
  }
})(jQuery);
