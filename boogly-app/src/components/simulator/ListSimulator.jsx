export class ListSimulator {

  constructor() {
    this.lists = {}; // 🔥 várias listas
    this.steps = [];
  }

  criar_lista(nome) {
  if (!this.lists[nome]) {
    this.lists[nome] = {
      data: [],
      limit: undefined
    };
  }

  this.steps.push({
    operation: "criar_lista",
    list: nome,
    state: this.getState()
  });
}

  criar_lista_limitada(nome, size) {
    if (!this.lists[nome]) {
      this.lists[nome] = {
        data: [],
        limit: size
      };
    }

    this.steps.push({
      operation: "criar_lista_limitada",
      list: nome,
      state: this.getState()
    });
  }

  inserir(value, nome) {

    const list = this.getList(nome);

    if (!list) return;

    // 🔥 verify limit
    if (list.limit !== undefined && list.data.length >= list.limit) {
      console.warn("Lista cheia!");
      return;
    }

    list.data.push(value);

    this.steps.push({
      operation: "inserir",
      value,
      list: nome,
      state: this.getState()
    });
  }

  remover_ultimo(nome) {

    const list = this.getList(nome);

    if (!list) return;

    const removed = list.data.pop();

    this.steps.push({
      operation: "remover_último",
      value: removed,
      list: nome,
      state: this.getState()
    });
  }

  remover_primeiro(nome) {

    const list = this.getList(nome);

    if (!list) return;

    const removed = list.data.shift()
    this.steps.push({
      operation: "remover_primeiro",
      value: removed,
      list: nome,
      state: this.getState()
    });
  }

  remover_item(value, nome) {

    const list = this.getList(nome);

    if (!list) return;

    const index = list.data.indexOf(value);

    if (index === -1) {

      this.steps.push({
        operation: "erro",
        message: "Item não existe",
        list: nome,
        state: this.getState()
      });

      return;
    }

    list.data.splice(index, 1);

    this.steps.push({
      operation: "remover_item",
      value,
      list: nome,
      state: this.getState()
    });
  }

  remover_da_posicao(index, nome) {

    const list = this.getList(nome);

    if (!list) return;

    if (index < 0 || index >= list.data.length) {
      console.warn("Posição inválida");
      return;
    }

    const removed = list.data.splice(index, 1)[0];

    this.steps.push({
      operation: "remover_da_posicao",
      value: removed,
      index,
      list: nome,
      state: this.getState()
    });
  }

  tamanho(nome) {
    const list = this.getList(nome);

    return list ? list.data.length : 0;
  }

  ta_vazia(nome) {
    const list = this.getList(nome);

    return list ? list.data.length === 0 : true;
  }

  getList(nome) {
    const list = this.lists[nome];

    if (!list) {
      console.warn(`Lista "${nome}" não existe`);
      return null;
    }

    return list;
  }

  getState() {
    const state = {};

    for (const key in this.lists) {
      state[key] = [...this.lists[key].data];
    }

    return state;
  }

  para_cada(variable, nome, callback) {
    const list = this.getList(nome);

    if (!list) return;

    for (let i = 0; i < list.data.length; i++) {
      const value = list.data[i];

      callback(value);

      this.steps.push({
        operation: "loop",
        variable,
        value,
        list: nome,
        state: this.getState()
      });
    }
  }
}