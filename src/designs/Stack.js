
class Stack {
    constructor(list) {
        this.list = list;
    }

    push(data) {
        this.list.push(data);
    }

    pop() {
        return this.list.pop();
    }

    popAll() {
        const result = [];
        while(!this.isEmpty()) {
            result.push(this.pop());
        }
        
        return result;
    }

    getRemains() {D
        return this.list;
    }

    isEmpty() {
        return this.list.length === 0;
    }
}


module.exports = Stack;