import { IJsonLoadable } from "../resources";

interface WebHelpAbstractions {
  functions: Record<string, unknown>;
  ambiguousFunctions: Record<string, unknown>;
  enumerators: Record<string, unknown>;
}

export class WebHelpLibrary implements IJsonLoadable {
  functions: string[] = [];
  ambiguousFunctions: string[] = [];
  enumerators: string[] = [];

  loadFromJsonObject(obj: WebHelpAbstractions): void {
    this.functions.push(...Object.keys(obj["functions"]));
    this.ambiguousFunctions.push(...Object.keys(obj["ambiguousFunctions"]));
    this.enumerators.push(...Object.keys(obj["enumerators"]));
  }
}
