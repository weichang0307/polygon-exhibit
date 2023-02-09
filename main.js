let canvas=document.getElementById('canvas')
canvas.width=500
canvas.height=1000
let ctx=canvas.getContext('2d')
let fps=50
let b01=new ball(100,100,20,10)
let r01=new rect(200,100,40,40,10)
let ws=[]
let bs=[]
let nn=10
let tt=0

let poly







let world_=new world(0,300,100)
let keys={}
function init(){




    /*
    ws.push(new rect(-250,100,500,30,Infinity))
    ws.push(new rect(250,400,500,30,Infinity))
    ws.push(new rect(200,250,30,500,Infinity))
    ws.push(new rect(400,250,30,500,Infinity))*/

    ws.push(new polygon(-250,100,[[-500,-10],[500,-10],[500,10],[-500,10]],Infinity))
    ws.push(new polygon(250,400,[[-500,-10],[500,-10],[500,10],[-500,10]],Infinity))
    ws.push(new polygon(100,250,[[-10,-500],[10,-500],[10,500],[-10,500]],Infinity))
    ws.push(new polygon(400,250,[[-10,-500],[10,-500],[10,500],[-10,500]],Infinity))
    for(let i of ws){
        i.isgravity=false
        world_.add(i)
    }
    ws.push(new polygon(250,300,[[0,30],[100,30],[120,0],[120,-70],[-0,0]],10))
    world_.add(ws[4])
    ws.push(new polygon(290,150,[[0,9],[30,9],[30,0],[30,-6],[-0,0]],10))
    world_.add(ws[5])
    ws.push(new polygon(290,0,[[0,9],[30,15],[30,0],[30,-6],[-0,10]],10))
    world_.add(ws[6])
    ws.push(new polygon(290,-150,[[0,9],[30,20],[30,0],[30,-6],[-0,0]],10))
    world_.add(ws[7])
    ws.push(new ball(270,-230,30,10))
    world_.add(ws[8])
    ws[8].material='metal'
    ws.push(new ball(300,-230,20,10))
    world_.add(ws[9])
    ws[9].material='metal'


    /*
    for(let i=0;i<nn;i++){
        let x=Math.random()*100+250
        let y=Math.random()*1000-1000
        let vx=(Math.random()-0.5)*0.5
        let vy=(Math.random()-0.5)*0.5
        let bb=new ball(x,y,10,10)
        //let bb=new rect(x,y,50,50,10)
        bb.velocity=[vx,vy]
        bs.push(bb)
        world_.add(bb)
    }
    bs[0].radius=30
    bs[0].position[1]=300*/

    world_.setCoefficient('default','default',0,0.5)
    world_.setCoefficient('metal','default',0,0.5)
    world_.setCoefficient('metal','metal',0,0.5)

    

    /*
    world_.add(b01)
    world_.add(r01)
    b01.velocity[0]=0.1
    r01.velocity[0]=0
    world_.add_constraint(b01,r01,100,0.0001)*/
    window.addEventListener('keydown',keydown)
    window.addEventListener('keyup',keyup)
}
function update(){
    tt+=1000/fps/*
    if(tt>5000){
        ws[2].velocity[0]=Math.sin(tt/50)*500
        ws[3].velocity[0]=Math.sin(tt/50)*500
    }else{
        ws[2].velocity[0]=0
        ws[3].velocity[0]=0
    }*/
    
/*
    
    if(keys.a){
        bs[0].velocity[0]-=0.01
    }
    if(keys.d){
        bs[0].velocity[0]+=0.05
    }
    if(keys.w){
        bs[0].velocity[1]-=0.05
    }
    if(keys.s){
        bs[0].velocity[1]+=0.05
    }*/



    world_.update(1/fps)

}

function keydown(e){
    let keyid=e.code
    if(keyid==='KeyA'&&!keys.a){
        keys.a=true
        bs[0].force[0]-=500
    }
    if(keyid==='KeyD'&&!keys.d){
        keys.d=true
        bs[0].force[0]+=500

    }
    if(keyid==='KeyW'&&!keys.w){
        keys.w=true
        bs[0].force[1]-=500

    }
    if(keyid==='KeyS'&&!keys.s){
        keys.s=true
        bs[0].force[1]+=500

    }
}
function keyup(e){
    let keyid=e.code
    if(keyid==='KeyA'&&keys.a){
        bs[0].force[0]+=500
        keys.a=false
    }
    if(keyid==='KeyD'&&keys.d){
        bs[0].force[0]-=500
        keys.d=false
    }
    if(keyid==='KeyW'&&keys.w){
        bs[0].force[1]+=500
        keys.w=false
    }
    if(keyid==='KeyS'&&keys.s){
        bs[0].force[1]-=500
        keys.s=false
    }
}
function draw(){
    ctx.fillStyle='black'
    ctx.fillRect(0,0,500,1000)
    
    for(let i of ws){
        i.draw_helper('orange')
    }
    for(let i of bs){
        i.draw_helper('white')
    }

    requestAnimationFrame(draw)
}
init()
setInterval(update,1000/fps)
draw()




