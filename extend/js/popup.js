$.ajaxSetup({
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    }
});

//
var dedup = makeDedupObj();

/*Array.prototype.unique=function(){
    var arr=[];
    var listId=[];
    $('.shopList li').each(function(i){
        listId.push($(this).attr('data-id'));
    })
    for(var i=0;i<this.length;i++){
        //在n数组中找，没有则push添加
        if(listId.indexOf(this[i]._id) !=-1) arr.push(i);
    }
    for (var i = arr.length - 1; i >= 0; i--) {
        this.splice(i,1);
    }
    return this;
}*/

/*商品模板*/
var listTemplet = '<li class="clearfix" ><div class="shop-img"><a href="#{taobaoItemUrl}" target="_blank"><img src="#{imgUrl}"></a></div><div class="shop-detail"><p class="shop-title"><a href="#{taobaoItemUrl}" target="_blank" title="#{name}">#{name}</a><span class="originalDatetime">#{originalDatetime}</span></p><p class="shop-price">¥<span>#{price}</span><button data-descr="deprecated" data-time="#{createdAt}" data-imgUrl="#{imgUrl}" data-url="#{taobaoItemUrl}" class="fr addToPic">加入图集</button><a href="#{originalCollectionUrl}" target="_blank" class="origin fr">源</a></p></div></li>';

/*底部导航点击*/
$(".nav-item").click(function() {
    $(".equal-header .page-name").text($(this).find("p").text());
    if (!$(this).hasClass('on')) {
        localStorage.setItem("navIndex", $(this).index());
        $(this).addClass("on").siblings().removeClass("on");
        if ($(this).hasClass('home-item')) {
            $('.home').css('transform', 'translateX(0)');
            $('.user').css('transform', 'translateX(320px)');
        } else {
            $('.user').css('transform', 'translateX(0)');
            $('.home').css('transform', 'translateX(320px)');
        }
    }
})


/*分类点击*/
$(".classify-nav").on("click", "li", function() {
    //    if (!$(this).hasClass('on')) {
    $('.search-input').val("");
    localStorage.setItem("isSearch", false);
    localStorage.setItem("classifyName", $(this).text());
    $(this).addClass("on").siblings().removeClass("on");
    listReload($(this).index(), $(this).text());
    //   } 
})

/*刷新*/
$('header').dblclick(function() {
    listReload($(".classify-nav .on").index(), $(".classify-nav .on").text());
})
$('.load').click(function() {
    $('header').dblclick();
})

/*忘记密码的展开*/
$(".lose-title").click(function() {
    $(".lose-content").slideToggle();
    $(".success").hide();
    $(".lose-content input").val("");
})

/*新密码校验*/
$(".confirm-pwd").blur(function() {
    if ($(this).val() != $('.pwd').val() || $(this).val() == "") {
        $('.error').text('两次输入密码不一致').show();
    } else {
        $('.error').hide();
    }
})
$(".pwd").blur(function() {
    if ($('.confirm-pwd').val() != "" && $(this).val() != $('.confirm-pwd').val()) {
        $('.error').text('两次输入密码不一致').show();
    } else {
        $('.error').hide();
    }
})

$(".changeBtn").click(function() {
    var oldPwd = $(".old-pwd").val();
    var newPwd = $(".pwd").val();
    var confirmPwd = $(".confirm-pwd").val();
    if (newPwd === confirmPwd) {
        $.post(host + "/ds/user/new-password", { newPwd: newPwd, oldPwd: oldPwd })
            .then(function() {
                $(".success").text("修改成功").show();
                $(".lose-content input").val("");
            }, function(err) {
                $(".error").text("修改失败.").show();
            })
    }
})

var commoditiesURL = "http://tm.jymao.com/ds/g/Commodity?sortField=-createdAt&select=-tags -taobaoUrl -descr -originalDescr&condition[taobaoItemUrl][$ne]=working&condition[taobaoItemUrl][$exists]=true";
var categoryPara = "condition[categories]="

