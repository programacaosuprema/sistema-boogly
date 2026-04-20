export class ListSimulator {

  constructor() {
    this.lists = {};
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

    if (list.limit !== undefined && list.data.length >= list.limit) {
      this.steps.push({
        type: "error",
        message: "lista cheia",
        state: this.getState()
      });
      return;
    }

    const position = list.data.length;

    // 🔥 highlight posição de inserção
    this.steps.push({
      type: "highlight_insert",
      index: position,
      message: `inserindo ${value} na posição ${position}`,
      state: this.getState()
    });

    list.data.push(value);

    this.steps.push({
      type: "add",
      index: position,
      message: `inseriu ${value}`,
      state: this.getState()
    });
  }

  remover_ultimo(nome) {
    const list = this.getList(nome);
    if (!list || list.data.length === 0) return;

    const lastIndex = list.data.length - 1;

    // 🔥 percurso
    for (let i = 0; i <= lastIndex; i++) {
      this.steps.push({
        type: "traverse",
        index: i,
        message: `percorrendo posição ${i}`,
        state: this.getState()
      });
    }

    // 🔥 highlight alvo
    this.steps.push({
      type: "highlight_remove",
      index: lastIndex,
      message: `encontrou o último elemento`,
      state: this.getState()
    });

    const removed = list.data.pop();

    this.steps.push({
      type: "remove",
      index: lastIndex,
      message: `removeu (${removed})`,
      state: this.getState()
    });
  }

  remover_primeiro(nome) {
    const list = this.getList(nome);
    if (!list || list.data.length === 0) return;

    // 🔥 destaque início
    this.steps.push({
      type: "traverse",
      index: 0,
      message: "acessando início",
      state: this.getState()
    });

    this.steps.push({
      type: "highlight_remove",
      index: 0,
      message: "removendo primeiro elemento",
      state: this.getState()
    });

    const removed = list.data.shift();

    this.steps.push({
      type: "remove",
      index: 0,
      message: `removeu (${removed})`,
      state: this.getState()
    });
  }

  remover_item(value, nome) {
    const list = this.getList(nome);
    if (!list) return;

    let index = -1;

    for (let i = 0; i < list.data.length; i++) {
      this.steps.push({
        type: "traverse",
        index: i,
        message: `procurando ${value}`,
        state: this.getState()
      });

      if (list.data[i] === value) {
        index = i;
        break;
      }
    }

    if (index === -1) {
      this.steps.push({
        type: "error",
        message: `item ${value} não encontrado`,
        state: this.getState()
      });
      return;
    }

    this.steps.push({
      type: "highlight_remove",
      index,
      message: `encontrou ${value}`,
      state: this.getState()
    });

    list.data.splice(index, 1);

    this.steps.push({
      type: "remove",
      index,
      message: `removeu ${value}`,
      state: this.getState()
    });
  }

  remover_da_posicao(index, nome) {
    const list = this.getList(nome);
    if (!list) return;

    if (index < 0 || index >= list.data.length) {
      this.steps.push({
        type: "error",
        message: "posição inválida",
        state: this.getState()
      });
      return;
    }

    // 🔥 percurso
    for (let i = 0; i <= index; i++) {
      this.steps.push({
        type: "traverse",
        index: i,
        message: `indo até posição ${index}`,
        state: this.getState()
      });
    }

    this.steps.push({
      type: "highlight_remove",
      index,
      message: `posição ${index} encontrada`,
      state: this.getState()
    });

    const removed = list.data.splice(index, 1)[0];

    this.steps.push({
      type: "remove",
      index,
      message: `removeu (${removed})`,
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
      this.steps.push({
        type: "error",
        message: `lista "${nome}" não existe`,
        state: this.getState()
      });
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

      this.steps.push({
        type: "traverse",
        index: i,
        message: `${variable} = ${value}`,
        state: this.getState()
      });

      callback(value);
    }
  }
}