class Time {

}

function twoChar (num){
    let res;
    if (num < 10){
        res = "0" + num;
    } else {
        res = num;
    }
    return res;
}

function date (){
    let now = new Date();
    let date = document.querySelector('#time');
    let now_hour = twoChar(now.getHours());
    let now_min = twoChar(now.getMinutes());
    let now_sec = twoChar(now.getSeconds()); 
    let time = "Now:" + now_hour + ":" + now_min + ":" + now_sec;
    date.innerHTML = time;
}

function display_nowtime (){
    setInterval(date, 1000);
}
window.addEventListener("load", display_nowtime);


let btn = document.querySelector("#link");
btn.addEventListener("click", function(){
    window.open("https://www.youtube.com/", "_blank");
})

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
    if (test2 > 0) frag = true;

    return frag;
}

function judgeAll (isFileDetected, url, t, h){
    let frag = false;

    if (!judgeURL(url) && !isFileDetected){
        window.alert('URLを入力してください');
        return false;
    }

    if (judgeURL(url) && judgeNum(t)){
        frag = true;
    }

    if (t != null && !judgeNum(t)){
        window.alert('タイマーは1分以上で入力してください');
    } else if (h != null) {
        frag = true;
    }

    if (isFileDetected){
        frag = true;
    }

    return frag;
}

let URL = window.document.querySelector(".url");
let url = URL.value;
function linkOpen(){
    window.open(url, "_blank", "menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes,width=300,height=300,top=550,left=1220");
}

////
let audio = new Audio();
let audioFile = document.querySelector("#finput");
let isFileDetected = false;
audioFile.addEventListener("change", function(event){
    let finput = event.target;
    if (finput.files.length == 0){ return };

    const file = finput.files[0];
    if (!file.type.match("audio.*")){
        alert("音声ファイルを選択してください");
        return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", function(){
        audio.pause();
        audio.src = reader.result;
    })
    reader.readAsDataURL(file);

    isFileDetected = true;
})

let stopButton = document.querySelector("#stop");
stopButton.addEventListener("click", function(){
    audio.pause();
});
////

let timeout;
function timerOn(){
    URL = window.document.querySelector(".url");
    url = URL.value;
    let T = window.document.querySelector("#num");
    let t = Number(T.value);
    let H = window.document.querySelector("#hour");
    let h = Number(H.value);
    console.log(t);
    if (!judgeAll(isFileDetected, url, t, h)) return;
    console.log(t);

    let set_time = new Date();

    let time;
    if (isNaN(h)){
        time = t * 60 * 1000;
        console.log(t);
        console.log(time);
        if (isFileDetected){
            console.log(":)");
            timeout = setTimeout(function(){
                audio.play();
            }, time);
        } else {
            console.log(":(");
            timeout = setTimeout(linkOpen, time);
        }
    } else {
        let alert_time = new Date();
        alert_time.setHours(h);
        alert_time.setMinutes(0);
        alert_time.setSeconds(0);
        if (alert_time - set_time < 0){
            alert_time.setDate(alert_time.getDate() + 1);
            time = alert_time - set_time;
        } else {
            time = alert_time - set_time;
        }

        if (isFileDetected){
            console.log(":)");
            timeout = setTimeout(function(){
                audio.play();
            }, time);
        } else {
            console.log(":(");
            timeout = setTimeout(linkOpen, time);
        }
    }
    window.alert('タイマーを設定しました！');
    set_display(t, h);
}

function timerOff (){
    clearTimeout(timeout);
    window.alert('タイマーをキャンセルしました！');

    let cntdown = document.querySelector("#countdown");
    cntdown.classList.add('uk-hidden');

    let display = document.querySelector('#set');
    display.innerHTML = "";
}


function set_display(t, h){
    let display = document.querySelector('#set');
    let set_time = new Date();
    console.log(h);
    console.log(t);
    if (isNaN(h) && !isNaN(t)){
        display.innerHTML = "Setting State: " + t + "minutes later";
        let set_h, set_min;
        let time = t;
        if (set_time.getMinutes() + time >= 60){
            set_h = (set_time.getMinutes() + time) / 60;
            set_min = (set_time.getMinutes() + time) % 60;

            set_time.setHours(set_time.getHours() + set_h);
            set_time.setMinutes(set_time.getMinutes() + set_min);
        } else {
            set_time.setMinutes(set_time.getMinutes() + time);
        }
    } else if (!isNaN(h) && isNaN(t)) {
        display.innerHTML = "Setting State: " + twoChar(h) + ":00";

        let alert_time = new Date();
        alert_time.setHours(h);
        alert_time.setMinutes(0);
        alert_time.setSeconds(0);
        if (alert_time - set_time < 0){
            alert_time.setDate(alert_time.getDate() + 1);
            set_time = alert_time;
        } else {
            set_time = alert_time;
        }
        
    } else {
        display.innerHTML = "Setting State: have not been set";
        return;
    }

    let cntdown = document.querySelector("#countdown");
    set_time = "date: " + set_time;
    cntdown.setAttribute("uk-countdown", set_time);
    cntdown.classList.remove('uk-hidden');
}

//addEventListenerだとsetTimeoutが戻り値を変数に格納するときに実行されなかった
//onclickに変更
// const el = document.querySelector('.on');
// el.addEventListener('click', timerOn);
// const el2 = document.querySelector('.off');
// el.addEventListener('click', timerOff);

//isNaNはnull型を無理やりNumver型に直そうとして生じた型

// リファクタリング必須