/*请求页面分类和商品列表数据*/
doGet("http://tm.jymao.com/ds/g/Category", "<li data-pinyin=#{pinyin}>#{name}</li>", $(".classify-nav"), function() {
        var classifyName = localStorage.getItem("classifyName") || "全部";
        var listNum = localStorage.getItem("listNum") || 15;
        var firstShopTime = localStorage.getItem("firstShopTime");
        var isSearch = localStorage.getItem("isSearch");
        var inputVal = localStorage.getItem("inputVal");
        var url = '';

        if (isNaN(Date.parse(firstShopTime))) {
            firstShopTime = (new Date()).toUTCString();
        }
        if (isSearch == "true") {
            url = commoditiesURL + "&condition[tags]=" + inputVal;
            if (classifyName != "全部") url += "&" + categoryPara + classifyName;
            $('.search-input').val(inputVal);
            $(".classify-nav li:contains(" + classifyName + ")").addClass('on').siblings().removeClass('on');
        } else {
            if (classifyName == "全部") {
                url = commoditiesURL + "&limit=" + listNum;
            } else {
                url = commoditiesURL + "&" + categoryPara + classifyName + "&limit=" + listNum;
            }
            if (firstShopTime != null && firstShopTime != "undefined") url += '&olderThan=' + firstShopTime;
            $(".classify-nav li:contains(" + classifyName + ")").addClass('on').siblings().removeClass('on');
        }
        console.log(url);
        $(".shopList").html('');
        dedup.reset();

        doGet(url, listTemplet, $(".shopList"), function() {
            localStorage.setItem("firstShopTime", $(".shopList li").first().find('button').attr('data-time'));
            var scrollTop = localStorage.getItem("scrollTop") || 0;
            $(".shopList").scrollTop(scrollTop);
        });
    })
    /*doGet("http://tm.jymao.com/ds/jobs/commodities",listTemplet,$(".shopList"));*/

/*加入图集点击处理*/
$(".shopList").on('click', 'button', function() {
    var taobaoUrl = $(this).attr('data-url');
    var description = "随机描述生成中,请稍等..."; //$(this).attr('data-descr');
    var name = $(this).parent().siblings('.shop-title').find("a").attr("title");
    var imgUrl = $(this).attr('data-imgUrl');
    navText = $('.classify-nav .on').text();
    var data = { "taobaoUrl": taobaoUrl, "name": name, "description": description, "imgUrl": imgUrl, "navText": navText };

    chrome.tabs.getSelected(null, function(tab) {
        if (/http(s{0,1})\:\/\/kolplatform\.jinritemai\.com\/index\/article\/addArticle.*/.test(tab.url)) {
            var bg = chrome.extension.getBackgroundPage();
            bg.get(data);
        } else {
            $('.message').text("请进入添加图集页面");
            $('.link').html('<a target="_blank" href="https://kolplatform.jinritemai.com/index/article/addArticle?content_type=2&sig=1487080371312.262">确定</a>');
            $('.message-fix').fadeIn();
        }
    });

})

/*弹出框关闭*/
$('.modal span').click(function(event) {
    event.stopPropagation();
    $('.message-fix').fadeOut();
})
$(document).click(function() {
    $('.modal span').last().click();
})

