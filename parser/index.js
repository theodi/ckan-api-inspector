import "colors";
import Q from "q";
import _ from "lodash";
import Consumer from "./consumer";
import getJSON from "./getJSON";

export default class Parser {

  constructor({ url, limit }) {
    this.url = url;
    this.limit = limit;
    this.retries = 0;
    this.processed = 0;
    this.consumer = new Consumer();
    this.getUntilComplete = this.getUntilComplete.bind(this);
  }

  getResult(start, count) {
    let URL = `${this.url}/api/3/action/package_search?start=${start}&rows=${count}`;
    console.log(`requesting ${URL}`);
    return getJSON(URL).then(json => {
      if (!json.success) {
        throw new Error(`Search was unsuccessful for ${URL}`);
      }
      this.retries = 0;
      return json.result;
    }, error => {
      if (this.retries < 10) {
        this.retries += 1;
        console.error(error);
        console.log("Retrying in 5 seconds...");
        return Q.delay(5000).then(() => this.getResult(start, count));
      } else {
        throw error;
      }
    });
  }

  getCount() {
    return this.getResult(0,0).then(json => json.count);
  }

  parseAll() {
    return this.getCount().then(count => {
      if (this.limit > 0) this.limit = Math.min(this.limit, count);
      else this.limit = count;
      return this.getUntilComplete();
    });
  }

  getUntilComplete(json) {
    if (json) {
      this.processed += json.results.length;
      _.each(json.results, result => this.consumer.consume(result));
    }
    if (this.processed < this.limit) {
      return this.getResult(this.processed, this.limit - this.processed).then(this.getUntilComplete);
    } else {
      return this.consumer.toJSON();
    }
  }
}
