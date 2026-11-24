self.onmessage=({data:{kind,code,mode,input}})=>{try{
 const parameters=({dom:['name'],binding:['stock'],computed:['product','query'],emits:['total','quantity']})[kind]
 if(!parameters)throw Error('Unknown exercise')
 const fn=new Function(...parameters,code)
 if(mode==='preview'){const result=kind==='computed'?input.products.filter(p=>fn(p,input.query)).map(p=>p.name).join(', ')||'пусто':fn(...input.args);self.postMessage({ok:true,result:String(result).slice(0,2000)});return}
 const cases=({dom:[[['Суп'],'Блюдо: Суп'],[['Чай'],'Блюдо: Чай']],binding:[[[0],true],[[2],false]],computed:[[[{name:'Суп',active:true},'СУП'],true],[[{name:'Суп',active:true},'чай'],false],[[{name:'Суп',active:false},'суп'],false],[[{name:'Чай',active:true},'  чай '],true]],emits:[[[0,1],1],[[2,3],5],[[5,1],6]]})[kind]
 self.postMessage({ok:true,passed:cases.every(([args,want])=>fn(...args)===want)})
 }catch{self.postMessage({ok:false,error:'Код пока не выполнился. Проверьте синтаксис и имена параметров.'})}}

self.postMessage({ready:true})
