function parse(url: string): string {
  let i, j = 0;
  let str: string = "";
  let isQuery: boolean = false;
  const delimiters: Array<string> = [":", "?", "&"];
  for (i = 0; i < url.length; i++) {
    const c = url.charAt(i);
    isQuery = url.charAt(i) === "&" || url.charAt(i) === "?";
    if (delimiters.indexOf(c) > -1) {
      // eat all characters
      let param = "";
      for (j = (i + 1); j < url.length; j++) {
        if (/\w/.test(url.charAt(j))) {
          param += url.charAt(j);
        } else {
          break;
        }
      }

      if (isQuery) {
        str += `([?&]${param}=([^&]+))`;
      } else {
        str += `(?<${param}>\\w+)`;
      }
      i = j - 1;

    } else {
      str += c;
    }
  }

  /** 
   * TODO:
   * fix issue with route not matching exact value
  */
  if (isQuery) {
    return str;
  }

  // add end border to query string
  str += "$";
  return str
}

export default parse;
