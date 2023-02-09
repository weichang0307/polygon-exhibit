/*
require modules:
myVector
*/

 
/*
mass: kg
long: m
*/

let v2=new myVector()


class rect{
	constructor(x,y,width,height,mass=0,material='default',resistance_vec2=[0,0]){
		this.type='rect'
		this.position=[x,y]
		this.velocity=[0,0]
		this.force=[0,0]
		this.scale=[width,height]
		this.mass=mass
		this.resistance=resistance_vec2
		this.isgravity=true
		this.iscollition=true
		this.material=material
		this.collision=function(e){}
	}
	draw_helper(color,fill=true,through=1,ctx_=ctx){
		ctx_.globalAlpha=through
		ctx_.fillStyle=color
		ctx_.strokeStyle=color 
		if(fill){
			ctx_.fillRect(this.position[0]-this.scale[0]/2,this.position[1]-this.scale[1]/2,this.scale[0],this.scale[1])
		}else{
			ctx_.strokeRect(this.position[0]-this.scale[0]/2,this.position[1]-this.scale[1]/2,this.scale[0],this.scale[1])
		}
		ctx_.globalAlpha=1
	}
}


class ball{
	constructor(x,y,radius,mass=0,material='default',resistance_vec2=[0,0]){
		this.type='ball'
		this.position=[x,y]
		this.velocity=[0,0]
		this.force=[0,0]
		this.radius=radius
		this.mass=mass
		this.resistance=resistance_vec2
		this.isgravity=true
		this.iscollition=true
		this.material=material
		this.collision=function(e){}
	}
	draw_helper(color,fill=true,through=1,ctx_=ctx){
		ctx_.globalAlpha=through
		ctx_.fillStyle=color
		ctx_.strokeStyle=color
		ctx_.beginPath()
		ctx_.arc(this.position[0],this.position[1],this.radius,0,Math.PI*2)
		ctx_.closePath() 
		if(fill){
			ctx_.fill()	
		}else{
			ctx_.stroke()
		}
		ctx_.globalAlpha=1
	}


}


class polygon{
	constructor(x,y,points,mass=0,material='default',resistance_vec2=[0,0]){
		this.type='polygon'
		this.position=[x,y]
		this.velocity=[0,0]
		this.force=[0,0]
		this.points=points
		this.sides=[]
		for(let i=0;i<points.length;i++){
			let v=[]
			let k=(i+1)%(points.length)
			v[0]=points[k][0]-points[i][0]
			v[1]=points[k][1]-points[i][1]
			this.sides.push(v)
		}
		this.normals=this.sides.map((side)=>{
			let x=-side[1]
			let y=side[0]
			let abs=Math.sqrt(x**2+y**2)
			x/=abs
			y/=abs
			return [x,y]
		})
		
		this.mass=mass
		this.resistance=resistance_vec2
		this.isgravity=true
		this.iscollition=true
		this.material=material
		this.collision=function(e){}
	}
	draw_helper(color,fill=true,through=1,ctx_=ctx){
		ctx_.globalAlpha=through
		ctx_.fillStyle=color
		ctx_.strokeStyle=color 

		ctx_.beginPath()
		ctx_.moveTo(this.points[0][0]+this.position[0],this.points[0][1]+this.position[1])
		for(let i=1;i<this.points.length;i++){
			ctx_.lineTo(this.points[i][0]+this.position[0],this.points[i][1]+this.position[1])
		}
		ctx_.closePath()


		if(fill){
			ctx_.fill()
		}else{
			ctx_.stroke()
		}
		ctx_.globalAlpha=1
	}
}

