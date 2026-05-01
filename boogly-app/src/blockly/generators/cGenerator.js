import { Generator } from "blockly";

export const CGenerator = new Generator("C");

let hasList = false;

// 🔹 EXPRESSÕES
CGenerator.forBlock['compare'] = function(block) {
  const a = CGenerator.valueToCode(block, 'A', CGenerator.ORDER_NONE) || "0";
  const b = CGenerator.valueToCode(block, 'B', CGenerator.ORDER_NONE) || "0";
  const op = block.getFieldValue('OP');
  return [`${a} ${op} ${b}`, CGenerator.ORDER_NONE];
};

CGenerator.forBlock['variable'] = function(block) {
  return [block.getFieldValue('VAR'), CGenerator.ORDER_NONE];
};

// 🔹 GERADOR PRINCIPAL
export function cGenerator(workspace) {
  CGenerator.init(workspace);

  let indentLevel = 1;

  function indent() {
    return "    ".repeat(indentLevel);
  }

  function addLine(code, line) {
    return code + indent() + line + "\n";
  }

  function generateBlock(block) {
    let code = "";
    let current = block;

    while (current) {

      // INSERT
      if (current.type === "insert") {
        const value = current.getFieldValue("VALUE");
        const list = current.getFieldValue("LIST");
        code = addLine(code, `inserir_inicio(&${list}, ${value});`);
      }

      // IF
      if (current.type === "if") {
        const condition = CGenerator.valueToCode(current, "CONDITION", CGenerator.ORDER_NONE) || "0";

        code = addLine(code, `if (${condition}) {`);
        indentLevel++;

        const branch = current.getInputTargetBlock("DO");
        if (branch) code += generateBlock(branch);

        indentLevel--;
        code = addLine(code, `}`);
      }

      // IF ELSE
      if (current.type === "if_else") {
        const condition = CGenerator.valueToCode(current, "CONDITION", CGenerator.ORDER_NONE) || "0";

        code = addLine(code, `if (${condition}) {`);
        indentLevel++;

        const doBlock = current.getInputTargetBlock("DO");
        if (doBlock) code += generateBlock(doBlock);

        indentLevel--;
        code = addLine(code, `} else {`);
        indentLevel++;

        const elseBlock = current.getInputTargetBlock("ELSE");
        if (elseBlock) code += generateBlock(elseBlock);

        indentLevel--;
        code = addLine(code, `}`);
      }

      // FOR EACH
      if (current.type === "for_each") {
        const varName = current.getFieldValue("VAR");
        const list = current.getFieldValue("LIST");

        code = addLine(code, `Nodo *aux_${varName} = ${list}.inicio;`);
        code = addLine(code, `while (aux_${varName} != NULL) {`);
        indentLevel++;

        code = addLine(code, `int ${varName} = aux_${varName}->dado;`);

        const branch = current.getInputTargetBlock("DO");
        if (branch) code += generateBlock(branch);

        code = addLine(code, `aux_${varName} = aux_${varName}->proximo;`);

        indentLevel--;
        code = addLine(code, `}`);
      }

      current = current.getNextBlock();
    }

    return code;
  }

  const blocks = workspace.getTopBlocks(true).filter(
    block => block.type === "run_program"
  );

  if (!blocks || blocks.length === 0) return "";

  let hasList = false;

  blocks.forEach(block => {
    let current = block.getInputTargetBlock("DO");

    while (current) {
      if (current.type === "list_container" || current.type === "list_fixed") {
        hasList = true;
        break;
      }
      current = current.getNextBlock();
    }
  });

  if (!hasList) return "";

  let header = `#include <stdio.h>
#include <stdlib.h>

typedef struct Nodo {
    int dado;
    struct Nodo *proximo;
} Nodo;

typedef struct {
    int tamanho;
    Nodo *inicio;
} Lista;

`;

  let functions = "";
  let main = "";

  let usedFunctions = {
    inicializar: false,
    inserir: false,
    remover_inicio: false,
    remover_final: false,
    remover_valor: false,
    remover_posicao: false,
    obter: false,
    buscar: false,
    inverter: false,
    vazia: false,
    ordenar_crescente: false,
    ordenar_decrescente: false,
    sublista: false,
    size: 0
  };

  // 🔹 PROCESSAMENTO
  blocks.forEach(block => {
    let current = block.getInputTargetBlock("DO");

    while (current) {

      // LISTA
      if (current.type === "list_container" || current.type === "list_fixed") {
        const name = current.getFieldValue("NAME");

        if (current.type === "list_fixed") {
          usedFunctions.size = current.getFieldValue("SIZE");
        }

        usedFunctions.inicializar = true;

        main = addLine(main, `Lista ${name};`);
        main = addLine(main, `inicializar(&${name});`);
      }

      // INSERT
      if (current.type === "insert") {
        usedFunctions.inserir = true;

        const value = current.getFieldValue("VALUE");
        const list = current.getFieldValue("LIST");

        main = addLine(main, `inserir_inicio(&${list}, ${value});`);
      }

      // REMOVE FIRST
      if (current.type === "remove_first") {
        usedFunctions.remover_inicio = true;
        const list = current.getFieldValue("LIST");
        main = addLine(main, `remover_inicio(&${list});`);
      }

      // REMOVE LAST
      if (current.type === "remove_last") {
        usedFunctions.remover_final = true;
        const list = current.getFieldValue("LIST");
        main = addLine(main, `remover_final(&${list});`);
      }

      // REMOVE ITEM
      if (current.type === "remove_item") {
        usedFunctions.remover_valor = true;
        const value = current.getFieldValue("VALUE");
        const list = current.getFieldValue("LIST");
        main = addLine(main, `remover_valor(&${list}, ${value});`);
      }

      // REMOVE INDEX
      if (current.type === "remove_index") {
        usedFunctions.remover_posicao = true;
        const index = current.getFieldValue("INDEX");
        const list = current.getFieldValue("LIST");
        main = addLine(main, `remover_posicao(&${list}, ${index});`);
      }

      // GET
      if (current.type === "item_position") {
        usedFunctions.obter = true;
        const pos = current.getFieldValue("VALUE");
        const list = current.getFieldValue("LIST");
        main = addLine(main, `printf("%d\\n", obter_elemento(&${list}, ${pos}));`);
      }

      // BUSCAR
      if (current.type === "list_index") {
        usedFunctions.buscar = true;
        const value = current.getFieldValue("VALUE");
        const list = current.getFieldValue("LIST");
        main = addLine(main, `printf("%d\\n", buscar_posicao(&${list}, ${value}));`);
      }

      // INVERTER
      if (current.type === "invert") {
        usedFunctions.inverter = true;
        const list = current.getFieldValue("LIST");
        main = addLine(main, `inverter(&${list});`);
      }

      // VAZIA
      if (current.type === "is_empty") {
        usedFunctions.vazia = true;
        const list = current.getFieldValue("LIST");
        main = addLine(main, `printf("%d\\n", esta_vazia(&${list}));`);
      }

      // SORT
      if (current.type === "sort_ascending") {
        usedFunctions.ordenar_crescente = true;
        const list = current.getFieldValue("LIST");
        main = addLine(main, `ordenar_crescente(&${list});`);
      }

      if (current.type === "sort_descending") {
        usedFunctions.ordenar_decrescente = true;
        const list = current.getFieldValue("LIST");
        main = addLine(main, `ordenar_decrescente(&${list});`);
      }

      // SUBLISTA
      if (current.type === "sublist") {
        usedFunctions.sublista = true;
        const start = current.getFieldValue("FIRST_VALUE");
        const end = current.getFieldValue("SECOND_VALUE");
        const list = current.getFieldValue("LIST");
        main = addLine(main, `Lista sub = sublista(&${list}, ${start}, ${end});`);
      }

      // CONTROLE DE FLUXO
      if (["if", "if_else", "for_each"].includes(current.type)) {
        main += generateBlock(current);
      }

      current = current.getNextBlock();
    }
  });

   // 🔹 INICIALIZAR
if (usedFunctions.inicializar) {
functions += `
void inicializar(Lista *l) {
    l->inicio = NULL;
    l->tamanho = ${usedFunctions.size};
}

`;
}

// 🔹 INSERIR
if (usedFunctions.inserir) {
functions += `
void inserir_inicio(Lista *l, int valor) {
    Nodo *novo = (Nodo*) malloc(sizeof(Nodo));
    novo->dado = valor;
    novo->proximo = l->inicio;
    l->inicio = novo;
    l->tamanho++;
}

`;
}

// 🔹 REMOVER PRIMEIRO
if (usedFunctions.remover_inicio) {
functions += `
void remover_inicio(Lista *l) {
    if (l->inicio == NULL) return;

    Nodo *temp = l->inicio;
    l->inicio = temp->proximo;
    free(temp);
    l->tamanho--;
}

`;
}

// 🔹 REMOVER ÚLTIMO
if (usedFunctions.remover_final) {
functions += `
void remover_final(Lista *l) {
    if (l->inicio == NULL) return;

    Nodo *atual = l->inicio;
    Nodo *anterior = NULL;

    while (atual->proximo != NULL) {
        anterior = atual;
        atual = atual->proximo;
    }

    if (anterior == NULL) {
        l->inicio = NULL;
    } else {
        anterior->proximo = NULL;
    }

    free(atual);
    l->tamanho--;
}

`;
}

// 🔹 REMOVER POR VALOR
if (usedFunctions.remover_valor) {
functions += `
void remover_valor(Lista *l, int valor) {
    Nodo *atual = l->inicio;
    Nodo *anterior = NULL;

    while (atual != NULL && atual->dado != valor) {
        anterior = atual;
        atual = atual->proximo;
    }

    if (atual != NULL) {
        if (anterior == NULL) {
            l->inicio = atual->proximo;
        } else {
            anterior->proximo = atual->proximo;
        }

        free(atual);
        l->tamanho--;
    }
}

`;
}

// 🔹 REMOVER POR POSIÇÃO
if (usedFunctions.remover_posicao) {
functions += `
void remover_posicao(Lista *l, int pos) {
    Nodo *atual = l->inicio;
    Nodo *anterior = NULL;

    for (int i = 1; i < pos && atual != NULL; i++) {
        anterior = atual;
        atual = atual->proximo;
    }

    if (atual != NULL) {
        if (anterior == NULL) {
            l->inicio = atual->proximo;
        } else {
            anterior->proximo = atual->proximo;
        }

        free(atual);
        l->tamanho--;
    }
}

`;
}

// 🔹 OBTER ELEMENTO
if (usedFunctions.obter) {
functions += `
int obter_elemento(Lista *l, int pos) {
    Nodo *aux = l->inicio;

    for (int i = 1; i < pos && aux != NULL; i++) {
        aux = aux->proximo;
    }

    if (aux != NULL) return aux->dado;
    return -1;
}

`;
}

// 🔹 BUSCAR POSIÇÃO
if (usedFunctions.buscar) {
functions += `
int buscar_posicao(Lista *l, int valor) {
    Nodo *aux = l->inicio;
    int pos = 1;

    while (aux != NULL) {
        if (aux->dado == valor) return pos;
        aux = aux->proximo;
        pos++;
    }

    return -1;
}

`;
}

// 🔹 LISTA VAZIA
if (usedFunctions.vazia) {
functions += `
int esta_vazia(Lista *l) {
    return l->tamanho == 0;
}

`;
}

// 🔹 INVERTER LISTA
if (usedFunctions.inverter) {
functions += `
void inverter(Lista *l) {
    Nodo *prev = NULL;
    Nodo *current = l->inicio;
    Nodo *next = NULL;

    while (current != NULL) {
        next = current->proximo;
        current->proximo = prev;
        prev = current;
        current = next;
    }

    l->inicio = prev;
}
`;
}

// 🔹 SORT CRESCENTE
if (usedFunctions.ordenar_crescente) {
functions += `
void ordenar_crescente(Lista *l) {
    if (l->inicio == NULL) return;

    Nodo *i = l->inicio->proximo;

    while (i != NULL) {
        Nodo *j = l->inicio;

        while (j != i) {
            if (j->dado > i->dado) {
                int temp = j->dado;
                j->dado = i->dado;
                i->dado = temp;
            }
            j = j->proximo;
        }

        i = i->proximo;
    }
}
`;
}

// 🔹 SORT DECRESCENTE
if (usedFunctions.ordenar_decrescente) {
functions += `
void ordenar_decrescente(Lista *l) {
    if (l->inicio == NULL) return;

    Nodo *i = l->inicio->proximo;

    while (i != NULL) {
        Nodo *j = l->inicio;

        while (j != i) {
            if (j->dado < i->dado) {
                int temp = j->dado;
                j->dado = i->dado;
                i->dado = temp;
            }
            j = j->proximo;
        }

        i = i->proximo;
    }
}
`;
}

if (usedFunctions.sublista) {
functions += `
Lista sublista(Lista *l, int inicio, int fim) {
    Lista nova;
    nova.inicio = NULL;
    nova.tamanho = 0;

    if (inicio < 1 || fim > l->tamanho || inicio > fim) return nova;

    Nodo *aux = l->inicio;

    for (int i = 1; i < inicio; i++) {
        aux = aux->proximo;
    }

    for (int i = inicio; i <= fim && aux != NULL; i++) {
        Nodo *novo = (Nodo*) malloc(sizeof(Nodo));
        novo->dado = aux->dado;
        novo->proximo = nova.inicio;
        nova.inicio = novo;
        nova.tamanho++;

        aux = aux->proximo;
    }

    return nova;
}
`;
}

  return header + functions + "\nint main() {\n" + main + "    return 0;\n}";
}