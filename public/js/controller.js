/**
 * Created by pmcc on 16/10/10.
 */


routeApp.controller('mainApp', function($scope) {
    var swiper = document.getElementById("swiper");
    var scale = window.screen.height / window.screen.width;
    swiper.style.height = document.body.clientWidth * 900 / 750 + "px";

    var mySwiper = new Swiper('.swiper-container', {
        autoplay: 4000,
        speed: 500,
        pagination: '.pagination',
        loop: true,
        grabCursor: true,
        paginationClickable: true
    });


});

routeApp.factory('orderInfoFactory', function() {
    var orderInfo = {};

    var _setter = function(data) {
        orderInfo = data
    };

    var _getter = function() {
        return orderInfo;
    };

    return {
        setter: _setter,
        getter: _getter
    };
});

//产品列表页
routeApp.controller('productsCtrl', function($scope, $routeParams, $http, $localStorage) {
    $(window).scrollTop(0);
    if (!!$routeParams.orderChannel) {
        $localStorage.orderChannel = $routeParams.orderChannel
    }
    // console.log($routeParams.orderChannel)
    // console.log(!!$routeParams.orderChannel)

});
//产品1
routeApp.controller('details1Ctrl', function($scope, $routeParams, $http) {
    $(window).scrollTop(0);

});
routeApp.controller('buyCtrl', function($scope, $routeParams, $http, orderInfoFactory, $sessionStorage) {
    $(window).scrollTop(0);
    var productId = $routeParams.productId;
    var goods = {
        'p1': { 'goodsName': "女性常见癌症 全面筛查", 'goodsPrice': 1299 },
        'p2': { 'goodsName': "女性常见癌症 深度筛查", 'goodsPrice': 1999 },
        'p3': { 'goodsName': "爱心妈妈备孕套餐", 'goodsPrice': 885 }
    };
    productId = productId.slice(1); //三种产品 1299  1999  885
    $scope.price = goods[productId].goodsPrice;
    $scope.count = 1;
    $scope.billText = '不开发票';
    $scope.isInvoice = '不开发票'; //是否需要发票
    $scope.invoiceType = ''; //发票类型
    $scope.invoice = ''; //发票内容
    $scope.orderInfo = {}; //订单信息
    $scope.isChecked = 0;
    $scope.remark = '';
    $scope.totalAmount = $scope.price * $scope.count;
    $scope.reduce = function() {
        if ($scope.count > 1) {
            $scope.count -= 1
        }
    };

    $scope.add = function() {
        $scope.count += 1
    };

    //控制发票 标签的选择
    $scope.isSelected1 = true;
    $scope.isSelected2 = false;
    $scope.noBill = function() {
        $scope.isSelected1 = true;
        $scope.isSelected2 = false;
    };
    $scope.commonBill = function() {
        $scope.isSelected1 = false;
        $scope.isSelected2 = true;
    };

    //控制 遮罩层的显示
    $scope.layerClose = function() {
        $('.layer-wrap').css('display', 'none')
    };
    $scope.layerShow = function() {
        $('.layer-wrap').css('display', 'block')
    };

    //发票确定
    $scope.billBtn = function() {
        if ($scope.isSelected2 == true) {
            // $scope.billText=$scope.isChecked ===0 ? '个人' : $scope.billCompany;

            if ($scope.isChecked === 0) {
                $scope.billText = "个人";
                $scope.isInvoice = '普通发票';
                $scope.invoiceType = '个人';
                $scope.invoice = '个人';
            } else {
                $scope.billText = $scope.billCompany;
                $scope.isInvoice = '普通发票';
                $scope.invoiceType = '单位';
                $scope.invoice = $scope.billCompany;
            }
        } else {
            $scope.billText = '不开发票';
            $scope.isInvoice = '不开发票';
            $scope.invoiceType = '';
            $scope.invoice = '';
        }

        $('.layer-wrap').css('display', 'none')
    };


    $scope.$watch('count', function() {
        $scope.orderAmount = $scope.price * $scope.count;
    });

    //控制发票选择按钮，当选择公司时，未填内容，按钮不可用
    $scope.$watch('isChecked', function() {
        if ($scope.isChecked == 1) {
            $scope.$watch('billCompany', function() {
                if (!$scope.billCompany) {
                    $scope.disabledBtn = true
                } else {
                    $scope.disabledBtn = false
                }
            })
        }
    });


    //提交订单
    $scope.orderSubmit = function() {

        if (!$scope.orderInfo.consignee) {
            alert('请输入收件人姓名');
            return false
        }
        if (!(/^1[3|4|5|7|8][0-9]\d{8}$/).test($scope.orderInfo.receiptPhone)) {
            alert('请输入有效的收件人手机号码');
            return false
        }
        if (!$scope.orderInfo.address) {
            alert('请输入您的收货地址');
            return false
        }

        // $scope.orderInfo.goodsJson = ([{ "goodsName": goods[productId].goodsName, "goodsNum": $scope.count, "goodsPrice": $scope.price }]).toString();
        $scope.orderInfo.goodsJson = '[{ "goodsName":"' + goods[productId].goodsName + '", "goodsNum":' + $scope.count + ', "goodsPrice":' + $scope.price + ' }]';
        $scope.orderInfo.isInvoice = $scope.isInvoice;
        $scope.orderInfo.invoiceType = $scope.invoiceType;
        $scope.orderInfo.invoice = $scope.invoice;
        $scope.orderInfo.remark = $scope.remark;
        $scope.orderInfo.payWay = '微信支付';
        //$scope.orderInfo.orderAmount = $scope.orderAmount;
        $scope.orderInfo.orderAmount = 0.01;
        $scope.orderInfo.deliveryMethod = '顺丰包邮';

        // orderInfoFactory.setter($scope.orderInfo);

        // console.log(orderInfoFactory.getter())
        // console.log($scope.orderInfo)
        $scope.disabledBtn = true; //点击提交 禁用按钮
        console.log(serverIP)
        $http({
            method: 'post',
            url: serverIP + 'geneOrder/submitOrder.htm',
            data: $scope.orderInfo,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            transformRequest: function(data) {
                return $.param(data);
            }
        }).then(function(res) {
            console.log(res)
            $scope.disabledBtn = false;
            $scope.orderInfo.resultData = res.data.resultData
                // $scope.orderInfo.resultData = 1111
            $sessionStorage.orderInfo = $scope.orderInfo
            window.location.href = '#/product/pay'
        }, function(res) {
            $scope.disabledBtn = false;
            console.log(res)
            alert('请求失败，请重新提交')
        });


    }

});


