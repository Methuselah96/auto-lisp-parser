import * as path from "path";
import * as fs from "fs";
import { WebHelpLibrary } from "./help/openWebHelp";

export let internalLispFuncs: Array<string> = [];
export let internalDclKeys: Array<string> = [];
export let winOnlyListFuncPrefix: Array<string> = [];
export let allCmdsAndSysvars: Array<string> = [];
export let webHelpContainer: WebHelpLibrary = new WebHelpLibrary();

export function loadAllResources() {
  readDataFileByLine("../data/alllispkeys.txt", (items) => {
    internalLispFuncs = items;
  });
  readDataFileByLine("../data/alldclkeys.txt", (items) => {
    internalDclKeys = items;
  });
  readDataFileByLine("../data/winonlylispkeys_prefix.txt", (items) => {
    winOnlyListFuncPrefix = items;
  });
  readDataFileByDelimiter("../data/cmdAndVarsList.txt", ",", (item) => {
    let isLispCmds = item.startsWith("C:") || item.startsWith("c:");
    if (!isLispCmds && allCmdsAndSysvars.indexOf(item) < 0) {
      allCmdsAndSysvars.push(item);
    }
  });
  readJsonDataFile("../data/webHelpAbstraction.json", webHelpContainer);
}

export interface IJsonLoadable {
  loadFromJsonObject(data: object): void;
}

function readJsonDataFile(datafile: string, intoObject: IJsonLoadable): void {
  var dataPath = path.resolve(__dirname, datafile);
  fs.readFile(dataPath, "utf8", function (err: Error, data: string) {
    if (err === null && intoObject["loadFromJsonObject"]) {
      intoObject.loadFromJsonObject(JSON.parse(data));
    }
  });
}

function readDataFileByLine(
  datafile: string,
  action: (items: string[]) => void
) {
  var dataPath = path.resolve(__dirname, datafile);
  try {
    var data = fs.readFileSync(dataPath, { encoding: "utf8", flag: "r" });
    if (data.includes("\r\n")) {
      action(data.split("\r\n"));
    } else {
      action(data.split("\n"));
    }
  } catch (error) {
    console.log(error);
  }
}

function readDataFileByDelimiter(
  datafile: string,
  delimiter: string,
  action: (item: string) => void
) {
  var dataPath = path.resolve(__dirname, datafile);
  try {
    var data = fs.readFileSync(dataPath, { encoding: "utf8", flag: "r" });
    var lineList: Array<String>;
    if (data.includes("\r\n")) {
      lineList = data.split("\r\n");
    } else {
      lineList = data.split("\n");
    }

    lineList.forEach((line) => {
      var items = line.split(delimiter);
      var item = items[0];
      item = item.trim();
      if (item.length > 0) {
        action(item);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