class world{
	constructor(gravityx,gravityy,iteration=50){
		this.gravity=[gravityx,gravityy]
		this.objs=[]
		this.springs=[]
		this.iteration=iteration
		this.accurate=0.99999
		this.coefficients=[]
	}
	add(obj){
		this.objs.push(obj)
	}
	delete(obj){
		for(let i in this.objs){
			if(obj===this.objs[i]){
				this.objs.splice(i,1)
			}
		}
	}
	addSpring(a,b,origin_dis,count,ax=0,ay=0,bx=0,by=0){
		this.constraint.push({a:a,b:b,origin_dis:origin_dis,count:count,ap:[ax,ay],bp:[bx,by]})
	}
	removeSpring(a,b,origin_dis,count){
		let ex={a:a,b:b,origin_dis:origin_dis,count:count,ap:[ax,ay],bp:[bx,by]}
		for(let i in this.constraint){
			if(ex===this.constraint[i]){
				this.constraint.splice(i,1)
			}
		}
	}
	getCoefficient(material1,material2){
		for(let i of this.coefficients){
			if((i.object[0]===material1&&i.object[1]===material2)||(i.object[0]===material2&&i.object[1]===material1)){
				return i
			}
		}
		return {object:'default',friction:0,restitution:1}
	}
	setCoefficient(material1,material2,friction=0,restitution=1){
		let coe=this.getCoefficient(material1,material2)
		if(coe.object==='default'){
			this.coefficients.push({
				object:[material1,material2],
				friction:friction,
				restitution:restitution
			})
		}else{
			coe.friction=friction
			coe.restitution=restitution
		}
		

	}
	update(time){
		let time_=time/this.iteration
		for(let k=0;k<this.iteration;k++){
			//彈簧
			for(let i of this.springs){
				let dis=v2.minus(v2.add(i.a.position,i.ap),v2.add(i.b.position,i.bp))   
				let ff=(v2.abs(dis)-i.origin_dis)*i.count
				i.a.velocity=v2.add(i.a.velocity,v2.set(ff/i.a.mass,v2.deg(dis)+Math.PI))
				i.b.velocity=v2.add(i.b.velocity,v2.set(ff/i.b.mass,v2.deg(dis)))
			}
			//重力及阻力
			for(let i of this.objs){
				i.velocity[0]*=(1-i.resistance[0])**(time_)
				i.velocity[1]*=(1-i.resistance[1])**(time_)
				i.velocity[0]+=i.force[0]/i.mass*time_
				i.velocity[1]+=i.force[1]/i.mass*time_


				if(i.isgravity){
					i.velocity[0]+=this.gravity[0]*time_
					i.velocity[1]+=this.gravity[1]*time_
				}
			}
			//碰撞
			
			for(let i=0;i<this.objs.length-1;i++){
				for(let y=i+1;y<this.objs.length;y++){
					if(this.objs[i].iscollition||this.objs[y].iscollition){
						this.collision(this.objs[i],this.objs[y])
						
					}
				}
			}
			

			//改變位置
			for(let i of this.objs){
				i.position[0]+=i.velocity[0]*time_
				i.position[1]+=i.velocity[1]*time_
			}

		}
	}
	collision(a,b){
		//若兩物皆為無限重則不碰撞
		if(a.mass===Infinity&&b.mass===Infinity){
			return
		}

		//分辨碰撞種類

		let at=a.type
		let bt=b.type
		
		if(at==='rect'&&bt==='rect'){
			collision_rect_rect.call(this,a,b)
		}
		else if(at==='ball'&&bt==='ball'){
			collision_ball_ball.call(this,a,b)
		}
		else if(at==='ball'&&bt==='rect'){
			collision_ball_rect.call(this,a,b)
		}
		else if(at==='rect'&&bt==='ball'){
			collision_ball_rect.call(this,b,a)
		}

		if(at==='polygon'&&bt==='polygon'){
			collision_polygon_polygon.call(this,a,b)
			
		}
		if(at==='ball'&&bt==='polygon'){
			collision_ball_polygon.call(this,a,b)
			
		}
		if(at==='polygon'&&bt==='ball'){
			collision_ball_polygon.call(this,b,a)
			
		}
					

		
	}
}
function my_calculate(a,b){
	//return a/a+b
	if(a!==Infinity&&b!==Infinity){
		return a/(a+b)
	}else if(a===Infinity&&b!==Infinity){
		return 1
	}else if(a!==Infinity&&b===Infinity){
		return 0
	}else if(a===Infinity&&b===Infinity){
		return 1/2
	}
}
function getVCm(A,B){
	if(A.mass===Infinity){
		vCm=A.velocity.slice()
	}else if(B.mass===Infinity){
		vCm=B.velocity.slice()
	}else{
		vCm=[]
		vCm[0]=(A.velocity[0]*A.mass+B.velocity[0]*B.mass)/(A.mass+B.mass)
		vCm[1]=(A.velocity[1]*A.mass+B.velocity[1]*B.mass)/(A.mass+B.mass)
	}
	return vCm
	

}


