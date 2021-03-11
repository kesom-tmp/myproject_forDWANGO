//Aliases
let Application = PIXI.Application,
    loader = PIXI.loader,
    TextureCache = PIXI.TextureCache,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Container = PIXI.Container,
    Rectangle = PIXI.Rectangle,
    Text = PIXI.Text,
    Graphics = PIXI.Graphics,
    id = loader.resources;

//アプリケーション宣言
const wi = window.getComputedStyle(document.getElementById("main","")).width;
const divWidth = Number(wi[0]+wi[1]+wi[2]);
const mobileDivWidthPercent = 90;//スマホのときのdiv.mainの横幅（画面横幅比パーセント）
const width = 500;
const height = 600;
const playableHeight = 500;

let app= new Application({
    width:width, 
    height:height,
    antialias: true,
    transparent: false,
    resolution: 1,
    autoResize: true,
    backgroundColor:0xAAAAAA,
});
//貼り付け
document.getElementById("game").appendChild(app.renderer.view);
let resizeRatio;
screenResize();

const fuCo = [[12,2],[10,12],[1,22],[27,18]];
const fuAnchor = [[10,8],[2,5],[11,1],[1,1]];
const suCo = [[19,1],[8,9],[1,9],[23,7]];
const suAnchor = [[3,13],[14,1],[18,2],[1,3]];



//定数宣言
//マップチップ系統
const maptipNum = 25;
const maptipSize = 50;//１チップの1辺の長さ
const senseAreaNum = 60;
const senseTipSize = maptipNum*maptipSize/senseAreaNum;

const playAreaHeight = height*5/6;

//ふすの能力系統
const sensableRange = 3;//感知器を中心に3×3を感知
const sensableKind = 5;//ふ、す、草、敵、実
const surroundingSensableRange = 3;//3×3
const selfSensableKind = 9;//左角度、右角度、左伸ばし、右伸ばし、エネルギー、サイズ、水分量,vx,vy
const surroundingSensableKind = 3;//標高、気温、湿度
const creatureInputKind = 5;//ｘ、ｙ、サイズ、ｖｘ、ｖｙ;



//ニューロン系統
const inputKind = [[sensableKind],[selfSensableKind],[surroundingSensableRange**2,surroundingSensableKind]];//腕、自身、地形
const inputLayerNum = inputKind[0]*creatureInputKind+inputKind[1]+inputKind[2][0]*inputKind[2][1];
const hiddenLayerNum = 50;
const outputLayerNum = 7;
const geneNum = [sensableKind*creatureInputKind*hiddenLayerNum, selfSensableKind*hiddenLayerNum, 
                (surroundingSensableRange**2)*surroundingSensableKind*hiddenLayerNum, hiddenLayerNum*outputLayerNum];

const fusuSenseKind = 3;
const fusuSensePeriod = 10;//10フレーム後に次の感知
const fusuCalcKind = 6;//
const fusuCalcPeriod = 10;

const fuTextureSize = 40;
const suTextureSize = 40;
const kusaTextureSize = 30;
const tekiTextureSize = 100;


//草のデザイン
const kusaNutritionRate = 0.01;
const kusaNutritionAttenuation = 1;
const kusaWaterRate = 0.01;
const kusaWaterAttenuation = 1;
const kusaBasalMetabo = 0.001;//kusaNutritionRate*0.3;
const kusaMetaboRate = 0.001;//0.001;
const kusaBasalWaterConsume = kusaWaterRate*0.01;
const kusaBearStandard = 2;
const kusaEnergyMin = 0.6;

//実のデザイン
const fruitNum = 3;
const fruitEnergy = 0.5;
const fruitRange = [0,4,30,13];
const fruitExcretionTime = 300;
const fruitSproutTime = 300;
const babyKusaSize = 1;

//ふすのデザイン
const fusuEnergyMin = 0.01;
const fusuEatRange = 10;
const fusuEatCo = [[18,26],[17,20]];
const fusuBasalMetabo = 0.00005;
const fusuMetaboRate = 0.00007;
const fusuWaterConsume = 0.00007;
const excessionLossRate =　0.00005;
const elevationLossRate = 0.00005;
const moveLossRate = 0.00005;
const rotateLossRate = 0.00005;
const stretchLossRate = 0.00005;
const fusuGrowV = 0.05;
const sizeMin = 0.05;
const sizeMax = 3;
const sizeChangeFrequency = 60;
const eatTime = 60;
const hitRangeRate = 1;

const fuckEnergyMin = 1.5;
const fuckSizeMin = 1.5;
const fuckDistance = [15,-10];
const fuckV = 0.1;
const fuckSpeed = 0.2;
const fuckSwing = 0.5;
const fuFuckCo = [11,34,26,29];//オスｘ、ｙ　メスｘ、ｙ
const suFuckCo = [12,35,24,25];
const fuckCo = [fuFuckCo, suFuckCo];
const fuckGap = Math.PI*1/3;
const fuckRotation = [[0, Math.PI/4, Math.PI*1.1, -Math.PI/5],[-Math.PI/5, -Math.PI*1.3, Math.PI/10, 0]];//オス左右、メス左右
const fuckHandSwing = 0.5;
const fuckTime = 180;
const birthSpeed = 20;//1フレームに遺伝子を作る戸数
const heartNum = 4;
const babyEnergy = 0.5;

const tempStandard = 0.5;
const tempTired = 0.00001;

const vMult = [0.00005,0.00005,0.001,0.001,0.001,0.001,0.001,0.01];
const stretchMax = 40;
const vMax = 1;
const rotateVMax = 0.1;
const stretchVMax = 1;

const damageRate = 0.0000001;
const damageTime = 30;
const damageMoveV = 10;

//敵のデザイン
const tekiHP = 500;
const tekiWater = 5;
const tekiV = 2;
const tekiMoveTime = 500;
const tekiSensableRange = 5;
const tekiHPRate = tekiHP/1800;
const tekiAppearStandard = [30,50,65,75,85,90,94,98];
const tekiDieNutrition = 10;
const tekiDieNutritionTip = 30;
const tekiSize = 1;

//気象のデザイン
const sunTempAdd =   0.00003;
const tempDecrease = 0.0001;
const tempAdjust = 0.7;

const airCalcNum = maptipNum*3/5;
const pressureMigrateRate = 0.3;
const rainRate = 0.33;
const rainAmount = 0.00001;
const kusaSunEnergyRate = 0.1;
const rainTime = 60;
const rainAnimeNum = 3;
const rainOriSize = 40;

const firstFuSuNum = 5;
const firstKusaNum = 100;




//クラス
class creature extends Container {
    constructor(){
        super();
        this.vx = this.vy = 0;
        this.energy = 1;
        this.water = 1;
        this.handStretchLength = [1,1];
        this.t = 0;
        this.eatFlag = 0;
        this.eatT = 0;

        this.rotatev = [0,0];
        this.stretchv = [0,0];

        this.maptip = [[0,0],[0,0]];

        this.state = 0;//0生存　1死　２ファック　３つかまれ

        this.fucking = 0;
        this.fuckt = 0;

        this.damaged = 0;

        this.sizeV = 0;

        this.eatenFruit = [];

        this.input = [];//
        for(let i=0;i<3;i++){
            this.input.push([]);
        }
        

        this.output = [0,0,0,0,0,0,0];//移動距離、左右腕回転、左右腕伸ばし、発情

        //入力初期化
        for(let i=0;i<inputKind[0];i++){
            this.input[0].push([]);
        }
        this.input[1] = [];
        for(let i=0;i<selfSensableKind;i++){
            this.input[1].push(0);
        }
        for(let i=0;i<inputKind[2][0];i++){
            this.input[2].push([0,0,0]);
        }

        
        
        
        movableObjectAry.push(this);
        displayObjectAry.push(this);
        sensableObjectAry.push(this);
        fusuAry.push(this);
    }

    calc = () =>{
        let leftRotateCalc=()=>{
            this.rotatev[0] += this.makeOutput(0);
            this.energy -= Math.floor(this.rotatev[0]/rotateVMax)*excessionLossRate;
            this.rotatev[0] = Math.max(Math.min(this.rotatev[0],rotateVMax),rotateVMax);
        };
        let rightRotateCalc=()=>{
            this.rotatev[1] += this.makeOutput(1);
            this.energy -= Math.floor(this.rotatev[1]/rotateVMax)*excessionLossRate;
            this.rotatev[1] = Math.max(Math.min(this.rotatev[1],rotateVMax),rotateVMax);
        };
        let leftStretchCalc=()=>{
            this.stretchv[0] += this.makeOutput(2);
            this.energy -= Math.floor(this.stretchv[0]/stretchVMax)*excessionLossRate;
            
        };
        let rightStretchCalc=()=>{
            this.stretchv[1] += this.makeOutput(3);
            this.energy -= Math.floor(this.stretchv[0]/stretchVMax)*excessionLossRate;
        };
        let moveCalc=()=>{
            this.vx += this.makeOutput(4);
            this.vy += this.makeOutput(5);
            this.energy -= Math.floor(this.vx/vMax)*excessionLossRate;
            this.energy -= Math.floor(this.vy/vMax)*excessionLossRate;
        };
        let sizeCalc=()=>{
            this.sizeV = this.makeOutput(6);
        }
        return  [leftRotateCalc, rightRotateCalc, leftStretchCalc, rightStretchCalc, moveCalc,sizeCalc];
    }

    makeOutput(n){
        let hidden = [];
        for(let a=0;a<hiddenLayerNum;a++){
            hidden.push(0);
            for(let i=0;i<sensableKind;i++){//腕からの入力について、クリーチャーの種類ごとに
                for(let j=0;j<creatureInputKind;j++){//入力情報の種類ごとに（位置、サイズ、速度)
                    for(let k=0;k<this.input[0][i].length;k++){//オブジェクトごとに
                        hidden[a] += this.input[0][i][k][j] * this.gene[0][a*sensableKind*creatureInputKind + i*creatureInputKind+j];
                    }
                }
            }
            
            for(let i=0;i<selfSensableKind;i++){//自身からの入力について
                hidden[a] += this.input[1][i] * this.gene[1][a*selfSensableKind+i];
            }
            
            for(let i=0;i<surroundingSensableRange**2;i++){//周囲からの情報について、マスごとに
                for(let j=0;j<surroundingSensableKind;j++){//入力情報の種類ごとに（標高、気温、湿度）
                    hidden[a] += this.input[2][i][j] * this.gene[2][i*surroundingSensableRange+j];
                 }
            }
        }
        

        let output = 0;
        for(let a=0;a<hiddenLayerNum;a++){
            output += hidden[a] * this.gene[3][n*hiddenLayerNum+a];
        }
        output *= vMult[n]
        return output;
    }

    leftHandRotate(){
        //x,yに向かってロープを曲げる
        //感覚器官座標を計算する
        let angle = this.rotatev[0];
        this.parts[2].rotation += angle;
    }
    rightHandRotate(){
        //x,yに向かってロープを曲げる
        //感覚器官座標を計算する
        let angle = this.rotatev[1];
        this.parts[3].rotation += angle;
    }
    leftHandStretch(){
        let d = this.stretchv[0];
        this.handStretchLength[0] = Math.max(Math.min(this.handStretchLength[0]+d, stretchMax*this.size),0);
        this.parts[2].vertices[this.leftHandVerticy] = this.handCo[0][0] + this.handStretchLength[0]*Math.sin(this.handAngle[0]);
        this.parts[2].vertices[this.leftHandVerticy+1] = this.handCo[0][1] + this.handStretchLength[0]*Math.cos(this.handAngle[0]);
    }
    rightHandStretch(){
        let d = this.stretchv[1];
        this.handStretchLength[1] = Math.max(Math.min(this.handStretchLength[1]+d,stretchMax*this.size),0);
        this.parts[3].vertices[this.rightHandVerticy] = this.handCo[1][0] + this.handStretchLength[1]*Math.sin(this.handAngle[1]);
        this.parts[3].vertices[this.rightHandVerticy+1] = this.handCo[1][1] + this.handStretchLength[1]*Math.cos(this.handAngle[1]);
    }

