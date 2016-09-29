
//(1)cardType = JiBen JinNang ZhuangBei
//cardNum = j/k/q/a/2/3...

//(2)获取卡牌名称及花色
//var cardContent = cards[i].split(" ");
//cardsColorArray[i] =  cardContent[1]

//(3)弃牌时，dock_Nodes = getElementsByAttribute("onclick","card_UsedSelected(event)");
//所以必须先使用 isRoundOver = "true"的dealCard(cards, isRoundOver)函数，弃牌时卡牌才能被选中
//利用发送isRoundOver = "false"的dealCard(cards, isRoundOver)实现顺手牵羊？在卡牌锁定时获得一张牌

//(4)弃牌后所有牌的 enable="true", onclick = ""(有hover效果，弃牌后卡牌展开，卡牌无法点击)
//必须要等到下回合才能select卡牌

//(5)status:显示我方和对方的"出牌阶段"/"弃牌阶段"状态

//(6)正常出牌下（非任务技能，装备）本地判定闪不能使用，杀只能出一次

//(7)"闪" state:正常出牌/被杀/人物技能/装备技能/弃牌
//use_Normal/discard/deal/undo/getHurted
//use_CharacterSkill/use_EquipSkill/discard

//(8)"杀" state:正常出牌
//use_Normal/discard/deal/undo/

//*(9)弃任意张牌后左右槽区的card-number只减1，防止因一次减过多牌出现花屏现象

//(10)控制台中的"去文字特效"在出非装备牌后使用

//(11)为保证前端效果，代码中了setTimeout来设置元素延迟效果
//设置元素属性注意延迟的影响

//TODO:卡牌css调整(前端)
//TODO:退出(前端)
//TODO:音效(前端)
//TODO:背景修饰(前端)

//Done:血量满时不能使用桃
//Done:无装备时杀，闪，桃的判定
//Done:[桃]血量满时不能使用
//Done:[闪]无装备时卡牌只有在弃牌时能点击
//Done:[杀]无装备时只能使用一次
//TODO:被杀时询问是否使用闪
//TODO:决斗时询问是否使用杀
//TODO:南蛮入侵时询问是否使用杀
//TODO:诸葛连弩（装备）
//TODO:丈八蛇矛（装备）
//TODO:青龙偃月刀（装备）
//TODO:顺手牵羊（锦囊）一方随机失去一张牌，被另一方获取
//TODO:过河拆桥（锦囊）一方随机失去一张牌
//TODO:五谷丰登（锦囊）双方随机获得一张牌
//TODO:桃园结义（锦囊）双方各加一点生命
//TODO:计时器
//TODO:。。。

//deal_Card(cards, isRoundOver, character, status);
//解析后端发来的json数据，发送给前端
var jsonAnalysis = function(){

    var cards = new Array();
    cards[0] = "J 顺手牵羊 JinNang shunshou.png";
    cards[1] = "Q 桃 JiBen tao.png";
    cards[2] = "4 杀 JiBen sha.png";
    cards[3] = "K 丈八蛇矛 ZhuangBei zhangba.png";
    cards[4] = "K 闪 JiBen shan.png";

    //判定回合是否结束，考虑顺手牵羊
    var isRoundOver = "true";

    var status = "出牌";
    deal_Card(cards, isRoundOver, status);

};


//弃牌
//TODO:shan_Judge()  弃牌时恢复各个牌的选择
//TODO:sha_Judge()
//TODO:tao_Judge()
//prompt_DiscardCard(0, totalNum);
//remove_Status();
//show_Status(status)
//status="发牌"/"弃牌"
//弃牌  首先改变状态槽status
var card_Discard = function(totalNum){

    var status = "弃牌";

    remove_Status();
    show_Status(status);

    var dock_Nodes = getElementsByAttribute("onclick","card_UsedSelected(event)");
    for(var j = 0; j < dock_Nodes.length; j++){
        dock_Nodes[j].setAttribute("onclick", "card_DiscardSelected(event," + totalNum + ")");
        dock_Nodes[j].setAttribute("discard", "false");   //重要属性
    }

    prompt_DiscardCard(0, totalNum);

    //弃牌时恢复"闪","杀","桃"牌的选择
    var state = "discard";
    sha_Judge(state, totalNum);
    shan_Judge(state, totalNum);
    tao_Judge(state, totalNum);

};


//弃牌时卡牌选择
//prompt_DiscardCard(discard_Div.length, totalNum);   totalNum:需要放弃的总牌数
var card_DiscardSelected = function(event, totalNum){

    //鼠标点击到的是卡牌背景
    var cardImage_Div = event.target;
    var card_Div = cardImage_Div.parentNode;

    if(card_Div.getAttribute("discard") == "false"){
        card_Div.setAttribute("discard", "true");
    }
    else if(card_Div.getAttribute("discard") == "true"){
        card_Div.setAttribute("discard", "false");
    }

    var discard_Div = getElementsByAttribute("discard", "true");
    var undiscard_Div = getElementsByAttribute("discard", "false");

    if(discard_Div.length == totalNum){
        for(var i = 0; i < undiscard_Div.length; i++){
            undiscard_Div[i].setAttribute("onclick", "");
            undiscard_Div[i].setAttribute("enable", "false");
        }
    }
    else if(discard_Div.length < totalNum){

        if(undiscard_Div){
            for(var j = 0; j < undiscard_Div.length; j++){
                if(undiscard_Div[j].getAttribute("enable") == "false"){
                    undiscard_Div[j].setAttribute("enable", "true");
                    undiscard_Div[j].setAttribute("onclick", "card_DiscardSelected(event," + totalNum + ")");
                }
            }
        }
    }

    prompt_DiscardCard(discard_Div.length, totalNum);

};

//consult_DiscardCard()
var prompt_DiscardCard = function(discardNum, totalNum){

    var prompt_Div = document.getElementById("prompt");

    prompt_Div.innerHTML = " 请放弃【 " + discardNum + "/" + totalNum + " 】张手牌";

    if(discardNum == totalNum){
        consult_DiscardCard(totalNum);
    }
    else if(discardNum < totalNum){
        var confirm_Div = document.getElementById("confirm");
        //var cancel_Div = document.getElementById("cancel");

        if(confirm_Div){
            confirm_Div.remove();
            //cancel_Div.remove();
        }
    }
};

var consult_DiscardCard =function(totalNum){

    //问询槽
    var consult_Div = document.getElementById("consult");

    var confirm_Div = document.createElement("DIV");
    confirm_Div.style.left = "calc(50% - 29px)";
    //var cancel_Div = document.createElement("DIV");

    confirm_Div.setAttribute("id","confirm");
    //cancel_Div.setAttribute("id","cancel");

    confirm_Div.setAttribute("onmousedown", "confirm_DiscardCard(" + totalNum + ")");
    //cancel_Div.setAttribute("onmousedown", "undo_DiscardCard()");

    confirm_Div.innerHTML = "确认";
    //cancel_Div.innerHTML = "否";

    consult_Div.appendChild(confirm_Div);
    //consult_Div.appendChild(cancel_Div);

};


