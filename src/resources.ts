import * as path from "path";
import * as fs from "fs";
import { WebHelpLibrary } from "./help/openWebHelp";

export interface Resources {
  internalLispFuncs: Array<string>;
  webHelpContainer: WebHelpLibrary;
}

export function loadAllResources(): Resources {
  let internalLispFuncs: Array<string> = [];
  let webHelpContainer: WebHelpLibrary = new WebHelpLibrary();

  readDataFileByLine("../data/alllispkeys.txt", (items) => {
    internalLispFuncs = items;
  });
  readJsonDataFile("../data/webHelpAbstraction.json", webHelpContainer);

  return { internalLispFuncs, webHelpContainer };
}

export interface IJsonLoadable {
  loadFromJsonObject(data: object): void;
}

function readJsonDataFile(datafile: string, intoObject: IJsonLoadable): void {
  const dataPath = path.resolve(__dirname, datafile);
  fs.readFile(
    dataPath,
    "utf8",
    function (err: NodeJS.ErrnoException | null, data: string) {
      if (err === null && intoObject["loadFromJsonObject"]) {
        intoObject.loadFromJsonObject(JSON.parse(data));
      }
    }
  );
}

function readDataFileByLine(
  datafile: string,
  action: (items: string[]) => void
) {
  const dataPath = path.resolve(__dirname, datafile);
  try {
    const data = fs.readFileSync(dataPath, { encoding: "utf8", flag: "r" });
    if (data.includes("\r\n")) {
      action(data.split("\r\n"));
    } else {
      action(data.split("\n"));
    }
  } catch (error) {
    console.log(error);
  }
}