    handSense = () =>{
        //入力の初期化
        for(let i=0;i<inputKind[0];i++){
            this.input[0][i] = [];
        }

        let nowHandCo = [//左感知器の座標
            this.rx+this.parts[2].x*this.size+(this.originHandLength[0]+this.handStretchLength[0])*Math.sin(this.handAngle[0]-this.parts[2].rotation),
            this.ry+this.parts[2].y*this.size+(this.originHandLength[0]+this.handStretchLength[0])*Math.cos(this.handAngle[0]-this.parts[2].rotation),
        ];
        let nowHandSenseTip = [Math.floor(nowHandCo[0]/senseTipSize), Math.floor(nowHandCo[1]/senseTipSize), Math.floor(nowHandCo[2]/senseTipSize), Math.floor(nowHandCo[3]/senseTipSize)];
        for(let i=0;i<sensableRange;i++){
            for(let j=0;j<sensableRange;j++){
                let tipx = mod(nowHandSenseTip[0]-1 + i,senseAreaNum);
                let tipy = mod(nowHandSenseTip[1]-1 + j,senseAreaNum);
                    for(let k=0;k<objectsOnTip[tipy*senseAreaNum+tipx].length;k++){
                        if(objectsOnTip[tipy*senseAreaNum+tipx][k]!=this){
                            this.input[0][objectsOnTip[tipy*senseAreaNum+tipx][k].character]
                            .push([this.rx-objectsOnTip[tipy*senseAreaNum+tipx][k].rx,this.ry-objectsOnTip[tipy*senseAreaNum+tipx][k].ry,objectsOnTip[tipy*senseAreaNum+tipx][k].size,
                                objectsOnTip[tipy*senseAreaNum+tipx][k].vx, objectsOnTip[tipy*senseAreaNum+tipx][k].vy]);//オブジェクト感知
                        }
                    }
            }
        }

        nowHandCo = [//右感知器の座標
            this.rx+this.parts[3].x*this.size+(this.originHandLength[1]+this.handStretchLength[1])*Math.sin(this.handAngle[1]-this.parts[3].rotation),
            this.ry+this.parts[3].y*this.size+(this.originHandLength[1]+this.handStretchLength[1])*Math.cos(this.handAngle[1]-this.parts[3].rotation)
        ];
        //感知器の感知チップにおける座標
        nowHandSenseTip = [Math.floor(nowHandCo[0]/senseTipSize), Math.floor(nowHandCo[1]/senseTipSize), Math.floor(nowHandCo[2]/senseTipSize), Math.floor(nowHandCo[3]/senseTipSize)];
        for(let i=0;i<sensableRange;i++){
            for(let j=0;j<sensableRange;j++){
                let tipx = mod(nowHandSenseTip[0]-1 + i,senseAreaNum);//左上から始める
                let tipy = mod(nowHandSenseTip[1]-1 + j,senseAreaNum);
                    for(let k=0;k<objectsOnTip[tipy*senseAreaNum+tipx].length;k++){
                        if(objectsOnTip[tipy*senseAreaNum+tipx][k]!=this){
                            this.input[0][objectsOnTip[tipy*senseAreaNum+tipx][k].character]
                            .push([this.rx-objectsOnTip[tipy*senseAreaNum+tipx][k].rx,this.ry-objectsOnTip[tipy*senseAreaNum+tipx][k].ry,objectsOnTip[tipy*senseAreaNum+tipx][k].size,
                                objectsOnTip[tipy*senseAreaNum+tipx][k].vx, objectsOnTip[tipy*senseAreaNum+tipx][k].vy]);//オブジェクト感知
                        }
                    }
            }
        }
    }
    selfSense=()=>{
        //初期化
        this.input[1]=[];
        this.input[1].push(this.handAngle[0],this.handAngle[1],this.handStretchLength[0],this.handStretchLength[1],this.energy,this.water,this.size,this.vx,this.vy);
        
    }
    surroundingSense =()=>{
        //初期化
        for(let i=0;i<surroundingSensableRange**2;i++){
            this.input[2][i] = [];
        }
        let co = [mod(Math.floor((this.rx+this.oriSize*this.size)/maptipSize),maptipNum), mod(Math.floor((this.ry+this.oriSize*this.size)/maptipSize),maptipNum)];
        this.maptip[1] = this.maptip[0];
        this.maptip[0] = co;
         
        for(let i=0;i<surroundingSensableRange;i++){
            for(let j=0;j<surroundingSensableRange;j++){
                let tipX = mod(co[0]-1+i,maptipNum);
                let tipY = mod(co[1]-1+j,maptipNum);
                if(tipX>=0 && tipX<=maptipNum-1 && tipY>=0 && tipY<=maptipNum-1){
                    let tip = maptipAry[tipX+tipY*maptipNum]
                    this.input[2][i+j*surroundingSensableRange].push(tip.elevation, tip.temp, tip.humidity);
                } else {
                    this.input[2][i+j*surroundingSensableRange].push(10,-1,-1);
                }
            }
        }
    }
    get sense() {
        return [this.handSense,this.selfSense,this.surroundingSense];
    }


    

    fuck(){
        //ダミー
    }
    maleFuck = ()=>{//オス
        this.vx = -((this.rx+fuckCo[this.character][0]*this.size)-(this.fuckPartner.rx+fuckCo[this.character][2]*this.fuckPartner.size))*fuckV;
        this.vy = -((this.ry+fuckCo[this.character][1]*this.size)-(this.fuckPartner.ry+fuckCo[this.character][3]*this.fuckPartner.size))*fuckV;
        
        this.parts[1].rotation = Math.sin(this.fuckt*fuckSpeed)**2*fuckSwing/(this.size*0.9);
        
        this.parts[2].rotation = fuckRotation[this.character][0] + Math.sin(this.fuckt*fuckSpeed)**2*fuckHandSwing;
        this.parts[3].rotation = fuckRotation[this.character][1] - Math.sin(this.fuckt*fuckSpeed)**2*fuckHandSwing;
        this.alpha = 1;
        //this.parts[2].rotation += 0.1;

        this.fuckt += 1 + loopNum;
        for(let i=0;i<heartNum;i++){
            if(this.fuckt%10==0){
                this.heartAry[i].alpha = Math.floor(Math.random()*2);
            } 
        }
        if(this.fuckt >= fuckTime){
            this.fucking = 0;
            this.state = 0;
            this.fuckt = 0;
            for(let i=0;i<heartNum;i++){
                this.heartAry[i].alpha = 0;
            }
            this.parts[1].rotation = 0;
            this.parts[2].rotation = 0;
            this.parts[3].rotation = 0;
        }
    }
    femaleFuck = () =>{//メス
        this.vx = -((this.rx+fuckCo[this.character][2]*this.size)-(this.fuckPartner.rx+fuckCo[this.character][0]*this.fuckPartner.size))*fuckV;
        this.vy = -((this.ry+fuckCo[this.character][3]*this.size)-(this.fuckPartner.ry+fuckCo[this.character][1]*this.fuckPartner.size))*fuckV;

        this.parts[1].rotation = Math.sin(this.fuckt*fuckSpeed-fuckGap)**2*fuckSwing/(this.size*1.1);
        this.parts[2].rotation = fuckRotation[this.character][2]+ Math.sin(this.fuckt*fuckSpeed)**2*fuckHandSwing;
        this.parts[3].rotation = fuckRotation[this.character][3]- Math.sin(this.fuckt*fuckSpeed)**2*fuckHandSwing;
        this.alpha = 1;

        this.fuckt += 1 + loopNum;

        for(let i=0;i<heartNum;i++){
            if(this.fuckt%10==0){
                this.heartAry[i].alpha = Math.floor(Math.random()*2);
            } 
        }

        if(this.fuckt >= fuckTime){
            this.fucking = 3;//妊娠
            this.fuckt = 0;
            this.babyGene = [];
            for(let i=0;i<geneNum.length;i++){
                this.babyGene.push([]);
            }
            this.geneMaking = 0;
            this.birtht = 0;
            for(let i=0;i<heartNum;i++){
                this.heartAry[i].alpha = 0;
            }
            this.parts[1].rotation = 0;
            this.parts[2].rotation = 0;
            this.parts[3].rotation = 0;
        }

        

    }
    birth = ()=>{
        this.parts[0].rotation += 0.5-Math.random();
        this.parts[2].rotation += 0.5-Math.random();
        this.parts[3].rotation += 0.5-Math.random();
        const babyKind = [fu, su];
        for(let i=0;i<birthSpeed;i++){
            if(this.birtht < geneNum[this.geneMaking]){
                let gene;
                if(Math.random() > 0.5){
                    gene = this.gene[this.geneMaking][this.birtht];
                } else {
                    gene = this.fuckPartner.gene[this.geneMaking][this.birtht];
                }
                if(Math.random() < 0.01){
                    gene = 0.5-Math.random();
                }
                this.babyGene[this.geneMaking].push(gene);
                this.birtht ++;
            } else {
                this.birtht = 0;
                this.geneMaking ++;
            }
            if(this.geneMaking >= geneNum.length){
                this.fucking = 0;
                this.state = 0;
                let baby = new babyKind[this.character](this.rx, this.ry, 0.5, this.babyGene);
                playArea.addChild(baby);
                this.energy -= babyEnergy;
                this.parts[0].rotation =0;
                this.parts[2].rotation =0;
                this.parts[3].rotation =0;
                break;
            }
        }

        
    }
    searchFuck = ()=>{
        for(let i=0;i<sensableRange;i++){
            for(let j=0;j<sensableRange;j++){
                let tipx = Math.floor(this.rx/maptipSize)-1+i;
                let tipy = Math.floor(this.ry/maptipSize)-1+j;
                let ary = objectsOnHitTip[mod(tipy,maptipNum)*maptipNum+mod(tipx,maptipNum)][this.character];//同種個体配列
                for(let k=0;k<ary.length;k++){
                    if(hypo(this.rx+this.oriSize*this.size/2, this.ry+this.oriSize*this.size/2, ary[k].rx+ary[k].oriSize*ary[k].size/2, ary[k].ry+ary[k].oriSize*ary[k].size)
                            <= this.oriSize*this.size/2 + ary[k].oriSize*ary[k].size/2//重なったら
                        && this.energy >= fuckEnergyMin && ary[k].energy >= fuckEnergyMin && ary[k].fucking == 0//栄養があって交尾中でなければ
                        && this.size >= fuckSizeMin && ary[k].size >= fuckSizeMin//サイズ下限
                        && ary[k] != this){//自分自身でなければ
                            this.fucking = 1 + Math.floor(Math.random()*2);//雌雄の決定
                            ary[k].fucking = 1 + (this.fucking)%2;
                            this.state = 2;
                            ary[k].state = 2;
                            this.fuckPartner = ary[k];
                            ary[k].fuckPartner = this;
                            this.vx = this.vy = this.rotatev[0] = this.rotatev[1] = this.stretchv[0] = this.stretchv[1] = 0;
                            ary[k].vx = ary[k].vy = ary[k].rotatev[0] = ary[k].rotatev[1] = ary[k].stretchv[0] = ary[k].stretchv[1] = 0;
                            this.parts[2].vertices[this.leftHandVerticy] = this.handCo[0][0] + Math.sin(this.handAngle[0]);
                            this.parts[2].vertices[this.leftHandVerticy+1] = this.handCo[0][1] + Math.cos(this.handAngle[0]);
                            this.parts[3].vertices[this.rightHandVerticy] = this.handCo[1][0] + Math.sin(this.handAngle[1]);
                            this.parts[3].vertices[this.rightHandVerticy+1] = this.handCo[1][1] + Math.cos(this.handAngle[1]);
                            this.fuckPartner.parts[2].vertices[this.fuckPartner.leftHandVerticy] = this.fuckPartner.handCo[0][0] + Math.sin(this.fuckPartner.handAngle[0]);
                            this.fuckPartner.parts[2].vertices[this.fuckPartner.leftHandVerticy+1] = this.fuckPartner.handCo[0][1] + Math.cos(this.fuckPartner.handAngle[0]);
                            this.parts[3].vertices[this.rightHandVerticy] = this.handCo[1][0] + Math.sin(this.handAngle[1]);
                            this.fuckPartner.parts[3].vertices[this.fuckPartner.rightHandVerticy+1] = this.fuckPartner.handCo[1][1] + Math.cos(this.fuckPartner.handAngle[1]);
                            this.alpha = 1;
                            this.fuckPartner.alpha = 1;
                            this.parts[1].scale.set(1,1);
                            this.fuckPartner.parts[1].scale.set(1,1);
                    }
                }
            }
        }
    }
    get fuckAct(){
        return [this.searchFuck, this.maleFuck, this.femaleFuck, this.birth];
    }

