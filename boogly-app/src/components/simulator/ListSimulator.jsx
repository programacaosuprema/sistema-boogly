export class ListSimulator {

  constructor() {
    this.list = [];
    this.steps = [];
  }

  insert(value) {

    this.list.push(value);

    this.steps.push({
      operation: "insert",
      value,
      state: [...this.list]
    });

  }

  remove() {

    const removed = this.list.pop();

    this.steps.push({
      operation: "remove",
      value: removed,
      state: [...this.list]
    });

  }

}