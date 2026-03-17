export class QueueSimulator {

  constructor() {
    this.queue = [];
    this.steps = [];
  }

  enqueue(value) {

    this.queue.push(value);

    this.steps.push({
      operation: "enqueue",
      value,
      state: [...this.queue]
    });

  }

  dequeue() {

    const removed = this.queue.shift();

    this.steps.push({
      operation: "dequeue",
      value: removed,
      state: [...this.queue]
    });

  }

}