//pay page
routeApp.controller('payCtrl', function($scope, $routeParams, $http, orderInfoFactory, $localStorage, $sessionStorage) {
    $(window).scrollTop(0);
    var sessionStorage = $sessionStorage;
    // console.log(sessionStorage)
    // console.log(storage.orderChannel || '')
    // var orderInfo = orderInfoFactory.getter();
    var orderInfo = sessionStorage.orderInfo;
    $scope.orderAmount = orderInfo.orderAmount;
    console.log(orderInfo)



    $scope.paySubmit = function() {
        // $sessionStorage.orderInfo = orderInfo ;
        $scope.disabledBtn = true; //点击提交 禁用按钮
        location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx030322437dbd6516&redirect_uri=http%3a%2f%2fwx.hnzpjk.com%2f%23%2fproduct%2ftopay&response_type=code&scope=snsapi_base&state=123#wechat_redirect'


    }
});

//topay page
routeApp.controller('topayCtrl', function($scope, $routeParams, $http, orderInfoFactory, $localStorage, $sessionStorage) {
    $(window).scrollTop(0);
    // var orderAmount = $sessionStorage.orderInfo;
    // var storage = $localStorage
    // console.log(storage.orderChannel || '')
    var sessionStorage = $sessionStorage;
    var orderInfo = sessionStorage.orderInfo;
    $scope.orderAmount = orderInfo.orderAmount;
    console.log(orderInfo)
    var code = location.search.substr(1).split("&")[0].substr(5);
    console.log(code)



    $scope.paySubmit = function() {
        $scope.disabledBtn = true; //点击提交 禁用按钮
        $http({
            method: 'post',
            url: serverIP + 'geneOrder/toPay.htm',
            data: {
                orderNo: orderInfo.resultData,
                code: code
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            transformRequest: function(data) {
                return $.param(data);
            }
        }).then(function(res) {
            console.log(res)
            console.log("success")
            var data = res.data.object
                // //微信支付
            function onBridgeReady(o, scope) {
                //console.log(o)
                //alert(scope.disabledBtn)
                var val = o.timeStamp.toString();
                //console.log(typeof val)
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                        "appId": o.appId, //公众号名称，由商户传入     
                        "timeStamp": val, //时间戳，自1970年以来的秒数
                        "nonceStr": o.nonceStr, //随机串     
                        "package": o.package,
                        "signType": "MD5", //微信签名方式：     
                        "paySign": o.paySign //微信签名 
                    },
                    function(res) {
                        // console.log(res)
                        //alert(JSON.stringify(res));
                        if (res.err_msg == "get_brand_wcpay_request:ok") {
                            alert("支付成功")
                            location.href = '#/products'

                            return
                        }

                        if (res.err_msg == "get_brand_wcpay_request:cancel") {
                            alert('已取消支付')

                            location.href = '#/products'

                        }

                        if (res.err_msg == "get_brand_wcpay_request:fail") {
                            alert('支付失败,请稍后重试！如果收到支付通知，切勿重复支付')

                            return
                        }

                    }
                );
            }
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                }
            } else {
                onBridgeReady(data);
            }
        });



    }



});
