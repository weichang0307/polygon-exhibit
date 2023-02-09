class myMatrix{
    constructor(){

    }
    rotate(matrix){
        let matrix_=this.createMatrix(matrix[0].length,matrix.length)
        for(let i=0;i<matrix.length;i++){
            for(let y=0;y<matrix[i].length;y++){
                matrix_[y][i]=matrix[i][y]
            }
        }
        return matrix_

    }
    create(colunm,row,init=0){
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
    multiply(m1,m2){
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
    toVector(m1){
        let vv=[]
        for(let i in m1){
            for(let y in i){
                vv.push[y]
            }
        }
        return vv
    }
}