//TODO:shan_Judge()
//TODO:shan_Judge() 弃牌后重新判定闪，正常出牌情况下闪不能使用
//TODO:tao_Judge() 弃牌后重新判定桃，如果血量满则不能使用
//TODO:setTimeOut()
//discard_RightCard(i)
//discard_LeftCard(i)
//remove_Status()
//_discardCardAnimation(totalNum)
var confirm_DiscardCard = function(totalNum) {

    var confirm_Div = document.getElementById("confirm");
    var prompt_Div = document.getElementById("prompt");

    confirm_Div.remove();
    prompt_Div.innerHTML = " ";

    //var card_Div = document.getElementsByClassName("card");
    var discard_Div = getElementsByAttribute("discard", "true");
    //alert(discard_Div.length);
    for (var i = 0; i < discard_Div.length; i++) {
        if (discard_Div[i].parentNode.id == "dockRight") {
            discard_RightCard(i);
            //alert("right");
        }
        else if (discard_Div[i].parentNode.id == "dockLeft") {
            discard_LeftCard(i);
            //alert("left");
        }

    }

    //弃牌后恢复为因未选中而锁定的卡牌
    var unable_Div = getElementsByAttribute("enable", "false");
    for (var i = 0; i < unable_Div.length; i++) {
        //unable_Div[i].setAttribute("onclick", "card_UsedSelected(event)");  弃牌后要等对方出牌，此时不能点击牌
        unable_Div[i].setAttribute("enable", "true");
    }

    var status_Div = document.getElementsByClassName("status");
    if(status_Div.length > 0){
        remove_Status();
    }

    setTimeout(_discardCardAnimation(totalNum),210);

};

//totalCards_Set()
var discard_LeftCard = function(i) {

    //获得卡牌数
    var cardNum = cards_Count("dockLeft");
    cardNum = parseInt(cardNum);

    var dockLeft_Div = document.getElementById("dockLeft");
    var discard_Div = getElementsByAttribute("discard", "true");
    discard_Div[i].setAttribute("removed", "true");

    //删除卡牌节点，并减缓卡牌节点删除后的抖动效果
    setTimeout(function(){
        ardNum = cardNum - 1;
        dockLeft_Div.setAttribute("card-number", cardNum);
    },1);
    setTimeout(function(){
        discard_Div[i].remove();
        totalCards_Set();
    },280);

};

//totalCards_Set()
var discard_RightCard = function(i) {

    //获得卡牌数
    var cardNum = cards_Count("dockRight");
    cardNum = parseInt(cardNum);
    var dockRight_Div = document.getElementById("dockRight");
    var discard_Div = getElementsByAttribute("discard", "true");
    discard_Div[i].setAttribute("removed", "true");

    //删除卡牌节点，并减缓卡牌节点删除后的抖动效果
    setTimeout(function(){
        cardNum = cardNum - 1;
        dockRight_Div.setAttribute("card-number", cardNum);
    },1);
    setTimeout(function(){
        discard_Div[i].remove();
        totalCards_Set();
    },280);

};

//discardCardAnimation(totalNum)
var _discardCardAnimation = function(totalNum){
    return function()
    {
        discardCardAnimation(totalNum);
    }
};

//TODO:setTimeout
//_discardingAnimation(j)
var discardCardAnimation = function(totalNum){

    //创建新的卡牌
    for(var i = 0; i < totalNum; i++){
        var arena_Div = document.getElementById("arena");

        var disgardCards_Div = document.createElement("DIV");
        var cardBack_Div = document.createElement("DIV");

        cardBack_Div.innerHTML = "杀";

        disgardCards_Div.setAttribute("class", "cardDiscarding");
        disgardCards_Div.setAttribute("discardCards-position", "player");
        cardBack_Div.setAttribute("class", "cardBack");
        disgardCards_Div.setAttribute("discarding", "false");

        disgardCards_Div.appendChild(cardBack_Div);
        arena_Div.appendChild(disgardCards_Div);

    }

    //发牌特效
    var time = 0;
    var interval = 220;

    for(var j = 0; j < totalNum; j++) {

        setTimeout(_discardingAnimation(j), time);
        time = time + interval;
    }

    //删除添加的卡牌特效，隐藏在角色头像卡牌后的Div
    var timeDelay = time + interval;
    setTimeout(function(){
        var oldCards = document.getElementsByClassName("cardDiscarding");
        if(oldCards){
            for (var k = (oldCards.length-1); k >= 0; k--){
                oldCards[k].remove();
            }
        }
    }, timeDelay);


};

//discardingAnimation(j)
var _discardingAnimation = function (j) {
    return function()
    {
        discardingAnimation(j);
    }
};

var discardingAnimation = function(j){

    parseInt(j);

    var dealCards_DivArray = document.getElementsByClassName("cardDiscarding");

    dealCards_DivArray[j].setAttribute("discarding", "true");

};



//发牌
//TODO:setTimeout
//_dealAnimation()
//_addCardAnimation()
//consult_EndRound(); 询问是否结束回合
var deal_Card = function(cards, isRoundOver, status){

    //创建新的卡牌
    for(i = 0; i<cards.length; i++){
        var arena_Div = document.getElementById("arena");

        var dealCards_Div = document.createElement("DIV");
        var cardBack_Div = document.createElement("DIV");

        cardBack_Div.innerHTML = "杀";

        dealCards_Div.setAttribute("class", "cardDealing");
        dealCards_Div.setAttribute("dealCard-position", "player");
        cardBack_Div.setAttribute("class", "cardBack");
        dealCards_Div.setAttribute("dealing", "false");

        dealCards_Div.appendChild(cardBack_Div);
        arena_Div.appendChild(dealCards_Div);

    }

    //发牌特效
    var time = 0;
    var interval = 220;
    var dealedNum = 0;

    var dealCards_DivArray = document.getElementsByClassName("cardDealing");
    for(var j = 0; j<dealCards_DivArray.length; j++){
        if(dealCards_DivArray[j].getAttribute("dealing") == "true"){
            dealedNum++;
        }
    }
    for(var i = 0; i<cards.length; i++) {

        setTimeout(_dealAnimation(i,dealedNum), time);
        time = time + interval;
    }

    //添加卡片
    var cardsContent = new Array();
    var cardsTypeArray = new Array();

    var timeLeft = 0;
    var timeRight = 0;
    interval = 240;
    var dockname;

    for(k = 0; k<cards.length; k++){

        cardsContent = cards[k].split(" ");
        cardsTypeArray[k] = cardsContent[2];

        if(cardsTypeArray[k] == "JiBen"){
            dockname = "dockLeft";
            setTimeout(_addCardAnimation(dockname, cards[k], isRoundOver, status), time);
            timeLeft = timeLeft + interval;
        }
        else{
            dockname = "dockRight";
            setTimeout(_addCardAnimation(dockname, cards[k], isRoundOver, status), time);
            timeRight = timeRight + interval;
        }
    }

    //删除添加的发卡牌特效，隐藏在角色头像卡牌后的Div
    var timeDelay;
    timeDelay = timeLeft + timeRight + 100;

    setTimeout(function(){
        var oldCards = document.getElementsByClassName("cardDealing");
        if(oldCards){
            for (var k = (oldCards.length-1); k >= 0; k--){
                oldCards[k].remove();
            }
        }

    },timeDelay);

    if(isRoundOver == "true"){
        setTimeout(function(){
            consult_EndRound();
        },timeDelay);
    }

};

