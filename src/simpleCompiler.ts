const code = `imm name str = 'The cows car jumped over the moon!'`;

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
  input: any[];
  tokens: Token[] = [];

  constructor(code: string) {
    this.input = code.match(/(?:[^\s']+|'[^']*')+/g)!;
    console.log(this.input);
  }

  tokenize() {
    if (this.input[0] === "mut" || this.input[0] === "imm") {
      const token: Variable = {
        tokenType: "Variable",
        state: this.input[0] as VariableState,
        identifier: this.input[1],
        type: this.input[2] as VariableType,
        value: this.input[4],
      };
      this.tokens.push(token);
    }
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
          `${temporary.state} ${temporary.identifier}: ${temporary.type} = ${temporary.value}`
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
console.log(JSON.stringify(transpiler.typeScript[0]));
