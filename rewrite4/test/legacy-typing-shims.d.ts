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

declare module "comb" {
  const value: any;
  export default value;
}

declare module "form-urlencoded" {
  const value: any;
  export default value;
}
declare module "oauth" {
  const value: any;
  export = value;
}