    eat(){
        for(let a=0;a<sensableRange;a++){//周囲3×3
            for(let b=0;b<sensableRange;b++){
                let tipx = Math.floor(this.rx/maptipSize)-1+a;
                let tipy = Math.floor(this.ry/maptipSize)-1+b;
                let ary = objectsOnHitTip[mod(tipy,maptipNum)*maptipNum+mod(tipx,maptipNum)][Math.abs(this.character-1)];
                for(let i=0;i<ary.length;i++){//ふはすを、すはふを食う
                    if(hypo(this.rx+fusuEatCo[this.character][0],this.ry+fusuEatCo[this.character][1],ary[i].rx+ary[i].oriSize*ary[i].size/2,ary[i].ry+ary[i].oriSize)<=ary[i].oriSize*ary[i].size/2+fusuEatRange*this.size){
                        if(ary[i].energy <= fusuEnergyMin && this.eatFlag ==0){
                            this.energy += Math.abs(ary[i].energy);
                            this.water += Math.abs(ary[i].water);
                            ary[i].beEaten();
                            this.eatFlag = 1;
                            this.grow();
                        }
                    }
                }
                ary = objectsOnHitTip[mod(tipy,maptipNum)*maptipNum+mod(tipx,maptipNum)][2];
                for(let i=0;i<ary.length;i++){//草を食う
                    if(hypo(this.rx+fusuEatCo[this.character][0]*this.size,this.ry+fusuEatCo[this.character][1]*this.size,ary[i].rx+ary[i].oriSize*ary[i].size/2,ary[i].ry+ary[i].oriSize)<=ary[i].oriSize*ary[i].size/2+fusuEatRange*this.size
                        && this.eatFlag==0){
                        this.energy += ary[i].nutrition;
                        this.water += ary[i].water;
                        ary[i].beEaten();
                        this.eatFlag = 1;
                        this.grow();
                    }
                }
                ary = objectsOnHitTip[mod(tipy,maptipNum)*maptipNum+mod(tipx,maptipNum)][4];//実を食う
                for(let i=0;i<ary.length;i++){
                    if(hypo(this.rx+fusuEatCo[this.character][0],this.ry+fusuEatCo[this.character][1],ary[i].rx+ary[i].oriSize*ary[i].size/2,ary[i].ry+ary[i].oriSize)<=ary[i].oriSize*ary[i].size/2+fusuEatRange*this.size
                        && this.eatFlag ==0){
                        this.energy += ary[i].nutrition;
                        this.water += ary[i].water;
                        ary[i].beEaten();
                        this.eatFlag = 1;
                        this.eatenFruit.push(fruitExcretionTime);
                        
                    }
                    
                }
            }
        }

        if(this.eatFlag ==1){
            this.eatAnime();
            this.eatT += 1+loopNum;
            this.vx *= 0.8;
            this.vy *= 0.8;
            if(this.eatT>=eatTime){
                this.eatT = 0;
                this.eatFlag = 0;
                this.parts[1].scale.set(1,1);
                this.grow();
            }
        }
    }
    grow(){
        //サイズ変更
        if(this.size + Math.sign(this.sizeV)*fusuGrowV >= sizeMin && this.size + Math.sign(this.sizeV)*fusuGrowV <= sizeMax){
            if(this.sizeV >= 0){
                
                this.size += Math.sign(this.sizeV)*fusuGrowV;
                this.scale.set(this.size,this.size*100);
                this.nutrition -= Math.sign(this.sizeV)*fusuGrowV;
            }
        }
    }
    eatAnime(){
        this.parts[1].scale.y -= Math.sin(this.t/1.5)/5;
    }

    beEaten(){
        playArea.removeChild(this);
        movableObjectAry.splice(movableObjectAry.indexOf(this),1);
        sensableObjectAry.splice(sensableObjectAry.indexOf(this),1);
        displayObjectAry.splice(displayObjectAry.indexOf(this),1);
        this.destroy();
        
    }
    metabo(){
        let tipx = this.maptip[0][0];
        let tipy = this.maptip[0][1];
        
        this.energy -= fusuBasalMetabo+fusuMetaboRate*this.size;//基礎代謝
        this.water -= fusuWaterConsume;//排泄
        this.energy -= Math.abs((maptipAry[tipy*maptipNum+tipx].temp-tempsum))*tempTired*0.0001;
        maptipAry[tipy*maptipNum+tipx].nutrition += fusuBasalMetabo+fusuMetaboRate*this.size;//うんち
        maptipAry[tipy*maptipNum+tipx].humidity += fusuWaterConsume;//排泄

        //消化
        for(let i=0;i<this.eatenFruit.length;i++){
            this.eatenFruit[i]--;
            if(this.eatenFruit[i] == 0){
                this.eatenFruit.splice(i,1);
                fruitOnTip[mod(Math.floor(this.ry/maptipSize),maptipNum)*maptipNum + mod(Math.floor(this.rx/maptipSize),maptipNum)].push(fruitSproutTime);
            }
        }

        
        //標高差による消耗
        this.energy -= (maptipAry[this.maptip[1][1]*maptipNum+this.maptip[1][0]].elevation - maptipAry[this.maptip[0][1]*maptipNum+this.maptip[0][0]].elevation)*elevationLossRate;
        this.energy -= (Math.sqrt(this.vx**2+this.vy**2)*moveLossRate 
                        +(Math.abs(this.rotatev[0])+Math.abs(this.rotatev[1]))*rotateLossRate
                        +(Math.abs(this.stretchv[0])+Math.abs(this.stretchv[1]))*stretchLossRate)*this.size**3;//移動、回転、伸ばしによる消耗　サイズの3乗に比例
        
    }
    excretion(){

    }
    die(){
        this.vx = this.vy = this.rotatev[0] = this.rotatev[1] = 0;
        this.state = 1;
    }
    sizeSet=(s)=>{
        this.scale.set(s,s);
        this.size = s;
    }
    hit(){
        let nowHandCo = [//左感知器の座標
            this.rx+this.parts[2].x*this.size+(this.originHandLength[0]+this.handStretchLength[0])*Math.sin(this.handAngle[0]-this.parts[2].rotation),
            this.ry+this.parts[2].y*this.size+(this.originHandLength[0]+this.handStretchLength[0])*Math.cos(this.handAngle[0]-this.parts[2].rotation),
        ];
        let nowHandSenseTip = [Math.floor(nowHandCo[0]/maptipSize), Math.floor(nowHandCo[1]/maptipSize), Math.floor(nowHandCo[2]/maptipSize), Math.floor(nowHandCo[3]/maptipSize)];
        for(let i=0;i<sensableRange;i++){
            for(let j=0;j<sensableRange;j++){
                let tipx = mod(nowHandSenseTip[0]-1 + i,maptipNum);
                let tipy = mod(nowHandSenseTip[1]-1 + j,maptipNum);
                let ary = objectsOnHitTip[tipy*maptipNum+tipx][Math.abs(this.character-1)];
                    for(let k=0;k<ary.length;k++){
                        if(hypo(nowHandCo[0], nowHandCo[1], ary[k].rx+ary[k].oriSize*ary[k].size, ary[k].ry+ary[k].oriSize*ary[k].size) <= ary[k].oriSize*ary[k].size*hitRangeRate
                            && ary[k].damaged==0){
                            ary[k].damaged = 1;
                            ary[k].damageVector = [(this.size/ary[k].size)*(ary[k].rx-this.rx)/hypo(ary[k].rx,ary[k].ry,this.rx,this.ry), (this.size/ary[k].size)*(ary[k].ry-this.ry)/hypo(ary[k].rx,ary[k].ry,this.rx,this.ry)];
                            ary[k].damaget = 0;
                            ary[k].energy -= (Math.abs(this.rotatev[0])+Math.abs(this.stretchv[0]))*damageRate*this.size/ary[k].size;
                            this.energy += (Math.abs(this.rotatev[0])+Math.abs(this.stretchv[0]))*damageRate*this.size/ary[k].size*0.3;
                        } 
                    }
            }
        }

        nowHandCo = [//右感知器の座標
            this.rx+this.parts[3].x*this.size+(this.originHandLength[1]+this.handStretchLength[1])*Math.sin(this.handAngle[1]-this.parts[3].rotation),
            this.ry+this.parts[3].y*this.size+(this.originHandLength[1]+this.handStretchLength[1])*Math.cos(this.handAngle[1]-this.parts[3].rotation)
        ];
        //感知器の感知チップにおける座標
        nowHandSenseTip = [Math.floor(nowHandCo[0]/maptipSize), Math.floor(nowHandCo[1]/maptipSize), Math.floor(nowHandCo[2]/maptipSize), Math.floor(nowHandCo[3]/maptipSize)];
        for(let i=0;i<sensableRange;i++){
            for(let j=0;j<sensableRange;j++){
                let tipx = mod(nowHandSenseTip[0]-1 + i,maptipNum);//左上から始める
                let tipy = mod(nowHandSenseTip[1]-1 + j,maptipNum);
                let ary = objectsOnHitTip[tipy*maptipNum+tipx][Math.abs(this.character-1)];
                    for(let k=0;k<ary.length;k++){
                        if(hypo(nowHandCo[0], nowHandCo[1], ary[k].rx+ary[k].oriSize*ary[k].size, ary[k].ry+ary[k].oriSize*ary[k].size) <= ary[k].oriSize*ary[k].size*hitRangeRate
                            && ary[k].damaged==0){
                            ary[k].damaged = 1;
                            ary[k].damageVector = [(this.size/ary[k].size)*(ary[k].rx-this.rx)/hypo(ary[k].rx,ary[k].ry,this.rx,this.ry), (this.size/ary[k].size)*(ary[k].ry-this.ry)/hypo(ary[k].rx,ary[k].ry,this.rx,this.ry)];
                            ary[k].energy -= (Math.abs(this.rotatev[1])+Math.abs(this.stretchv[1]))*damageRate*this.size;
                            ary[k].damaget = 0;
                        } 
                    }
            }
        }


    }
    damaging = ()=>{
        for(let i=0;i<4;i++){
            this.parts[i].alpha = 1-0.7*Math.floor(this.damaget/5)%2;
        }
        this.damaget += 1 + loopNum;
        this.vx = damageMoveV*this.damageVector[0]*(damageTime-this.damaget)/damageTime;
        this.vy = damageMoveV*this.damageVector[1]*(damageTime-this.damaget)/damageTime;
        if(this.damaget >= damageTime){
            for(let i=0;i<4;i++){
                this.parts[i].alpha = 1;
            }
            this.damaget = 0;
            this.damaged = 0;
        }
    }
    get damage (){
        return [()=>{}, this.damaging];
    }

    livingAct=()=>{
        //感知
        this.sense[Math.floor(this.t/fusuSensePeriod)%fusuSenseKind]();
        //計算
        this.calc()[Math.floor(this.t/fusuCalcPeriod)%fusuCalcKind]();
        //出力によって
        for(let i=0;i<1+loopNum;i++){
            this.leftHandRotate();//左腕回転
            this.rightHandRotate();//右腕回転
            this.leftHandStretch();//左腕伸ばす
            this.rightHandStretch();//右腕伸ばす
        }




        //手の当たり判定
        this.hit();
        this.damage[this.damaged]();

        this.metabo();//代謝

        this.t = (this.t+1+loopNum)%60;//1秒で一周期
        this.eat();//捕食

        //死判定
        if(this.energy < fusuEnergyMin || this.water <= 0){
            this.die();

        }

        if(displayObjectAry.indexOf(this)<0){
            fusuAry.splice(fusuAry.indexOf(this),1);
            if(this.character==0){
                fuAry.splice(fuAry.indexOf(this),1);
            }else {
                suAry.splice(suAry.indexOf(this),1);
            }
            playArea.removeChild(this);
            movableObjectAry.splice(movableObjectAry.indexOf(this),1);
            sensableObjectAry.splice(sensableObjectAry.indexOf(this),1);
            //displayObjectAry.splice(displayObjectAry.indexOf(this),1);
            this.destroy();
        }

    }

    deadAct=()=>{
        for(let i=0;i<4;i++){
            this.parts[i].alpha -= (1+loopNum)*0.01;
            
        }
        this.deadSprite.alpha += (1+loopNum)*0.01;
        if(this.parts[0].alpha <= 0){
            fusuAry.splice(fusuAry.indexOf(this),1);
            if(this.character==0) {
                fuAry.splice(fuAry.indexOf(this),1);
            } else {
                suAry.splice(suAry.indexOf(this),1);
            }
        }

    }
    bePickedup=()=>{
        this.parts[0].rotation += (1+loopNum)*(0.5-Math.random())/2;
        this.parts[2].rotation += (1+loopNum)*(0.5-Math.random())/2;
        this.parts[3].rotation += (1+loopNum)*(0.5-Math.random())/2;
    }
    get act(){
        return [this.livingAct, this.deadAct, this.fuck, this.bePickedup];
    }


}

