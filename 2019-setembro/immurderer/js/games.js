function operacao(operador = null) {
  questoes = [];
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
  questoes = [];
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
  questoes = [];
  for (let i = 0; i < maxQuestions; i++) {
    let a = Math.floor(Math.random() * 100) + 1;
    let b = Math.floor(Math.random() * 100) + 1;
    let media = Math.floor((a + b) / 2);
    conta = `${a}~_~${b} | `;
    questoes.push({ conta, res: media });
  }
}
function adivinheONumero() {
  questoes = [];
  let num = Math.floor(Math.random() * 10) + 1;
  for (let i = 0; i < maxQuestions; i++) {
    questoes.push(num);
  }
}

function pokemon() {
  questoes = [];
  let apiURL = "https://pokeapi.co/api/v2/type/";
  let types = ["🔥", "💧", "🍃", "⚡"];
  for (let i = 0; i < maxQuestions; i++) {
    let j = Math.floor(Math.random() * 4) + 10;
    axios
      .get(apiURL + j)
      .then(response => {
        let pokemons = response.data.pokemon;
        let randomIndex = Math.floor(Math.random() * pokemons.length);
        let name = pokemons[randomIndex].pokemon.name;
        questoes.push({ conta: "🐱 " + name, res: types[j - 10] });
      })
      .catch(err => console.error(err));
  }
}
