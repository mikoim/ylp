var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === 'complete') {
        clearInterval(readyStateCheckInterval);
        ylp();
    }
}, 3);

function ylp() {
    console.log("ylp loaded");

    switch ($('.page_title').text()) {
        case 'バトル':
            battleShowStatus();
            break;
    }
}

function battleShowStatus() {
    $('.data > a').each(function () {
        var link = $(this).attr('href');
        var status = $(this).parent();

        $.ajax({
            url: link,
            dataType: "html",
            cache: false,
            success: function (data, textStatus, jqXHR) {
                var atk = 0, def = 0;

                $('.deck_thumbnails > li', data).each(function () {
                    var raws = $(this).text().match(/攻:(\d+)防:(\d+)/);
                    atk += parseInt(raws[1]);
                    def += parseInt(raws[2]);
                });

                console.log($('.page_title', data).text() + ' → ATK : ' + atk + " / DEF : " + def);

                status.append('A: ' + atk + " D: " + def);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Error: ' + errorThrown + ' / ' + link);
            }
        });
    });
}