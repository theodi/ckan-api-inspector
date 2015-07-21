import "colors";
import _ from "lodash";
import Q from "q";
import Consumer from "./consumer";
import getJSON from "./getJSON";

export default class Parser {

  constructor({ url, limit }) {
    this.url = url;
    this.limit = limit;
    this.consumer = new Consumer();
  }

  getIds() {
    return getJSON(`${this.url}/api/3/action/package_list`).then(json => {
      let results = shuffle(json.result);
      return this.limit > 0 ? results.slice(0, this.limit) : results;
    });
  }

  parseAll() {
    return this.getIds().then(ids => {
      console.log(`Processing ${ids.length} datasets from ${this.url}`.bold);
      let requests = _.map(ids, id => getJSON(`${this.url}/api/2/rest/package/${id}`).then(result => {
        console.log(`received ${id}`.green);
        this.consumer.consume(result);
        return result;
      }, error => {
        console.log(`failed ${id}`.red, error);
        return error;
      }));
      return Q.allSettled(requests).then(() => this.consumer.toJSON());
    });
  }
}

// From: http://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  var m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}
