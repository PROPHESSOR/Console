var cmds = [];
var $i = 0;
var $i1 = $i;
var cryptCount = 1;
$Config = {
    theme: "desert",
    themes: {
        desert: "pre { white-space: pre-wrap; font-family: monospace; color: #ffffff; background-color: #333333; }body { font-family: monospace; color: #ffffff; background-color: #333333; }* { font-size: 1em; }.Statement { color: #f0e68c; font-weight: bold; }.LineNr { color: #ffff00; }.Comment { color: #87ceeb; }.Constant { color: #ffa0a0; }.Identifier { color: #98fb98; }.Todo { color: #ff4500; background-color: #eeee00; padding-bottom: 1px; }",
        elflord: "pre { white-space: pre-wrap; font-family: monospace; color: #00ffff; background-color: #000000; }body { font-family: monospace; color: #00ffff; background-color: #000000; }* { font-size: 1em; }.Function { color: #ffffff; }.Repeat { color: #ffffff; }.Statement { color: #aa4444; font-weight: bold; }.LineNr { color: #ffff00; }.Comment { color: #80a0ff; }.Constant { color: #ff00ff; }.Todo { color: #0000ff; background-color: #ffff00; padding-bottom: 1px; }",
        solarized: "pre { white-space: pre-wrap; font-family: monospace; color: #839496; background-color: #002b36; } body { font-family: monospace; color: #839496; background-color: #002b36; } * { font-size: 1em; } .Statement { color: #719e07; } .LineNr { color: #586e75; background-color: #073642; padding-bottom: 1px; } .Comment { color: #586e75; font-style: italic; } .Constant { color: #2aa198; } .Identifier { color: #268bd2; } .Todo { color: #d33682; font-weight: bold; }"
    },
    users: [{
        login: 'admin',
        password: polyCrypt('admin', cryptCount),
        permission: 'admin',
        name: "Администратор"
    }, {
        login: 'user',
        password: polyCrypt('user', cryptCount),
        name: "Пользователь",
        permission: 'user'
    }, {
        login: 'PROPHESSOR',
        password: polyCrypt('PR0PHESSOR', cryptCount),
        name: "PROPHESSOR",
        permission: 'admin'
    }

    ],
    login: true
};
$LOG$ = [];
$Modules = [];
$Commands = [{
    cmd: 'reload',
    func: 'lsaveData();window.location.reload();',
    help: 'Перезагружает консольку',
    permission: 'user'
},
//Развлечение
{
    cmd: 'flip',
    func: 'var tmp = Math.round(Math.random());if(tmp){addConsoleReturn("Да","w");}else{addConsoleReturn("Нет","w");}',
    help: 'Заменяет подбрасывание монетки: выводит Да/Нет',
    perm: "user"
},

//Администрирование
{
    cmd: 'addUser',
    func: 'var tmp = command.split(" ");if(tmp[1]&&tmp[2]&&tmp[3]&&tmp[4]){$Config.users.push({login:command.split(" ")[1],password:polyCrypt(command.split(" ")[2], cryptCount),name:command.split(" ")[3],permission:command.split(" ")[4]});addConsoleReturn("Пользователь успешно добавлен!","g");lsaveData();}else{addConsoleReturn("Неверный формат!","e");};',
    help: 'Добавляет пользователя: логин пароль имя права',
    permission: 'admin'
},
{
    cmd: 'removeUser',
    func: 'var tmp = command.split(" ");if(tmp[1]){for(i in $Config.users){if($Config.users[i].login==tmp[1]){$Config.users.splice(i,1);addConsoleReturn("Пользователь успешно удалён!","g");lsaveData();if(tmp[1]==$TMP$.currentUser.login){window.location.reload();}continue;}}/*addConsoleReturn("Такого пользователя не существует!","e");*/}else{addConsoleReturn("Вы не указали пользователя!","e");};',
    help: 'Удаляет пользователя: логин',
    permission: 'admin'
},
{
    cmd: 'exit',
    func: 'lsaveData();window.close();',
    help: 'Закрывает консольку',
    permission: 'admin'
}

];
$Help = "";
$TMP$ = {
    block: false
};

function saveLog() {
    var tmp = toJSON($LOG$);
    window.localStorage.setItem('log', tmp);
}

function log() {
    var tmp = "";
    for (i in arguments) {
        tmp += arguments[i];
    }
    $LOG$.push(tmp);
    /*saveLog();*/
    console.log(tmp);
}
function lreadData() {
    var tmp = window.localStorage.getItem('config');
    if (parseJSON(tmp) === null) {
        log('Первый запуск!');
        lsaveData();
    } else {
        $Config = parseJSON(tmp);
    }
    var lg = window.localStorage.getItem('log');
    if (parseJSON(lg) === null) {
        $LOG$.push("[F]" + Date().toString());
        window.localStorage.setItem('log', toJSON($LOG$));
    } else {
        $LOG$ = parseJSON(lg);
        $LOG$.push(Date().toString());
    }
    log('-Конфигурация успешно загружена!');
}
function lsaveData() {
    var tmp = toJSON($Config);
    window.localStorage.setItem('config', tmp);
    saveLog();
    log('-Конфигурация успешно сохранена!');
}
function lclearData() {
    window.localStorage.clear();
    log('-Все данные успешно удалены!');
}
function showLog() {
    console.log($LOG$.toString().replace(/,/g, '\n'));
}

