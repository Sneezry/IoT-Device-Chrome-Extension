function getSaSToken() {
    var account = $('#account').val();
    var key = $('#key').val();
    var sr = account + '.azure-devices.net';
    var se = Math.round(new Date().getTime() / 1000) + 60;
    var stringtosign = sr + '\n' + se;
    var sig = encodeUriComponentStrict(CryptoJS.HmacSHA256(stringtosign, CryptoJS.enc.Base64.parse(key)).toString(CryptoJS.enc.Base64));
    return 'SharedAccessSignature sr=' + sr + '&sig=' + sig + '&se=' + se + '&skn=iothubowner';
}

function encodeUriComponentStrict(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16);
    });
}

function callApi(action) {
    var account = $('#account').val();
    var name = $('#name').val();
    var url = 'https://' + account + '.azure-devices.net/devices/' + name + '?api-version=2016-11-14';
    switch(action) {
        case 'add':
            $.ajax({
                url: url,
                type: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getSaSToken()
                },
                data: '{"deviceId": "' + name + '"}'
            }).done(function(){
                $( "#history" ).prepend('<p><strong>' + name + '</strong> has been added.</p>');
            }).fail(function() {
                $( "#history" ).prepend('<p>add <strong>' + name + '</strong> failed.</p>');
            });
            break;
        case 'del':
            $.ajax({
                url: url,
                type: 'DELETE',
                headers: {
                    'If-Match': '*',
                    'Authorization': getSaSToken()
                },
            }).done(function(){
                $( "#history" ).prepend('<p><strong>' + name + '</strong> has been deleted.</p>');
            }).fail(function() {
                $( "#history" ).prepend('<p>delete <strong>' + name + '</strong> failed.</p>');
            });
    }
}

$('#add').click(function() {
    var account = $('#account').val();
    var key = $('#key').val();
    var name = $('#name').val();
    if (!account || !key || !name) {
        alert('IoT Hub Account, IoT Hub Owner Primary Key, and Device ID must be specific.');
        return;
    }

    callApi('add');
});

$('#del').click(function() {
    var account = $('#account').val();
    var key = $('#key').val();
    var name = $('#name').val();
    if (!account || !key || !name) {
        alert('IoT Hub Account, IoT Hub Owner Primary Key, and Device ID must be specific.');
        return;
    }

    callApi('del');
});

$('#account').keydown(function() {
    localStorage.account = this.value;
});

$('#account').change(function() {
    localStorage.account = this.value;
});

$('#key').keydown(function() {
    localStorage.pkey = this.value;
});

$('#key').change(function() {
    localStorage.pkey = this.value;
});

$('#account').val(localStorage.account || '');
$('#key').val(localStorage.pkey || '');