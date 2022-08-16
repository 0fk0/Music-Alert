let now = new Date();
function date (){
    let dat = document.querySelector('#date');
    dat.innerHTML = now;
}

let sel = document.querySelector('#hour');
function makeSelect (){
    for (let i = 1; i <= 24; i++){
        sel.innerHTML += "<option value=\"" + i + "\">" + i + ":00</option>";
    }
}
makeSelect();

const regPattern = /^https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+$/;
function judgeURL (test1){
    let frag = false;
    if (regPattern.test(test1)) frag = true;

    return frag;
}

function judgeNum (test2){
    let frag = false;
    if (t > 0) frag = true;

    return frag;
}

let url = new URL(window.location.href);
let params = url.searchParams;

let u = params.get('url');
let t = params.get('num');
let h = params.get('hour');
function judgeAll (){
    let frag = false;
    if (judgeURL(u) && judgeNum(t)) frag = true;

    if (!judgeURL(u)) window.alert('URLを入力してください');
    if (!judgeNum(t)) window.alert('タイマーは1分以上で入力してください');
    if (!judgeURL(u) || !judgeNum(t)){
        u = '';
        t='';
    }

    return frag;
}

function linkOpen(){
    window.open(u, "_blank", "menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes,width=300,height=300,top=550,left=1220");
}

let timeout;
function timerOn(){
    if (!judgeAll()) return;
    window.alert('タイマーを設定しました！');

    let hour = now.getHours();
    let min = now.getMinutes();
    let time;
    if (h == "null"){
        time = t * 60 * 1000;      
        timeout = setTimeout(linkOpen, time);
    } else {
        if (h - hour <= 0){
            time = ((h - hour + 24) * 60 - min) * 60 * 1000;
        } else {
            time = ((h - hour) * 60 - min) * 60 * 1000;
        }
        timeout = setTimeout(linkOpen, time);
    }
}

function timerOff (){
    window.alert('タイマーをキャンセルしました！')
    clearTimeout(timeout);
}

let display = document.querySelector('#set');
function set_display(){
    if (h == "null"){
        display.innerHTML = "設定状態: " + t + "分後";
    } else if (t == null) {
        display.innerHTML = "設定状態: 設定されていません";
    } else {
        display.innerHTML = "設定状態: " + h + ":00";
    }
}

let set = document.querySelector('.setting');
set.addEventListener('click', set_display);

//addEventListenerだとsetTimeoutが戻り値を変数に格納するときに実行されなかった
//onclickに変更
// const el = document.querySelector('.on');
// el.addEventListener('click', timerOn);
// const el2 = document.querySelector('.off');
// el.addEventListener('click', timerOff);