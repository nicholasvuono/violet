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

  readonly input: any;

  constructor(input: any) {
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

  readWhile(predicate: Function): string {
    let str = "";
    while (!this.input.eof() && predicate(this.input.peek()))
      str += this.input.next();
    return str;
  }

  readIdentifier(char: string): { type: string; value: string } {
    var id = this.readWhile(this.isIdentifier);
    return {
      type: this.isKeyword(id) ? "keyword" : "identifier",
      value: id,
    };
  }

  readNext() {
    this.readWhile(this.isWhitespace);
    if (this.input.endOfFile()) return null;
    const char = this.input.peek();
    if (this.isStartOfIdentifier(char)) return this.readIdentifier(char);
    if (this.isOperator(char))
      return {
        type: "op",
        value: this.readWhile(this.isOperator),
      };
    this.input.croak("Can't handle character: " + char);
  }

  peek() {
    return this.current || (this.current = this.readNext());
  }
  next() {
    const token = this.current;
    this.current = null;
    return token || this.readNext();
  }
  endOfFile() {
    return this.peek() == null;
  }
}
