type Encoding = "text" | "json";

export default function readBody(request: Request, encoding?: Encoding): Promise<JSON | string> {
  if (encoding == "text") {
    return request.text();
  }

  return request.json();
}