//询问是否结束回合
var consult_EndRound = function(){

    var timeDelay = 281;

    setTimeout(function(){

        //问询槽
        var hpCount = hp_count();
        var cardCounts = totalCards_Count();

        //如果剩余卡牌数小于等于生命值，则用弃牌
        var totalNum = cardCounts - hpCount;

        var consult_Div = document.getElementById("consult");

        var confirm_Div = document.createElement("DIV");
        confirm_Div.style.left = "calc(50% - 46px)";
        confirm_Div.style.width = "80px";
        //var cancel_Div = document.createElement("DIV");

        confirm_Div.setAttribute("id","confirm");
        //cancel_Div.setAttribute("id","cancel");

        confirm_Div.innerHTML = "结束回合";
        //cancel_Div.innerHTML = "否";

        consult_Div.appendChild(confirm_Div);
        //consult_Div.appendChild(cancel_Div);

        //如果剩余卡牌数小于等于生命值，则用弃牌,否则卡牌的enable与onclick属性与confirm_DiscardCard()的相同
        if(totalNum > 0){
            confirm_Div.setAttribute("onmousedown", "card_Discard(" + totalNum + ")");
            //cancel_Div.setAttribute("onmousedown", "undo_DiscardCard()");
        }
        else{
            confirm_Div.setAttribute("onmousedown", "confirm_EndRound()");
        }

    }, timeDelay);

};

//remove_Status();
//remove_Consult_EndRound();
var confirm_EndRound = function(){

    var status_Div = document.getElementsByClassName("status");
    if(status_Div.length > 0){
        remove_Status();
    }

    var card_Div = document.getElementsByClassName("card");
    for(var i = 0; i < card_Div.length; i++){
            card_Div[i].setAttribute("onclick", "");
            card_Div[i].setAttribute("enable", "true");
    }
    remove_Consult_EndRound();
};

var remove_Consult_EndRound = function(){

    var confirm_Div = document.getElementById("confirm");
    if(confirm_Div){
        confirm_Div.remove();
    }
};

//dealAnimation(i, dealedNum)
var _dealAnimation = function (i, dealedNum) {
    return function()
    {
        dealAnimation(i, dealedNum);
    }
};


var dealAnimation = function(i, dealedNum){

    parseInt(i);
    parseInt(dealedNum);

    var dealCards_DivArray = document.getElementsByClassName("cardDealing");

    i = i + dealedNum;
    dealCards_DivArray[i].setAttribute("dealing", "true");

};

//setTimeout传参需再写个函数,该函数返回一个不带参数的函数,否则没有延迟效果
//addCardAnimation(dockName, card, isRoundOver, status)
var _addCardAnimation = function(dockName, card, isRoundOver, status){
    return function()
    {
        addCardAnimation(dockName, card, isRoundOver, status);
    }
};


//卡牌添加动画
//TODO:shan_Judge()  正常发牌后，发到的闪不能使用
//TODO:sha_Judge()   将上回合禁止的"杀"牌解禁
//TODO:tao_Judge()   如果生命值满，则不能点击桃子
//show_Status()显示状态槽
//add_LeftCard()
//add_RightCard()
var addCardAnimation = function(dockName, card, isRoundOver, status){

    //防止重复添加，消除时无法一次remove
    var status_Div = document.getElementsByClassName("status");
    if(status_Div.length == 0){
        show_Status(status);
    }

    if(dockName == "dockLeft"){
        add_LeftCard(card, isRoundOver);
    }
    else if(dockName == "dockRight"){
        add_RightCard(card, isRoundOver);
    }

    //正常发牌后，发到的闪不能使用
    var state = "deal";
    sha_Judge(state);
    shan_Judge(state);
    tao_Judge(state);

};



//card = "J 过河拆桥 JinNang guohe.png";   //加cardtype
//totalCards_Set();
var add_RightCard = function(card, isRoundOver){

    //获得卡牌信息
    var cardName;
    var cardImgSrc;
    var cardType;
    var cardContent = card.split(" ");
    cardName = cardContent[1];
    cardType = cardContent[2];
    cardImgSrc = cardContent[3];

    //获得卡牌数
    var cardNum = cards_Count("dockRight");
    cardNum = parseInt(cardNum);

    //添加新卡牌
    var dockRight_Div = document.getElementById("dockRight");
    dockRight_Div.setAttribute("card-number",++cardNum);

    var card_Div = document.createElement("DIV");
    var cardImage_Div = document.createElement("DIV");
    var cardName_Div = document.createElement("DIV");
    var cardType_Div = document.createElement("DIV");

    //<div class="card" >
    card_Div.setAttribute("class", "card");
    card_Div.setAttribute("onclick", "");
    card_Div.setAttribute("onmouseover", "showIntro()");
    card_Div.setAttribute("onmouseout", "hideIntro()");
    card_Div.setAttribute("enable", "true");
    card_Div.setAttribute("discard", "false");
    //  <div class="cardName">
    cardName_Div.setAttribute("class", "cardName");
    //  <div class="cardImage">
    cardImage_Div.setAttribute("class", "cardImage");
    cardImage_Div.style.backgroundImage = "url(assets/image/card/standard/" + cardImgSrc +")";
    //  <div class="cardType">
    cardType_Div.setAttribute("class", "cardType");
    cardType_Div.setAttribute("TypeName", cardType);

    //文字竖排效果
    cardName_Div.innerHTML = cardName;
    cardName_Div.innerHTML =  cardName_Div.innerHTML.split('').join('<br>');

    //cardName是card_Div的第二个子节点，文字不会被图片覆盖
    card_Div.appendChild(cardImage_Div);
    card_Div.appendChild(cardName_Div);
    card_Div.appendChild(cardType_Div);
    dockRight_Div.appendChild(card_Div);

    //重新计算总手牌数
    totalCards_Set();

    //将上回合弃牌后onclick禁止的卡片恢复
    if(isRoundOver == "true"){
        var unclickable_Div = getElementsByAttribute("onclick", "");
        for(var k = 0; k < unclickable_Div.length; k++){
            unclickable_Div[k].setAttribute("onclick", "card_UsedSelected(event)")
        }
    }
    //考虑顺手牵羊，发一张牌但是不能点击牌
    else if(isRoundOver == "false"){
        card_Div = document.getElementsByClassName("card");
        for(var i = 0; i < card_Div.length; i++){
            card_Div[i].setAttribute("onclick", "");
            card_Div[i].setAttribute("enable", "true");
        }
    }

};

//totalCards_Set();
var add_LeftCard = function(card, isRoundOver){

    //获得卡牌信息
    var cardName;
    var cardImgSrc;
    var cardType;
    var cardContent = card.split(" ");
    cardName = cardContent[1];
    cardType = cardContent[2];
    cardImgSrc = cardContent[3];

    //获得卡牌数
    var cardNum = cards_Count("dockLeft");
    cardNum = parseInt(cardNum);

    //添加新卡牌
    var dockLeft_Div = document.getElementById("dockLeft");
    dockLeft_Div.setAttribute("card-number",++cardNum);

    var card_Div = document.createElement("DIV");
    var cardImage_Div = document.createElement("DIV");
    var cardName_Div = document.createElement("DIV");
    var cardType_Div = document.createElement("DIV");

    //<div class="card" >
    card_Div.setAttribute("class", "card");
    card_Div.setAttribute("onclick", "");
    card_Div.setAttribute("onmouseover", "showIntro()");
    card_Div.setAttribute("onmouseout", "hideIntro()");
    card_Div.setAttribute("enable", "true");
    card_Div.setAttribute("discard", "false");
    //  <div class="cardName">
    cardName_Div.setAttribute("class", "cardName");
    //  <div class="cardImage">
    cardImage_Div.setAttribute("class", "cardImage");
    cardImage_Div.style.backgroundImage = "url(assets/image/card/standard/" + cardImgSrc +")";
    //  <div class="cardType">
    cardType_Div.setAttribute("class", "cardType");
    cardType_Div.setAttribute("TypeName", cardType);

    //文字竖排效果
    cardName_Div.innerHTML = cardName;
    cardName_Div.innerHTML =  cardName_Div.innerHTML.split('').join('<br>');

    //cardName是card_Div的第一个子节点
    card_Div.appendChild(cardImage_Div);
    card_Div.appendChild(cardName_Div);
    card_Div.appendChild(cardType_Div);
    dockLeft_Div.appendChild(card_Div);

    //重新计算总手牌数
    totalCards_Set();

    //将上回合弃牌后onclick禁止的卡片恢复
    if(isRoundOver == "true"){
        var unclickable_Div = getElementsByAttribute("onclick", "");
        for(var k = 0; k < unclickable_Div.length; k++){
            unclickable_Div[k].setAttribute("onclick", "card_UsedSelected(event)")
        }
    }
    //考虑顺手牵羊，发一张牌但是不能点击槽区卡牌
    else if(isRoundOver == "false"){
        card_Div = document.getElementsByClassName("card");
        for(var i = 0; i < card_Div.length; i++){
            card_Div[i].setAttribute("onclick", "");
            card_Div[i].setAttribute("enable", "true");
        }
    }

};


