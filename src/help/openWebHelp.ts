import { IJsonLoadable } from "../resources";

// This container object represents all of the normalized data extracted from help.autodesk.com/view/OARX/
export class WebHelpLibrary implements IJsonLoadable {
  dclAttributes: Dictionary<WebHelpDclAtt> = {};
  dclTiles: Dictionary<WebHelpDclTile> = {};
  objects: Dictionary<WebHelpObject> = {};
  functions: Dictionary<WebHelpFunction> = {};
  ambiguousFunctions: Dictionary<WebHelpFunction[]> = {};
  enumerators: Dictionary<string> = {};
  _jsonYear: string = "";

  get jsonCreatedWithVersionYear(): string {
    return this._jsonYear;
  }

  // consumes a JSON converted object into the WebHelpLibrary
  loadFromJsonObject(obj: object): void {
    // Issue #70, A user configured extension setting was requested by Issue #70 and deprecated the use of the embedded json year
    //            However, this was left available in case we would like to setup a unit test that insures the JSON isn't stale.
    this._jsonYear = obj["year"] ?? "2021";

    Object.keys(obj["dclAttributes"]).forEach((key) => {
      let newObj = new WebHelpDclAtt(obj["dclAttributes"][key]);
      this.dclAttributes[key] = newObj;
    });
    Object.keys(obj["dclTiles"]).forEach((key) => {
      let newObj = new WebHelpDclTile(obj["dclTiles"][key]);
      this.dclTiles[key] = newObj;
    });
    Object.keys(obj["objects"]).forEach((key) => {
      let newObj = new WebHelpObject(obj["objects"][key]);
      this.objects[key] = newObj;
    });
    Object.keys(obj["functions"]).forEach((key) => {
      let newObj = new WebHelpFunction(obj["functions"][key]);
      this.functions[key] = newObj;
    });
    Object.keys(obj["ambiguousFunctions"]).forEach((key) => {
      let newLst = [];
      obj["ambiguousFunctions"][key].forEach((element) => {
        newLst.push(new WebHelpFunction(element));
      });
      this.ambiguousFunctions[key] = newLst;
    });
    this.enumerators = obj["enumerators"];
    // The obj["events"] dictionary also exists but wasn't used because we really don't have a purpose for them right now.
  }
}

// All sub-entities of the WebHelpLibrary class are catagorized by one of these contextual types. These relate to which part of the documentation generated them and
// what type of behavior or signature each of them individually represents regarding that documentation
enum WebHelpCategory {
  OBJECT = 0,
  METHOD = 1,
  PROPGETTER = 2,
  PROPSETTER = 3,
  FUNCTION = 4,
  ENUM = 5,
  DCLTILE = 6,
  DCLATT = 7,
  EVENT = 8,
}

// mostly used as decoration
interface Dictionary<T> {
  [Key: string]: T;
}

// this "Type" representation is fundemental building block for objects that derive from WebHelpEntity and
// will play an integral role to enhancing intellisense suggestions
class WebHelpValueType {
  id: string; // typically indicative of the "name" that was used in the signature area of the documentation
  typeNames: string; // Often equal to id, but could be the underlying type name of an enum or object
  primitive: string; // Always a lower case representation, but could also be a truly primitive type such as enum or object when the previous two held identifiers
  enums: string[]; // When representing an enum, this should be populated with "known" possible values and is to be used for enhancing inteli-sense
}

// Generic base type containing all the underlying data specific to making the "Open Web Help" context menu option functional
// Note that enum names are directly represented by this generic class and contain a named redirect to the help documentation that referenced them.
class WebHelpEntity {
  id: string;
  category: WebHelpCategory;
  guid: string;
  description: string;
  platforms: string;
  constructor(template: object) {
    this.category = template["category"];
    this.description = template["description"];
    this.guid = template["guid"];
    this.id = template["id"];
    this.platforms = template["platforms"];
  }
}

// While not directly accessible through OpenWebHelp function since object names aren't directly used in lisp, these do cronical what each object has for methods & properties.
// Expected to be used for future development of intellisense behaviors
class WebHelpObject extends WebHelpEntity {
  properties: string[];
  methods: string[];
  constructor(template: object) {
    super(template);
    this.methods = template["methods"];
    this.properties = template["properties"];
  }
}

// This encapsulates a single symbol signature from the official online help documentation. Anything of type function, method or property generated (at least) one of these objects.
// Note: Some "methods" contained multiple signatures and wound up being filed in WebHelpLibrary.ambiguousFunctions dictionary<key: string, signatures: WebHelpFunction[]>
// 		 An example of this is the Vla-Add
class WebHelpFunction extends WebHelpEntity {
  arguments: WebHelpValueType[];
  returnType: WebHelpValueType;
  validObjects: string[];
  signature: string;
  constructor(template: object) {
    super(template);
    this.arguments = template["arguments"];
    this.returnType = template["returnType"];
    this.signature = template["signature"];
    this.validObjects = template["validObjects"];
  }
}

// The signatures were only very mildly processed to remove irregularities, but mostly represent exactly what the official documentation provided.
// The attributes field is purely a list of normalized names. Use webHelpContainer<WebHelpLibrary>[dclAttributes][name] to query data about a specific attribute type.
class WebHelpDclTile extends WebHelpEntity {
  attributes: string[];
  signature: string;
  constructor(template: object) {
    super(template);
    this.attributes = template["attributes"];
    this.signature = template["signature"];
  }
}

// The signatures were very mildly processed to remove irregularities, but mostly represent exactly what the official documentation provided.
// The valueTypes were reigidly handled/specified by the abstraction generator
class WebHelpDclAtt extends WebHelpEntity {
  valueType: WebHelpValueType;
  signature: string;
  constructor(template: object) {
    super(template);
    this.valueType = template["valueType"];
    this.signature = template["signature"];
  }
}