/*滚动加载检测*/
var isOk = true;
$(".shopList").scroll(function() {
    setTimeout(function() {
        localStorage.setItem("scrollTop", $(".shopList").scrollTop());


        if (checkSlide() && isOk) {
            var isSearch = localStorage.getItem("isSearch");
            $(".reload-fix").show();
            isOk = false;
            var url = "";
            var lastShopTime = $(".shopList li").last().find('button').attr('data-time');

            if (isSearch != 'true') {
                if ($('.classify-nav .on').index() == 0) {
                    url = commoditiesURL + "&olderThan=" + lastShopTime + "&limit=15";
                } else {
                    url = commoditiesURL + "&" + categoryPara + $('.classify-nav .on').text() + "&limit=15&olderThan=" + lastShopTime;
                }
            } else {
                url = commoditiesURL + "&condition[tags]=" + $('.search-input').val() + "&olderThan=" + lastShopTime + "&limit=15";
                if ($('.classify-nav .on').index() != 0) {
                    url += "&" + categoryPara + $('.classify-nav .on').text();
                }
            }

            $.get(url, function(data) {
                /*console.log((data.unique()));*/
                $(".reload-fix").hide();
                var newStr = "";
                for (var i = 1; i < data.length; i++) {
                    if (!data[i].taobaoItemUrl) continue;
                    if (data[i].taobaoItemUrl.indexOf(".jd.com") != -1 || data[i].taobaoItemUrl.indexOf("ai.taobao.com") != -1) continue;

                    var commodityId = data[i]._id;
                    if (dedup.hasOne(commodityId)) continue
                    else dedup.addOne(commodityId)

                    var str = listTemplet;
                    newStr += repeatStr(str, data[i]);
                }
                $(".shopList").append(newStr);
                localStorage.setItem("listNum", $(".shopList>li").length);
                isOk = true;

            })
        }
    }, 300)

})

/*本地存储读取*/
if (localStorage.getItem("navIndex")) {
    $(".nav-item").eq(localStorage.getItem("navIndex")).click();
}

/*是否加载*/
function checkSlide() {
    var lastShopTop = $(".shopList li").last().get(0).offsetTop + ($(".shopList li").last().outerHeight()) / 2;
    var winH = $(".shopList").scrollTop() + $(".shopList").outerHeight();
    return (winH > lastShopTop) ? true : false;
}


/*get请求封装*/
function doGet(url, tpl, ele, fn) {
    $(".reload-fix").show();
    $.get(url, function(data) {
        $(".reload-fix").hide();
        var newStr = "";
        for (var i = 0; i < data.length; i++) {
            if (!data[i].words) {
                if (!data[i].taobaoItemUrl) continue;
                if (data[i].taobaoItemUrl.indexOf(".jd.com") != -1 || data[i].taobaoItemUrl.indexOf("ai.taobao.com") != -1) continue;

                var commodityId = data[i]._id;
                if (dedup.hasOne(commodityId)) continue
                else dedup.addOne(commodityId)
            }
            newStr += repeatStr(tpl, data[i]);
        }
        ele.append(newStr);

        fn && fn();
    })
}


/*模板替换*/
function repeatStr(str, data) {
    var s = str.replace(/#\{(.*?)\}/ig, function(match, value) {
        return data[value] || "";
    })
    return s;
}

/*shopList刷新*/
function listReload(index, name) {
    $(".shopList").html('');
    dedup.reset();

    var url = "";
    if (index == 0) {
        url = commoditiesURL + "&limit=15";
    } else {
        url = commoditiesURL + "&" + categoryPara + name + "&limit=15"
    }
    doGet(url, listTemplet, $('.shopList'), function() {
        localStorage.setItem('firstShopTime', $(".shopList li").first().find('button').attr('data-time'));
        localStorage.setItem('listNum', 15);
    });
}


/*监听浏览器返回数据*/
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (!message) {
        $('.message').text("请关闭当前添加宝贝窗口");
        $('.link').html('确定');
        $('.message-fix').fadeIn();
    }
})

/*获取url
chrome.tabs.getSelected(null, function(tab) { console.log(tab.url); });

页面通信background，content，popup
C->P 或者 C->B 或者 b->p
chrome.runtime.sendMessage({'名称':'传送数据'})
P->C  B->C
chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
           chrome.tabs.sendMessage(tabs[0].id, {'名称':'值'}, function(response) {
                //向 content_script 发送消息
           });  
       })
接收消息都是 
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
alert(JSON.stringify(message)) //这里获取到消息值与名称
})*/