//正常出牌时点击卡牌
//prompt_UseCard()
//remove_Consult_EndRound();
var card_UsedSelected = function(event){

    //消除"是否结束回合"问询槽
    remove_Consult_EndRound();

    //鼠标点击到的是卡牌背景
    var cardImage_Div = event.target;
    cardImage_Div.parentNode.setAttribute("selected", "true");

    var card_Div = document.getElementsByClassName("card");

    for(var i = 0; i < card_Div.length; i++){
        if(card_Div[i].getAttribute("selected") != "true"){
            card_Div[i].setAttribute("onclick", "");
            card_Div[i].setAttribute("enable", "false");
        }
    }

    for(var j = 0; j < card_Div.length; j++) {
        if(card_Div[j].getAttribute("selected") == "true"){
            var cardName = card_Div[j].firstChild.nextSibling.textContent;
            var cardType = card_Div[j].lastChild.getAttribute("TypeName");
            prompt_UseCard(cardName, cardType);
            card_Div[j].setAttribute("onclick", "");
        }
    }

    //根据卡片不同变换角色头像的背景颜色
    var target;
    if((cardType == "ZhuangBei") || (cardName == "桃") || (cardName == "无中生有")){
        target = getElementByAttribute("character-position", "player");
        target.setAttribute("target", "true");
    }
    else if((cardName == "杀") || (cardName == "过河拆桥") || (cardName == "顺手牵羊")){
        target = getElementByAttribute("character-position", "rival_player");
        target.setAttribute("target", "true");
    }
};


//提醒槽
//consult_UseCard()
var prompt_UseCard = function(cardName, cardType){

    var prompt_Div = document.getElementById("prompt");
    if((cardType == "ZhuangBei") && (equip_UsedTimes == 1)){
        prompt_Div.innerHTML = "确认使用【" + cardName + "】替换【" + equip_Name + "】?";
        consult_UseCard();
    }
    else{
        prompt_Div.innerHTML = "请问使用【" + cardName + "】吗?";
        consult_UseCard();
    }

};


var consult_UseCard =function(){

    //问询槽
    var consult_Div = document.getElementById("consult");

    var confirm_Div = document.createElement("DIV");
    var cancel_Div = document.createElement("DIV");

    confirm_Div.setAttribute("id","confirm");
    cancel_Div.setAttribute("id","cancel");

    confirm_Div.setAttribute("onmousedown", "confirm_UseCard()");
    cancel_Div.setAttribute("onmousedown", "undo_UseCard()");

    confirm_Div.innerHTML = "是";
    cancel_Div.innerHTML = "否";

    consult_Div.appendChild(confirm_Div);
    consult_Div.appendChild(cancel_Div);

};


//确认出牌
//TODO:shan_Judge() 出牌后重新判定闪，正常出牌情况下闪不能使用
//TODO:sha_Judge() 正常情况下出牌，杀只能使用一次
//hp_Add()
//use_RightCard()
//use_LeftCard()
//line_Animation()
//equip_Animation(cardName, cardType);
//word_Animation(cardName, cardType);
var confirm_UseCard = function(){

    var confirm_Div = document.getElementById("confirm");
    var cancel_Div = document.getElementById("cancel");
    var prompt_Div = document.getElementById("prompt");

    confirm_Div.remove();
    cancel_Div.remove();
    prompt_Div.innerHTML = " ";

    var card_DivArray = document.getElementsByClassName("card");

    for(var i = 0; i < card_DivArray.length; i++){
        var cardName = card_DivArray[i].firstChild.nextSibling.textContent;
        var cardType = card_DivArray[i].lastChild.getAttribute("typename")
        if(card_DivArray[i].getAttribute("selected") == "true") {
            if(card_DivArray[i].parentNode.id == "dockRight"){
                use_RightCard();

                //出牌效果
                line_Animation(cardName);
                word_Animation(cardName, cardType);
                equip_Animation(cardName, cardType);
            }
            else if(card_DivArray[i].parentNode.id == "dockLeft"){
                use_LeftCard();

                //出牌效果
                line_Animation(cardName);
                word_Animation(cardName, cardType);
            }
        }

        //line_Amination放此处会出错
        //line_Amination(cardName);

        if(card_DivArray[i].getAttribute("enable") != "true"){
            card_DivArray[i].setAttribute("onclick", "card_UsedSelected(event)");
            card_DivArray[i].setAttribute("enable", "true");
        }
    }

    var state = "use_Normal";
    sha_Judge(state);
    shan_Judge(state);
    tao_Judge(state);

};


//取消出牌
//TODO:shan_Judge() 正常出牌时，发到的闪不能使用
//TODO:sha_Judge()
//TODO:tao_Judge()
//consult_EndRound();
var undo_UseCard = function(){

    var dock_Nodes = getElementByAttribute("selected","true");
    dock_Nodes.setAttribute("selected","false");

    var confirm_Div = document.getElementById("confirm");
    var cancel_Div = document.getElementById("cancel");
    var prompt_Div = document.getElementById("prompt");

    confirm_Div.remove();
    cancel_Div.remove();
    prompt_Div.innerHTML = " ";

    var card_Div = document.getElementsByClassName("card");

    for(var i = 0; i < card_Div.length; i++){
        if(card_Div[i].getAttribute("onclick") == ""){
            card_Div[i].setAttribute("onclick", "card_UsedSelected(event)");
            card_Div[i].setAttribute("enable", "true");
        }
    }

    //取消角色头像背景特效
    var player_Div = getElementByAttribute("target", "true");
    player_Div.setAttribute("target", "false");

    var state = "undo";
    shan_Judge(state);
    sha_Judge(state);
    tao_Judge(state);

    consult_EndRound();

};

//setTimeout
var use_LeftCard = function(){

    //获得卡牌数
    var cardNum = cards_Count("dockLeft");
    cardNum = parseInt(cardNum);
    var dockLeft_Div = document.getElementById("dockLeft");
    var dock_Nodes = getElementByAttribute("selected","true");
    dock_Nodes.setAttribute("removed", "true");

    //删除卡牌节点，并减缓卡牌节点删除后的抖动效果
    setTimeout(function(){
        dockLeft_Div.setAttribute("card-number", --cardNum);
    },1);
    setTimeout(function(){
        dock_Nodes.setAttribute("selected","false");
    },22);
    setTimeout(function(){
        dock_Nodes.remove();
        totalCards_Set();
    },280);

    //取消角色头像背景特效
    var player_Div = getElementByAttribute("target", "true");
    player_Div.setAttribute("target", "false");

};

