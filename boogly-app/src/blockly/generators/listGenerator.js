import { javascriptGenerator } from "blockly/javascript";

/*function getParentListName(block) {
  let parent = block.getSurroundParent();

  while (parent) {
    if (parent.type === "list_container" || parent.type === "list_fixed") {
      return parent.getFieldValue("NAME");
    }
    parent = parent.getSurroundParent();
  }

  return "lista"; // fallback
}*/

javascriptGenerator.forBlock["insert"] = function (block) {

  const value = block.getFieldValue("VALUE");
  const listName = block.getFieldValue("LIST");

  return `inserir(${value}, "${listName}")\n`;
};

javascriptGenerator.forBlock["remove"] = function (block) {
  const listName = block.getFieldValue("LIST");

  return `remover("${listName}")\n`;
};

javascriptGenerator.forBlock["remove_item"] = function (block) {
  const value = block.getFieldValue("VALUE");
  const listName = block.getFieldValue("LIST");

  return `remover_item(${value}, "${listName}")\n`;
};

javascriptGenerator.forBlock["remove_index"] = function (block) {
  const index = block.getFieldValue("INDEX");
  const listName = block.getFieldValue("LIST");

  return `remover_da_posicao(${index}, "${listName}")\n`;
};

javascriptGenerator.forBlock["size"] = function (block) {

  const listName = block.getFieldValue("LIST");

  return [`tamanho("${listName}")`, javascriptGenerator.ORDER_NONE];
};

javascriptGenerator.forBlock["is_empty"] = function (block) {

  const listName = block.getFieldValue("LIST");

  return [`ta_vazia("${listName}")`, javascriptGenerator.ORDER_NONE];
};

javascriptGenerator.forBlock["list_container"] = function (block) {

  const name = block.getFieldValue("NAME");

  return `criar_lista("${name}")\n`;
};

javascriptGenerator.forBlock["list_fixed"] = function (block) {

  const name = block.getFieldValue("NAME");
  const size = block.getFieldValue("SIZE");

  return `criar_lista_limitada("${name}", ${size})\n`;
};