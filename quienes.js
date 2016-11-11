// todo: Quienes no me siguen

function main() {
    var $input = $('#input-text');
    var $btn = $('#btn-send');
    var nick = $input.val();
    var userid;
    var page = 1;
    var followings = [];
    var followers = [];
    var result = [];
    var avatar = [];
    $input.val('');
    $('#ban-content').show();
    $('.loader').show();
    $('#baneados li').remove();
    $('#info p').remove();
    $('#baneados p').remove();

    var clean = function(){
        $('.loader').hide();
        $('#info p').remove();
        $('#baneados p').remove()
    };

    var getID = function(nickName){
        var dfd = $.Deferred();
        $.ajax({
            url: 'http://api.taringa.net/user/nick/view/' + nickName,
            success: function(response){
                dfd.resolve(response['id'])
            },
            error: function(){
                clean();
                $('#ban-content p').remove();
                $('#baneados').append('<p style="color: #cedeff; padding-bottom: 10px;"> Ingresa un puto usuario valido.</p>');
            }
        });
        return dfd.promise()
    };

    var getNick = function(id){
        var dfd = $.Deferred();
        if (id == undefined) {
            clean();
            $('#ban-content p').remove();
            $('#baneados').append('<p style="color: #cedeff; padding-bottom: 10px;"> Todos los que sigues, te siguen :3 </p>');
            return false;
        }
        $.ajax({
            url: 'http://api.taringa.net/user/view/' + id,
            success: function(response){
                dfd.resolve(response);
            }
        });
        return dfd.promise()
    };

    var getFollowings = function() {
        var dfd = $.Deferred();
        $.ajax({
            url: 'http://api.taringa.net/user/followings/view/' + userid + '?trim_user=true&count=50&page=' + page,
            success: function(array){
                if(array.length > 0) {
                    followings.push.apply(followings, array);
                    page++;
                }
                dfd.resolve(array); /* Se que no esta muy bien esto pero weno :c */
            }
        });
        return dfd.promise();
    };

    var getFollowers = function(){
        var dfd = $.Deferred();
        $.ajax({
            url: 'http://api.taringa.net/user/followers/view/' + userid + '?trim_user=true&count=50&page=' + page,
            success: function(array){
                if(array.length > 0) {
                    followers.push.apply(followers, array);
                    page++;
                }
                dfd.resolve(array);
            }
        });
        return dfd.promise();
    };

    function banFollowings() {
        getFollowings().then(function(e){
            if(e.length > 0) {
                banFollowings();
            }
            else {
                page = 1;
                banFollowers();
                $('#ban-content p').remove();
                $('#ban-content').append('<p id=info-result> Obteniendo seguidores... </p>')
            }
        })
    }

    function banFollowers() {
        getFollowers().then(function(e){
            if(e.length > 0) {
                banFollowers();
            }
            else {
                page = 0;
                getDifference();
                $('#ban-content p').remove();
                $('#ban-content').append('<p id=info-result> Calculando diferencias.. </p>')
            }
        })
    }

    getID(nick).then(function(e){ /* esto se ejecuta primero... */
        userid = e;
        banFollowings();
        $('#ban-content p').remove();
        $('#ban-content').append('<p id=info-result> Obteniendo usuarios que sigues... </p>')
    });

    function getDifference(){
        $.grep(followings, function(e){
            if ($.inArray(e, followers) == -1) {
                result.push(e);
            }
        });
        lastFunction();/* NO SE POR QUE ESTO SE EJECUTA DESPUES DEL GREP SI EN TEORIA ES ASINCRONO D:... */
    }

    function lastFunction(){ /* Best name ever */
        getNick(result[page]).then(function(e){
            result[page] = e['nick'];
            avatar.push(e['avatar']['big']);
            page++;
            if (page < result.length) {
                lastFunction();
            }
            else {
                $('#ban-content p').remove();
                $('.loader').hide();
                $('#info').append('<p style="padding-bottom: 10px;">Estos no te siguen, clickealos para ir a su perfil. </p>');
                for (x in result) {
                    if (result.hasOwnProperty(x)){
                        $('#baneados').append('<li><a href="http://www.taringa.net/' + result[x] + '" target="_blank"><img src="' + avatar[x] + '" title="' + result[x] + '"/><br>' + result[x] + ' </a></li>');
                    }
                }
            }
        });
    }
}

$(document).ready(function(){

    $('#input-text').focus();
    $('#input-text').keydown(function(key){
        if (key.which == 13) main();
    });

    $('#btn-send').click(function(){
        main();
    });

});