//setTimeout
var use_RightCard = function(){

    //获得卡牌数
    var cardNum = cards_Count("dockRight");
    cardNum = parseInt(cardNum);
    var dockRight_Div = document.getElementById("dockRight");
    var dock_Nodes = getElementByAttribute("selected","true");
    dock_Nodes.setAttribute("removed", "true");

    //删除卡牌节点，并减缓卡牌节点删除后的抖动效果
    setTimeout(function(){
        dockRight_Div.setAttribute("card-number", --cardNum);
    },1);
    setTimeout(function(){
        dock_Nodes.setAttribute("selected","false");
    },22);
    setTimeout(function(){
        dock_Nodes.remove();
        totalCards_Set();
    },280);

    //取消角色头像背景特效
    var player_Div = getElementByAttribute("target", "true");
    player_Div.setAttribute("target", "false");

};


//TODO:卡牌判定
var line_Animation = function(cardName){

    //删除上次添加的line
    var oldLine = document.getElementsByClassName("line");
    if(oldLine.length > 0){
        oldLine[oldLine.length-1].remove();
    }

    if((cardName == "杀") || (cardName == "过河拆桥") || (cardName == "顺手牵羊")){

        var arena_Div = document.getElementById("arena");

        var line_Div = document.createElement("DIV");

        line_Div.setAttribute("class", "line");
        line_Div.setAttribute("line-position", "player");

        arena_Div.appendChild(line_Div);
    }

};

var word_Animation = function(cardName, cardType){

    var timeDelay = 750;
    if((cardName == "桃") || (cardName == "闪") || (cardName == "五谷丰登")){
        timeDelay = 200;
    }

    setTimeout(function(){

        var arena_Div = document.getElementById("arena");

        var word_Div = document.createElement("DIV");
        word_Div.setAttribute("class", "word");

        if(cardName == "杀"){
            word_Div.setAttribute("word-type", "Sha");
            word_Div.innerHTML = cardName;
        }
        else if(cardName == "南蛮入侵"){
            word_Div.setAttribute("word-type", "NanMan");
            word_Div.innerHTML = cardName;
        }
        else if(cardName == "闪"){
            word_Div.setAttribute("word-type", "Shan");
            word_Div.innerHTML = cardName;
        }
        else if(cardName == "桃"){
            word_Div.setAttribute("word-type", "Tao");
            word_Div.innerHTML = cardName;
        }
        else if(cardType == "JinNang"){
            word_Div.setAttribute("word-type", "JinNang");
            word_Div.innerHTML = cardName;
        }

        arena_Div.appendChild(word_Div);

    },timeDelay);
};

//setTimeout
//consult_EndRound();
var equip_Animation = function(cardName, cardType){

    var timeDelay = 230;

    setTimeout(function() {

        var avatar_Div;
        var equipBar_Div;

        if (cardType == "ZhuangBei") {
            if (equip_UsedTimes == 1) {
                equipBar_Div = document.getElementsByClassName("equipBar");
                equipBar_Div[equipBar_Div.length - 1].remove();
            }

            avatar_Div = getElementByAttribute("avatar-position", "player");

            equipBar_Div = document.createElement("DIV");

            equipBar_Div.setAttribute("class", "equipBar");
            equipBar_Div.innerText = cardName;
            equip_Name = cardName;

            avatar_Div.appendChild(equipBar_Div);

            equip_UsedTimes = 1;

            //前端装备栏先出现装备再出现问询槽
            setTimeout(function(){
                consult_EndRound();
            },timeDelay)
        }

        //放在此处会出错，使用锦囊时也会显示问询槽
        //consult_EndRound();

    },timeDelay);

};


//hp_Sub()
var hurted_Animation = function(){

    var timeDelay = 610;

    var player_Div = getElementByAttribute("character-position", "player");
    player_Div.setAttribute("hurted", "true");

    setTimeout(function(){
        var player_Div = getElementByAttribute("character-position", "player");
        player_Div.setAttribute("hurted", "false");
    }, timeDelay);

    setTimeout(function(){
        hp_Sub();
    }, (timeDelay-50));

};


//TODO:setTimeout
var dead_Animation = function (){

    var timeDelay = 250;

    var avatar_Div = getElementByAttribute("avatar-position", "player");
    avatar_Div.setAttribute("dead", "true");

    var avatar_childArray = avatar_Div.children;
    for(var i = (avatar_childArray.length-1); i >= 0; i--){
        avatar_childArray[i].remove();
    }

    setTimeout(function(){

        var avatar_Div = getElementByAttribute("avatar-position", "player");

        var lose_Div = document.createElement("DIV");
        lose_Div.setAttribute("class", "lose");
        lose_Div.innerText = "败北";
        avatar_Div.appendChild(lose_Div);


    },timeDelay);

    setTimeout(function(){

        var card_DivArray = getElementsByAttribute("card");
        for(var j = (card_DivArray.length-1); j >=0; j-- ){
            card_DivArray[j].setAttribute("onclick", "");
            card_DivArray[j].setAttribute("enable", "false");
        }

    },timeDelay);

};

//状态槽
var show_Status = function(status){

    var arena_Div = document.getElementById("arena");

    var status_Div =  document.createElement("DIV");

    status_Div.setAttribute("class", "status");
    status_Div.setAttribute("status-character-position", "player");
    status_Div.innerText = "-----" + status + "阶段-----";

    arena_Div.appendChild(status_Div);
};

var remove_Status = function(){

    var status_Div = document.getElementsByClassName("status");
    status_Div[0].remove();

};


//consult_EndRound();
var remove_Word = function(){

    var oldWord = document.getElementsByClassName("word");
    if(oldWord.length > 0){
        oldWord[oldWord.length-1].remove();
    }

    var confirm_Div = document.getElementById("confirm");
    if(!confirm_Div){
        consult_EndRound();
    }
};

var hp_Add = function(){

    var timeDelay = 600;

    setTimeout(function(){

        var hp_Div = getElementByAttribute("hp-position", "player");
        var hp_DivArray = hp_Div.children;
        var hp_Condition;
        for(var i = 0; i < hp_DivArray.length; i++){
            hp_Condition = hp_DivArray[i].getAttribute("class");
            if(hp_Condition == "lost"){
                hp_DivArray[i].setAttribute("class", "");
                break;
            }
        }

        var hpCount = 0;
        for(var j = 0; j < hp_DivArray.length; j++){
            hp_Condition = hp_DivArray[j].getAttribute("class");
            if(hp_Condition == ""){
                hpCount = hpCount + 1;
            }
        }

        if(hpCount > 2){
            hp_Div.setAttribute("hp-condition", "high");
        }
        else if(hpCount == 2){
            hp_Div.setAttribute("hp-condition", "medium");
        }
        else if(hpCount == 1){
            hp_Div.setAttribute("hp-condition", "low");
        }

    }, timeDelay);

};

//dead_Animation();
var hp_Sub = function(){

    var hp_Div = getElementByAttribute("hp-position", "player");
    var hp_DivArray = hp_Div.children;
    var hp_Condition;

    for(var i = (hp_DivArray.length-1); i >= 0; i--){
        hp_Condition = hp_DivArray[i].getAttribute("class");
        if(hp_Condition == ""){
            hp_DivArray[i].setAttribute("class", "lost");
            break;
        }
    }

    var hpCount = 0;
    for(var j = 0; j < hp_DivArray.length; j++){
        hp_Condition = hp_DivArray[j].getAttribute("class");
        if(hp_Condition == ""){
            hpCount = hpCount + 1;
        }
    }

    if(hpCount > 2){
        hp_Div.setAttribute("hp-condition", "high");
    }
    else if(hpCount == 2){
        hp_Div.setAttribute("hp-condition", "medium");
    }
    else if(hpCount == 1){
        hp_Div.setAttribute("hp-condition", "low");
    }
    else if(hpCount == 0){
        dead_Animation();
    }

};