function prelogin() {
    if ($Config.login) {
        loginform();
    } else {
        pre.innerHTML += 'Для просмотра справки - наберите <span class="Statement" onclick="addCmd(\'help\')">help</span><br><br><span id="L1" class="LineNr">1  </span>';
    }
}


/*Main*/
function Main() {
    log('Инициализация...');
    lreadData();
    loadModules();
    /*loadHelp();*/
    setColorScheme($Config.theme);
    log('-Тема ' + $Config.theme + ' задана!');
    pre = document.getElementById('vimCodeElement');
    TIMER = setInterval(Loop, 10);
    input = document.getElementById('console-input');
    counter = 1;
    pre.scrollIntoView(true);
    log('Инициализация завершена!');
    prelogin();
}

function loginSuccess() {
    $LOG$.push("[" + $TMP$.currentUser.login + "]");
    loadHelp();
}
function setColorScheme(scheme) {
    var style = document.getElementById('styles');
    for (i in $Config.themes) {
        if (i == scheme) {
            style.innerHTML = $Config.themes[i];
            $Config.theme = scheme;
            lsaveData();
            return;
        }
    }
    addConsoleReturn('Такой темы не существует!', 'e');
    style.innerHTML = $Config.themes.desert;
}

function scrollDown() {
    var scrollHeight = document.documentElement.scrollHeight;
    var clientHeight = document.documentElement.clientHeight;
    scrollHeight = Math.max(scrollHeight, clientHeight);
    window.scrollTo(0, scrollHeight - document.documentElement.clientHeight)
}

function Loop() {
}

function addConsoleOut(text) {
    if (!$TMP$.block) {
        if (counter == 1) {
            pre.innerHTML += '<span class="Comment">' + text + '</span>';
        } else {
            pre.innerHTML += '<br/><span class="LineNr">' + counter + ' </span> <span class="Comment">' + text + '</span>';
        }
        counter++;
    }
}
function addConsoleReturn(text, type) {
    var classname = 'none';
    switch (type) {
        case 'e':
            classname = "error";
            break;
        case 'w':
            classname = "warning";
            break;
        case 'i':
            classname = "info";
            break;
        case 'g':
            classname = "great";
            break;
        case 'f':
            classname = "fail";
            break;
        default:
            classname = type;
            break;
    }
    pre.innerHTML += '<br/><return><span class="' + classname + '">' + text + '</span></return>';
}
function addCommand(cmd, func, help) {
    $Commands.push({ cmd: cmd, func: func, help: help });
    loadHelp(true);
    log('Команда ' + cmd + "успешно добавлена!");
}

function loadModuleByUrl(url) {
    log('--Подключаю модуль с URL: ' + url + '...');
    var tmp = document.createElement('script');
    tmp.type = "text/javascript";
    tmp.src = url;
    document.head.appendChild(tmp);
    log('--Модуль успешно подключён!');
}

function addColorScheme(name, css) {
    $Config.themes[name] = css;
    return true;
}

function onKeyDown(keycode) {
    switch (keycode) {
        case 13: //enter
            addConsoleOut(input.value);
            evalCommand(input.value);
            if (input.value != "" && !$TMP$.block) {
                cmds.push(input.value);
                $i++;
                $i1 = $i;
            }
            input.value = '';
            scrollDown();
            break;
        case 38: //up
            if ($i1 > 0) {
                $i1--;
                input.value = cmds[$i1];
                //log(cmds[$i1]);
            } else {
                //log('No up');
            }
            break;
        case 40: //down
            if ($i1 < $i - 1) {
                $i1++;
                input.value = cmds[$i1];
                //log(cmds[$i1]);
            } else {
                //log('No down');
            }
            break;
    }
    //log(keycode);
}

function block() {
    return false;
}
function login(login, password) {
    console.log(login, password, polyCrypt(password, cryptCount));
    for (var i in $Config.users) {
        if ($Config.users[i].login == login) {
            if ($Config.users[i].password == polyCrypt(password, cryptCount)) {
                $TMP$.currentUser = $Config.users[i];
                return true;
            } else {
                return false;
            }
        }
    }
}
function loginform(number) {
    if (number === undefined) {
        $TMP$.block = true;
        pre.innerHTML += 'Введите логин:<br/>';
        block = function (command) {
            $TMP$.login = command;
            loginform(1);
        }
    } else if (number == 1) {
        pre.innerHTML += 'Введите пароль:';
        $.changeType('console-input', 'password');
        block = function (command) {
            $TMP$.password = command;
            loginform(2);
        }
    } else if (number == 2) {
        $.changeType('console-input', 'text');
        if (login($TMP$.login, $TMP$.password)) {
            clear([["С возвращением, " + $TMP$.currentUser.name + "!", 'i']]);
            $TMP$.block = false;
            loginSuccess();
        } else {
            addConsoleReturn("Неверный логин, или пароль!<br/>", 'e');
            loginform();
        }
    }
}