class fu extends creature {//ふ
    constructor(x, y, size,gene){
        super();
        this.oriSize = fuTextureSize;
        this.rx = Math.max(Math.min(x,maptipNum*maptipSize),0); 
        this.ry = Math.max(Math.min(y,maptipNum*maptipSize),0);

        this.handAngle = [-Math.PI*3/4+Math.PI/2, Math.PI*3/4-Math.PI/2];
        this.handCo = [[0,11],[12,13]];
        fuAry.push(this);
        let parts = [];
        for(let i=0;i<4;i++){
            let part = new PIXI.mesh.Plane(id["fu"+(i+1)].texture,2,2);
            parts.push(part);
            part.position.set(fuCo[i][0]+fuAnchor[i][0], fuCo[i][1]+fuAnchor[i][1]);
            part.pivot.set(fuAnchor[i][0], fuAnchor[i][1]);
            this.addChild(part);
        }
        this.heartAry = [];
        for(let i=0;i<4;i++){
            let heart = new Sprite(id["heart"].texture);
            heart.position.set(Math.random()*fuTextureSize, Math.random()*fuTextureSize);
            heart.alpha = 0;
            this.addChild(heart);
            this.heartAry.push(heart);
        }
        let dead = new Sprite(id["deadfu"].texture);
        this.deadSprite = dead;
        this.addChild(dead);
        dead.alpha = 0;
        this.leftHandVerticy = 4;
        this.rightHandVerticy = 6;
        this.originHandLength = [Math.sqrt(parts[2].width**2 + parts[2].height**2), Math.sqrt(parts[3].width**2+parts[3].height**2)];
        this.parts = parts;
        this.scale.set(size,size);
        this.size = size;
        this.character = 0;
        this.gene = gene;

        this.x = (this.rx - camx)*camz;
        this.y = (this.ry - camy)*camz;
        this.scale.set(this.size*camz);
    }
}

class su extends creature {//す
    constructor(x, y, size,gene){
        super();
        this.rx = Math.max(Math.min(x,maptipNum*maptipSize),0); 
        this.ry = Math.max(Math.min(y,maptipNum*maptipSize),0);
        this.oriSize = suTextureSize;
        this.handAngle = [-Math.PI*1/2, Math.PI*1/2];
        this.handCo = [[0,2.5],[15,2.5]];
        suAry.push(this);
        let parts = [];
        for(let i=0;i<4;i++){
            let part = new PIXI.mesh.Plane(id["su"+(i+1)].texture,3,3);
            parts.push(part);
            part.position.set(suCo[i][0]+suAnchor[i][0], suCo[i][1]+suAnchor[i][1]);
            part.pivot.set(suAnchor[i][0], suAnchor[i][1]);
            this.addChild(part);
        }
        this.heartAry = [];
        for(let i=0;i<4;i++){
            let heart = new Sprite(id["heart"].texture);
            heart.position.set(Math.random()*suTextureSize, Math.random()*suTextureSize);
            heart.alpha = 0;
            this.addChild(heart);
            this.heartAry.push(heart);
        }
        let dead = new Sprite(id["deadsu"].texture);
        this.deadSprite = dead;
        this.addChild(dead);
        dead.alpha = 0;
        this.originHandLength = [Math.sqrt(parts[2].width**2 + parts[2].height**2), Math.sqrt(parts[3].width**2+parts[3].height**2)];
        this.leftHandVerticy = 6;
        this.rightHandVerticy = 10;
        this.parts = parts;
        this.scale.set(size,size);
        this.size = size;
        this.character = 1;
        this.gene = gene;

        this.x = (this.rx - camx)*camz;
        this.y = (this.ry - camy)*camz;
        this.scale.set(this.size*camz);
    }
}



class kusa extends Container {//草
    constructor(x,y,size=1){
        super();

        this.rx = Math.max(Math.min(x,maptipNum*maptipSize),0); 
        this.ry = Math.max(Math.min(y,maptipNum*maptipSize),0);
        this.vx = this.vy = 0;
        this.oriSize = kusaTextureSize;
        this.size = size;
        this.nutrition = 1;
        this.water = 1;
        this.t = 0;
        this.sp = [new Sprite(id["kusa"].texture), new Sprite(id["diedkusa"].texture)];
        this.addChild(this.sp[0]);
        this.addChild(this.sp[1]);
        this.sp[1].alpha = 0;


        this.scale.set(size,size);
        this.character = 2;

        displayObjectAry.push(this);
        kusaAry.push(this);
        sensableObjectAry.push(this);

        this.x = (this.rx - camx)*camz;
        this.y = (this.ry - camy)*camz;
        this.scale.set(this.size*camz);
    }
    act(){
        let grow = ()=>{
            let tipx = mod(Math.floor((this.rx+this.oriSize+this.size/2)/maptipSize),maptipNum);
            let tipy = mod(Math.floor((this.ry+this.oriSize+this.size/2)/maptipSize),maptipNum);
            if(maptipAry[tipy*maptipNum+tipx].nutrition > 0){
                this.nutrition += (1+loopNum)*kusaNutritionRate*this.size*kusaNutritionAttenuation;
                maptipAry[tipy*maptipNum+tipx].nutrition -= (1+loopNum)*kusaNutritionRate*this.size;
                if(this.size < this.nutrition)this.sizeSet(this.nutrition);
            }

            if(displayObjectAry.indexOf(this)<0){
                playArea.removeChild(this);
                sensableObjectAry.splice(sensableObjectAry.indexOf(this),1);
                //displayObjectAry.splice(displayObjectAry.indexOf(this),1);
                kusaAry.splice(kusaAry.indexOf(this),1);
                this.destroy();
            }
        };
        let intakeWater = ()=>{
            let tipx = mod(Math.floor((this.rx+this.oriSize+this.size/2)/maptipSize),maptipNum);
            let tipy = mod(Math.floor((this.ry+this.oriSize+this.size/2)/maptipSize),maptipNum);
            if(maptipAry[tipy*maptipNum+tipx].humidity > 0){
                this.water += (1+loopNum)*kusaWaterRate*this.size*kusaWaterAttenuation;
                maptipAry[tipy*maptipNum+tipx].humidity -= (1+loopNum)*kusaWaterRate;
            }
        };
        return [grow, intakeWater];
    }
    bearFruit(){
        for(let i=0;i<fruitNum;i++){
            let fr = new fruit(this.rx+fruitRange[0]+Math.random()*fruitRange[2], this.ry+fruitRange[1]+Math.random()*fruitRange[3]);
            playArea.addChild(fr);
        }
        this.nutrition -= fruitNum*fruitEnergy;
        this.water -= fruitNum*fruitEnergy;
    }
    die(){
        this.sp[0].alpha -= (1+loopNum)*0.01;
        this.sp[1].alpha += (1+loopNum)*0.01;
    }
    sizeSet(s){
        if(s<sizeMax){
            this.scale.set(s,s);
            this.size = s;
        }

    }
    beEaten(){
        playArea.removeChild(this);
        sensableObjectAry.splice(sensableObjectAry.indexOf(this),1);
        displayObjectAry.splice(displayObjectAry.indexOf(this),1);
        kusaAry.splice(kusaAry.indexOf(this),1);
        this.destroy();
    }
}
class fruit extends Container{//実
    constructor(x,y){
        super();
        sensableObjectAry.push(this);
        displayObjectAry.push(this);
        fruitAry.push(this);
        this.rx = x;
        this.ry = y;
        this.vx = this.vy = 0;
        this.oriSize = 10;
        this.size = 1;
        this.nutrition = 1;
        this.character = 4;
        this.water = 0.5;
        let sp = new Sprite(id["fruit"].texture);
        this.addChild(sp);
        this.character = 4;
    }
    beEaten(){
        playArea.removeChild(this);
        sensableObjectAry.splice(sensableObjectAry.indexOf(this),1);
        displayObjectAry.splice(displayObjectAry.indexOf(this),1);
        fruitAry.splice(fusuAry.indexOf(this),1);
        this.destroy();
        //種を体内に残して草をはやす処理
    }
    beBorn(){

    }
}



class maptip{
    constructor(x,y,elevation,t,n,h,p){
        this.co = [x,y];
        this.elevation = elevation;
        this.temp = t;
        this.nutrition = n;
        this.humidity = h;
        this.pressure = p;
        this.rainTime = 0;
        //雨アニメ
        let rainAnime = new Container();
        rainAnime.ary = [];
        for(let i=0;i<rainAnimeNum;i++){
            let sp = new Sprite(id["rain"+i].texture);
            sp.scale.set(maptipSize/rainOriSize,maptipSize/rainOriSize);
            rainAnime.addChild(sp);
            rainAnime.ary.push(sp);
        }
        rainAnime.position.set(x*maptipSize, y*maptipSize);
        rainAnime.alpha = 0;
        
        this.rainAnime = rainAnime;

        maptipAry.push(this);
    }
    rain(){
        this.rainAnime.alpha = 1;
        this.rainTime++;
        this.humidity += rainAmount;

        for(let i=0;i<rainAnimeNum;i++){
            this.rainAnime.ary[i].alpha = 0;
        }
        this.rainAnime.ary[this.rainTime%rainAnimeNum].alpha = 1;
        if(this.rainTime >= this.rainMaxTime){
            this.rainTime = 0;
            this.rainFlag = 0;
            this.rainAnime.alpha = 0;
        }
    }
    makeGraphics(){
        let graphic = new Graphics();
        let hsv = [20+this.humidity*15+this.nutrition*15, 1-this.elevation, 1-0.7*this.elevation];//チップの状態によって色を変える(適当)
        //let hsv = [20, 30, 1-this.elevation];
        let rgb = hsv2rgb(hsv[0], hsv[1], hsv[2]);
        let color = rgb2hex(rgb.rgb);
        graphic.beginFill(color.toString(16))
                .drawRect(0,0,maptipSize,maptipSize)
                .endFill();
        graphic.position.set(this.co[0]*maptipSize, this.co[1]*maptipSize);
        map.addChild(graphic);
        map.addChild(this.rainAnime);

 
    }
}

class teki extends Container{
    constructor(x,y){
        super();
        this.vx = this.vy = 0;
        this.energy = tekiHP;
        this.water = tekiWater
        this.t = 0;
        this.eatFlag = 0;
        this.eatT = 0;
        this.moveChangeTime = tekiMoveTime*Math.random();

        this.state = 0;//

        this.damaged = 0;

        let sp = new Sprite(id["teki"].texture);
        this.addChild(sp);

        this.character = 3;

        this.rx = x;this.ry = y;
        this.oriSize = tekiTextureSize;
  
        tekiAry.push(this);
        displayObjectAry.push(this);
        movableObjectAry.push(this);
        sensableObjectAry.push(this);
        
        this.size = tekiSize;
        this.scale.set(this.size,this.size);
        
    }
    act(){
        if(this.energy > 0){
            this.metabo();

            if(this.t >= this.moveChangeTime){
                this.move();
                this.t = 0;
            }
            if(this.eatFlag ==1){
                this.scale.y -= Math.sin(this.t/1.5)/5;
                this.eatT++;
                if(this.eatT >= eatTime){
                    this.eatT=0;
                    this.eatFlag = 0;
                    this.scale.set(1.5,1.5);
                }
            }


            
            this.eat();
            if(displayObjectAry.indexOf(this)<0){
                playArea.removeChild(this);
                movableObjectAry.splice(movableObjectAry.indexOf(this),1);
                sensableObjectAry.splice(sensableObjectAry.indexOf(this),1);
                //displayObjectAry.splice(displayObjectAry.indexOf(this),1);
                tekiAry.splice(tekiAry.indexOf(this),1);
                this.destroy();
            }

        } else {
            this.die();
        }


        if(this.energy )

        this.t++;
    }
    move(){
        this.vx = tekiV*(0.5-Math.random())*2;
        this.vy = tekiV*(0.5-Math.random())*2;
    }
    eat(){
        for(let i=0;i<tekiSensableRange;i++){
            for(let j=0;j<tekiSensableRange;j++){
                let tipx = mod(Math.floor((this.rx+this.oriSize*this.size/2)/maptipSize)-1+i,maptipNum);
                let tipy = mod(Math.floor((this.ry+this.oriSize*this.size/2)/maptipSize)-1+i,maptipNum);
                for(let k=0;k<2;k++){
                    let ary = objectsOnHitTip[tipy*maptipNum+tipx][k];
                    for(let a=0;a<ary.length;a++){
                        if(hypo(this.rx+this.oriSize*this.size/2, this.ry+this.oriSize*this.size/2, ary[a].rx+ary[a].oriSize*ary[a].size/2, ary[a].ry+ary[a].oriSize*ary[a].size)
                            <=this.oriSize*this.size/2 + ary[a].oriSize*ary[a].size/2){
                                ary[a].energy = 0;
                                this.eatFlag = 1;
                                this.eatT = 0;
                        }
                    }
                }
               
            }
        }

    }
    metabo(){
        this.energy -= tekiHPRate;
    }
    die(){
        this.vx = this.vy = 0;
        this.alpha -= 0.005;
        const nutMap = 10;
        if(this.alpha <= 0){
            playArea.removeChild(this);
            movableObjectAry.splice(movableObjectAry.indexOf(this),1);
            sensableObjectAry.splice(sensableObjectAry.indexOf(this),1);
            displayObjectAry.splice(displayObjectAry.indexOf(this),1);
            tekiAry.splice(tekiAry.indexOf(this),1);
            for(let i=0;i<tekiDieNutritionTip;i++){
                maptipAry[mod(Math.floor(this.ry+(0.5-Math.random())*nutMap*maptipSize),maptipNum)*maptipNum+
                          mod(Math.floor(this.rx+(0.5-Math.random())*nutMap*maptipSize),maptipNum)].nutrition += tekiDieNutrition;
                maptipAry[mod(Math.floor(this.ry+(0.5-Math.random())*nutMap*maptipSize),maptipNum)*maptipNum+
                mod(Math.floor(this.rx+(0.5-Math.random())*nutMap*maptipSize),maptipNum)].humidity += tekiDieNutrition;
                let a = new kusa(this.rx+(0.5-Math.random())*nutMap*maptipSize, this.ry+(0.5-Math.random())*nutMap*maptipSize, 1);
                playArea.addChild(a);
            }

            this.destroy();
        }
    }
}



