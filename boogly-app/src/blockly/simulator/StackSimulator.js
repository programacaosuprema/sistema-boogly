export class StackSimulator {

  constructor() {
    this.stack = [];
    this.steps = [];
  }

  push(value) {
    this.stack.push(value);
    this.saveStep();
  }

  pop() {
    this.stack.pop();
    this.saveStep();
  }

  saveStep() {
    this.steps.push([...this.stack]);
  }

}