function collision_polygon_polygon(a,b){
	let mtv
	let min_overlap=Infinity
	let sign=1
	let normals=a.normals.concat(b.normals)
	for(let i of normals){

		let amax=-Infinity
		let amin=Infinity
		let bmax=-Infinity
		let bmin=Infinity
		for(let y of a.points){
			let dot=i[0]*(y[0]+a.position[0])+i[1]*(y[1]+a.position[1])
			if(dot>amax){
				amax=dot
			}
			if(dot<amin){
				amin=dot
			}
		}
		for(let y of b.points){
			let dot=i[0]*(y[0]+b.position[0])+i[1]*(y[1]+b.position[1])
			if(dot>bmax){
				bmax=dot
			}
			if(dot<bmin){
				bmin=dot
			}
		}
		
		if(amin>bmax||amax<bmin){
			return
		}else{
			let overlap=Math.min(Math.abs(amax-bmin),Math.abs(amin-bmax))
			
			if(overlap<min_overlap){
				min_overlap=overlap
				mtv=i
				if(overlap===Math.abs(amax-bmin)){
					sign=Math.sign(amax-bmin)
				}else{
					sign=Math.sign(amin-bmax)
				}
			}
		}
	}
	
	
	if(a.mass===Infinity){
		b.position[0]+=sign*min_overlap*mtv[0]*this.accurate
		b.position[1]+=sign*min_overlap*mtv[1]*this.accurate
	}else if(b.mass===Infinity){
		a.position[0]-=sign*min_overlap*mtv[0]*this.accurate
		a.position[1]-=sign*min_overlap*mtv[1]*this.accurate
	}else{
		b.position[0]+=sign*min_overlap*mtv[0]*a.mass/(a.mass+b.mass)*this.accurate
		b.position[1]+=sign*min_overlap*mtv[1]*a.mass/(a.mass+b.mass)*this.accurate
		a.position[0]-=sign*min_overlap*mtv[0]*b.mass/(a.mass+b.mass)*this.accurate
		a.position[1]-=sign*min_overlap*mtv[1]*b.mass/(a.mass+b.mass)*this.accurate
	}


	let vAB=[a.velocity[0]-b.velocity[0],a.velocity[1]-b.velocity[1]]
	//若內積<0 => 夾角>90。 => 逐漸靠近
	if(mtv[0]*-sign*vAB[0]+mtv[1]*-sign*vAB[1]<0){


		let vCm=getVCm(a,b)
		let vCmA=v2.minus(a.velocity,vCm)					
		let vCmB=v2.minus(b.velocity,vCm)	
		let vCmA_divide=v2.divide2(vCmA,v2.deg(mtv))
		let vCmB_divide=v2.divide2(vCmB,v2.deg(mtv))
		//由材料名取得對應係數
		let coefficient=this.getCoefficient(a.material,b.material)
		//摩擦力
		let ff=[0,0]
		
		if(a.mass!==Infinity){
			let fl=v2.abs(vCmA_divide.normal)*(1+coefficient.restitution)*a.mass*coefficient.friction
			if(fl>v2.abs(vCmA_divide.tangent)*a.mass){
				fl=v2.abs(vCmA_divide.tangent)*a.mass
			}
			ff=v2.set(fl,v2.deg(vCmA_divide.tangent)+Math.PI)
		}else if(b.mass!==Infinity){
			let fl=v2.abs(vCmB_divide.normal)*(1+coefficient.restitution)*b.mass*coefficient.friction
			if(fl>v2.abs(vCmB_divide.tangent)*b.mass){
				fl=v2.abs(vCmB_divide.tangent)*b.mass
			}
			ff=v2.set(fl,v2.deg(vCmB_divide.tangent))
		}


		a.velocity=v2.minus(v2.add(vCm,v2.add(vCmA_divide.tangent,v2.scale(ff,1/a.mass))),v2.scale(vCmA_divide.normal,coefficient.restitution))
		b.velocity=v2.minus(v2.add(vCm,v2.minus(vCmB_divide.tangent,v2.scale(ff,1/b.mass))),v2.scale(vCmB_divide.normal,coefficient.restitution))



		
		
	}


}

