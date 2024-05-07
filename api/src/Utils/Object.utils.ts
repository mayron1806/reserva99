import _ from 'lodash';
export class ObjectUtils {
  static compare(objA: object, objB: object) {
    return _.isEqual(objA, objB);
  }
}