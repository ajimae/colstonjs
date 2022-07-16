import http from "k6/http";
import { check } from "k6";

export let options = {
  vus: 100,
  duration: "10s"
};

export default function() {
  let res = http.get("http://127.0.0.1:8000/");
  check(res, {
    "success": (r) => r.status == 200
  });
};
