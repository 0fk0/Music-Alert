// 時間の表示をすべて二桁で表す
function twoChar (num){
    let res;
    if (num < 10){
        res = "0" + num;
    } else {
        res = num;
    }
    return res;
}

// Date型を拡張したTImeオブジェクト
class Time extends Date {
    constructor(date){
        super();
        this.hours = date.getHours();
        this.minutes = date.getMinutes();
        this.seconds = date.getSeconds();
    }

    twoCharHour (){
        this.hours = twoChar(this.hours);
    }
    twoCharMinute (){
        this.minutes = twoChar(this.minutes);
    }
    twoCharSecond (){
        this.seconds = twoChar(this.seconds);
    }
}

// DOM表示などUIを変化させるDisplayオブジェクト
class Display {
    ONE_SECONDS = 1000;

    nowTimeUpdate(){
        const nowTime = new Time(new Date);
        const timeElement = document.querySelector('#time');
        nowTime.twoCharHour();
        nowTime.twoCharMinute();
        nowTime.twoCharSecond();
        let time = "Now:" + nowTime.hours + ":" + nowTime.minutes + ":" + nowTime.seconds;
        timeElement.innerHTML = time;
    }

    nowTime(){
        setInterval(this.nowTimeUpdate.bind(this), this.ONE_SECONDS);
    }

    setHourOption(){
        const sel = document.querySelector('#hour');
        for (let i = 1; i <= 24; i++){
            sel.innerHTML += "<option value=\"" + i + "\">" + i + ":00</option>";
        }
    }

    setRemainTime(){
        const display = document.querySelector('#set');
        let setTime = new Time(new Date);
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
    
        const cntdown = document.querySelector("#countdown");
        set_time = "date: " + set_time;
        cntdown.setAttribute("uk-countdown", set_time);
        cntdown.classList.remove('uk-hidden');
    }

    removeRemainTime(){
        const cntdown = document.querySelector("#countdown");
        cntdown.classList.add('uk-hidden');

        const display = document.querySelector("#set");
        display.innerHTML = "";
    }
}

// 入力された値を一括管理するオブジェクト(入力値の判定も行う)
class Input {
    REGPATTERN = /^https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+$/;

    constructor(){
        this.url = window.document.querySelector(".url").value;
        this.minutes = window.document.querySelector("#num").value;
        this.hours = window.document.querySelector("#hour").value;
        this.audio = new Audio();
        this.isSetUrl = false;
        this.isSetMinutes = false;
        this.isSetHours = false;
        this.isSetAudioFile = false;
    }

    judgeUrl(){
        if (this.REGPATTERN.test(this.url)){
            this.isSetUrl = true;
        }
    }

    judgeMinutes(){
        if (this.minutes > 0){
            this.isSetMinutes = true;
        }
    }

    judgeHours(){
        if (this.hours != null){
            this.isSetHours = true;
        }
    }

    judgeAudioFile(){
        if (!this.isSetAudioFile){
            window.alert("オーディオファイルを指定してください");
        }
    }

    addAudioFile(){
        const audioFileElement = document.querySelector("#finput");
        audioFileElement.addEventListener("change", function(event){
            let finput = event.target;
            if (finput.files.length == 0){ return };

            const file = finput.files[0];
            if (!file.type.match("audio.*")){
                alert("音声ファイルを選択してください");
                return;
            }
            const reader = new FileReader();
            reader.addEventListener("load", function(){
                this.audio.pause();
                this.audio.src = reader.result;
            }.bind(this));
            reader.readAsDataURL(file);

            this.isSetAudioFile = true;
        }.bind(this))
    }

    updateInput(){
        this.url = window.document.querySelector(".url").value;
        this.minutes = window.document.querySelector("#num").value;
        this.hours = window.document.querySelector("#hour").value;
    }
}

class Timer {
    TIMEOUT;

    constructor(input, basicFunc){
        this.input = input;
        this.func = basicFunc;
        this.setTime = new Time(new Date());
        this.alertTime = new Time(new Date());
        this.setMinutes = 0;
        this.isSet = false;
    }

    timerOn(){
        this.input.updateInput();
        this.input.judgeUrl();
        this.input.judgeMinutes();
        this.input.judgeHours();
        // this.input.judgeAudioFile();

        if (!this.input.isSetHours){
            this.setMinutes = Number(this.input.minutes) * 60 * 1000;

            if (this.input.isSetAudioFile){
                window.alert("タイマーを設定しました！1");
                this.TIMEOUT = setTimeout(function(){
                    this.input.audio.play();
                }.bind(this), this.setMinutes);
                this.isSet = true;
            } else {
                window.alert("タイマーを設定しました！2");
                this.TIMEOUT = setTimeout(this.func.linkOpen.bind(this), this.setMinutes);
                this.isSet = true;
            }
        } else {
            this.alertTime.setHours(Number(this.input.hours));
            this.alertTime.setMinutes(0);
            this.alertTime.setSeconds(0);
            if (this.alertTime - this.setTime < 0){
                this.alertTime.setDate(this.alertTime.getDate() + 1);
                this.setMinutes = this.alertTime - this.setTime;
            } else {
                this.setMinutes = this.alertTime - this.setTime;
            }

            if (this.input.isSetAudioFile){
                window.alert("タイマーを設定しました！3");
                this.TIMEOUT = setTimeout(function(){
                    this.input.audio.play();
                }.bind(this), this.setMinutes);
                this.isSet = true;
            } else {
                window.alert("タイマーを設定しました！4");
                this.TIMEOUT = setTimeout(this.basicFunc.linkOpen.bind(this), this.setMinutes);
                this.isSet = true;
            }
        }

        if (this.isSet){
            window.alert("タイマーを設定しました！");
        } else {
            window.alert("入力内容を確認してください");
        }
    }

    timerOff(){
        clearTimeout(this.TIMEOUT);
        window.alert("タイマーをキャンセルしました！");
    }
}

class BasicFunction {
    YOUTUBE_LINK = "https://www.youtube.com/";
    WINDOW_SETTING = "menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes,width=300,height=300,top=550,left=1220";

    constructor(input){
        this.input = input;
    }

    setYoutubeLinkOpen(){
        const btn = document.querySelector("#link");
        btn.addEventListener("click", function(){
            window.open(this.YOUTUBE_LINK, "_blank");
        }.bind(this));
    };

    linkOpen(){
        console.log(this.func.WINDOW_SETTING);
        window.open(this.input.url, "_blank", this.func.WINDOW_SETTING);
    };

    setStopAudio(){
        const stopButton = document.querySelector("#stop");
        stopButton.addEventListener("click", function(){
            this.input.audio.pause();
        }.bind(this));
    };

}

const display = new Display();
display.setHourOption();
window.addEventListener("load", display.nowTime());

const input = new Input();
input.addAudioFile();

const basicFunc = new BasicFunction(input);
basicFunc.setYoutubeLinkOpen();
basicFunc.setStopAudio();

const timer = new Timer(input, basicFunc);

// タイマーと残り時間表示を同時に処理
function start(){
    timer.timerOn();
    display.setRemainTime();
}
function end(){
    timer.timerOff();
    display.removeRemainTime();
}

const onElement = document.querySelector('.on');
onElement.addEventListener('click', start);
const offElement = document.querySelector('.off');
offElement.addEventListener('click', end);


/*メモ*/
//　isNaNはnull型を無理やりNumver型に直そうとして生じた型
//　リファクタリング必須だった