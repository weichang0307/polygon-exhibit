function cast3Dto2D(vec3,camera3D,scale=5000){
	let vv=v.minus(vec3,camera3D.position)
    let v0=v.minus(vec3,camera3D.position)
	vv=v.rotateOnAxis([0,1,0],vv,-camera3D.alpha)
	vv=v.rotateOnAxis([1,0,0],vv,-camera3D.beta)
    if(v.equal(vv,v0)){
        //console.log(1)
    }
    if(vv[2]<camera3D.mini||vv[2]>camera3D.max){
        return false
        
    }
	let dis=v.abs(vv)/scale
	return [vv[0]/dis,vv[1]/dis]
}
function get3Ddistance(vec3_1,vec3_2){
    let vv=v.minus(vec3_1,vec3_2)
    return v.abs(vv)
}
class Camera3D{
	constructor(position,rotation,max=Infinity,mini=0){
		this.position=position
		this.alpha=0
		this.beta=0
		this.max=max
		this.mini=mini

	}
    focusOn(obj){
        let nv=v.minus(obj,this.position)
        nv.splice(1,1)
        let degy=-v.deg(nv)+Math.PI/2
        this.alpha=degy
        nv.splice(1,0,0)
        let nnv=v.minus(obj,this.position)
        let cosd=v.dot(nv,nnv)/v.abs(nv)/v.abs(nnv)
        if(cosd>1){
            cosd=1
        }else if(cosd<0){
            cosd=0
        }
        let degx=Math.acos(cosd)*-Math.sign(nnv[1])
        this.beta=degx
    }
}