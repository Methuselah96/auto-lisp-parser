export class DocumentManager {
  public static getSelectorType(fspath: string): string {
    if (fspath) {
      const ext: string = fspath.toUpperCase().slice(-4);
      switch (ext) {
        case ".LSP":
          return DocumentManager.Selectors.lsp;
        case ".MNL":
          return DocumentManager.Selectors.lsp;
        case ".PRJ":
          return DocumentManager.Selectors.prj;
        case ".DCL":
          return DocumentManager.Selectors.dcl;
        default:
          return "";
      }
    } else {
      return "";
    }
  }
}

export namespace DocumentManager {
  export enum Selectors {
    lsp = "autolisp",
    dcl = "autolispdcl",
    prj = "autolispprj",
  }
}
