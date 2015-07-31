import http from "http";
import request from "request";

let pool = new http.Agent({ maxSockets: 10 });
let headers = { "User-Agent": "ckan-api-inspector-bot" };

export default function(href) {
  return new Promise(function(resolve, reject) {
    request({ uri: href, headers, pool }, function(error, response) {

      if (error) return reject(error);

      var href = response.request.uri.href;
      if (response.statusCode !== 200) {
        return reject(new Error("Resource " + href + " returned status " + response.statusCode));
      }

      try {
        resolve(JSON.parse(response.body));
      } catch(error) {
        reject(error);
      }
    });
  });
}
