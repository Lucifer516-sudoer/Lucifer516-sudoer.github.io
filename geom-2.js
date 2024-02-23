let w,h,el,g,ratio,shapes,my={}
function init(mode){let version='0.94'
my.mode=getJSQueryVar('mode','vector')
let canvasid='canvas'+my.mode
my.dragging=false
w=540
h=360
let s=''
s+='<div style="position:relative; width:'+w+'px; height:'+h+'px; border: none; border-radius: 9px; margin:auto; display:block;  border: 1px solid blue; ">'
s+='<canvas id="'+canvasid+'" width="'+w+'" height="'+h+'" style="z-index:10;"></canvas>'
s+='<div style="position:absolute; right:3px; top:3px;">'
// s+='<button id="appBtn" onclick="winNew()" style="z-index:2;" class="btn">'+winnewSvg()+'</button>'
s+='</div>'
s+='<div id="btns2" style="position:absolute; right:3px; bottom:3px;">'
s+='<button id="coordsBtn" onclick="toggleCoords()" style="z-index:2;" class="btn lo" >Coords</button>'
s+='<button id="resetBtn" onclick="reset()" style="z-index:2;" class="btn" >Reset</button>'
s+='</div>'
// s+=wrap({cls:'copyrt',pos:'abs',style:'left:5px; bottom:3px'},'&copy; 2023 Rod Pierce v'+version)
s+='</div>'
docInsert(s)
el=document.getElementById(canvasid)
ratio=2
el.width=w*ratio
el.height=h*ratio
el.style.width=w+'px'
el.style.height=h+'px'
g=el.getContext('2d')
g.setTransform(ratio,0,0,ratio,0,0)
my.coords=new Coords(0,0,w,h,-2,-1.9,15,11,true)
my.graph=new Graph(g,my.coords)
my.dragNo=0
my.coordsQ=false
shapes=[]
makeShapes()
el.addEventListener('mousedown',mouseDownListener,false)
el.addEventListener('touchstart',ontouchstart,false)
el.addEventListener('mousemove',domousemove,false)
doType()}
function winnewSvg(){let s=''
s+='<svg xmlns="http://www.w3.org/2000/svg" width="26" height="21" version="1.1" style="stroke-width:2; fill:none; vertical-align:middle;">'
s+='<rect style="stroke:grey;" x="1" y="6" ry="4" width="19" height="13" />'
s+='<path style="stroke:#cdf;stroke-width:3;" d="m 14,6 h 6 v 6"/>'
s+='<path style="stroke:black;" d="m 16,2 h 8 v 8"/>'
s+='<path style="stroke:black;" d="m 14,12 10,-10"/>'
s+='</svg>'
return s}
function winNew(){window.open(toLoc('/app.html?folder=geometry&file=geom-vector&p='+my.mode))}
function toLoc(s){if(window.location.href.indexOf('localhost')>0)s='/mathsisfun'+s
return s}
function reset(){makeShapes()
update()}
function update(){doType()}
function toggleCoords(){my.coordsQ=!my.coordsQ
toggleBtn('coordsBtn',my.coordsQ)
update()}
function toggleBtn(btn,onq){if(onq){document.getElementById(btn).classList.add('hi')
document.getElementById(btn).classList.remove('lo')}else{document.getElementById(btn).classList.add('lo')
document.getElementById(btn).classList.remove('hi')}}
function ontouchstart(evt){let touch=evt.targetTouches[0]
evt.clientX=touch.clientX
evt.clientY=touch.clientY
evt.touchQ=true
mouseDownListener(evt)}
function ontouchmove(evt){let touch=evt.targetTouches[0]
evt.clientX=touch.clientX
evt.clientY=touch.clientY
evt.touchQ=true
mouseMoveListener(evt)
evt.preventDefault()}
function ontouchend(){el.addEventListener('touchstart',ontouchstart,false)
window.removeEventListener('touchend',ontouchend,false)
if(my.dragging){my.dragging=false
window.removeEventListener('touchmove',ontouchmove,false)}}
function domousemove(e){document.body.style.cursor='default'
let bRect=el.getBoundingClientRect()
let mouseX=(e.clientX-bRect.left)*(el.width/ratio/bRect.width)
let mouseY=(e.clientY-bRect.top)*(el.height/ratio/bRect.height)
for(let i=0;i<shapes.length;i++){if(hitTest(shapes[i],mouseX,mouseY)){my.dragNo=i
document.body.style.cursor='pointer'}}}
function mouseDownListener(evt){let i
let highestIndex=-1
let bRect=el.getBoundingClientRect()
let mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width)
let mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height)
for(i=0;i<shapes.length;i++){if(hitTest(shapes[i],mouseX,mouseY)){my.dragNo=i
my.dragging=true
if(i>highestIndex){my.dragHoldX=mouseX-shapes[i].x
my.dragHoldY=mouseY-shapes[i].y
highestIndex=i
my.dragNo=i}}}
if(my.dragging){if(evt.touchQ){window.addEventListener('touchmove',ontouchmove,false)}else{window.addEventListener('mousemove',mouseMoveListener,false)}
doType()}
if(evt.touchQ){el.removeEventListener('touchstart',ontouchstart,false)
window.addEventListener('touchend',ontouchend,false)}else{el.removeEventListener('mousedown',mouseDownListener,false)
window.addEventListener('mouseup',mouseUpListener,false)}
if(evt.preventDefault){evt.preventDefault()}
else if(evt.returnValue){evt.returnValue=false}
return false}
function mouseUpListener(){el.addEventListener('mousedown',mouseDownListener,false)
window.removeEventListener('mouseup',mouseUpListener,false)
if(my.dragging){my.dragging=false
window.removeEventListener('mousemove',mouseMoveListener,false)}}
function mouseMoveListener(evt){let posX
let posY
let shapeRad=shapes[my.dragNo].rad
let minX=shapeRad
let maxX=el.width-shapeRad
let minY=shapeRad
let maxY=el.height-shapeRad
let bRect=el.getBoundingClientRect()
let mouseX=(evt.clientX-bRect.left)*(el.width/ratio/bRect.width)
let mouseY=(evt.clientY-bRect.top)*(el.height/ratio/bRect.height)
posX=mouseX-my.dragHoldX
posX=posX<minX?minX:posX>maxX?maxX:posX
posY=mouseY-my.dragHoldY
posY=posY<minY?minY:posY>maxY?maxY:posY
shapes[my.dragNo].x=posX
shapes[my.dragNo].y=posY
doType()}
function hitTest(shape,mx,my){let dx
let dy
dx=mx-shape.x
dy=my-shape.y
return dx*dx+dy*dy<shape.rad*shape.rad}
function doType(){g.clearRect(0,0,el.width,el.height)
my.graph.drawGraph()
drawPts()}
function makeShapes(){let xys=[]
switch(my.mode){case 'vector':case 'xy':xys=[[150,220],[350,150],]
break
default:xys=[[150,220],[350,150],]}
shapes=[]
for(let i=0;i<xys.length;i++){let xy=xys[i]
shapes.push(new Pt(xy[0],xy[1]))}}
function drawPts(){let i
g.strokeStyle='rgba(0, 0, 255, 0.5)'
g.fillStyle='rgba(255, 255, 100, 0.5)'
g.lineWidth=2
switch(my.mode){case 'vector':case 'xy':let pt1=shapes[0]
let pt2=shapes[1]
let ln=new Line(pt1,pt2)
ln.setLen(1500,true)
g.beginPath()
g.setLineDash([5,15])
g.strokeStyle='#aaa'
g.lineWidth=1
g.moveTo(ln.a.x,ln.a.y)
g.lineTo(ln.b.x,ln.b.y)
g.stroke()
g.setLineDash([])
g.fillStyle='#aaa'
g.font='14px Arial'
let midPt=new Pt((pt1.x+pt2.x)/2,(pt1.y+pt2.y)/2)
let dx=pt2.x-midPt.x
let dy=pt2.y-midPt.y
let ang=Math.atan2(dy,dx)
g.save()
g.translate(pt2.x,pt2.y)
g.rotate(ang)
g.beginPath()
g.fillText('direction \u2192',90,-3)
g.restore()
if(my.mode=='vector'){drawDim(pt1,pt2,'#8af','Magnitude = ')}
if(my.mode=='xy'){g.font='bold 18px Arial'
g.fillStyle='darkorange'
g.fillText('Vector components x and y',15,27)
g.fill()
let ptxy={x:pt2.x-0.01,y:pt1.y}
g.lineWidth=2
drawVec(pt1,ptxy,'#aaf')
drawVec(ptxy,pt2,'#faa')
g.lineWidth=1
drawDim(pt1,ptxy,'#aaf','x = ')
drawDim(ptxy,pt2,'#faa','y = ')}
g.lineWidth=3
drawVec(pt1,pt2,'red')
break
default:}
for(i=0;i<shapes.length;i++){g.fillStyle='hsla(240, 100%, 70%, 0.6)'
g.beginPath()
g.arc(shapes[i].x,shapes[i].y,shapes[i].rad,0,2*Math.PI,false)
g.closePath()
g.fill()
g.fillStyle='hsla(240, 100%, 70%, 1)'
g.beginPath()
g.arc(shapes[i].x,shapes[i].y,2,0,2*Math.PI,false)
g.closePath()
g.fill()
g.textAlign='left'
if(my.coordsQ){g.font='bold 14px Arial'
let txt='('
txt+=my.coords.toXVal(shapes[i].x).toFixed(1)
txt+=','
txt+=my.coords.toYVal(shapes[i].y).toFixed(1)
txt+=')'
g.fillText(txt,shapes[i].x+5,shapes[i].y-9)}else{g.font='14px Arial'
g.fillText(String.fromCharCode(65+i),shapes[i].x+5,shapes[i].y-9)}}}
function drawDim(pta1,pta2,clr,lbl){let pt1,pt2
if(pta1.x<pta2.x){pt1={x:pta1.x,y:pta1.y}
pt2={x:pta2.x,y:pta2.y}}else{pt1={x:pta2.x,y:pta2.y}
pt2={x:pta1.x,y:pta1.y}}
let xVal=pt2.x-pt1.x
let yVal=pt2.y-pt1.y
let ang=Math.atan2(yVal,xVal)
let mag=Math.sqrt(xVal*xVal+yVal*yVal)
g.strokeStyle=clr
g.fillStyle=clr
g.save()
g.translate(pt1.x,pt1.y)
g.rotate(ang)
g.textAlign='center'
g.beginPath()
g.moveTo(0,30)
g.lineTo(mag,30)
g.moveTo(0,10)
g.lineTo(0,40)
g.moveTo(mag,10)
g.lineTo(mag,40)
g.drawArrow(0,30,15,2,15,7,-Math.PI)
g.drawArrow(mag,30,15,2,15,7,0)
g.fillText(lbl+Math.round(my.coords.xScale*mag*10)/10,mag/2,27)
g.stroke()
g.restore()}
function drawVec(pt1,pt2,clr){g.beginPath()
g.strokeStyle=clr
g.moveTo(pt1.x,pt1.y)
g.lineTo(pt2.x,pt2.y)
g.stroke()
g.fillStyle=clr
let xVal=pt2.x-pt1.x
let yVal=pt2.y-pt1.y
let ang=Math.atan2(yVal,xVal)
let mag=Math.sqrt(xVal*xVal+yVal*yVal)
if(mag<0)ang+=Math.PI
g.drawArrow(pt2.x,pt2.y,20,2,30,15,-ang)
g.fill()}
function Pt(ix,iy){this.x=ix
this.y=iy
this.rad=9
this.color='rgb('+0+','+0+','+255+')'
this.angleIn=0
this.angleOut=0}
Pt.prototype.setxy=function(ix,iy){this.x=ix
this.y=iy}
Pt.prototype.getAngle=function(){return this.angleOut-this.angleIn}
Pt.prototype.drawMe=function(g){g.fillStyle='rgba(0, 0, 255, 0.3)'
g.beginPath()
g.arc(this.x,this.y,20,0,2*Math.PI,false)
g.closePath()
g.fill()}
Pt.prototype.getAvg=function(pts){let xSum=0
let ySum=0
for(let i=0;i<pts.length;i++){xSum+=pts[i].x
ySum+=pts[i].y}
let newPt=new Pt(xSum/pts.length,ySum/pts.length)
newPt.x=xSum/pts.length
newPt.y=ySum/pts.length
return newPt}
Pt.prototype.setAvg=function(pts){this.setPrevPt()
let newPt=this.getAvg(pts)
this.x=newPt.x
this.y=newPt.y}
Pt.prototype.interpolate=function(pt1,pt2,f){this.setPrevPt()
this.x=pt1.x*f+pt2.x*(1-f)
this.y=pt1.y*f+pt2.y*(1-f)}
Pt.prototype.translate=function(pt,addQ){addQ=typeof addQ!=='undefined'?addQ:true
let t=new Pt(this.x,this.y)
t.x=this.x
t.y=this.y
if(addQ){t.x+=pt.x
t.y+=pt.y}else{t.x-=pt.x
t.y-=pt.y}
return t}
Pt.prototype.translateMe=function(pt,addQ){addQ=typeof addQ!=='undefined'?addQ:true
if(addQ){this.x+=pt.x
this.y+=pt.y}else{this.x-=pt.x
this.y-=pt.y}}
Pt.prototype.rotate=function(angle){let cosa=Math.cos(angle)
let sina=Math.sin(angle)
let xPos=this.x*cosa+this.y*sina
let yPos=-this.x*sina+this.y*cosa
return new Pt(xPos,yPos)}
Pt.prototype.rotateMe=function(angle){let t=new Pt(this.x,this.y).rotate(angle)
this.x=t.x
this.y=t.y}
Pt.prototype.multiply=function(fact){return new Pt(this.x*fact,this.y*fact)}
Pt.prototype.multiplyMe=function(fact){this.x*=fact
this.y*=fact}
function dist(dx,dy){return Math.sqrt(dx*dx+dy*dy)}
function loop(currNo,minNo,maxNo,incr){currNo+=incr
let range=maxNo-minNo+1
if(currNo<minNo){currNo=maxNo-((-currNo+maxNo)%range)}
if(currNo>maxNo){currNo=minNo+((currNo-minNo)%range)}
return currNo}
function constrain(min,val,max){return Math.min(Math.max(min,val),max)}
function Coords(left,top,width,height,xStt,yStt,xEnd,yEnd,uniScaleQ){this.left=left
this.top=top
this.width=width
this.height=height
this.xStt=xStt
this.yStt=yStt
this.xEnd=xEnd
this.yEnd=yEnd
this.uniScaleQ=uniScaleQ
this.xLogQ=false
this.yLogQ=false
this.skewQ=false
this.xScale
this.xLogScale
this.yScale
this.calcScale()}
Coords.prototype.calcScale=function(){if(this.xLogQ){if(this.xStt<=0)this.xStt=1
if(this.xEnd<=0)this.xEnd=1}
if(this.yLogQ){if(this.yStt<=0)this.yStt=1
if(this.yEnd<=0)this.yEnd=1}
let temp
if(this.xStt>this.xEnd){temp=this.xStt
this.xStt=this.xEnd
this.xEnd=temp}
if(this.yStt>this.yEnd){temp=this.yStt
this.yStt=this.yEnd
this.yEnd=temp}
let xSpan=this.xEnd-this.xStt
if(xSpan<=0)xSpan=0.1
this.xScale=xSpan/this.width
this.xLogScale=(Math.log(this.xEnd)-Math.log(this.xStt))/this.width
let ySpan=this.yEnd-this.yStt
if(ySpan<=0)ySpan=0.1
this.yScale=ySpan/this.height
this.yLogScale=(Math.log(this.yEnd)-Math.log(this.yStt))/this.height
if(this.uniScaleQ&&!this.xLogQ&&!this.yLogQ){let newScale=Math.max(this.xScale,this.yScale)
this.xScale=newScale
xSpan=this.xScale*this.width
let xMid=(this.xStt+this.xEnd)/2
this.xStt=xMid-xSpan/2
this.xEnd=xMid+xSpan/2
this.yScale=newScale
ySpan=this.yScale*this.height
let yMid=(this.yStt+this.yEnd)/2
this.yStt=yMid-ySpan/2
this.yEnd=yMid+ySpan/2}}
Coords.prototype.getXScale=function(){return this.xScale}
Coords.prototype.getYScale=function(){return this.yScale}
Coords.prototype.toXPix=function(val){if(this.xLogQ){return this.left+(Math.log(val)-Math.log(this.xStt))/this.xLogScale}else{return this.left+(val-this.xStt)/this.xScale}}
Coords.prototype.toYPix=function(val){if(this.yLogQ){return this.top+(Math.log(this.yEnd)-Math.log(val))/this.yLogScale}else{return this.top+(this.yEnd-val)/this.yScale}}
Coords.prototype.toPtVal=function(pt,useCornerQ){return new Pt(this.toXVal(pt.x,useCornerQ),this.toYVal(pt.y,useCornerQ))}
Coords.prototype.toXVal=function(pix,useCornerQ){if(useCornerQ){return this.xStt+(pix-this.left)*this.xScale}else{return this.xStt+pix*this.xScale}}
Coords.prototype.toYVal=function(pix,useCornerQ){if(useCornerQ){return this.yEnd-(pix-this.top)*this.yScale}else{return this.yEnd-pix*this.yScale}}
Coords.prototype.getTicks=function(stt,span){let ticks=[]
let inter=this.tickInterval(span/5,false)
let tickStt=Math.ceil(stt/inter)*inter
let i=0
let tick
do{let tick=i*inter
tick=Number(tick.toPrecision(5))
ticks.push([tickStt+tick,1])
i++}while(tick<span)
inter=this.tickInterval(span/4,true)
for(i=0;i<ticks.length;i++){let t=ticks[i][0]
if(Math.abs(Math.round(t/inter)-t/inter)<0.001){ticks[i][1]=0}}
return ticks}
Coords.prototype.tickInterval=function(span,majorQ){let pow10=Math.pow(10,Math.floor(Math.log(span)*Math.LOG10E))
let mantissa=span/pow10
if(mantissa>=5){if(majorQ){return 5*pow10}else{return 2*pow10}}
if(mantissa>=2){if(majorQ){return 2*pow10}else{return 1*pow10}}
if(mantissa>=1){if(majorQ){return 1*pow10}else{return 0.2*pow10}}
if(majorQ){return 1*pow10}else{return 0.2*pow10}}
Coords.prototype.xTickInterval=function(tickDensity,majorQ){return this.tickInterval((this.xEnd-this.xStt)/tickDensity,majorQ)}
Coords.prototype.yTickInterval=function(tickDensity,majorQ){return this.tickInterval((this.yEnd-this.yStt)/tickDensity,majorQ)}
function Graph(g,coords){this.g=g
this.coords=coords
this.xLinesQ=true
this.yLinesQ=true
this.xValsQ=true
this.yValsQ=true
this.skewQ=false}
Graph.prototype.drawGraph=function(){this.hzAxisY=this.coords.toYPix(0)
if(this.hzAxisY<0)this.hzAxisY=0
if(this.hzAxisY>this.coords.height)this.hzAxisY=this.coords.height
this.hzNumsY=this.hzAxisY+14
if(this.hzAxisY>this.coords.height-10)this.hzNumsY=this.coords.height-3
this.vtAxisX=this.coords.toXPix(0)
if(this.vtAxisX<0)this.vtAxisX=0
if(this.vtAxisX>this.coords.width)this.vtAxisX=this.coords.width
this.vtNumsX=this.vtAxisX-5
if(this.vtAxisX<10)this.vtNumsX=20
if(this.coords.xLogQ){this.drawLinesLogX()}else{if(this.xLinesQ){this.drawHzLines()}}
if(this.coords.yLogQ){this.drawLinesLogY()}else{if(this.yLinesQ){this.drawVtLines()}}}
Graph.prototype.drawVtLines=function(){let g=this.g
g.lineWidth=1
let ticks=this.coords.getTicks(this.coords.xStt,this.coords.xEnd-this.coords.xStt)
for(let i=0;i<ticks.length;i++){let tick=ticks[i]
let xVal=tick[0]
let tickLevel=tick[1]
if(tickLevel==0){g.strokeStyle='rgba(0,0,256,0.2)'}else{g.strokeStyle='rgba(0,0,256,0.1)'}
let xPix=this.coords.toXPix(xVal,false)
g.beginPath()
g.moveTo(xPix,this.coords.toYPix(this.coords.yStt,false))
g.lineTo(xPix,this.coords.toYPix(this.coords.yEnd,false))
g.stroke()
if(my.coordsQ&&tickLevel==0&&this.xValsQ){g.fillStyle='#0000ff'
g.font='12px Verdana'
g.textAlign='center'
g.fillText(fmt(xVal),xPix,this.hzNumsY)}}
if(this.skewQ)return
if(my.coordsQ){g.lineWidth=1.5
g.strokeStyle='#ff0000'
g.beginPath()
g.moveTo(this.vtAxisX,this.coords.toYPix(this.coords.yStt,false))
g.lineTo(this.vtAxisX,this.coords.toYPix(this.coords.yEnd,false))
g.stroke()
g.beginPath()
g.fillStyle=g.strokeStyle
g.drawArrow(this.vtAxisX,this.coords.toYPix(this.coords.yEnd),15,2,20,10,Math.PI/2,10,false)
g.stroke()
g.fill()}}
Graph.prototype.drawHzLines=function(){let g=this.g
g.lineWidth=1
let ticks=this.coords.getTicks(this.coords.yStt,this.coords.yEnd-this.coords.yStt)
for(let i=0;i<ticks.length;i++){let tick=ticks[i]
let yVal=tick[0]
let tickLevel=tick[1]
if(tickLevel==0){g.strokeStyle='rgba(0,0,256,0.2)'}else{g.strokeStyle='rgba(0,0,256,0.1)'}
let yPix=this.coords.toYPix(yVal,false)
g.beginPath()
g.moveTo(this.coords.toXPix(this.coords.xStt,false),yPix)
g.lineTo(this.coords.toXPix(this.coords.xEnd,false),yPix)
g.stroke()
if(my.coordsQ&&tickLevel==0&&this.yValsQ){g.fillStyle='#ff0000'
g.font='12px Verdana'
g.textAlign='right'
g.fillText(fmt(yVal),this.vtNumsX,yPix+5)}}
if(this.skewQ)return
if(my.coordsQ){g.lineWidth=2
g.strokeStyle='#0000ff'
g.beginPath()
g.moveTo(this.coords.toXPix(this.coords.xStt,false),this.hzAxisY)
g.lineTo(this.coords.toXPix(this.coords.xEnd,false),this.hzAxisY)
g.stroke()
g.beginPath()
g.fillStyle=g.strokeStyle
g.drawArrow(this.coords.toXPix(this.coords.xEnd,false),this.hzAxisY,15,2,20,10,0,10,false)
g.stroke()
g.fill()}}
function Line(pt1,pt2){this.a=new Pt(pt1.x,pt1.y)
this.b=new Pt(pt2.x,pt2.y)}
Line.prototype.getLength=function(){let dx=this.b.x-this.a.x
let dy=this.b.y-this.a.y
return Math.sqrt(dx*dx+dy*dy)}
Line.prototype.setLen=function(newLen,fromMidQ){let len=this.getLength()
if(fromMidQ){let midPt=this.getMidPt()
let halfPt=new Pt(this.a.x-midPt.x,this.a.y-midPt.y)
halfPt.multiplyMe(newLen/len)
this.a=midPt.translate(halfPt)
this.b=midPt.translate(halfPt,false)}else{let diffPt=new Pt(this.a.x-this.b.x,this.a.y-this.b.y)
diffPt.multiplyMe(newLen/len)
this.b=this.a.translate(diffPt,false)}}
Line.prototype.getMidPt=function(){return new Pt((this.a.x+this.b.x)/2,(this.a.y+this.b.y)/2)}
Line.prototype.rotateMidMe=function(angle){let midPt=this.getMidPt()
this.a.translateMe(midPt,false)
this.b.translateMe(midPt,false)
this.a.rotateMe(angle)
this.b.rotateMe(angle)
this.a.translateMe(midPt)
this.b.translateMe(midPt)}
Line.prototype.getClosestPoint=function(toPt,inSegmentQ){let AP=toPt.translate(this.a,false)
let AB=this.b.translate(this.a,false)
let ab2=AB.x*AB.x+AB.y*AB.y
let ap_ab=AP.x*AB.x+AP.y*AB.y
let t=ap_ab/ab2
if(inSegmentQ){t=constrain(0,t,1)}
return this.a.translate(AB.multiply(t))}
Line.prototype.setLen=function(newLen,fromMidQ){fromMidQ=typeof fromMidQ!=='undefined'?fromMidQ:true
let len=this.getLength()
if(fromMidQ){let midPt=this.getMidPt()
let halfPt=new Pt(this.a.x-midPt.x,this.a.y-midPt.y)
halfPt.multiplyMe(newLen/len)
this.a=midPt.translate(halfPt)
this.b=midPt.translate(halfPt,false)}else{let diffPt=new Pt(this.a.x-this.b.x,this.a.y-this.b.y)
diffPt.multiplyMe(newLen/len)
this.b=this.a.translate(diffPt,false)}}
Line.prototype.getAngle=function(){return Math.atan2(this.b.y-this.a.y,this.b.x-this.a.x)}
Line.prototype.isPerp=function(vsLine,toler){if(true){let degDiff=this.getAngle()-vsLine.getAngle()
degDiff=Math.abs(degDiff)
if(degDiff>Math.PI)degDiff-=Math.PI
if(isNear(degDiff,Math.PI/2,toler)){return true}
return false}else{}}
function fmt(num,digits){digits=14
if(num==Number.POSITIVE_INFINITY)return 'undefined'
if(num==Number.NEGATIVE_INFINITY)return 'undefined'
num=num.toPrecision(digits)
num=num.replace(/0+$/,'')
if(num.charAt(num.length-1)=='.')num=num.substr(0,num.length-1)
if(Math.abs(num)<1e-15)num=0
return num}
function isNear(checkVal,centralVal,limitVal){if(checkVal<centralVal-limitVal)return false
if(checkVal>centralVal+limitVal)return false
return true}
CanvasRenderingContext2D.prototype.drawArrow=function(x0,y0,totLen,shaftHt,headLen,headHt,angle,sweep,invertQ){let g=this
let pts=[[0,0],[-headLen,-headHt/2],[-headLen+sweep,-shaftHt/2],[-totLen,-shaftHt/2],[-totLen,shaftHt/2],[-headLen+sweep,shaftHt/2],[-headLen,headHt/2],[0,0],]
if(invertQ){pts.push([0,-headHt/2],[-totLen,-headHt/2],[-totLen,headHt/2],[0,headHt/2])}
for(let i=0;i<pts.length;i++){let cosa=Math.cos(-angle)
let sina=Math.sin(-angle)
let xPos=pts[i][0]*cosa+pts[i][1]*sina
let yPos=pts[i][0]*sina-pts[i][1]*cosa
if(i==0){g.moveTo(x0+xPos,y0+yPos)}else{g.lineTo(x0+xPos,y0+yPos)}}}
CanvasRenderingContext2D.prototype.drawBox=function(midX,midY,radius,angle){g.beginPath()
let pts=[[0,0],[Math.cos(angle),Math.sin(angle)],[Math.cos(angle)+Math.cos(angle+Math.PI/2),Math.sin(angle)+Math.sin(angle+Math.PI/2)],[Math.cos(angle+Math.PI/2),Math.sin(angle+Math.PI/2)],[0,0],]
for(let i=0;i<pts.length;i++){if(i==0){g.moveTo(midX+radius*pts[i][0],midY+radius*pts[i][1])}else{g.lineTo(midX+radius*pts[i][0],midY+radius*pts[i][1])}}
g.stroke()}
function getJSQueryVar(varName,defaultVal){let scripts=document.getElementsByTagName('script')
let lastScript=scripts[scripts.length-1]
let scriptName=lastScript.src
let bits=scriptName.split('?')
if(bits.length<2)return defaultVal
let query=bits[1]
console.log('query: ',query)
let vars=query.split('&')
for(let i=0;i<vars.length;i++){let pair=vars[i].split('=')
if(pair[0]==varName){return pair[1]}}
return defaultVal}
function docInsert(s){let div=document.createElement('div')
div.innerHTML=s
let script=document.currentScript
script.parentElement.insertBefore(div,script)}
function wrap({id='',cls='',pos='rel',style='',txt='',tag='div',lbl='',fn='',opts=[]},...mores){let s=''
s+='\n'
txt+=mores.join('')
let noProp='event.stopPropagation(); '
let tags={btn:{stt:'<button '+(fn.length>0?' onclick="'+noProp+fn+'" ':''),cls:'btn',fin:'>'+txt+'</button>'},can:{stt:'<canvas ',cls:'',fin:'></canvas>'},div:{stt:'<div '+(fn.length>0?' onclick="'+fn+'" ':''),cls:'',fin:' >'+txt+'</div>'},edit:{stt:'<textarea onkeyup="'+fn+'" onchange="'+fn+'"',cls:'',fin:' >'+txt+'</textarea>'},inp:{stt:'<input value="'+txt+'"'+(fn.length>0?'  oninput="'+fn+'" onchange="'+fn+'"':''),cls:'input',fin:'>'+(lbl.length>0?'</label>':'')},out:{stt:'<span ',cls:'output',fin:' >'+txt+'</span>'+(lbl.length>0?'</label>':'')},radio:{stt:'<div ',cls:'radio',fin:'>\n'},sel:{stt:'<select '+(fn.length>0?' onchange="'+fn+'"':''),cls:'select',fin:'>\n'},sld:{stt:'<input type="range" '+txt+' oninput="'+noProp+fn+'" onchange="'+noProp+fn+'"',cls:'select',fin:'>'+(lbl.length>0?'</label>':'')},}
let type=tags[tag]
if(lbl.length>0)s+='<label class="label">'+lbl+' '
s+=type.stt
if(cls.length==0)cls=type.cls
if(tag=='div')style+=fn.length>0?' cursor:pointer;':''
if(id.length>0)s+=' id="'+id+'"'
if(cls.length>0)s+=' class="'+cls+'"'
if(pos=='dib')s+=' style="position:relative; display:inline-block;'+style+'"'
if(pos=='rel')s+=' style="position:relative; '+style+'"'
if(pos=='abs')s+=' style="position:absolute; '+style+'"'
s+=type.fin
if(tag=='radio'){for(let i=0;i<opts.length;i++){let chk=''
if(i==0)chk='checked'
let idi=id+i
let lbl=opts[i]
s+='<input id="'+idi+'" type="radio" name="'+id+'" value="'+lbl.name+'" onclick="'+fn+'('+i+');" '+chk+' >'
s+='<label for="'+idi+'">'+lbl.name+' </label>'}
s+='</div>'}
if(tag=='sel'){for(let i=0;i<opts.length;i++){let opt=opts[i]
let idStr=id+i
let chkStr=opt.name==txt?' selected ':''
let descr=opt.hasOwnProperty('descr')?opt.descr:opt.name
s+='<option id="'+idStr+'" value="'+opt.name+'"'+chkStr+'>'+descr+'</option>\n'}
s+='</select>'
if(lbl.length>0)s+='</label>'}
s+='\n'
return s.trim()}
init()