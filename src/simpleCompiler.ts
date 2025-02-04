const code = `imm name str = 'The cows car jumped over the moon!'
mut age num = 29`;

type VariableState = "imm" | "mut";

type VariableType = "str" | "num" | "bool" | "arr";

type Variable = {
  tokenType: "Variable";
  state: VariableState;
  identifier: string;
  type: VariableType;
  value: string | number | boolean | [];
};

type Token = Variable | any;

class Tokenizer {
  input: any = [];
  tokens: Token[] = [];

  constructor(code: string) {
    const lines = code.split("\n");
    console.log(lines);
    lines.forEach((value, index) => {
      this.input[index] = value.match(/(?:[^\s']+|'[^']*')+/g)!;
    });
    console.log(this.input);
  }

  tokenize() {
    this.input.forEach((_: any, index: any) => {
      if (this.input[index][0] === "mut" || this.input[index][0] === "imm") {
        const token: Variable = {
          tokenType: "Variable",
          state: this.input[index][0] as VariableState,
          identifier: this.input[index][1],
          type: this.input[index][2] as VariableType,
          value: this.input[index][4],
        };
        this.tokens.push(token);
      }
    });
  }
}

class Transpiler {
  readonly tokens: Token[];
  typeScript: string[] = [];
  typeMap: any = {
    str: "string",
    num: "number",
    bool: "boolean",
    arr: "[]",
  };
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }
  ouput() {
    for (const token of this.tokens) {
      if (token.tokenType === "Variable") {
        const temporary = {
          state: token.state === "imm" ? "const" : "let",
          identifier: token.identifier,
          type: this.typeMap[token.type],
          value: token.value,
        };
        this.typeScript.push(
          `${temporary.state} ${temporary.identifier}: ${temporary.type} = ${temporary.value};`
        );
      }
    }
  }
}

const tokenizer = new Tokenizer(code);
tokenizer.tokenize();
console.log(tokenizer.tokens);
const transpiler = new Transpiler(tokenizer.tokens);
transpiler.ouput();
console.log(JSON.stringify(transpiler.typeScript));