function evalCommand(command) {
    if (!$TMP$.block) {
        switch (command.split(' ')[0]) {
            case 'help':
                addConsoleReturn('<pink>#==========Список доступных команд==========#<br/>#==========Основные команды=================#</pink><br/><orange onclick="addCmd(\'help\');">help</orange> - выводит список команд (эта команда)<br/><orange onclick="addCmd(\'eval \'">eval [команда]</orange> - выполняет произвольную JavaScript/JsMobileBasic команду<br/><orange onclick="addCmd(\'clear\');">clear</orange> - очищает экран<br/><orange onclick="addCmd(\'setcolorscheme\');">setcolorscheme тема</orange> - Смена цветовой схемы (desert,elflord,solarized)<br/><pink>#==========Дополнительные команды===========#</pink><br/>' + $Help, 'i');
                break;
            case 'eval':
                if ($TMP$.currentUser.permission == 'admin') {
                    try { eval(command.split(' ')[1]) } catch (e) { addConsoleReturn(e, 'w') };
                } else {
                    addConsoleReturn("У вас недостаточно прав для использования этой команды!", 'e');
                }
                break;
            case 'clear':
                clear();
                break;
            case 'setcolorscheme':
                setColorScheme(command.split(' ')[1]);
                break;
            case '':
                break;
            default:
                if (!moduleCommands(command)) {
                    for (i in $Commands) {
                        if ($Commands[i].cmd == command.split(' ')[0]) {
                            if (($Commands[i].perm == $TMP$.currentUser.permission) || ($TMP$.currentUser.permission == "admin")) {
                                eval($Commands[i].func);
                                return true;
                            }
                        }
                    }
                    addConsoleReturn('Такой команды не существует ;(', 'e');
                    return false;
                }
                break;
        }
    } else {
        block(command);
    }
    saveLog();
}
function addCmd(cmd) {
    input.value = cmd;
    input.focus();
}
//Modules
function moduleCommands(command) {
    return false;
}
function addModule(module) {
    $Modules.push(module);
    saveModules();
    eval(module);
}

function loadModules() {
    var tmp = window.localStorage.getItem('modules');
    $Modules = parseJSON(tmp);
    for (i in $Modules) {
        eval($Modules[i]);
        log("--Модуль " + i + " загружен!");
    }
    log('--Модули загружены!');
}
function saveModules() {
    var tmp = toJSON($Modules);
    window.localStorage.setItem('modules', tmp);
    log('--Модули успешно сохранены в память!');
}

function removeModule(id) {
    $Modules.splice(id, 1);
    saveModules();
    log('--Модуль успешно удалён!');
}
function loadHelp(reload) {
    if (reload) {
        $Help = '';
    }
    for (i in $Commands) {
        if (($Commands[i].perm == $TMP$.currentUser.permission) || ($TMP$.currentUser.permission == "admin")) {
            $Help += '<orange onclick=\'addCmd("' + $Commands[i].cmd + '");\'>' + $Commands[i].cmd + "</orange> <yellow>-</yellow> " + $Commands[i].help + ";<br/>";
        }
    }
    log('Справка по командам успешно загружена!');
}
//API
function toJSON(data) {
    return JSON.stringify(data, 4);
}
function parseJSON(json) {
    return JSON.parse(json);
}

var $ = {
    html: function (element, code) {
        document.getElementById(element).innerHTML = code;
    },
    hide: function (element) {
        document.getElementById(element).style.display = 'none';
    },
    show: function (element) {
        document.getElementById(element).style.display = '';
    },
    changeType: function (element, type) {
        document.getElementById(element).type = type;
    }
}

function toggleInput(toggle) {
    var tmp = document.getElementById("console-input");
    if (toggle) {//enable
        tmp.type = "text";
    } else {//disable
        tmp.type = "hidden";
    }
}
function fullscreen(mode /*0-off;1-on;-1-toggle*/) {
    if (!mode) {
        require('nw.gui').Window.get().enterKioskMode();
    } else if (mode == -1) {
        require('nw.gui').Window.get().toggleKioskMode();
    } else {
        require('nw.gui').Window.get().leaveKioskMode();
    }
}
function clear(returns) {
    pre.innerHTML = 'PROPHESSOR\'s console.<br>Version 1.0';
    if (typeof (returns) !== "undefined") {
        for (i in returns) {
            addConsoleReturn(returns[i][0], returns[i][1]);
            /*console.log(returns[i][0],returns[i][1]);*/
        }
    }
    pre.innerHTML += '<br/>Для просмотра справки - наберите <span class="Statement" onclick="addCmd(\'help\')">help</span>';
    pre.innerHTML += '<br/><br/><span id="L1" class="LineNr">1  </span>';
    counter = 1;
}