let mainDiv = document.getElementById("main");

//素材準備
//音
let soundsClass = class{
    constructor(){
        this.ary = [];
        this.idAry = [];
    }
    soundPush(r){
        this.ary.push(r[0]);
        this.idAry.push(r[1]);
    }
    id(id){
        for(let i=0;i<this.ary.length;i++){
            if(this.idAry[i]==id){
                return this.ary[i];
            }
        }
    }
}
let sounds = new soundsClass();
const audioPath = "sounds/"
const soundDatas = [//[ソース、ID、ループ、音量]
                    ["choice.wav","choice",false,0.7] ,["clear.wav","clear",false,1],["hit.wav","hit",false,0.3],
                    ["kusa.wav","kusa",false,1],["pickup.wav","pickup",false,1],["start.wav","start",false,1],
                    ["music2.mp3","bgm",true,1],["ending.wav","register",false,1]

                ]
for(let i=0;i<soundDatas.length;i++){
    let sound = new Howl({
        src: [audioPath+soundDatas[i][0]],
        preload: 'metadata',
        loop: soundDatas[i][2],
        volume: soundDatas[i][3],
    });
    sounds.soundPush([sound, soundDatas[i][1]]);
    loadProgressHandler();
}
//画像
const imagePath = "images/";
const imageDatas = [
                        ["kusa","kusa.png"],["diedkusa","diedkusa.png"],["fruit","fruit.png"],["deadfu","deadfu.png"],["deadsu","deadsu.png"],["heart","heart.png"],
                        ["mousekusa", "mousekusa.png"],["bat1","bat1.png"],["hand1","hand1.png"],["hand2","hand2.png"],["teki","teki.png"],
                        ["ti","title.png"],["tweet","tweet.png"],["retry","retry.png"],["rank","rank.png"],["norank","norank.png"]
        
                    ];
for(let i=0;i<4;i++){
    imageDatas.push(["fu"+(i+1), "fu"+(i+1)+".png"]);
    imageDatas.push(["su"+(i+1), "su"+(i+1)+".png"]);
}
for(let i=0;i<rainAnimeNum;i++){
    imageDatas.push(["rain"+i, "rain"+(i+1)+".png"]);
}

for(let i=0;i<imageDatas.length;i++){
    loader.add(imageDatas[i][0],imagePath+imageDatas[i][1]);
}
loader.on('progress',loadProgressHandler);
loader.load(setup);
function loadProgressHandler(){
}


//シーン宣言
let titleScene = new Container();
let playScene = new Container();
let gameoverScene = new Container();
let gameclearScene = new Container();
app.stage.addChild(titleScene);






////////////オブジェクトの性格/////////////////
//[ふ、す、草、実、敵]

//変数宣言
let state;
let movableObjectAry = [];
let fuAry = [];
let suAry = [];
const characterAry = [fuAry, suAry];
let fusuAry = [];
let kusaAry = [];
let fruitAry = [];
let maptipAry = [];
let tekiAry = [];
let senseAreaObjects = [];
for(let i=0;i<senseAreaNum;i++){
    senseAreaObjects.push([]);
}
let displayObjectAry = [];
let cam = {x:0, y:0};
let sensableObjectAry = [];
let camx = 0;
let camy = 0;
let camz = 1;

let objectsOnTip = [];
let objectsOnHitTip = [];
let kusaOnTip = [];
let fruitOnTip = []

let tekiAppearNum =0;

let loopNum=0;

const latitude = Math.PI/6;
const earthR = maptipNum/2;//地球の半径(チップ単位)
const oneDay = 10;
const oneYear = oneDay*360;//1800フレームで半年
let sunx=0//太陽のx座標
let sunMaptipAry = [];//太陽に照らされているチップ
let sunAngleMult = function(t){//-1~1を往復する関数
    return (0.5 - (t/(oneYear/2) -(t/(oneYear/2)-1)* Math.floor(t/(oneYear/2))%2*2))*2;
}
let sunAngle;

let day;
let sunPosx;
let sunPosy;

let btnChoice = null;

let t=0;
let justClicked = false;

let time=0;

let tempsum = 0;

const waveNum = 20;
const waveMult = 20;
const multV =1;
const waveAdding = 100;
const addingV = 1;
const waveSize = 10;
const sizeV = 2;
const indiviSizeV = 2;
const indiviMultV = 0.01;
const indiviAddingV = 0.05;
let randomWaveFunction = [];
let maxElevation = 0;

//スプライト宣言
let playArea;
let displayArea;
let map;
//let mapFrame;
let fuNumText;
let suNumText;
let displayTime;

let light;
let displayLight = [];

//ゲームデザイン

let a;
let  b;
let bat;

let hand

let dragging = false;
const clickFunc = [hitStart, pickupStart, plantKusaStart, mapMoveStart];
const dragFunc = [hitMove, pickupMove, plantKusaMove, mapMove];
const pointerupFunc = [hitEnd, pickupEnd, plantKusaEnd, mapMoveEnd];
//クリックイベント
function playAreaClick(e){
    this.data = e.data;
    mouse.x = this.data.getLocalPosition(this.parent).x
    mouse.y = this.data.getLocalPosition(this.parent).y
    mouse.prex = mouse.x;
    mouse.prey = mouse.y;
    mouse.rx = camx + mouse.x/camz;
    mouse.ry = camy + mouse.y/camz;
    if(btnChoice!=null)clickFunc[btnChoice]();
    dragging = true;
}
function playAreaDrag(e){
    if(dragging){
        this.data = e.data;
        mouse.prex = mouse.x;
        mouse.prey = mouse.y;
        mouse.x = this.data.getLocalPosition(this.parent).x
        mouse.y = this.data.getLocalPosition(this.parent).y
        mouse.rx = camx + mouse.x/camz;
        mouse.ry = camy + mouse.y/camz;

        if(btnChoice!=null)dragFunc[btnChoice]();

    }

}
function playAreaDragEnd(e){
    this.data = e.data;
    mouse.x = this.data.getLocalPosition(this.parent).x
    mouse.y = this.data.getLocalPosition(this.parent).y
    mouse.rx = camx + mouse.x/camz;
    mouse.ry = camy + mouse.y/camz;
    dragging = false;
    if(btnChoice!=null)pointerupFunc[btnChoice]();
}

function hitStart(){
    playScene.addChild(bat);
    bat.anchor.set(0.6,0.6);
    
    mouse.b = bat;
    mouse.b.position.set(mouse.x,mouse.y);
}
function hitMove(){
    mouse.b.position.set(mouse.x,mouse.y);
}
const hitDamage = 20;
function hitEnd(){
    mouse.t=0;
    app.ticker.add(batAnime);
    let hittables = [0,1,3];

    let tipx = mod(Math.floor(mouse.rx/maptipSize),maptipNum);
    let tipy = mod(Math.floor(mouse.ry/maptipSize),maptipNum);
    for(let m=0;m<2;m++){
        for(let n=0;n<2;n++){
            let tipx = mod(Math.floor(mouse.rx/maptipSize)-1+m,maptipNum);
            let tipy = mod(Math.floor(mouse.ry/maptipSize)-1+n,maptipNum);
            for(let a=0;a<hittables.length;a++){
                for(let k=0;k<objectsOnHitTip[tipy*maptipNum+tipx][hittables[a]].length;k++){
                    let ary = objectsOnHitTip[tipy*maptipNum+tipx][hittables[a]];
                        if(ary[k].character==2){
                            ary[k].nutrition -= hitDamage;
                        }else {
                            ary[k].energy -= hitDamage;
                        }
                        
                        if(!sounds.id("hit").playing()) sounds.id("hit").play();
                    
                }
            }
        }
    }

            
        
        
}
function batAnime(){
    if(mouse.b.rotation >= -1){
        mouse.b.rotation -= 0.8;
    } else {
        if(mouse.t>10){
            playScene.removeChild(mouse.b);
            app.ticker.remove(batAnime);
            mouse.b.rotation = 0;
        }
    }
    mouse.t++;
}
const pickableChara = [0,1];
const arys = [movableObjectAry, displayObjectAry, sensableObjectAry];
function pickupStart(){
    playScene.addChild(hand);
    hand.texture = id["hand2"].texture;
    hand.position.set(mouse.x,mouse.y);
    //mouse.pickupAry = [];

    
    for(let m=0;m<3;m++){
        for(let n=0;n<3;n++){
            let tipx = mod(Math.floor(mouse.rx/maptipSize)-1+m,maptipNum);
            let tipy = mod(Math.floor(mouse.ry/maptipSize)-1+n,maptipNum);
            let ary = objectsOnHitTip[tipy*maptipNum+tipx];
            for(let i=0;i<pickableChara.length;i++){
                for(let j=0;j<ary[pickableChara[i]].length;j++){
                    if(hypo(mouse.rx,mouse.ry,ary[pickableChara[i]][j].rx+ary[pickableChara[i]][j].oriSize*ary[pickableChara[i]][j].size,ary[pickableChara[i]][j].ry+ary[pickableChara[i]][j].oriSize*ary[pickableChara[i]][j].size)
                        <= ary[pickableChara[i]][j].oriSize*ary[pickableChara[i]][j].size){
                            ary[pickableChara[i]][j].state = 3;
                            mouse.pickupAry.push(ary[pickableChara[i]][j]);
                            for(let k=0;k<arys.length;k++){
                                arys[k].splice(arys[k].indexOf(ary[pickableChara[i]][j]), 1);
                                if(!sounds.id("pickup").playing()) sounds.id("pickup").play();
                            }
                    }

                }
            }
        }
    }

    
}
function pickupMove(){
    hand.position.set(mouse.x,mouse.y);
    for(let i=0;i<mouse.pickupAry.length;i++){
        //mouse.pickupAry[i].position.set(mouse.x,mouse.y);
        mouse.pickupAry[i].x -= mouse.prex-mouse.x;
        mouse.pickupAry[i].y -= mouse.prey-mouse.y;
        mouse.pickupAry[i].x = Math.max(Math.min(mouse.pickupAry[i].x, width-mouse.pickupAry[i].oriSize*mouse.pickupAry[i].size*camz),0);
        mouse.pickupAry[i].y = Math.max(Math.min(mouse.pickupAry[i].y, playableHeight-mouse.pickupAry[i].oriSize*mouse.pickupAry[i].size*camz),0);
    }
}
function pickupEnd(){
    for(let i=0;i<mouse.pickupAry.length;i++){
        mouse.pickupAry[i].state = 0;
        mouse.pickupAry[i].rx = camx + mouse.pickupAry[i].x/camz;
        mouse.pickupAry[i].ry = camy + mouse.pickupAry[i].y/camz;
        mouse.pickupAry[i].parts[0].rotation = 0;
        for(let k=0;k<arys.length;k++){
            arys[k].push(mouse.pickupAry[i]);
        }
    }
    mouse.pickupAry = [];
    hand.texture = id["hand1"].texture;
    mouse.t =0;
    app.ticker.add(handAnime);
}
function handAnime(){
    if(mouse.t>=10){
        playScene.removeChild(hand);
        app.ticker.remove(handAnime);
    }
    mouse.t++;
}
let mouseKusaAry = [];
function plantKusaStart(){
    let s = new Sprite(id["mousekusa"].texture);
    mouseKusaAry.push(s);
    playScene.addChild(s);
    s.position.set(mouse.x, mouse.y);
    mouse.s = s;
}
function plantKusaMove(){
    mouse.s.position.set(mouse.x, mouse.y);
}
function plantKusaEnd(){
    playScene.removeChild(mouse.s);
    let k = new kusa(mouse.rx, mouse.ry, 1);
    mouseKusaAry.splice(mouseKusaAry.indexOf(mouse.s));
    playArea.addChild(k);
    sounds.id("kusa").play();
    for(let i=0;i<mouseKusaAry.length;i++){
        playScene.removeChild(mouseKusaAry[i]);
    }
}

