function modal(){
    this.oldPrice;
    this.oldName;
    this.isOurCommodity;
    this.openUrl;
    this.iframe=$($('iframe').get(0).contentWindow.document);
}
modal.prototype={
    insertUrl:function(){
        var self=this;
        if ($('.add-commodity-auto-button').length == 0) {
            $("button.add-baby-button").click();
            $('iframe').get(0).contentWindow.document.getElementsByClassName('addLinkCommodityBtn')[0].click();
        }
        $(".add-commodity-auto-button").parent().parent().find("input").val(self.openUrl);
        $(".add-commodity-auto-button").click();
    },
    addBtn:function(){
        var self=this;
        if ($('.reload').length == 0) {
            /*var formGroup = $(".commodity-image-upload-container .form-group").eq(2);
            formGroup.css('position', 'relative');
            formGroup.append('<button class="btn btn-danger reload" style="outline:none;position:absolute;right:0;top:0;padding:0 10px">重新生成</button>')*/
            $('.togglePriceDirectionBtn').parents(".modal-dialog").prepend('<button class="btn btn-danger reload" style="outline:none;position:absolute;right:46px;bottom:272px;z-index:99;padding:0 10px">重新生成</button>');
            $(".reload").click(function(event) {
                event.stopPropagation();
                chrome.runtime.sendMessage($("input[data-fv-field='name']").val());
            })
        }

        if ($('.insert-pic').length == 0) {
            $('.togglePriceDirectionBtn').parents(".modal").find('.modal-footer').prepend('<button class="btn btn-danger insert-pic pull-left">插入图片</button>');
            $('.insert-pic').click(function() {
                var name = $("input[data-fv-field='name']").val();
                var updateSrc = $('.commodity-image-upload-container img').attr('src');
                $('.add-img-manual-button').click();
                var updateTimer = setInterval(function() {
                    if ($('.commodity-image-upload-container').length == 1) {
                        clearInterval(updateTimer);
                        $('.commodity-image-upload-container img').attr("src", updateSrc);
                        $('.commodity-image-upload-container .col-md-7 .form-group').addClass("has-success").find("input").val(updateSrc).siblings("span").find("small").attr("data-fv-result", "VALID")
                        $('.commodity-image-upload-container textarea').val(name);
                        $("button[data-bb-handler='success']").click();
                        self.showModal(self.info,true);
                    }
                }, 300)
            })
        }
    },
    dealOur:function(){
        var self=this;
        var name = $("input[data-fv-field='name']");
        if (name.val() != "" && (name.val().length > 20 || name.val().length < 6)) {
            name.val(self.info.name);
        }

        $("textarea[name='description']").val("请稍候...正在生成描述");

        var imgItem = $(".commodity-image-list-container .thumb-container img");
        if(imgItem.length>=5){
            imgItem.last().attr('src',self.info.imgUrl);
            imgItem.last().siblings().attr('value',self.info.imgUrl);
        }else{
            var tpl='<div class="thumb-container"><label><input type="radio" name="img_select" value="'+self.info.imgUrl+'" checked=""><img src="'+self.info.imgUrl+'"></label></div>';
            $(".commodity-image-list-container .col-md-12").append(tpl);
        }
        $(".commodity-image-list-container .thumb-container label").last().click();
    },
    showModal:function(info,insert){
        var self=this;
        this.info=info || {};
        var insert=insert || false;

        if (!insert && self.isOurCommodity && this.info.name == this.oldName) return;
        this.oldName = this.info.name;

        this.insertUrl();

        var timer = setInterval(function() {
            var price = $("input[data-fv-field='price']");
            if (insert || price.val() != undefined && price.val() != self.oldPrice && price.val()!="") {
                clearInterval(timer);
                self.oldPrice = price.val();                

                if (self.isOurCommodity) {
                    self.dealOur();
                }
                
                setTimeout(function() {
                    $(".reload").click();
                    //chrome.runtime.sendMessage($("input[data-fv-field='name']").val());
                }, 200)
                
            }
        }, 300)
    }
}

var our=new modal();
var iframe=$($('iframe').get(0).contentWindow.document);
setInterval(function() {
    /*if ($(".commodity-image-list-container .thumb-container label img").css("height") != '96.59px') {
        $(".commodity-image-list-container .thumb-container label img").css({"height":'96.59px'})
    }*/
    iframe.find('.commodity-container .selectCommodityBtn').unbind("click");
    iframe.find('.commodity-container .selectCommodityBtn').click(function() {
        our.isOurCommodity = false;
        our.openUrl = $(this).parent().attr('_href');
    })
    our.addBtn();
}, 300)

chrome.runtime.onMessage.addListener(function(request, sender, response) {
    if (!request.hasOwnProperty("text")) {
        our.isOurCommodity=true;
        our.openUrl=request.taobaoUrl;
        var info={
            name : request.name,
            description : request.description,
            imgUrl : request.imgUrl,
        }

        our.showModal(info);

    } else {
        $("textarea[data-fv-field='description']").val(request.text);
    }
})