var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === 'complete') {
        clearInterval(readyStateCheckInterval);
        ylp();
    }
}, 1);

function ylp() {
    console.log("ylp loaded");

    switch ($('.page_title').text()) {
        case 'バトル':
            if (getBattlePoint() >= 2) {
                var dp = getDefeatablePlayer(getEnemyStatus(), 1300);

                if (!dp) {
                    setTimeout(function () {location.reload();}, Math.random() * 5000);
                    return;
                }
            }

            var time = new Date();
            time.setTime(time.getTime() + 600000);
            console.log('Waiting until ' + time.toLocaleString() + ' ...');

            setTimeout(function () {location.reload();}, 600000);

            break;
    }
}

function getDefeatablePlayer(enemies, limit) {
    var player = null;

    $.each(enemies, function() {
       if (this.def < limit && this.def > 0) {
           player = this;
           return false;
       }
    });

    return player;
}

function getBattlePoint() {
    var battlePoint = 0;

    $('.battle_info > .bp > img').each(function () {
        if ($(this).attr('src').indexOf('rescue.png') !== -1) {
            battlePoint++;
        }
    });

    return battlePoint;
}

function parsePlayerId(url) {
    return parseInt(url.match(/otherPid=(\d+)/)[1]);
}

function getEnemyStatus() {
    var players = [];

    $('.data > a').each(function () {
        var link = $(this).attr('href');
        var status = $(this).parent();

        $.ajax({
            url: link,
            dataType: "html",
            cache: false,
            async: false,
            success: function (data, textStatus, jqXHR) {
                var atk = 0, def = 0;

                $('.deck_thumbnails > li', data).each(function () {
                    var raws = $(this).text().match(/攻:(\d+)防:(\d+)/);
                    atk += parseInt(raws[1]);
                    def += parseInt(raws[2]);
                });

                console.log($('.page_title', data).text() + ' → ATK : ' + atk + " / DEF : " + def);

                status.append('A: ' + atk + " D: " + def);

                players.push({
                    dom: status.parent(),
                    pid : parsePlayerId(link),
                    atk : atk,
                    def : def
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Error: ' + errorThrown + ' / ' + link);
            }
        });
    });

    return players;
}