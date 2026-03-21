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

  remover_item(value) {
    const index = this.lista.indexOf(value);

    if (index === -1) {
      console.warn("Item não existe");
      return null;
    }

    this.lista.splice(index, 1);

    this.steps.push([...this.lista]);
  }

  remover_da_posicao(index) {
    if (index < 0 || index >= this.lista.length) {
      console.warn("Posição inválida");
      return null;
    }

    this.lista.splice(index, 1);

    this.steps.push([...this.lista]);
  }

}