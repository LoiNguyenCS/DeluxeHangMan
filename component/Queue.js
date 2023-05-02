class Queue {
    constructor() {
      this.items = [];
    }
  
    enqueue(item) {
      this.items.push(item);
    }
  
    dequeue() {
      return this.items.shift();
    }
  
    peek() {
      return this.items[0];
    }
  
    size() {
      return this.items.length;
    }
  
    isEmpty() {
      return this.items.length === 0;
    }
    forceOut(name) {
        for(let i = 0;i< this.items.length;i++){
            
            if(this.items[i] == name){
                this.items.splice(i);
                
            }
        }
        
      }
      CountOccurrence(name){
        let num = 0;
        for(let i = 0;i< this.items.length;i++){
            let filtereditem = this.items[i].replace(/\(.*?\)/g,"")
            if(filtereditem== name){
                num+=1;
                
            }
        }
        return num;
      }
  }
  module.exports = Queue;