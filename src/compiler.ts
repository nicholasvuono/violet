class CharacterInputStream {
  position: number = 0;
  line: number = 1;
  column: number = 0;

  readonly input: string;

  constructor(input: string) {
    this.input = input;
  }

  next() {
    const char = this.input.charAt(this.position++);
    if (char == "\n") {
      this.line++;
      this.column = 0;
    } else {
      this.column++;
    }
    return char;
  }

  peek() {
    return this.input.charAt(this.position);
  }

  endOfFile() {
    return this.peek() == "";
  }

  error(message: string) {
    throw new Error(message + " (" + this.line + ":" + this.column + ")");
  }
}

class TokenStream {
  current: any = null;
  keywords: string[] = ["imm", "mut", "str"];

  readonly input: string;

  constructor(input: string) {
    this.input = input;
  }

  isKeyword(word: string): boolean {
    return this.keywords.includes(word);
  }

  isStartOfIdentifier(char: string): boolean {
    return /[a-z]/i.test(char);
  }

  isIdentifier(char: string): boolean {
    return this.isStartOfIdentifier(char);
  }

  isOperator(char: string): boolean {
    return "=".indexOf(char) >= 0;
  }

  isWhitespace(char: string): boolean {
    return " \t\n".indexOf(char) >= 0;
  }

  // readWhile(predicate: string): string {
  //   let str: string;
  //   while(!this.input)
  // }
}
