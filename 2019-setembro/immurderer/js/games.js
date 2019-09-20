function operacao(operador = null) {
  for (let i = 0; i < maxQuestions; i++) {
    let b = Math.floor(Math.random() * maxNumber) + 1;
    let a = Math.floor(Math.random() * maxNumber) + (operador == "/" ? b : 1);
    operador =
      operador == null ? "+-/*"[Math.floor(Math.random() * 4)] : operador;
    conta = `${a}${operador}${b}`;
    questoes.push({ conta: conta + " = ", res: eval(conta) });
  }
}

function gameOperacao() {
  for (let i = 0; i < maxQuestions; i++) {
    let b = Math.floor(Math.random() * maxNumber) + 1;
    let a = Math.floor(Math.random() * maxNumber) + 1;
    operador = "+-/*"[Math.floor(Math.random() * 4)];
    resultado = parseInt(eval(`${a}${operador}${b}`));
    conta = `${a}_${b}=${resultado} | `;
    res = operador;
    questoes.push({ conta, res });
  }
}

function numeroDoMeio() {
  /*
      Gera 10 pares de numeros aleatorios
      Pega a média inteira dos pares
      Adiciona às questoes um objeto com os pares e a média
    */
  for (let i = 0; i < maxQuestions; i++) {
    let a = Math.floor(Math.random() * 100) + 1;
    let b = Math.floor(Math.random() * 100) + 1;
    let media = Math.floor((a + b) / 2);
    conta = `${a}~_~${b} | `;
    questoes.push({ conta, res: media });
  }
}
function adivinheONumero() {
  let num = Math.floor(Math.random() * 10) + 1;
  for (let i = 0; i < maxQuestions; i++) {
    questoes.push(num);
  }
}
