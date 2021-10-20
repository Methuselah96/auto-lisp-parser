import { loadAllResources } from "../resources";

export namespace SymbolServices {
  // These are some basic symbols that may or may not appear in our lookup sources
  // However, their frequency alone makes this pre-check list a performance increase.
  const _commonSymbols = ["+", "-", "/", "*", "<", ">", "<=", ">=", "/="];

  // This list of native keys is used to detect symbols we would not want to track
  const _nativeKeys: Array<string> = [];
  function generateNativeKeys(): void {
    const { internalLispFuncs, webHelpContainer } = loadAllResources();
    _nativeKeys.push(
      ...new Set(
        webHelpContainer.functions
          .concat(webHelpContainer.ambiguousFunctions)
          .concat(webHelpContainer.enumerators)
          .concat(internalLispFuncs)
      )
    );
    _nativeKeys.sort();
  }

  // runs binary search on load-once & sorted constant
  export function isNative(lowerKey: string): boolean {
    if (_nativeKeys.length === 0) {
      generateNativeKeys();
    }
    if (_commonSymbols.includes(lowerKey)) {
      return true;
    }
    let start = 0;
    let end = _nativeKeys.length - 1;
    let result = false;
    while (start <= end) {
      let middle = Math.floor((start + end) / 2);
      if (_nativeKeys[middle] === lowerKey) {
        result = true;
        break;
      } else if (_nativeKeys[middle] < lowerKey) {
        start = middle + 1;
      } else {
        end = middle - 1;
      }
    }
    return result;
  }
}