//***************对方动画*********************
//css内设有延迟效果
var lineAnimation_rival = function(){

    //删除上次添加的line
    var oldLine = document.getElementsByClassName("line");
    if(oldLine.length > 0){
        oldLine[oldLine.length-1].remove();
    }

    var arena_Div = document.getElementById("arena");

    var line_Div = document.createElement("DIV");

    line_Div.setAttribute("class", "line");
    line_Div.setAttribute("line-position", "rival_player");

    arena_Div.appendChild(line_Div);

};

//设定对方手牌数,传入最新的手牌数即可
var set_RivalCards = function(cardsNum){

    var cardnum_Div = getElementByAttribute("card-position", "rival_player");
    if(cardsNum >= 3){
        cardnum_Div.setAttribute("num-condition", "high");
    }
    else if((cardsNum >= 1) && (cardsNum < 3)){
        cardnum_Div.setAttribute("num-condition", "medium");
    }
    else if(cardsNum == 0){
        cardnum_Div.setAttribute("num-condition", "low");
    }
    cardnum_Div.innerHTML = cardsNum;
};

var addHP_Rival = function(){

    var hp_Div = getElementByAttribute("hp-position", "rival_player");
    var hp_DivArray = hp_Div.children;
    var hp_Condition;
    for(var i = 0; i < hp_DivArray.length; i++){
        hp_Condition = hp_DivArray[i].getAttribute("class");
        if(hp_Condition == "lost"){
            hp_DivArray[i].setAttribute("class", "");
            break;
        }
    }

    var hpCount = 0;
    for(var j = 0; j < hp_DivArray.length; j++){
        hp_Condition = hp_DivArray[j].getAttribute("class");
        if(hp_Condition == ""){
            hpCount = hpCount + 1;
        }
    }

    if(hpCount > 2){
        hp_Div.setAttribute("hp-condition", "high");
    }
    else if(hpCount == 2){
        hp_Div.setAttribute("hp-condition", "medium");
    }
    else if(hpCount == 1){
        hp_Div.setAttribute("hp-condition", "low");
    }

};

var subHP_Rival = function(){

    var hp_Div = getElementByAttribute("hp-position", "rival_player");
    var hp_DivArray = hp_Div.children;
    var hp_Condition;
    for(var i = (hp_DivArray.length-1); i >= 0; i--){
        hp_Condition = hp_DivArray[i].getAttribute("class");
        if(hp_Condition == ""){
            hp_DivArray[i].setAttribute("class", "lost");
            break;
        }
    }

    var hpCount = 0;
    for(var j = 0; j < hp_DivArray.length; j++){
        hp_Condition = hp_DivArray[j].getAttribute("class");
        if(hp_Condition == ""){
            hpCount = hpCount + 1;
        }
    }

    if(hpCount > 2){
        hp_Div.setAttribute("hp-condition", "high");
    }
    else if(hpCount == 2){
        hp_Div.setAttribute("hp-condition", "medium");
    }
    else if(hpCount == 1){
        hp_Div.setAttribute("hp-condition", "low");
    }


};

var dealCardAnimation_Rival = function(totalNum){

    //创建新的卡牌
    for(i = 0; i < totalNum; i++){
        var arena_Div = document.getElementById("arena");

        var dealCards_Div = document.createElement("DIV");
        var cardBack_Div = document.createElement("DIV");

        cardBack_Div.innerHTML = "杀";

        dealCards_Div.setAttribute("class", "cardDealing");
        dealCards_Div.setAttribute("dealCard-position", "rival-player");
        cardBack_Div.setAttribute("class", "cardBack");
        dealCards_Div.setAttribute("dealing", "false");

        dealCards_Div.appendChild(cardBack_Div);
        arena_Div.appendChild(dealCards_Div);

    }

    //发牌特效
    var time = 0;
    var interval = 220;
    var dealedNum = 0;

    var dealCards_DivArray = document.getElementsByClassName("cardDealing");
    for(var j = 0; j<dealCards_DivArray.length; j++){
        if(dealCards_DivArray[j].getAttribute("dealing") == "true"){
            dealedNum++;
        }
    }
    for(var i = 0; i < totalNum; i++) {

        setTimeout(_dealAnimation(i,dealedNum), time);
        time = time + interval;
    }


    //加载status




    //删除添加的发卡牌特效，隐藏在角色头像卡牌后的Div
    var timeDelay;
    timeDelay = time + 100;

    setTimeout(function(){
        var oldCards = document.getElementsByClassName("cardDealing");
        if(oldCards){
            for (var k = (oldCards.length-1); k >= 0; k--){
                oldCards[k].remove();
            }
        }

    },timeDelay);

};

var discardCardAnimation_Rival = function(totalNum){

    //创建新的卡牌
    for(var i = 0; i < totalNum; i++){
        var arena_Div = document.getElementById("arena");

        var disgardCards_Div = document.createElement("DIV");
        var cardBack_Div = document.createElement("DIV");

        cardBack_Div.innerHTML = "杀";

        disgardCards_Div.setAttribute("class", "cardDiscarding");
        disgardCards_Div.setAttribute("discardCards-position", "rival-player");
        cardBack_Div.setAttribute("class", "cardBack");
        disgardCards_Div.setAttribute("discarding", "false");

        disgardCards_Div.appendChild(cardBack_Div);
        arena_Div.appendChild(disgardCards_Div);

    }

    //发牌特效
    var time = 0;
    var interval = 220;

    for(var j = 0; j < totalNum; j++) {
        //设置discarding = "true"
        setTimeout(_discardingAnimation(j), time);
        time = time + interval;
    }


    //加载status




    //删除添加的卡牌特效，隐藏在角色头像卡牌后的Div
    var timeDelay = time + interval;
    setTimeout(function(){
        var oldCards = document.getElementsByClassName("cardDiscarding");
        if(oldCards){
            for (var k = (oldCards.length-1); k >= 0; k--){
                oldCards[k].remove();
            }
        }
    }, timeDelay);

};

//函数内部设有延迟效果
var wordAnimation_Rival = function(cardName, cardType){

    var timeDelay = 750;
    if((cardName == "桃") || (cardName == "五谷丰登")){
        timeDelay = 200;
    }

    setTimeout(function(){

        var arena_Div = document.getElementById("arena");

        var word_Div = document.createElement("DIV");
        word_Div.setAttribute("class", "word");

        if(cardName == "杀"){
            word_Div.setAttribute("word-type", "Sha");
            word_Div.innerHTML = cardName;
        }
        else if(cardName == "南蛮入侵"){
            word_Div.setAttribute("word-type", "NanMan");
            word_Div.innerHTML = cardName;
        }
        else if(cardName == "闪"){
            word_Div.setAttribute("word-type", "Shan");
            word_Div.innerHTML = cardName;
        }
        else if(cardName == "桃"){
            word_Div.setAttribute("word-type", "Tao");
            word_Div.innerHTML = cardName;
        }
        else if(cardType == "JinNang"){
            word_Div.setAttribute("word-type", "JinNang");
            word_Div.innerHTML = cardName;
        }

        arena_Div.appendChild(word_Div);

    },timeDelay);
};