function mapMoveStart(){
}
const lineBold = 3;
function mapMove(){
    scaleFunc[nowScale]();
}
function scale0(){
    camx -= (mouse.x-mouse.prex)/camz;
    camy -= (mouse.y-mouse.prey)/camz;
    camx = Math.max(Math.min(camx, ((maptipNum+1)*(maptipSize)-width)*camz),-maptipSize*camz);
    camy = Math.max(Math.min(camy, ((maptipNum+1)*(maptipSize)-playableHeight)*camz),-maptipSize*camz);

    map.frame.rx = camx-lineBold;
    map.frame.ry = camy-lineBold;
}
function scale1(){
    map.frame.rx += (mouse.x-mouse.prex)/camz;
    map.frame.ry += (mouse.y-mouse.prey)/camz;
    map.frame.rx = Math.max(Math.min(map.frame.rx, ((maptipNum+30)*(maptipSize))*camz),-maptipSize*camz);
    map.frame.ry = Math.max(Math.min(map.frame.ry, ((maptipNum+30)*(maptipSize))*camz),-maptipSize*camz);
}
const scaleFunc = [scale1,scale0];
function mapMoveEnd(){

}

let nowScale = 1;
const scales = [width/(maptipNum*maptipSize),1];
const scaleText = ["拡大","縮小"];
let scaletxt;
function mapscale(){
    nowScale = Math.abs((nowScale-1)*2)/2;
    camz = scales[nowScale];
    scaletxt.text = scaleText[nowScale];
    if(nowScale == 0){
        camx = camy=0;
    } else {
        camx = map.frame.rx+lineBold;
        camy = map.frame.ry+lineBold;
    }
}

const touchableMargin = 2;
function setup(){
    screenResize();

    //最初に作るスプライト
    //ステージ
    var stage = new Sprite();
    stage.width = width;
    stage.height = playableHeight;
    stage.x = stage.y = 0;
    playScene.addChild(stage);

    //プレイ領域
    playArea =new Container();
    playScene.addChild(playArea);
    playArea.width = width - touchableMargin*2;
    playArea.height = playAreaHeight - touchableMargin*2;
    playArea.position.set(touchableMargin, touchableMargin);
    playArea.interactive = true;
    playArea.on("pointerdown", playAreaClick);
    playArea.on("pointermove", playAreaDrag);
    playArea.on("pointerup", playAreaDragEnd);
    playArea.on("pointeroutside", playAreaDragEnd);
    playArea.on("mouseupoutside",playAreaDragEnd);
    playArea.on("pointerupoutside", playAreaDragEnd);

    
    //太陽グラフィック
    sunPosy = earthR;
    sunPosx = 0;
    for(let i=0;i<earthR*2;i++){//上から順に下に降りる
        for(let j=0;j<earthR*Math.sin(Math.acos((sunPosy-i)/earthR))/2;j++){//光面積の横幅/2
            sunMaptipAry.push([sunPosx+j,i]);
            if(j!=0)sunMaptipAry.push([sunPosx-j,i]);
        }
    }
    for(let i=0;i<2;i++){
        let light = new Container();
        light.rx = light.ry = light.vx = light.vy = 0;
        for(let i=0;i<sunMaptipAry.length;i++){
            let rec = new Graphics();
            rec.beginFill(0xFFBB00)
                .drawRect(0,0,maptipSize,maptipSize)
                .endFill();
            rec.position.set(sunMaptipAry[i][0]*maptipSize, sunMaptipAry[i][1]*maptipSize);
            light.addChild(rec);
        }
        light.alpha = 0.1;
        light.pivot.set(0,earthR*maptipSize);
        displayObjectAry.push(light);
        playScene.addChild(light);
        light.t=0;
        displayLight.push(light);
    }

    //表示領域
    const rightBoxWidth = 100;
    const boxMargin = 3;
    const btnFunc = [];
    displayArea = new Container();
    playScene.addChild(displayArea);
    displayArea.width = width;
    displayArea.height = height-playAreaHeight;
    displayArea.y = playableHeight;
    let displayAreaBox = new Graphics();
    displayAreaBox.beginFill(0x227755)
                    .drawRect(0,0,width,height-playableHeight)
                    .endFill();
    displayArea.addChild(displayAreaBox);
    let btnAry = [];
    //各種ボタン
    for(let i=0;i<4;i++){
        let btn = new Graphics();
        btn.lineStyle(1,0x330000,1)
            .beginFill(0xFFFFFF)
            .drawRoundedRect(0,0,(width-(rightBoxWidth+6*boxMargin))/2, (height-playableHeight-4*boxMargin)/2,5)
            .endFill();
        btnAry.push(btn);
        let yellow = new Graphics();
        yellow.lineStyle(1,0x330000,1)
            .beginFill(0xFFFF00)
            .drawRoundedRect(0,0,(width-(rightBoxWidth+6*boxMargin))/2, (height-playableHeight-4*boxMargin)/2,5)
            .endFill();
        btn.addChild(yellow);
        btn.yellow = yellow;
        yellow.alpha = 0;
        btn.position.set(boxMargin + (2*boxMargin+(width-(rightBoxWidth+6*boxMargin))/2)*(i%2), boxMargin+(2*boxMargin+(height-playableHeight-4*boxMargin)/2)*Math.floor(i/2));
        displayArea.addChild(btn);
        btn.interactive = true;
        btn.on("pointerdown", ()=>{
            for(let i=0;i<4;i++){
                btnAry[i].yellow.alpha = 0;
            }
            sounds.id("choice").play();
            btn.yellow.alpha = 1;
            btnChoice = i;
        });
    }
    //拡大縮小ボタン
    const btnwidth=90;
    let btn1 = new Graphics();
    btn1.lineStyle(1,0x330000,1);
    btn1.beginFill(0xFFFFFF);
    btn1.drawRoundedRect(0,0,btnwidth,(height-playableHeight-4*boxMargin)/2,5);
    btn1.endFill();
    displayArea.addChild(btn1);
    btn1.position.set(boxMargin + (2*boxMargin+(width-(rightBoxWidth+6*boxMargin))/2)*1 + (width-(rightBoxWidth+6*boxMargin))/2-btnwidth, boxMargin+(2*boxMargin+(height-playableHeight-4*boxMargin)/2)*1);
    btn1.interactive = true;
    btn1.on("pointerdown",mapscale);
    scaletxt = new Text("縮小",{fontSize:30});
    scaletxt.position.set(15,5);
    btn1.addChild(scaletxt);
    nowScale = 1;
    camz = scales[nowScale];
    //たたくボタン
    let batimg = new Sprite(id["bat1"].texture);
    btnAry[0].addChild(batimg);
    batimg.position.set(150,10);
    let battxt = new Text("たたく",{fontSize:30});
    btnAry[0].addChild(battxt);
    battxt.position.set(5,5);
    //もちあげるボタン
    let handimg = new Sprite(id["hand2"].texture);
    btnAry[1].addChild(handimg);
    handimg.position.set(160,10);
    let handtxt = new Text("もちあげる",{fontSize:30});
    btnAry[1].addChild(handtxt);
    handtxt.position.set(5,5);
    let rightBox = new Graphics();
    rightBox.lineStyle(1,0x330000,1)
            .beginFill(0xAA6633)
            .drawRoundedRect(0,0,rightBoxWidth, height-playableHeight-2*boxMargin,5)
            .endFill();
    rightBox.position.set(width-rightBoxWidth-boxMargin, boxMargin);
    displayArea.addChild(rightBox);
    let kusaimg = new Sprite(id["kusa"].texture);
    btnAry[2].addChild(kusaimg);
    kusaimg.position.set(155,10);
    let kusatxt = new Text("草を生やす",{fontSize:30});
    btnAry[2].addChild(kusatxt);
    kusatxt.position.set(5,5);
    let maptxt = new Text("マップ\n 移動",{fontSize:20});
    btnAry[3].addChild(maptxt);
    maptxt.position.set(20,0);


    

    //各種テキスト
    let fuText = new Text("ふ",{fontSize:20});
    let suText = new Text("す",{fontSize:20});
    const txtMargin = 25;
    const txtY = 13;
    fuText.anchor.set(0.5,0.5);
    suText.anchor.set(0.5,0.5);
    rightBox.addChild(fuText);
    fuText.position.set(rightBoxWidth/2-txtMargin,txtY);
    rightBox.addChild(suText);
    suText.position.set(rightBoxWidth/2+txtMargin,txtY);
    fuNumText = new Text(5,{fontSize:30});
    suNumText = new Text(5, {fontSize:30});
    rightBox.addChild(fuNumText);
    rightBox.addChild(suNumText);
    fuNumText.position.set(rightBoxWidth/2-txtMargin,txtY+30);
    suNumText.position.set(rightBoxWidth/2+txtMargin,txtY+30);
    fuNumText.anchor.set(0.5,0.5);
    suNumText.anchor.set(0.5,0.5);

    displayTime = new Text("00:00:00",{fontSize:25});
    displayTime.anchor.set(0.5,0.5);
    displayTime.position.set(rightBoxWidth/2,75);
    rightBox.addChild(displayTime);

    bat = new Sprite(id["bat1"].texture);
    hand = new Sprite(id["hand1"].texture);
    hand.anchor.set(0.7,0.7);

    //タイトルシーン
    let aaa = new Sprite(id["ti"].texture);
    aaa.interactive = true;
    aaa.on("pointerdown",titleClick);
    titleScene.addChild(aaa);
    //ゲームオーバーシーン
    let bl = new Graphics();
    bl.beginFill(0x000000)
        .drawRect(0,0,width,height)
        .endFill();
    bl.alpha = 0.8;
    gameoverScene.addChild(bl);
    let ttt = new Text("ゲームオーバー！",{fontSize:60, fill:0xFFFFFF});
    gameoverScene.addChild(ttt);
    ttt.anchor.set(0.5,0.5);
    ttt.position.set(width/2,100);
    let rt = new Sprite(id["retry"].texture);
    rt.anchor.set(0.5,0.5);
    gameoverScene.addChild(rt);
    rt.interactive = true;
    rt.on("pointerdown",retry);
    rt.position.set(width/2,400);
    //ゲームクリアシーン
    let wh = new Graphics();
    wh.beginFill(0xFFFFFF)
        .drawRect(0,0,width,height)
        .endFill();
    wh.alpha = 0.8;
    gameclearScene.addChild(wh);
    let sss = new Text("ゲームクリア！!",{fontSize:60});
    gameclearScene.addChild(sss);
    sss.anchor.set(0.5,0.5);
    sss.position.set(width/2,100);
    let txt = new Text("かかった時間："+0+"秒", {fontSize:40});
    txt.anchor.set(0.5,0.5);
    txt.position.set(width/2, 200);
    gameclearScene.addChild(txt);
    gameclearScene.txt = txt;
    let tw = new Sprite(id["tweet"].texture);
    tw.interactive = true;
    tw.on("pointerdown", tweet);
    tw.anchor.set(0.5,0.5);
    gameclearScene.addChild(tw);
    tw.position.set(width/2,500);

    //名前
    let input = new PIXI.TextInput({
        input: {fontSize: '25px', width: '200px'}, 
        box: {fill: 0xEEEEEE,stroke: {color: 0x000000, width: 1}}
    });
    input.placeholder = '名前は20字以内で';
    input.position.set(80,320);
    gameclearScene.addChild(input);
    gameclearScene.input = input;

    let ranktext = new Text("ランキング："+0+"位",{fontSize:30});
    gameclearScene.addChild(ranktext);
    gameclearScene.ranktext = ranktext;
    ranktext.position.set(80,270);

    let registerButton = new Sprite(id["rank"].texture);
    gameclearScene.addChild(registerButton);
    gameclearScene.registerButton = registerButton;
    registerButton.position.set(330,280);
    registerButton.interactive = true;
    registerButton.on("pointerdown",register);


    let black = new Graphics();
    black.beginFill(0x000000)
            .drawRect(0,0,width,height)
            .endFill();
    titleScene.black = black;
    titleScene.addChild(black);
    black.alpha = 0;

    let black2 = new Graphics();
    black2.beginFill(0x000000)
            .drawRect(0,0,width,height)
            .endFill();
    playScene.black = black2;
    playScene.addChild(black2);
    black2.alpha = 1;

    //ゲームクリアシーンの色々


    

    map = new Container();




    state = title;
    app.ticker.add(gameloop);
}


//メインループ
function gameloop(delta){
    for(let i=0;i<Math.round(delta);i++){
        state(delta);
    }
}

function title(delta){
    //タイトルでゲーム開始
    if(titleClicked ==1){
        if(titleScene.black.alpha==0){
            sounds.id("start").play();
        }
        titleScene.black.alpha+= blackt;
        
        if(titleScene.black.alpha >= 1){
            state = gameInit;
        }
        
    }

}
let titleClicked = 0;
function titleClick(){
    titleClicked = 1;
}




