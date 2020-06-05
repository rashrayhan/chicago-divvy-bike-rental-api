
//reset group model values to 0
module.exports.reset = (group) =>{
    for (let key in group) {
        group[key] = 0;
    }
    return group;
}