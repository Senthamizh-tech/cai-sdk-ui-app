(function($){

    $(document).ready(function () {
        function assertion(options, callback) {
            var jsonData = {
                "clientId": options.clientId,
                "clientSecret": options.clientSecret,
                "identity": options.userIdentity,
                "aud": "",
                "isAnonymous": false
            };
            $.ajax({
                url: options.JWTUrl,
                type: 'post',
                data: jsonData,
                dataType: 'json',
                success: function (data) {
                    options.assertion = data.jwt;
                    options.handleError = koreBot.showError;
                    options.chatHistory = koreBot.chatHistory;
                    options.botDetails = koreBot.botDetails;
                    callback(null, options);
                    setTimeout(function () {
                        if (koreBot && koreBot.initToken) {
                            koreBot.initToken(options);
                        }
                    }, 2000);
                },
                error: function (err) {
                    koreBot.showError(err.responseText);
                }
            });
        }
        function getBrandingInformation(options) {
            if (chatConfig.botOptions && chatConfig.botOptions.enableThemes) {
                var brandingAPIUrl = (chatConfig.botOptions.brandingAPIUrl || '').replace(':appId', chatConfig.botOptions.botInfo._id);
                $.ajax({
                    url: brandingAPIUrl,
                    headers: {
                        'Authorization': "bearer " + options.authorization.accessToken,
                    },
                    type: 'get',
                    dataType: 'json',
                    success: function (data) {
                        if(koreBot && koreBot.applySDKBranding) {
                            koreBot.applySDKBranding(data);
                        }
                        if (koreBot && koreBot.initToken) {
                            koreBot.initToken(options);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            }

        }
        function onJWTGrantSuccess(options){
            getBrandingInformation(options);
        }
        var chatConfig=window.KoreSDK.chatConfig;
        chatConfig.botOptions.assertionFn=assertion;
        chatConfig.botOptions.jwtgrantSuccessCB = onJWTGrantSuccess;
        var koreBot = koreBotChat();
        koreBot.show(chatConfig);
        // var openWindow = window.open(url, koreBot.show(chatConfig), 'width = 500, height = 500'); 
        $('.openChatWindow').click(function () {
            window.open("http://localhost:3000", "", "width=400, height=550");
        });
    });

})(jQuery || (window.KoreSDK && window.KoreSDK.dependencies && window.KoreSDK.dependencies.jQuery));