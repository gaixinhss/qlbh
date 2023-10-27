function generateCode(code:string):string{

    const option:string =code.slice(0,2)
    const num:number= parseInt(code.slice(2));
    return option+(num+1);
}
export {generateCode}