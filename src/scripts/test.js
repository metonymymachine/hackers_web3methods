
//For Nodejs
const {statusChecker} = require('ethereum-status-checker');

statusChecker(["0xce6c5d87b63806c77dd20649e8916e559e5b5459d25f6d59ede55299ad62b2d2"],"rinkeby")
.then(result=>{
    console.log("output",result)
}).catch(err=>{
    console.log("err",err)
})