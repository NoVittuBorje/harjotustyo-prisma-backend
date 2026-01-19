const numbertoColor = (num) => {

    const sign = Math.sign(num)
    if(num == 0){return "inherit"}
    if(sign > 0){
        return ("#15ca0fff")
    }else{
        return("#dd1a0cff")
    }
}
export default numbertoColor