function gameInit(){
    //変数初期化
    maxElevation = 0;
    objectsOnTip = [];
    tekiAppearNum = 0;

    maptipAry = [];

    camx = 0;
    camy = 0;
    camz = 1;

    for(let i=0;i<senseAreaNum**2;i++){
        objectsOnTip.push([]);
    }
    for(let i=0;i<maptipNum**2;i++){
        objectsOnHitTip.push([]);
        kusaOnTip.push([]);
        fruitOnTip.push([]);
        for(let j=0;j<sensableKind;j++){
            objectsOnHitTip[i].push([]);
        }
    }
    fusuAry = [];
    fuAry = [];
    suAry = [];
    kusaAry = [];
    fruitAry = [];
    tekiAry = [];

    //地形生成
    randomWaveFunction = [];
    for(let i=0;i<waveNum;i++){
        randomWaveFunction.push([waveSize*(1+sizeV*(0.5-Math.random())), //振幅
                                waveMult*(1+multV*(0.5-Math.random())), //周波数
                                waveAdding*(1+addingV*(0.5-Math.random())), //波のずれ
                                Math.random()*maptipNum, Math.random()*maptipNum,//波の中心地（マップチップ座標)
                                1-(0.5-Math.random())*2]);//波の減衰度
    }
    for(let i=0;i<maptipNum**2;i++){
        let elevation = 0;
        let temp= Math.random();
        let nutrition= Math.random()*1.5;
        let humidity= Math.random()*1.5;
        let pressure = (1-temp)*(1-elevation);
        for(let j=0;j<waveNum;j++){
            let A = randomWaveFunction[j][0]*(1 + (0.5-Math.random())*indiviSizeV);
            let B = randomWaveFunction[j][1]*(1 + (0.5-Math.random())*indiviMultV);
            let C = randomWaveFunction[j][2]*(1 + (0.5-Math.random())*indiviAddingV);//波関数の定数を少しずつランダムでずらす
            let D = randomWaveFunction[j][5];
            let d = Math.sqrt((i%maptipNum - randomWaveFunction[j][3])**2 + (Math.floor(i/maptipNum) - randomWaveFunction[j][4])**2);
            elevation += (Math.max(Math.sqrt(2)*maptipNum*D-d**1.2,0)/maptipNum) * (A*Math.sin(B*d/maptipNum+C) + A)/2;//波の関数通りに標高加算
        }
        if(maxElevation<elevation){
            maxElevation = elevation;//最大標高
        }
        let tip = new maptip(i%maptipNum, Math.floor(i/maptipNum), elevation, temp, nutrition, humidity, pressure);
        
    }
    for(let i=0;i<maptipNum**2;i++){
        maptipAry[i].elevation /= maxElevation;//標高を正規化
        maptipAry[i].makeGraphics();//マップグラフィック生成
    }
    

    day = 0;

    //現在のマップを示すやつ
    let mapFrame = new Graphics();
    mapFrame
        .lineStyle(lineBold, 0x0000FF, 1)
        .drawRect(0,0,width+lineBold,playableHeight+lineBold);


    mapFrame.rx = mapFrame.ry = -lineBold;
    mapFrame.size = 1;
    map.frame = mapFrame;

    
    
    playArea.addChild(map);
    playArea.addChild(mapFrame);
    
    displayObjectAry.push(map);
    displayObjectAry.push(mapFrame);
    map.rx = map.ry = 0;
    map.size = 1;


    //デバッグ終わり

    //初期ふす生成
    let geneAry = [];
    for(let a=0;a<firstFuSuNum;a++){
        let gene = [];
        for(let i=0;i<geneNum.length;i++){
            gene.push([]);
            for(let j=0;j<geneNum[i];j++){
                gene[i].push(0.5-Math.random());
            }
        }
        geneAry.push(gene);
    }



    for(let i=0;i<firstFuSuNum;i++){
        let w = new fu(Math.random()*width, Math.random()*width,0.5+Math.random(),geneAry[i]);
        playArea.addChild(w);
        let d = new su(Math.random()*width, Math.random()*width,0.5+Math.random(),geneAry[i]);
        playArea.addChild(d);
    }

    for(let i=0;i<firstKusaNum;i++){
        let w = new kusa(Math.random()*maptipNum*maptipSize, Math.random()*maptipNum*maptipSize,1);
        playArea.addChild(w);
    }

    app.stage.removeChild(titleScene);
    app.stage.addChild(playScene);
    state = play;
    sounds.id("bgm").play();
    time = 0;
    
}


let blackt = 0.01;
function play(delta) {

    playScene.black.alpha -= blackt*2;
    
    //ふすの行動
    for(let i=(t%2)*loopNum;i<fusuAry.length;i += 1+1*loopNum){
         if(fusuAry[i] != null){
            fusuAry[i].act[fusuAry[i].state]();
        }
        
        if(fusuAry[i] != null){
            if(fusuAry[i].state !=3){
            fusuAry[i].fuckAct[fusuAry[i].fucking]();
            }   
        }
           
    }


    //草の行動
    for(let i=0;i<maptipNum**2;i++){
        kusaOnTip[i] = [];
    }
    for(let i=(t%2)*loopNum;i<kusaAry.length;i += 1 + 1*loopNum){
        if(kusaAry[i].nutrition > kusaEnergyMin && kusaAry[i].water > 0){//生きてたら=栄養と水があったら
            //太陽用に、チップに草を埋め込む
            try{
                kusaOnTip[mod(Math.floor((kusaAry[i].ry+kusaAry[i].oriSize*kusaAry[i].size/2)/maptipSize),maptipNum)*maptipNum +
                mod(Math.floor((kusaAry[i].rx+kusaAry[i].oriSize*kusaAry[i].size/2)/maptipSize),maptipNum)].push(kusaAry[i]);
            } catch(e){
                console.log("x:"+mod(Math.floor((kusaAry[i].rx+kusaAry[i].oriSize*kusaAry[i].size/2)/maptipSize),maptipNum),
                            "y:"+mod(Math.floor((kusaAry[i].ry+kusaAry[i].oriSize*kusaAry[i].size/2)/maptipSize),maptipNum))
            }

            //成長
            if(kusaAry[i]!=null){
                kusaAry[i].act()[kusaAry[i].t%kusaAry[i].act().length]();
            }
            if(kusaAry[i]!=null){
            //代謝
                kusaAry[i].nutrition = Math.max(kusaAry[i].nutrition-(kusaBasalMetabo + kusaMetaboRate*kusaAry[i].size),0);
                kusaAry[i].water = Math.max(kusaAry[i].water-kusaBasalWaterConsume,0);
            }
            if(kusaAry[i]!=null){
            //エネルギーがたまったら実をつける
            if(kusaAry[i].nutrition >= kusaBearStandard && kusaAry[i].water >= kusaBearStandard){
                kusaAry[i].bearFruit();
            }
            }

        } else {//死んでたら
            kusaAry[i].die();
        }
        
        if(kusaAry[i] != null){
            kusaAry[i].t = (kusaAry[i].t+1+loopNum)%60;
        }
        
    }

    //敵の行動
    for(let i=0;i<tekiAry.length;i++){
        if(tekiAry[i]!=null){
            tekiAry[i].act();
        }
        
    }
    //敵の発生
    if(fusuAry.length >= tekiAppearStandard[tekiAppearNum]){
        let ki = new teki(maptipNum*maptipSize*Math.random(),maptipNum*maptipSize*Math.random());
        playArea.addChild(ki);
        tekiAppearNum++;
    }

    //太陽の動き
    sunAngle = latitude*sunAngleMult(t);//-latitude~latitudeを動く
    sunPosy = maptipNum/2 + earthR*Math.sin(sunAngle);//太陽のど真ん中のｙ座標
    sunPosx = Math.floor(displayLight[0].t/oneDay)%maptipNum;//用検討
    day += Math.floor(sunPosx/(maptipNum-1));
    sunMaptipAry = [];
    for(let i=0;i<maptipNum;i++){//上から順に下に降りる
        for(let j=0;j<earthR*Math.sin(Math.acos((sunPosy-i)/earthR))/2;j++){//光面積の横幅/2
            sunMaptipAry.push([mod(sunPosx+j,maptipNum),i]);
            if(j!=0) sunMaptipAry.push([mod(sunPosx-j,maptipNum),i]);
        }
    }
    //太陽グラフィックの動き
    displayLight[0].rx = -maptipNum*maptipSize/2 + (displayLight[0].t/oneDay + maptipNum/2)%(maptipNum*2)*maptipSize;
    displayLight[0].ry = sunPosy*maptipSize;
    displayLight[1].rx = -maptipNum*maptipSize/2 + (displayLight[0].t/oneDay + maptipNum/2 + maptipNum)%(maptipNum*2)*maptipSize;
    displayLight[1].ry = sunPosy*maptipSize;
    displayLight[0].t = (displayLight[0].t+1)%(maptipNum*1000);
    //太陽による温度加算
    for(let i=0;i<sunMaptipAry.length;i++){
            maptipAry[sunMaptipAry[i][1]*maptipNum+sunMaptipAry[i][0]].temp += sunTempAdd*((2-maptipAry[sunMaptipAry[i][1]*maptipNum+sunMaptipAry[i][0]].humidity)**2);  
            maptipAry[sunMaptipAry[i][1]*maptipNum+sunMaptipAry[i][0]].pressure -= sunTempAdd;
            //草が太陽から栄養を受け取る
            for(let j=0;j<kusaOnTip[sunMaptipAry[i][1]*maptipNum+sunMaptipAry[i][0]].length;j++){
                kusaOnTip[sunMaptipAry[i][1]*maptipNum+sunMaptipAry[i][0]][j].nutrition += kusaSunEnergyRate*kusaOnTip[sunMaptipAry[i][1]*maptipNum+sunMaptipAry[i][0]][j].size;
            }
    }

    //マップの変化
    let xx = Math.floor(Math.random()*maptipNum);
    let yy = Math.floor(Math.random()*maptipNum);
    let ary = maptipAry;//参照するための一時保存配列
    for(let i=0;i<airCalcNum;i++){
        for(let j=0;j<airCalcNum;j++){
            let tipx = mod(xx+i,maptipNum);
            let tipy = mod(yy+j,maptipNum);
            const surround = [maptipAry[mod(tipy-1,maptipNum)*maptipNum+tipx], maptipAry[mod(tipy+1,maptipNum)*maptipNum+tipx],maptipAry[tipy*maptipNum+mod(tipx-1,maptipNum)],maptipAry[tipy*maptipNum+mod(tipx+1,maptipNum)]];
            const surroundCo = [mod(tipy-1,maptipNum)*maptipNum+tipx, mod(tipy+1,maptipNum)*maptipNum+tipx, tipy*maptipNum+mod(tipx-1,maptipNum), tipy*maptipNum+mod(tipx+1,maptipNum)];
            const bigSurroundCo = [
                mod(tipy-1,maptipNum)*maptipNum+mod(tipx-1,maptipNum), mod(tipy-1,maptipNum)*maptipNum+tipx, mod(tipy-1,maptipNum)*maptipNum+mod(tipx+1,maptipNum),
                mod(tipy+1,maptipNum)*maptipNum+mod(tipx-1,maptipNum), mod(tipy+1,maptipNum)*maptipNum+tipx, mod(tipy+1,maptipNum)*maptipNum+mod(tipx+1,maptipNum),
                tipy*maptipNum+mod(tipx-1,maptipNum),tipy*maptipNum+mod(tipx+1,maptipNum),
            ];
            let bigSurround = [];
            for(let k=0;k<bigSurroundCo.length;k++){
                bigSurround.push(maptipAry[bigSurroundCo[k]]);
            }
        
            //気温の均し
            let sum=0;
            for(let k=0;k<surround.length;k++){
                sum += surround[k].temp;
            }
            ary[tipy*maptipNum+tipx].temp = 1*(sum + maptipAry[tipy*maptipNum+tipx].temp)/5;
            //気温の減衰 標高が高いほど気温は低い
            ary[tipy*maptipNum+tipx].temp -= tempDecrease*(2-maptipAry[tipy*maptipNum+tipx].humidity);
            ary[tipy*maptipNum+tipx].tmp += (tempStandard-ary[tipy*maptipNum+tipx].tmp)*tempAdjust;

            ary[tipy*maptipNum+tipx].pressure = ary[tipy*maptipNum+tipx].pressure*(1-ary[tipy*maptipNum+tipx].elevation**2);

            //気圧の低い方に風が吹く
            ary[tipy*maptipNum+tipx].windSum = 0;
            ary[tipy*maptipNum+tipx].windTip = [];
            for(let k=0;k<bigSurround.length;k++){
                if(maptipAry[tipy*maptipNum+tipx].pressure < bigSurround[k].pressure){
                    ary[tipy*maptipNum+tipx].pressure += (bigSurround[k].pressure - maptipAry[tipy*maptipNum+tipx].pressure)*pressureMigrateRate/2;
                    ary[bigSurroundCo[k]].pressure -= (bigSurround[k].pressure - maptipAry[tipy*maptipNum+tipx].pressure)*pressureMigrateRate/2;
                    ary[tipy*maptipNum+tipx].windSum++;
                    ary[tipy*maptipNum+tipx].windTip.push(k);
                }
            }
            //nか所以上から風が吹いていたら雨を降らせ、水分を移動させる
            if(ary[tipy*maptipNum+tipx].windSum >= 6){
                ary[tipy*maptipNum+tipx].rainFlag = 1;
                ary[tipy*maptipNum+tipx].rainMaxTime = rainTime+10*Math.random();
                for(let k=0;k<ary[tipy*maptipNum+tipx].windTip.length;k++){
                    ary[tipy*maptipNum+tipx].humidity += bigSurround[ary[tipy*maptipNum+tipx].windTip[k]].humidity*rainRate;
                    ary[bigSurroundCo[ary[tipy*maptipNum+tipx].windTip[k]]].humidity -= bigSurround[ary[tipy*maptipNum+tipx].windTip[k]].humidity*rainRate;
                }
            }

            //草が生える
            for(let k=0;k<fruitOnTip[j*maptipNum+i].length;k++){
                fruitOnTip[j*maptipNum+i][k]--;
                if(fruitOnTip[j*maptipNum+i][k] == 0){
                    fruitOnTip[j*maptipNum+i].splice(k,1);
                    let a = new kusa((i+Math.random()-1)*maptipSize,(j+Math.random()-1)*maptipSize, babyKusaSize);
                    
                    playArea.addChild(a);
                }
            }
        }
    }
    maptipAry = ary;
    for(let i=0;i<maptipNum**2;i++){
        if(maptipAry[i].rainFlag) maptipAry[i].rain();
    }

    //デザイン用
    tempsum = 0;
    for(let i=0;i<maptipNum**2;i++){
        tempsum += maptipAry[i].temp;
    }

    let humsum = 0;
    for(let i=0;i<maptipNum**2;i++){
        humsum += maptipAry[i].humidity;
    }

    //感知されるオブジェクトの位置計算
    for(let i=0;i<senseAreaNum**2;i++){
        objectsOnTip[i] = [];//初期化
    }
    for(let i=0;i<maptipNum**2;i++){
        for(let j=0;j<sensableKind;j++){
            objectsOnHitTip[i][j] = [];//初期化
        }
    }
    for(let i=0;i<sensableObjectAry.length;i++){
        let x = Math.min(Math.max(sensableObjectAry[i].rx+sensableObjectAry[i].oriSize*sensableObjectAry[i].size/2,
                                  sensableObjectAry[i].oriSize*sensableObjectAry[i].size),
                         maptipNum*maptipSize-sensableObjectAry[i].oriSize*sensableObjectAry[i].size);
        let y = Math.min(Math.max(sensableObjectAry[i].ry+sensableObjectAry[i].oriSize*sensableObjectAry[i].size/2,
                                  sensableObjectAry[i].oriSize*sensableObjectAry[i].size),
                         maptipNum*maptipSize-sensableObjectAry[i].oriSize*sensableObjectAry[i].size);

        objectsOnTip[mod(Math.floor(y/senseTipSize),senseAreaNum)*senseAreaNum+mod(Math.floor(x/senseTipSize),senseAreaNum)].push(sensableObjectAry[i]);
        objectsOnHitTip[mod(Math.floor(y/maptipSize),maptipNum)*maptipNum+mod(Math.floor(x/maptipSize),maptipNum)][sensableObjectAry[i].character].push(sensableObjectAry[i]);

    }


    //座標計算
    for(let i=0;i<movableObjectAry.length;i++){
        movableObjectAry[i].rx += movableObjectAry[i].vx;
        movableObjectAry[i].ry += movableObjectAry[i].vy;
        movableObjectAry[i].rx = mod(movableObjectAry[i].rx+movableObjectAry[i].oriSize*movableObjectAry[i].size/2, maptipNum*maptipSize)-movableObjectAry[i].oriSize*movableObjectAry[i].size/2;
        movableObjectAry[i].ry = mod(movableObjectAry[i].ry+movableObjectAry[i].oriSize*movableObjectAry[i].size/2, maptipNum*maptipSize)-movableObjectAry[i].oriSize*movableObjectAry[i].size/2;
    }
    for(let i=0;i<displayObjectAry.length;i++){
        displayObjectAry[i].x = (displayObjectAry[i].rx - camx)*camz;
        displayObjectAry[i].y = (displayObjectAry[i].ry - camy)*camz;
        displayObjectAry[i].scale.set(displayObjectAry[i].size*camz);
        if(isNaN(displayObjectAry[i].rx))console.log("nan");
    }

    //テキスト表示
    fuNumText.text = fuAry.length;
    suNumText.text = suAry.length;
    displayTime.text = Math.floor(Math.floor(time/3600)/10)+""+Math.floor(time/3600)%10+":"+Math.floor((Math.floor(time%3600)/60)/10)+""+Math.floor((time%3600)/60)%10+":"+Math.floor((time%60)/10*(100/60))+""+Math.floor((time%60)%10);

    //個体数がゼロになったらゲームオーバー
    if(fusuAry.length <= 0){
        state = gameover;
        app.stage.addChild(gameoverScene);
    }
    
    //個体数が規定以上になったらゲームクリア
    if(fusuAry.length >= 100){
        state = gameClear;
        gameclearScene.txt.text = "かかった時間："+Math.floor(time/60)+ "." +Math.ceil(Math.floor((time%60*100/60)*100)/100) + "秒";
        app.stage.addChild(gameclearScene);
        sounds.id("clear").play();
    }

    loopNum = Math.floor(fusuAry.length/50);
    t = (t+1)%oneYear;
    time++;
}
let registerFlag = 0;
let rank;
async function gameClear(){
    registerFlag = 0;
    app.ticker.remove(gameloop);
    const postData = new FormData; // フォーム方式で送る場合
    postData.set('clearTime', JSON.stringify(time)); // set()で格納する

    const data = {
        method: 'POST',
        body: postData
    };

    //let rank=0;

    let req = await fetch('checkRank.php', data);
    rank = await req.json();
    gameclearScene.ranktext.text = "ランキング："+rank+"位";

}

