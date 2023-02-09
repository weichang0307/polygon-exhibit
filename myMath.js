class myMath{

    constructor(){
        
    }
    onePowerSimultaneousEquations(matrix_origin){
        let matrix
        if(matrix_origin.length<matrix_origin[0].length){
            matrix=this.rotateMatrix(matrix_origin)
        }else{
            matrix=this.shallowCopy(matrix_origin)
        }
        let final={
            delta:0, 
            status:'',
            deltas:[],
            ansers:[]
        }
        let coefficients=this.shallowCopy(matrix)
        coefficients.splice(coefficients.length-1,1)
        final.delta=this.determinant(coefficients)
        for(let i=0;i<matrix.length-1;i++){
            let matrix_=this.shallowCopy(coefficients)
            matrix_[i]=this.shallowCopy(matrix[matrix.length-1])
            final.deltas.push(this.determinant(matrix_))
        }
        if(final.delta===0){
            if(final.deltas[0]!==0){
                final.status='no solution'
            }else{
                final.status='infinity solution'
            }

        }else{
            for(let i=0;i<final.deltas.length;i++){
                final.ansers.push(final.deltas[i]/final.delta)
            }
            final.status='one solution'
        }
        return final

        
        
        
        
    }
    determinant(matrix){
        let nn=matrix.length
        if(nn===1){
            return matrix[0][0]
        }

        let ans=0

        for(let i=0;i<nn;i++){
            let isminus=-((i%2)*2-1)//+-1
            let matrix_=this.shallowCopy(matrix)
            matrix_.splice(i,1)
            for(let i of matrix_){
                i.splice(0,1)
            }
            ans+=isminus*matrix[i][0]*this.determinant(matrix_)
        }
        
        return ans
    }
    rotateMatrix(matrix){
        let matrix_=this.createMatrix(matrix[0].length,matrix.length)
        for(let i=0;i<matrix.length;i++){
            for(let y=0;y<matrix[i].length;y++){
                matrix_[y][i]=matrix[i][y]
            }
        }
        return matrix_

    }
    createMatrix(colunm,row,init=0){
        let arr=[]
        for(let i=0;i<colunm;i++){
            let one_colunm=[]
            for(let i=0;i<row;i++){
                one_colunm.push(init)
            }
            arr.push(one_colunm)
        }

        return arr
    }
    multiplyMatrix(m1,m2){
        let nm=this.createMatrix(m1.length,m2[0].length)
        for(let i=0;i<nm.length;i++){
            for(let y=0;y<nm[0].length;y++){
                let colunm=m1[i]
                let row=[]
                for(let k of m2){
                    row.push(k[y])
                }
                let ad=0
                for(let j=0;j<row.length;j++){
                    ad+=colunm[j]*row[j]
                }
                
                nm[i][y]=ad
                
            }
        }
        return nm
    }
    tryAllCombinations(arr,base,num,func){
        if(base.length+1===num){
            for(let i=0;i<arr.length;i++){
                func(base.concat([arr[i]]))
            }
        }

        for(let i=0;i<arr.length-1;i++){
            let nb=base.concat([arr[i]])
            let narr=arr.slice(i+1,arr.length)
            this.tryAllCombinations(narr,nb,num,func)
        }
        

    }
    shallowCopy(obj){
        return JSON.parse(JSON.stringify(obj))
    }
}