//出牌效果
var useCardAnimation_Rival = function(){
    lineAnimation_rival();
    wordAnimation_Rival('闪');
};

var removeWordAnimation_Rival = function(){

    var oldWord = document.getElementsByClassName("word");
    if(oldWord.length > 0){
        oldWord[oldWord.length-1].remove();
    }

};

var showStatus_Rival = function(status){

    var status_Div = document.getElementsByClassName("status");
    if(status_Div.length == 0){
        var arena_Div = document.getElementById("arena");

        status_Div =  document.createElement("DIV");

        status_Div.setAttribute("class", "status");
        status_Div.setAttribute("status-character-position", "rival_player");
        status_Div.innerText = "-----" + status + "阶段-----";

        arena_Div.appendChild(status_Div);
    }
};

var removeStatus_Rival = function(){

    var status_Div = document.getElementsByClassName("status");
    if(status_Div.length == 1){
        status_Div[0].remove();
    }
};

//setTimeout
var equipAnimation_Rival = function(cardName){

    var timeDelay = 230;
    setTimeout(function() {

        var avatar_Div;
        var equipBar_Div;


        if (equip_UsedTimes_Rival == 1) {
            equipBar_Div = document.getElementsByClassName("equipBar");
            equipBar_Div[equipBar_Div.length - 1].remove();
        }

        avatar_Div = getElementByAttribute("avatar-position", "rival_player");

        equipBar_Div = document.createElement("DIV");

        equipBar_Div.setAttribute("class", "equipBar");
        equipBar_Div.innerText = cardName;
        equip_Name = cardName;

        avatar_Div.appendChild(equipBar_Div);

        equip_UsedTimes_Rival = 1;


    },timeDelay);


};

//setTimeout
var deadAnimation_Rival = function(){
    var timeDelay = 250;

    var avatar_Div = getElementByAttribute("avatar-position", "rival_player");
    avatar_Div.setAttribute("dead", "true");

    var avatar_childArray = avatar_Div.children;
    for(var i = (avatar_childArray.length-1); i >= 0; i--){
        avatar_childArray[i].remove();
    }

    setTimeout(function(){

        var avatar_Div = getElementByAttribute("avatar-position", "rival_player");

        var lose_Div = document.createElement("DIV");
        lose_Div.setAttribute("class", "lose");
        lose_Div.innerText = "败北";
        avatar_Div.appendChild(lose_Div);


    },timeDelay);
};

//setTimeout
//subHP_Rival();
var hurtedAnimation_Rival = function(){

    var timeDelay = 610;

    var player_Div = getElementByAttribute("character-position", "rival_player");
    player_Div.setAttribute("hurted", "true");

    setTimeout(function(){
        var player_Div = getElementByAttribute("character-position", "rival_player");
        player_Div.setAttribute("hurted", "false");
    }, timeDelay);

    setTimeout(function(){
        subHP_Rival();
    }, (timeDelay-50));

};





//***************卡牌*********************

var shan_Judge = function(state, totalNum){

    var card_DivArray = document.getElementsByClassName("card");
    var cardName;
    //使牌无效
    if((state == "use_Normal") || (state == "undo") || (state == "deal")){
        for(var i = 0; i < card_DivArray.length; i++){
            cardName = card_DivArray[i].firstChild.nextSibling.textContent;
            if(cardName == "闪"){
                card_DivArray[i].setAttribute("onclick", "");
                card_DivArray[i].setAttribute("enable", "false");
            }
        }
    }
    //使牌有效
    else if(state == "discard"){
        for( i = 0; i < card_DivArray.length; i++){
            cardName = card_DivArray[i].firstChild.nextSibling.textContent;
            if(cardName == "闪"){
                card_DivArray[i].setAttribute("onclick", "card_DiscardSelected(event," + totalNum + ")");
                card_DivArray[i].setAttribute("enable", "true");
                //card_Divs[i].setAttribute("discard", "false");
            }
        }
    }


};

var sha_Judge = function(state, totalNum){

    var card_Selected;
    var card_DivArray;
    var cardName;

    card_DivArray = document.getElementsByClassName("card");
    //使多余的牌无效
    if(state == "use_Normal"){

        card_Selected = getElementByAttribute("selected", "true");
        cardName = card_Selected.firstChild.nextSibling.textContent;
        if((cardName == "杀") || (sha_UsedTimes == 1)){
            for(var i = 0; i < card_DivArray.length; i++){
                cardName = card_DivArray[i].firstChild.nextSibling.textContent;
                if(cardName == "杀"){
                    card_DivArray[i].setAttribute("onclick", "");
                    card_DivArray[i].setAttribute("enable", "false");
                }
            }

            sha_UsedTimes = 1;
        }
    }
    //使牌有效
    else if(state == "discard"){

        for( i = 0; i < card_DivArray.length; i++){
            cardName = card_DivArray[i].firstChild.nextSibling.textContent;
            if(cardName == "杀"){
                card_DivArray[i].setAttribute("onclick", "card_DiscardSelected(event," + totalNum + ")");
                card_DivArray[i].setAttribute("enable", "true");
                //card_Divs[i].setAttribute("discard", "false");
            }
        }

    }
    //使牌有效
    else if(state == "deal"){

        var cardAttribute_DivArray = getElementsByAttribute("onclick", "");

        for( i = 0; i < cardAttribute_DivArray.length; i++){
            cardName = cardAttribute_DivArray[i].firstChild.nextSibling.textContent;
            if(cardName == "杀"){
                cardAttribute_DivArray[i].setAttribute("onclick", "card_UsedSelected(event)");
                cardAttribute_DivArray[i].setAttribute("enable", "true");
                //cardAttribute_Divs[i].setAttribute("discard", "false");
            }
            //reset"杀"的使用次数
            sha_UsedTimes = 0;
        }

    }
    //使牌无效
    else if(state == "undo"){

        for( i = 0; i < card_DivArray.length; i++){
            cardName = card_DivArray[i].firstChild.nextSibling.textContent;
            if((cardName == "杀") && (sha_UsedTimes == 1)){
                card_DivArray[i].setAttribute("onclick", "");
                card_DivArray[i].setAttribute("enable", "false");
                //card_Divs[i].setAttribute("discard", "false");
            }
        }

    }

};