//login
var host = "http://tm.jymao.com"
$.get(host + "/ds/has-login")
    .then(function(res) {
        var hasLogin = res.hasLogin;
        if (hasLogin) {
            $(".my-name").text(res.name)
            $(".page-item").show();
            $(".login").hide();
            //$(".nav-item.home-item").click();

        } else {
            $(".page-item").hide();
            $(".login").show()
        }
    })

$(".logoutBtn").click(function() {
    $.post(host + "/ds/logout")
        .then(function(res) {
            $(".page-item").hide();
            $(".login").show();

        })
})

$(".login .password input").keyup(function() {
    $(".password-error").text("").hide();
})

$(".loginBtn").click(function() {
    var name = $(".login .user-name input").val();
    var password = $(".login .password input").val();
    $.post("http://tm.jymao.com/ds/login", {
        name: name,
        password: password
    }).then(function(res) {
        if (res.msg === "login ok") {
            $(".my-name").text(res.user && res.user.name)
            $(".page-item").show();
            $(".login").hide();
            $(".nav-item.home-item").click();
        }
    }, function(err) {
        var res = JSON.parse(err.responseText);
        if (res.msg === "mismatch") {
            $(".password-error").text("密码错误").show();
        } else {
            $(".password-error").text("登录失败").show();
        }
    })
    return false;
})

/*search*/
$('.search-input').keypress(function(e) {
    if (e.which == 13) {
        $('.fa-search').click();
    }
})


$('.fa-search').click(function() {
    var keyword = $('.search-input').val();
    keyword = keyword.replace(" ", "");
    if (!keyword) {
        $(".classify-nav li.on").click();
        return;
    }
    $(".reload-fix").show();

    var url = commoditiesURL + "&limit=15&condition[tags]=" + keyword;
    if ($('.classify-nav .on').index() != 0) {
        url += "&" + categoryPara + $('.classify-nav .on').text()
    }

    $.get(url, function(data) {
        $(".reload-fix").hide();
        var newStr = "";
        for (var i = 0; i < data.length; i++) {
            if (!data[i].words) {
                if (!data[i].taobaoItemUrl) continue;
                if (data[i].taobaoItemUrl.indexOf(".jd.com") != -1 || data[i].taobaoItemUrl.indexOf("ai.taobao.com") != -1) continue;
            }
            newStr += repeatStr(listTemplet, data[i]);
        }
        $('.shopList').html("");
        $('.shopList').scrollTop(0);
        $('.shopList').append(newStr);

        localStorage.setItem('firstShopTime', $(".shopList li").first().find('button').attr('data-time'));
        localStorage.setItem('listNum', 15);
        localStorage.setItem("scrollTop", 0);

        localStorage.setItem("inputVal", keyword);
        localStorage.setItem("isSearch", true);
    })
})


function makeDedupObj() {
    var ids = {};

    return {
        reset: function() {
            ids = {};
        },
        hasOne: function(id) {
            return !!ids[id]
        },
        addOne: function(id) {
            ids[id] = true;
        }
    }
}


//filter category
$(".classify-filter").keyup(function(evt) {
    var keyword = $(".classify-filter").val();

    var $items = $(".classify-nav li");

    if (keyword) {
        keyword = keyword.toUpperCase();
        $items.each(function(idx, item) {
            var text = $(item).text();
            if (~text.indexOf(keyword)) {
                $(item).removeClass("hidden")
            } else {
                //     $(item).addClass("hidden")
                var pinyin = $(item).attr("data-pinyin");
                if (pinyin) {
                    if (~pinyin.indexOf(keyword)) {
                        $(item).removeClass("hidden")
                    } else {
                        $(item).addClass("hidden")
                    }
                }
            }

        })
    } else {
        $items.removeClass("hidden")
    }
})