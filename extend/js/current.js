var _commodityAdder;
chrome.runtime.onMessage.addListener(function(request, sender, response) {
    if (!request.hasOwnProperty("text")) {
        var taobaoUrl = request.taobaoUrl;
        var name = request.name;
        var description = "";
        var imgUrl = request.imgUrl;
        var isOurCommodity = true;

        var openUrl = taobaoUrl;

        _commodityAdder = new CommodityAdder({
            name: name,
            description: description,
            imgUrl: imgUrl,
            isOurCommodity: true,
            openUrl: openUrl
        })
        _commodityAdder.domodal();
        // setTimeout(function() {
        _commodityAdder.deco();
        //    }, 500)
        /*if($("input[data-fv-field='name']").length==0){
        	domodal();
        }else{
        	response(false);
        }*/
    } else {
        $("textarea[data-fv-field='description']").val(request.text);
        _commodityAdder.info.description = request.text;
    }
})


function CommodityAdder(info) {
    this.info = info || {};
}

CommodityAdder.prototype.deco = function() {
    var $descr = $(".commodity-image-upload-container textarea[name='description']");
    var self = this;
    if ($descr.length === 0) {
        setTimeout(function() {
            self.deco();
        }, 300);
    }
    if (!$descr.val() || $descr.val() !== this.info.description) {
        $descr.val(this.info.description || "请稍候...正在生成描述")
    }

    if ($('.reload').length == 0) {
        var formGroup = $(".commodity-image-upload-container .form-group").eq(2);
        formGroup.css('position', 'relative');
        formGroup.append('<button class="btn btn-danger reload" style="outline:none;position:absolute;right:0;top:0;padding:0 10px">重新生成</button>')
        $(".reload").click(function() {
            chrome.runtime.sendMessage($("input[data-fv-field='name']").val());
        })

        if (!this.info.description) {
            $(".reload").click();
        }
    }

    if ($('.insert-pic').length == 0) {
        $('.modal-footer').prepend('<button class="btn btn-danger insert-pic pull-left">插入图片</button>');
        $('.insert-pic').click(function() {
            var text = $("input[data-fv-field='name']").val();
            var updateSrc = $('.commodity-image-upload-container img').attr('src');
            $('.add-img-manual-button').click();
            var updateTimer = setInterval(function() {
                if ($('.commodity-image-upload-container').length == 1) {
                    clearInterval(updateTimer);
                    $('.commodity-image-upload-container img').attr("src", updateSrc);
                    $('.commodity-image-upload-container .col-md-7 .form-group').addClass("has-success").find("input").val(updateSrc).siblings("span").find("small").attr("data-fv-result", "VALID")
                    $('.commodity-image-upload-container textarea').val(text);
                    $("button[data-bb-handler='success']").click();
                    $('.add-baby-button').click();
                    $('iframe').get(0).contentWindow.document.getElementsByClassName('addLinkCommodityBtn')[0].click();

                    self.domodal();
                    setTimeout(function() {
                        self.deco();
                    }, 500);
                }
            }, 300)
        })
    }
}

CommodityAdder.prototype.domodal = function() {
    if ($('.add-commodity-auto-button').length == 0) {
        $("button.add-baby-button").click();
        $('iframe').get(0).contentWindow.document.getElementsByClassName('addLinkCommodityBtn')[0].click();
    }
    $(".add-commodity-auto-button").parent().parent().find("input").val(this.info.openUrl);
    $(".add-commodity-auto-button").click();

    var self = this;
    var timer = setInterval(function() {
            //var nameInput = $("input[data-fv-field='price']");
            //if (nameInput.val() != undefined && nameInput.val() != oldVal) {
            var nameInput = $("input[data-fv-field='name']");

            if (nameInput.length === 1 && self.info.name) {
                clearInterval(timer);
                if (self.info.isOurCommodity && nameInput.val() != "" && (nameInput.val().length > 20 || nameInput.val().length < 6)) {
                    nameInput.val(self.info.name);
                }
                if (self.info.isOurCommodity) {
                    var imgItem = $(".commodity-image-list-container .thumb-container img");
                    if (imgItem.length >= 5) {
                        imgItem.last().attr('src', self.info.imgUrl);
                        imgItem.last().siblings().attr('value', self.info.imgUrl);
                    } else {
                        var tpl = '<div class="thumb-container"><label><input type="radio" name="img_select" value="' + self.info.imgUrl + '" checked=""><img src="' + self.info.imgUrl + '"></label></div>';
                        $(".commodity-image-list-container .col-md-12").append(tpl);
                    }
                    $(".commodity-image-list-container .thumb-container label").last().click();
                }
            }
            //	setTimeout(function() {
            //		console.log('reload');
            //$(".reload").click();
            //	}, 200)			
        },
        500)
}



setInterval(function() {
    var iframe = $($('iframe').get(0).contentWindow.document);

    iframe.find('.commodity-container .selectCommodityBtn').unbind("click");
    iframe.find('.commodity-container .selectCommodityBtn').click(function() {
        var openUrl = $(this).parent().attr('_href');
        _commodityAdder = new CommodityAdder({ openUrl: openUrl, isOurCommodity: false });
        _commodityAdder.deco();
    })
}, 300)