var tao_Judge = function (state, totalNum) {

    var card_DivArray;
    var cardName;

    var hp_Div;
    var hp_DivArray;
    var hp_Condition;
    var hpCount;

    if((state == "deal") || (state == "undo")){

        hp_Div = getElementByAttribute("hp-position", "player");
        hp_DivArray = hp_Div.children;
        hpCount = 0;

        for(var j = 0; j < hp_DivArray.length; j++){
            hp_Condition = hp_DivArray[j].getAttribute("class");
            if(hp_Condition == ""){
                hpCount = hpCount + 1;
            }
        }

        //如果生命值为满，则不能点击桃
        if(hpCount == 4){
            card_DivArray = document.getElementsByClassName("card");
            for(var i = 0; i < card_DivArray.length; i++) {
                cardName = card_DivArray[i].firstChild.nextSibling.textContent;
                if(cardName == "桃"){
                    card_DivArray[i].setAttribute("onclick", "");
                    card_DivArray[i].setAttribute("enable", "false");
                }
            }
        }
    }
    else if(state == "discard"){
        card_DivArray = document.getElementsByClassName("card");
        for( i = 0; i < card_DivArray.length; i++){
            cardName = card_DivArray[i].firstChild.nextSibling.textContent;
            if(cardName == "桃"){
                card_DivArray[i].setAttribute("onclick", "card_DiscardSelected(event," + totalNum + ")");
                card_DivArray[i].setAttribute("enable", "true");
                //card_Divs[i].setAttribute("discard", "false");
            }
        }
    }
    else if(state == "use_Normal"){

        var card_Selected = getElementByAttribute("selected", "true");
        cardName = card_Selected.firstChild.nextSibling.textContent;
        if(cardName == "桃"){
            hp_Add();
            //加血的时候设定延迟保证前端效果,所以判定要确保在延迟之后,详见hp_Add()
            var timeDelay = 600;
            setTimeout(function(){

                var hp_Div = getElementByAttribute("hp-position", "player");
                var hp_DivArray = hp_Div.children;
                var hp_Condition;
                var hpCount = 0;

                for(j = 0; j < hp_DivArray.length; j++){
                    hp_Condition = hp_DivArray[j].getAttribute("class");
                    if(hp_Condition == ""){
                        hpCount = hpCount + 1;
                    }
                }

                //如果生命值为满，则不能点击桃，confirm后会将所有牌恢复，所以此处要重判
                if(hpCount == 4){
                    card_DivArray = document.getElementsByClassName("card");
                    for(var i = 0; i < card_DivArray.length; i++) {
                        cardName = card_DivArray[i].firstChild.nextSibling.textContent;
                        if(cardName == "桃"){
                            card_DivArray[i].setAttribute("onclick", "");
                            card_DivArray[i].setAttribute("enable", "false");
                        }
                    }
                }

            }, timeDelay);
        }
        else{
            //防止出现出右边的牌后桃牌先有效后无效的现象
            var hp_Div = getElementByAttribute("hp-position", "player");
            var hp_DivArray = hp_Div.children;
            var hp_Condition;
            var hpCount = 0;

            for(j = 0; j < hp_DivArray.length; j++){
                hp_Condition = hp_DivArray[j].getAttribute("class");
                if(hp_Condition == ""){
                    hpCount = hpCount + 1;
                }
            }

            //如果生命值为满，则不能点击桃，confirm后会将所有牌恢复，所以此处要重判
            if(hpCount == 4){
                card_DivArray = document.getElementsByClassName("card");
                for(var i = 0; i < card_DivArray.length; i++) {
                    cardName = card_DivArray[i].firstChild.nextSibling.textContent;
                    if(cardName == "桃"){
                        card_DivArray[i].setAttribute("onclick", "");
                        card_DivArray[i].setAttribute("enable", "false");
                    }
                }
            }
        }
    }
};



//****************************************
var totalCards_Set = function(){
    var cardNumLeft = cards_Count("dockRight");
    var cardNumRight = cards_Count("dockLeft");
    var totalCardsNum;

    cardNumLeft = parseInt(cardNumLeft);
    cardNumRight = parseInt(cardNumRight);
    totalCardsNum = cardNumLeft + cardNumRight;

    var cardnum_Div = getElementByAttribute("card-position", "player");
    if(totalCardsNum >= 3){
        cardnum_Div.setAttribute("num-condition", "high");
    }
    else if((totalCardsNum >= 1) && (totalCardsNum < 3)){
        cardnum_Div.setAttribute("num-condition", "medium");
    }
    else if(totalCardsNum == 0){
        cardnum_Div.setAttribute("num-condition", "low");
    }
    cardnum_Div.innerHTML = totalCardsNum;
};

var hp_count = function(){

    var hp_Div = getElementByAttribute("hp-position", "player");
    var hp_DivArray = hp_Div.children;
    var hp_Condition;
    var hpCount = 0;

    for(j = 0; j < hp_DivArray.length; j++){
        hp_Condition = hp_DivArray[j].getAttribute("class");
        if(hp_Condition == ""){
            hpCount = hpCount + 1;
        }
    }
    return hpCount;
};

var totalCards_Count = function () {

    var cardNumLeft = cards_Count("dockRight");
    var cardNumRight = cards_Count("dockLeft");
    var totalCardsNum;

    cardNumLeft = parseInt(cardNumLeft);
    cardNumRight = parseInt(cardNumRight);
    totalCardsNum = cardNumLeft + cardNumRight;

    return totalCardsNum;
};

var showWin = function(){

    var timeDelay = 250;
    setTimeout(function(){

        var arena_Div = document.getElementById("arena");

        var word_Div = document.createElement("DIV");
        word_Div.setAttribute("class", "word");

        word_Div.setAttribute("word-type", "Win");
        word_Div.innerHTML = "少侠再战一局?";

        arena_Div.appendChild(word_Div);

    },timeDelay);

};

var showLose = function(){

    var timeDelay = 250;
    setTimeout(function(){

        var arena_Div = document.getElementById("arena");

        var word_Div = document.createElement("DIV");
        word_Div.setAttribute("class", "word");

        word_Div.setAttribute("word-type", "Lose");
        word_Div.innerHTML = "胜败乃兵家常事";

        arena_Div.appendChild(word_Div);

    },timeDelay);

};

var showIntro = function(){

    var arena_Div = document.getElementById("arena");
    var intro_Div = document.createElement("DIV");
    var introName_Div = document.createElement("DIV");
    var introContent_Div = document.createElement("DIV");
    var IntroNotice_Div = document.createElement("DIV");


    intro_Div.setAttribute("class", "intro");
    introName_Div.setAttribute("class", "introName");
    introContent_Div.setAttribute("class", "introContent");

    var cardName = "杀";
    introName_Div.innerText = "【" + cardName + "】";
    introContent_Div.innerHTML = Intro_Judge(cardName);

    intro_Div.appendChild(introName_Div);
    intro_Div.appendChild(introContent_Div);
    arena_Div.appendChild(intro_Div);
};

var Intro_Judge = function(cardName){

    var intro_Content;

    if(cardName == "杀"){
        intro_Content = "★效果：在你的出牌阶段，对另外一名角色使用，对该角色造成1点伤害。" + '<br/>' + '<br/>' +
            "★注意：每个出牌阶段你只能使用一张【杀】。";
        return intro_Content;
    }
};

var hideIntro = function(){

    var intro_Div = document.getElementsByClassName("intro");
    if(intro_Div.length){
        intro_Div[intro_Div.length-1].remove();
    }
};


//计算dockLeft或dockRight中的卡牌数
var cards_Count = function(dock){
    var cardNum = 0;
    var divs = document.getElementById(dock).childNodes;
    for(var i = 0;i < divs.length; i++){
        if(divs[i].className = "card")
            cardNum++;
    }
    return cardNum;
};

function getElementByAttribute(attribute, attributeValue){
    var elementArray;
    var matchedArray;

    elementArray = document.getElementsByTagName("*");

    for (var i = 0; i < elementArray.length; i++)
    {
        if (elementArray[i].getAttribute(attribute) == attributeValue)
        {
            matchedArray = elementArray[i];
        }
    }
    return matchedArray;
}

function getElementsByAttribute(attribute, attributeValue) {
    var elementArray;
    var matchedArray = new Array();

    elementArray = document.getElementsByTagName("*");

    for (var i = 0; i < elementArray.length; i++) {
        if (elementArray[i].getAttribute(attribute) == attributeValue) {
            matchedArray[matchedArray.length] = elementArray[i];
        }
    }
    return matchedArray;
}



//***************全局变量*********************
//TODO:全局变量
var sha_UsedTimes = 0;

var equip_UsedTimes = 0;
//装备区的装备名称
var equip_Name;

var equip_UsedTimes_Rival = 0;