function collision_ball_polygon(a,b){
	let mtv
	let min_overlap=Infinity
	let sign=1
	let dis_min=Infinity
	let dis_min_v
	for(let i of b.points){
		let disx=i[0]+b.position[0]-a.position[0]
		let disy=i[1]+b.position[1]-a.position[1]
		let dis=Math.sqrt(disx**2+disy**2)
		if(dis<dis_min){
			dis_min=dis
			dis_min_v=[disx,disy]
		}
	}
	let normals=b.normals.concat([[dis_min_v[0]/dis_min,dis_min_v[1]/dis_min]])


	for(let i of normals){

		let amax=i[0]*a.position[0]+i[1]*a.position[1]+a.radius
		let amin=amax-2*a.radius
		let bmax=-Infinity
		let bmin=Infinity

		for(let y of b.points){
			let dot=i[0]*(y[0]+b.position[0])+i[1]*(y[1]+b.position[1])
			if(dot>bmax){
				bmax=dot
			}
			if(dot<bmin){
				bmin=dot
			}
		}
		
		if(amin>bmax||amax<bmin){
			return
		}else{
			let overlap=Math.min(Math.abs(amax-bmin),Math.abs(amin-bmax))
			
			if(overlap<min_overlap){
				min_overlap=overlap
				mtv=i
				if(overlap===Math.abs(amax-bmin)){
					sign=Math.sign(amax-bmin)
				}else{
					sign=Math.sign(amin-bmax)
				}
			}
		}
	}
	
	
	if(a.mass===Infinity){
		b.position[0]+=sign*min_overlap*mtv[0]*this.accurate
		b.position[1]+=sign*min_overlap*mtv[1]*this.accurate
	}else if(b.mass===Infinity){
		a.position[0]-=sign*min_overlap*mtv[0]*this.accurate
		a.position[1]-=sign*min_overlap*mtv[1]*this.accurate
	}else{
		b.position[0]+=sign*min_overlap*mtv[0]*a.mass/(a.mass+b.mass)*this.accurate
		b.position[1]+=sign*min_overlap*mtv[1]*a.mass/(a.mass+b.mass)*this.accurate
		a.position[0]-=sign*min_overlap*mtv[0]*b.mass/(a.mass+b.mass)*this.accurate
		a.position[1]-=sign*min_overlap*mtv[1]*b.mass/(a.mass+b.mass)*this.accurate
	}


	let vAB=[a.velocity[0]-b.velocity[0],a.velocity[1]-b.velocity[1]]
	//若內積<0 => 夾角>90。 => 逐漸靠近
	if(mtv[0]*-sign*vAB[0]+mtv[1]*-sign*vAB[1]<0){


		let vCm=getVCm(a,b)
		let vCmA=v2.minus(a.velocity,vCm)					
		let vCmB=v2.minus(b.velocity,vCm)	
		let vCmA_divide=v2.divide2(vCmA,v2.deg(mtv))
		let vCmB_divide=v2.divide2(vCmB,v2.deg(mtv))
		//由材料名取得對應係數
		let coefficient=this.getCoefficient(a.material,b.material)
		//摩擦力
		let ff=[0,0]
		
		if(a.mass!==Infinity){
			let fl=v2.abs(vCmA_divide.normal)*(1+coefficient.restitution)*a.mass*coefficient.friction
			if(fl>v2.abs(vCmA_divide.tangent)*a.mass){
				fl=v2.abs(vCmA_divide.tangent)*a.mass
			}
			ff=v2.set(fl,v2.deg(vCmA_divide.tangent)+Math.PI)
		}else if(b.mass!==Infinity){
			let fl=v2.abs(vCmB_divide.normal)*(1+coefficient.restitution)*b.mass*coefficient.friction
			if(fl>v2.abs(vCmB_divide.tangent)*b.mass){
				fl=v2.abs(vCmB_divide.tangent)*b.mass
			}
			ff=v2.set(fl,v2.deg(vCmB_divide.tangent))
		}


		a.velocity=v2.minus(v2.add(vCm,v2.add(vCmA_divide.tangent,v2.scale(ff,1/a.mass))),v2.scale(vCmA_divide.normal,coefficient.restitution))
		b.velocity=v2.minus(v2.add(vCm,v2.minus(vCmB_divide.tangent,v2.scale(ff,1/b.mass))),v2.scale(vCmB_divide.normal,coefficient.restitution))



		
		
	}


}