const maxLength = 20;
async function register(){
    if(registerFlag == 0){
        if(gameclearScene.input.text != "" && rank>=1){
            if(gameclearScene.input.text.length > maxLength){
                gameclearScene.input.text = gameclearScene.input.text.substr(0, maxLength) + '...'
            }

            sounds.id("register").play();
            let postData  = new FormData;
            postData.set('clearInfo', JSON.stringify([gameclearScene.input.text, time]));
            let data = {method: 'POST', body:postData};
            let a = await fetch("registerRank.php",data);//データ送信
            console.log(await a.json());

            gameclearScene.input.placeholder = "登録済み";
            gameclearScene.input.text = "登録済み";
            registerFlag = 1;
            gameclearScene.registerButton.texture = id["norank"].texture;
        } else {
            gameclearScene.input.placeholder = "名前を入れてね";
           
        }
    } else {
        gameclearScene.input.text = "登録は一度だけよ";
    }

    
}


function gameover(){

}


//ツイート用
let url = "https://gamingchahan.com/fuyasu";
let link = "http://twitter.com/intent/tweet?text=私は煩悩を&hashtags=めざせ煩悩マスター &url=" + url;
function tweet(){
    link = "http://twitter.com/intent/tweet?text=ふを"+fuAry.length+"匹、すを"+suAry.length+"匹増やした！！ かかった時間："+Math.floor(time/60)+"秒"+"&hashtags=ふやすを増やすゲーム &url=" + url;
    if(!window.open(link)){
        location.href = link;
    } else {
        window.open(link = "http://twitter.com/intent/tweet?text=ふを"+fuAry.length+"匹、すを"+suAry.length+"匹増やした！！ かかった時間："+Math.floor(time/60)+"秒"+"&hashtags=ふやすを増やすゲーム &url=" + url);
    }
    
}
function retry(){
    //app.stage.removeChild(gameoverScene);
    window.location.reload();
}



//便利な関数を置いておく場所
function constructSprite(sprite){
    sprite.vx = sprite.vy = sprite.ax = sprite.ay = sprite.av = 0;
    sprite.m = sprite.mm = 1;
    sprite.anchor.set(0.5,0.5);
}


//摩擦計算
function culcFriction(v, f) {
    if (v != 0) {
        if (Math.abs(v) <= f) return v;
        return Math.sign(v)*f;
    }
    return 0;
}
//二点間の距離
function objHypo(a,b) {
    return Math.pow(Math.pow(a.x-b.x,2)+Math.pow(a.y-a.y,2),1/2);
}
function hypo(a,b,c,d){
    let f = Math.pow(Math.pow(a-c,2)+Math.pow(b-d,2),1/2);
    if (f!=0) return Math.pow(Math.pow(a-c,2)+Math.pow(b-d,2),1/2);
    else return (f+0.0001);
}

//力を加える vx,vy.ax,ay,avが前提
function addForce(obj,px,py,x,y){//pは-1~1
    let angle = (Math.PI/2 -obj.rotation);
    let d = hypo(0,0,x,y);
    let d2 = hypo(0,0,px*obj.width/2,py*obj.height/2);
    let d3 = hypo(0,0,px,py);
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);
    let cos1 = x/d;
    let sin1 = y/d;
    let cos2 = (px*obj.width/2)/d2;
    let sin2 = (py*obj.height/2)/d2;
    obj.av += d3*d*((cos*cos2-sin*sin2)*cos1 +(sin*cos2-cos*sin2)*sin1)/obj.mm;//sin(angle-theta2+theta1)*/
    obj.ax += x;
    obj.ay += y;
}



function putFront(child){//スプライトを前面に持ってくる
    app.stage.removeChild(child);
    app.stage.addChild(child);
}



function screenResize() {
    let x=0;
    let y=0;
    app.stage.scale.x = app.stage.scale.y = 1;
    x = width;
    y = height;
    resizeRatio = Math.min(divWidth/width, window.innerHeight/height);
    if(divWidth < width || window.innerHeight < height) {
        x = width*resizeRatio; 
        y = height*resizeRatio; 
        app.stage.scale.x = resizeRatio;
        app.stage.scale.y = resizeRatio;
    }
    app.renderer.resize(x, y);
}
window.addEventListener("load", screenResize);
window.addEventListener('resize',screenResize,false);

function cos(x,y,xx,yy){
    return (x-xx)/hypo(x,xx,y,yy);
}
function sin(x,y,xx,yy){
    return (y-yy)/hypo(x,xx,y,yy);
}


let mouse = {};
mouse.b = bat;
mouse.pickupAry = [];
mouse.x = 0;
mouse.y = 0;
let isClicked = false;
//画面タッチ
function stageOnClick(e){
    this.data = e.data;
    mouse.x = this.data.getLocalPosition(this.parent).x;
    mouse.y = this.data.getLocalPosition(this.parent).y;
    justClicked = true;
    isClicked= true;    
}
function stageOutClick(e){
    isClicked = false;
    this.data = null;
}
function mouseMove(e){
    this.data = e.data;
    mouse.x = this.data.getLocalPosition(this.parent).x;
    mouse.y = this.data.getLocalPosition(this.parent).y;
}

function rgb2hex ( rgb ) {
	return "0x" + rgb.map( function ( value ) {
		return ( "0" + value.toString( 16 ) ).slice( -2 ) ;
	} ).join( "" ) ;
}

function hsv2rgb(h, s, v) {
    // 引数処理
    h = (h < 0 ? 360 + h % 360 : h % 360) / 60;
    s = s < 0 ? 0 : s > 1 ? 1 : s;
    v = v < 0 ? 0 : v > 1 ? 1 : v;

    // HSV to RGB 変換
    const c = [v, v, v]
      , a = Math.floor(h)
      , f = h - a;
    c[Math.floor(a / 2 + 2) % 3] *= (1 - s);
    c[(7 - a) % 3] *= (1 - s * (a % 2 ? f : 1 - f));
    for (let i in c)
        c[i] = Math.round(c[i] * 255);

    // 戻り値
    return {
        hex: '#' + (('00000' + (c[0] << 16 | c[1] << 8 | c[2]).toString(16)).slice(-6)),
        rgb: c,
        r: c[0],
        g: c[1],
        b: c[2],
    };
}

function mod(i, j) {
    return (i % j) < 0 ? (i % j) + 0 + (j < 0 ? -j : j) : (i % j + 0);
}