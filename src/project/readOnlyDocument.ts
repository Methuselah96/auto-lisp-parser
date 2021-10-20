import * as fs from "fs";
import { getDocumentContainer } from "../parsing/containers";
import { DocumentManager } from "../documents";
import { DocumentServices } from "../services/documentServices";
import { ILispFragment } from "../astObjects/ILispFragment";
import { LispContainer } from "../astObjects/lispContainer";

export class ReadonlyDocument {
  private constructor(filePath: string) {
    this.fileName = DocumentServices.normalizeFilePath(filePath);
  }

  static open(filePath: string): ReadonlyDocument {
    const langId = DocumentManager.getSelectorType(filePath);
    if (fs.existsSync(filePath) === false || langId === "") {
      return null;
    }

    let ret = new ReadonlyDocument(filePath);

    let data = fs.readFileSync(filePath).toString();
    ret.initialize(data, langId);
    return ret;
  }

  // Example Use Cases
  //      Identify global variables from fragments of AutoLisp code
  //      Currently in use to save/create PRJ files
  static createMemoryDocument(
    fileContent: string,
    languageId: string
  ): ReadonlyDocument {
    let ret = new ReadonlyDocument("");
    ret.initialize(fileContent, languageId);
    return ret;
  }

  initialize(rawContent: string, langId: string) {
    this.fileContent = rawContent.replace(/\r*\n/g, "\r\n"); //rawContent.split('\r\n').join('\n').split('\n').join('\r\n');//to make sure every line ends with \r\n
    this.eolLength = 2;

    this.languageId = langId;

    if (this.fileContent.length === 0) {
      this.lines = [];
    } else {
      this.lines = this.fileContent.split("\r\n");
    }
  }

  // Converted this from a constant data feature into an on-demand feature that once used is essentially cached for future queries.
  get atomsForest(): Array<ILispFragment> {
    if (this.languageId === DocumentManager.Selectors.lsp) {
      if (this._documentContainer) {
        return this._documentContainer.atoms;
      } else {
        this.updateAtomsForest();
        return this._documentContainer.atoms;
      }
    } else {
      return [];
    }
  }

  // This was segregated from the atomsForest getter to support two primary use cases:
  //      A force update that will be called on the workspace.onDidSaveTextDocument() saved event to keep the memory document in sync with the user input.
  //      To recycle/update a memory document object currently being used with AutoLisp code fragments for enhanced data type detection.
  updateAtomsForest(content?: string) {
    if (this.languageId === DocumentManager.Selectors.lsp) {
      if (content) {
        this.initialize(content, this.languageId);
      }
      this._documentContainer = getDocumentContainer(this.fileContent);
    }
  }

  fileContent: string;
  lines: string[];
  eolLength: number;
  private _documentContainer: LispContainer; // Added to drastically reduces complexity in other places.

  //#region implementing vscode.TextDocument

  fileName: string;

  languageId: string;

  get documentContainer(): LispContainer {
    if (this._documentContainer) {
      return this._documentContainer;
    } else {
      return (this._documentContainer = getDocumentContainer(this.fileContent));
    }
  }
}
