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
    type: "create",
    message: `criou a lista "${nome}"`,
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
      type: "create",
      message: `criou a lista "${nome}" com tamanho ${size}`,
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

    const position = list.data.length - 1;

    this.steps.push({
      type: "add",
      message: `inseriu ${value} na posição ${position}`,
      state: this.getState()
    });
      }

  remover_ultimo(nome) {

    const list = this.getList(nome);

    if (!list) return;

    const removed = list.data.pop();

    this.steps.push({
      type: "remove",
      message: `removeu o último elemento (${removed})`,
      state: this.getState()
    });
  }

  remover_primeiro(nome) {

    const list = this.getList(nome);

    if (!list) return;

    const removed = list.data.shift()
    this.steps.push({
      type: "remove",
      message: `removeu o primeiro elemento (${removed})`,
      state: this.getState()
    });
  }

  remover_item(value, nome) {

    const list = this.getList(nome);

    if (!list) return;

    const index = list.data.indexOf(value);

    if (index === -1) {

      this.steps.push({
      type: "error",
      message: `item ${value} não existe`,
      state: this.getState()
    });

      return;
    }

    list.data.splice(index, 1);

    this.steps.push({
      type: "remove",
      message: `removeu o item ${value}`,
      state: this.getState()
    });
  }

  remover_da_posicao(index, nome) {

    const list = this.getList(nome);

    if (!list) return;

    if (index < 0 || index >= list.data.length){
    
      this.steps.push({
        type: "error",
        state: this.getState()
      });
      return;
    }

    const removed = list.data.splice(index, 1)[0];

    this.steps.push({
      type: "remove",
      message: `removeu o item na posição ${index} (${removed})`,
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
      type: "loop",
      message: `percorrendo ${variable} = ${value}`,
      state: this.getState()
    });
    }
  }
}