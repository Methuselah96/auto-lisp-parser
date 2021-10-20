// en-US is forced because native AutoLisp is in english and ZXX is a 'no particular language' override
// https://unicode.org/reports/tr35/#BCP_47_Language_Tag_Conversion
const collator = new Intl.Collator(["en-US", "zxx"], { sensitivity: "base" });
export function StringEqualsIgnoreCase(str1: string, str2: string): boolean {
  return collator.compare(str1, str2) === 0;
}

// For situations (like parsing) where many strings are being constructed or one large string from many small sources.
// This doesn't save nearly as much garbage collection/performance as a .Net implementation, but it does do what it
// intended to do and in large scenarios the performance increase is very obvious.
export class StringBuilder {
  private _charCodes: Array<number> = [];

  charCodeAt(index: number): number {
    return this._charCodes[index];
  }

  hasValues(): boolean {
    return this._charCodes.length > 0;
  }

  appendCode(charCode: number): void {
    this._charCodes.push(charCode);
  }

  endsWith(charCode: number): boolean {
    return this._charCodes[this._charCodes.length - 1] === charCode;
  }

  materialize(): string {
    try {
      return String.fromCharCode(...this._charCodes);
    } finally {
      this._charCodes.length = 0;
    }
  }
}
