declare module "super-request" {
  type RequestResponse = {
    body: any;
    headers: Record<string, any>;
    statusCode?: number;
    text?: string;
  };

  type RequestChain = {
    [key: string]: any;
    body(payload: any): RequestChain;
    del(url: string): RequestChain;
    delete(url: string): RequestChain;
    end(callback: (err?: any, res?: RequestResponse) => void): RequestChain;
    expect(status: number, callback?: (err?: any, res?: RequestResponse) => void): RequestChain;
    get(url: string): RequestChain;
    headers(value: Record<string, any>): RequestChain;
    json(payload: any): RequestChain;
    post(url: string): RequestChain;
    put(url: string): RequestChain;
    send(payload: any): RequestChain;
    set(name: string, value: string): RequestChain;
    wait(delay: any): RequestChain;
  };

  type RequestFactory = ((endpoint: string) => RequestChain) & {
    [key: string]: any;
  };

  const value: RequestFactory;
  export default value;
}

declare module "supertest-as-promised" {
  const value: any;
  export default value;
}

declare module "extend" {
  const value: any;
  export default value;
}

declare module "moment" {
  const value: any;
  export default value;
}

declare module "comb" {
  const value: any;
  export default value;
}

declare module "chai" {
  export const expect: any;
  export const use: any;
  export const assert: any;
  export const should: any;
  const value: {
    use(plugin: any): void;
    expect: any;
    assert: any;
    should: any;
    [key: string]: any;
  };
  export default value;
}

declare module "isemail" {
  const value: any;
  export default value;
}

declare module "chai-things" {
  const value: any;
  export default value;
}

declare module "validator" {
  const value: any;
  export default value;
}

declare module "express" {
  const value: any;
  export default value;
}

declare module "form-urlencoded" {
  const value: any;
  export default value;
}

declare module "jws" {
  const value: any;
  export default value;
}

declare module "lodash.isequal" {
  const value: any;
  export default value;
}

declare module "uuid" {
  export function v4(): string;
  const value: {
    v4: typeof v4;
    [key: string]: any;
  };
  export default value;
}

declare module "oauth" {
  const value: any;
  export = value;
}

declare module "*helper.ts" {
  const value: any;
  export default value;
}

declare module "*multipartParser.ts" {
  const value: any;
  export default value;
}

declare module "*redirect.ts" {
  const value: any;
  export default value;
}

declare module "*templatingSelection.ts" {
  const value: any;
  export default value;
}

declare module "*util/requests.ts" {
  const value: any;
  export default value;
}

declare var id: any;
declare var param: any;
declare var correctResponsesPattern: any;
declare var choice: any;
declare var fillin: any;
declare var scale: any;
declare var source: any;
declare var target: any;
declare var numeric: any;
declare var other: any;
declare var steps: any;
declare var seq: any;
declare var tf: any;
declare var OAUTH: any;

declare namespace NodeJS {
  interface Global {
    OAUTH?: any;
  }
}
