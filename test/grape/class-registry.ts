var classes:Function[] = [];


export function register(cl):void {
    cl.__id = classes.push(cl) - 1;
}

export function get(id:number):Function {
    return classes[id];
}

export function getId(cl):number {
    if(typeof cl.__id==='undefined'){
        console.log('Class not registered' , cl);
    }
    return cl.__id;
}
