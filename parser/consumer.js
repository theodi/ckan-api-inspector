import _ from "lodash";

export default class Consumer {

  constructor() {
    this.contents = {};
    this.count = 0;
  }

  populate(context, contents) {

    if (_.isString(contents)) {
      contents = silentJSONParser(contents);
    }

    if (_.isArray(contents)) {
      assignDefault(context, "list", {});
      occurred(context.list);
      // all objects in an array that contain a key and value
      // are transformed and processed as keys
      let [keys, list] = _.partition(contents, hasKeyValue);
      if (keys.length) {
        let object = _.object(_.pluck(keys, "key"), keys);
        this.populate(context, object);
      }
      _.each(list, (value) => {
        this.populate(context.list, value);
      });
    } else if (_.isObject(contents)) {
      assignDefault(context, "keys", {});
      _.each(contents, (value, key) => {
        assignDefault(context.keys, key, {});
        occurred(context.keys[key]);
        this.populate(context.keys[key], value);
      });
    } else if (!context.too_many_values) {
      assignDefault(context, "values", []);
      if (context.values.length > 50) {
        context.too_many_values = true;
      } else {
        this.populateValue(context.values, contents);
      }
    }
  }

  populateValue(values, value) {
    let result = _.findWhere(values, { value });
    if (!result) {
      result = { value };
      values.push(result);
    }
    return occurred(result);
  }

  consume(contents) {
    this.populate(this.contents, contents);
    this.count += 1;
  }

  toJSON() {
    return {
      count: this.count,
      result: this.contents
    };
  }
}

function hasKeyValue(obj) {
  return _.isObject(obj) &&
         _.has(obj, "key") &&
         _.has(obj, "value");
}

function assignDefault(obj, key, value) {
  if (obj[key] === undefined) {
    obj[key] = value;
  }
  return obj;
}

function silentJSONParser(json) {
  try {
    return JSON.parse(json);
  } catch(e) {
    return json;
  }
}

function occurred(obj) {
  if (_.isNumber(obj.occurs)) {
    obj.occurs += 1;
  } else {
    obj.occurs = 1;
  }
  return obj;
}