//碰撞 矩形-矩形
function collision_rect_rect(A,B){
	

	//A對於B的相對位置
	let pAB=v2.minus(A.position,B.position)
	//若是A與B有重疊
	if(Math.abs(pAB[0])*2<A.scale[0]+B.scale[0]&&Math.abs(pAB[1])*2<A.scale[1]+B.scale[1]){
		//A與B重疊區域的高與寬
		let border_dis_x=(A.scale[0]+B.scale[0])/2-Math.abs(pAB[0])
		let border_dis_y=(A.scale[1]+B.scale[1])/2-Math.abs(pAB[1])
		
		




		let vCm=getVCm(A,B)

		let vCmA=v2.minus(A.velocity,vCm)
		let vCmB=v2.minus(B.velocity,vCm)
		let vAB=v2.minus(A.velocity,B.velocity)
		//由材料名取得對應係數
		let coefficient=this.getCoefficient(A.material,B.material)

		//若重疊區域高大於寬則判定為左右碰撞
			if(border_dis_x<border_dis_y){
			
			if(A.mass===Infinity&&B.mass===Infinity){

			}else if(A.mass===Infinity){
				B.position[0]-=border_dis_x*Math.sign(pAB[0])
			}else if(B.mass===Infinity){
				A.position[0]+=border_dis_x*Math.sign(pAB[0])
			}else{
				A.position[0]+=border_dis_x*Math.sign(pAB[0])*B.mass/(A.mass+B.mass)
				B.position[0]-=border_dis_x*Math.sign(pAB[0])*A.mass/(A.mass+B.mass)
			}
			


			//若相對位置與相對速度為反向 => 逐漸靠近
			if(Math.sign(pAB[0])===-Math.sign(vAB[0])){
				//一維完全彈性碰撞




				//碰撞
				A.velocity[0]=vCm[0]-vCmA[0]*coefficient.restitution
				B.velocity[0]=vCm[0]-vCmB[0]*coefficient.restitution
				//摩擦力
				
				let ff=0
				if(A.mass!==Infinity){
					ff=-Math.abs(vCmA[0])*(1+coefficient.restitution)*A.mass*coefficient.friction*Math.sign(vCmA[1])
					if(Math.abs(ff)>Math.abs(vCmA[1]*A.mass)){
						ff=-vCmA[1]*A.mass
					}
				}else if(B.mass!==Infinity){
					ff=Math.abs(vCmB[0])*(1+coefficient.restitution)*B.mass*coefficient.friction*Math.sign(vCmB[1])
					if(Math.abs(ff)>Math.abs(vCmB[1]*B.mass)){
						ff=vCmB[1]*B.mass
					}
				}

				A.velocity[1]+=ff/A.mass
				B.velocity[1]-=ff/B.mass
				//callback
				if(Math.sign(pAB[0])<0){
					A.collision({side:"right",obj:B})
					B.collision({side:"left",obj:A})
				}else{
					A.collision({side:"left",obj:B})
					B.collision({side:"right",obj:A})
				}
			}
		//否則判定為上下碰撞
		}else{


			if(A.mass===Infinity&&B.mass===Infinity){

			}else if(A.mass===Infinity){
				B.position[1]-=border_dis_y*Math.sign(pAB[1])
			}else if(B.mass===Infinity){
				A.position[1]+=border_dis_y*Math.sign(pAB[1])
			}else{
				A.position[1]+=border_dis_y*Math.sign(pAB[1])*B.mass/(A.mass+B.mass)
				B.position[1]-=border_dis_y*Math.sign(pAB[1])*A.mass/(A.mass+B.mass)
			}
			//若相對位置與相對速度為反向 => 逐漸靠近
			if(Math.sign(pAB[1])===-Math.sign(vAB[1])){
				//碰撞
				A.velocity[1]=vCm[1]-vCmA[1]*coefficient.restitution
				B.velocity[1]=vCm[1]-vCmB[1]*coefficient.restitution
				//摩擦力
				
				let ff=0
				if(A.mass!==Infinity){
					ff=-Math.abs(vCmA[1])*(1+coefficient.restitution)*A.mass*coefficient.friction*Math.sign(vCmA[0])
					if(Math.abs(ff)>Math.abs(vCmA[0]*A.mass)){
						ff=-vCmA[0]*A.mass
					}
				}else if(B.mass!==Infinity){
					ff=Math.abs(vCmB[1])*(1+coefficient.restitution)*B.mass*coefficient.friction*Math.sign(vCmB[0])
					if(Math.abs(ff)>Math.abs(vCmB[0]*B.mass)){
						ff=vCmB[0]*B.mass
					}
				}

				A.velocity[0]+=ff/A.mass
				B.velocity[0]-=ff/B.mass
				//callback	
				if(Math.sign(pAB[1])<0){
					A.collision({side:"top",obj:B})
					B.collision({side:"bottom",obj:A})
				}else{
					A.collision({side:"bottom",obj:B})
					B.collision({side:"top",obj:A})
				}
			}
		}
	}
}
//碰撞 球-球
function collision_ball_ball(A,B){
	//A對於B的相對位置
	let pAB=[A.position[0]-B.position[0],A.position[1]-B.position[1]]
	let dis=Math.sqrt(pAB[0]**2+pAB[1]**2)
	let boarder_dis=A.radius+B.radius-dis
	//若是A與B有重疊(距離<A半徑+B半徑)
	if(boarder_dis>0){

		let fix=[pAB[0]*boarder_dis/dis,pAB[1]*boarder_dis/dis]
		if(A.mass===Infinity){
			B.position[0]-=fix[0]
			B.position[1]-=fix[1]
		}else if(B.mass===Infinity){
			A.position[0]+=fix[0]
			A.position[1]+=fix[1]
		}else{
			B.position[0]-=fix[0]*A.mass/(A.mass+B.mass)
			B.position[1]-=fix[1]*A.mass/(A.mass+B.mass)
			A.position[0]+=fix[0]*B.mass/(A.mass+B.mass)
			A.position[1]+=fix[1]*B.mass/(A.mass+B.mass)
		}

		let pdeg=Math.atan2(pAB[1],pAB[0])
		let vAB=[A.velocity[0]-B.velocity[0],A.velocity[1]-B.velocity[1]]
		//若內積<0 => 夾角>90。 => 逐漸靠近
		if(pAB[0]*vAB[0]+pAB[1]*vAB[1]<0){


			let vCm=getVCm(A,B)
			let vCmA=v2.minus(A.velocity,vCm)					
			let vCmB=v2.minus(B.velocity,vCm)	
			let vCmA_divide=v2.divide2(vCmA,v2.deg(pAB))
			let vCmB_divide=v2.divide2(vCmB,v2.deg(pAB))
			//由材料名取得對應係數
			let coefficient=this.getCoefficient(A.material,B.material)
			//摩擦力
			let ff=[0,0]
			
			if(A.mass!==Infinity){
				let fl=v2.abs(vCmA_divide.normal)*(1+coefficient.restitution)*A.mass*coefficient.friction
				if(fl>v2.abs(vCmA_divide.tangent)*A.mass){
					fl=v2.abs(vCmA_divide.tangent)
				}
				ff=v2.set(fl,v2.deg(vCmA_divide.tangent)+Math.PI)
			}else if(B.mass!==Infinity){
				let fl=v2.abs(vCmB_divide.normal)*(1+coefficient.restitution)*B.mass*coefficient.friction
				if(fl>v2.abs(vCmB_divide.tangent)*B.mass){
					fl=v2.abs(vCmB_divide.tangent)
				}
				ff=v2.set(fl,v2.deg(vCmB_divide.tangent))
			}


			A.velocity=v2.minus(v2.add(vCm,v2.add(vCmA_divide.tangent,v2.scale(ff,1/A.mass))),v2.scale(vCmA_divide.normal,coefficient.restitution))
			B.velocity=v2.minus(v2.add(vCm,v2.minus(vCmB_divide.tangent,v2.scale(ff,1/B.mass))),v2.scale(vCmB_divide.normal,coefficient.restitution))



			//call back
			A.collision({deg:pdeg,obj:B})
			B.collision({deg:pdeg+Math.PI,obj:A})
			
			
		}
			

		
		
	}
}
//碰撞 球-矩形
function collision_ball_rect(A,B){
	//A對於B的相對位置
	let pAB=[A.position[0]-B.position[0],A.position[1]-B.position[1]]
	let bcd=[B.scale[0]-Math.abs(pAB[0]),B.scale[1]-Math.abs(pAB[1])]
	



	
	

				
	if(Math.abs(pAB[1])<B.scale[1]/2+A.radius&&Math.abs(pAB[0])<B.scale[0]/2&&bcd[1]<bcd[0]){
		
		//A對於B的相對速度
		let vAB=v2.minus(A.velocity,B.velocity)
		let vCm=getVCm(A,B)
		let vCmA=v2.minus(A.velocity,vCm)
		let vCmB=v2.minus(B.velocity,vCm)
		//由材料名取得對應係數
		let coefficient=this.getCoefficient(A.material,B.material)

		let bd=A.radius+B.scale[1]/2-Math.abs(pAB[1])
		if(A.mass===Infinity&&B.mass===Infinity){

		}else if(A.mass===Infinity){
			B.position[1]-=bd*Math.sign(pAB[1])
		}else if(B.mass===Infinity){
			A.position[1]+=bd*Math.sign(pAB[1])
		}else{
			A.position[1]+=bd*Math.sign(pAB[1])*B.mass/(A.mass+B.mass)
			B.position[1]-=bd*Math.sign(pAB[1])*A.mass/(A.mass+B.mass)
		}


		//若相對位置與相對速度為反向 => 逐漸靠近
		if(Math.sign(pAB[1])===-Math.sign(vAB[1])){
			//碰撞
			A.velocity[1]=vCm[1]-vCmA[1]*coefficient.restitution
			B.velocity[1]=vCm[1]-vCmB[1]*coefficient.restitution
			//摩擦力
			
			let ff=0
			if(A.mass!==Infinity){
				ff=-Math.abs(vCmA[1])*(1+coefficient.restitution)*A.mass*coefficient.friction*Math.sign(vCmA[0])
				if(Math.abs(ff)>Math.abs(vCmA[0]*A.mass)){
					ff=-vCmA[0]*A.mass
				}
			}else if(B.mass!==Infinity){
				ff=Math.abs(vCmB[1])*(1+coefficient.restitution)*B.mass*coefficient.friction*Math.sign(vCmB[0])
				if(Math.abs(ff)>Math.abs(vCmB[0]*B.mass)){
					ff=vCmB[0]*B.mass
				}
			}

			A.velocity[0]+=ff/A.mass
			B.velocity[0]-=ff/B.mass
			//call back
			if(pAB[1]>0){
				A.collision({side:"bottom",obj:B})
				B.collision({side:"top",obj:A})
			}else{
				A.collision({side:"top",obj:B})
				B.collision({side:"bottom",obj:A})
			}
		}
	//若是Y距離<B的高/2 且 X距離<B的寬/2+A的半徑 則判定為A與B的側邊接觸
	}else if(Math.abs(pAB[0])<B.scale[0]/2+A.radius&&Math.abs(pAB[1])<B.scale[1]/2){

		//A對於B的相對速度
		let vAB=v2.minus(A.velocity,B.velocity)
		let vCm=getVCm(A,B)
		let vCmA=v2.minus(A.velocity,vCm)
		let vCmB=v2.minus(B.velocity,vCm)
		//由材料名取得對應係數
		let coefficient=this.getCoefficient(A.material,B.material)

		let bd=A.radius+B.scale[0]/2-Math.abs(pAB[0])
		if(A.mass===Infinity&&B.mass===Infinity){

		}else if(A.mass===Infinity){
			B.position[0]-=bd*Math.sign(pAB[0])
		}else if(B.mass===Infinity){
			A.position[0]+=bd*Math.sign(pAB[0])
		}else{
			A.position[0]+=bd*Math.sign(pAB[0])*B.mass/(A.mass+B.mass)
			B.position[0]-=bd*Math.sign(pAB[0])*A.mass/(A.mass+B.mass)
		}




		if(Math.sign(pAB[0])===-Math.sign(vAB[0])){
			//碰撞
			A.velocity[0]=vCm[0]-vCmA[0]*coefficient.restitution
			B.velocity[0]=vCm[0]-vCmB[0]*coefficient.restitution
			//摩擦力
			
			let ff=0
			if(A.mass!==Infinity){
				ff=-Math.abs(vCmA[0])*(1+coefficient.restitution)*A.mass*coefficient.friction*Math.sign(vCmA[1])
				if(Math.abs(ff)>Math.abs(vCmA[1]*A.mass)){
					ff=-vCmA[1]*A.mass
				}
			}else if(B.mass!==Infinity){
				ff=Math.abs(vCmB[0])*(1+coefficient.restitution)*B.mass*coefficient.friction*Math.sign(vCmB[1])
				if(Math.abs(ff)>Math.abs(vCmB[1]*B.mass)){
					ff=vCmB[1]*B.mass
				}
			}

			A.velocity[1]+=ff/A.mass
			B.velocity[1]-=ff/B.mass
			//call back
			if(pAB[0]>0){
				A.collision({side:"left",obj:B})
				B.collision({side:"right",obj:A})
			}else{
				A.collision({side:"right",obj:B})
				B.collision({side:"left",obj:A})
			}
		}
	//否則可能為A與B的角接觸
	}else{

		//A對於B的相對速度
		let vAB=v2.minus(A.velocity,B.velocity)
		let vCm=getVCm(A,B)
		let vCmA=v2.minus(A.velocity,vCm)
		let vCmB=v2.minus(B.velocity,vCm)
		//由材料名取得對應係數
		let coefficient=this.getCoefficient(A.material,B.material)

		//A對於B對應角的相對位置
		let pABcorner=[]
		pABcorner[0]=pAB[0]-B.scale[0]/2*Math.sign(pAB[0])
		pABcorner[1]=pAB[1]-B.scale[1]/2*Math.sign(pAB[1])
		//若A與B對應角的距離<A的半徑 則判定為A與B的角接觸
		if(v2.abs(pABcorner)<A.radius){
			//若內積<0 => 夾角>90。 => 逐漸靠近
			if(v2.dot(pABcorner,vAB)<0){
				//A對於B對應角的法線相對速度
				let vABcorner_normal=v2.divide2(vAB,v2.deg(pABcorner)).normal
				let vCmA_divide=v2.divide2(vCmA,v2.deg(pABcorner))
				let vCmB_divide=v2.divide2(vCmB,v2.deg(pABcorner))
				//摩擦力
				let ff=[0,0]
				
				if(A.mass!==Infinity){
					let fl=v2.abs(vCmA_divide.normal)*(1+coefficient.restitution)*A.mass*coefficient.friction
					if(fl>v2.abs(vCmA_divide.tangent)*A.mass){
						fl=v2.abs(vCmA_divide.tangent)
					}
					ff=v2.set(fl,v2.deg(vCmA_divide.tangent)+Math.PI)
				}else if(B.mass!==Infinity){
					let fl=v2.abs(vCmB_divide.normal)*(1+coefficient.restitution)*B.mass*coefficient.friction
					if(fl>v2.abs(vCmB_divide.tangent)*B.mass){
						fl=v2.abs(vCmB_divide.tangent)
					}
					ff=v2.set(fl,v2.deg(vCmB_divide.tangent))
				}


				A.velocity=v2.minus(v2.add(vCm,v2.add(vCmA_divide.tangent,v2.scale(ff,1/A.mass))),v2.scale(vCmA_divide.normal,coefficient.restitution))
				B.velocity=v2.minus(v2.add(vCm,v2.minus(vCmB_divide.tangent,v2.scale(ff,1/B.mass))),v2.scale(vCmB_divide.normal,coefficient.restitution))


				//call back
				A.collision({deg:v2.deg(vABcorner_normal),obj:A})
				let str=''
				if(pAB[1]>0){
					str+='top'
				}else{
					str+='bottom'
				}
				if(pAB[0]>0){
					str+='right'
				}else{
					str+='left'
				}
				B.collision({side:str,obj:B})
				
				
			}
			
			
		}
	}
	
}/*
export default {
	ball,
	rect,
	world
}*/