export class StackSimulator {

  constructor() {
    this.stack = [];
    this.steps = [];
  }

  push(value) {
    this.stack.push(value);

    this.steps.push({
      operation: "push",
      value,
      stack: [...this.stack]
    });
  }

  pop() {

    const removed = this.stack.pop();

    this.steps.push({
      operation: "pop",
      value: removed,
      stack: [...this.stack]
    });
  }
}