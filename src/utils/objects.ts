import { IntObject } from 'common/interfaces/others';
import { isEmpty } from 'utils/others';

// @parameter -> Object
// Returns object's empty properties

export const getEmptyFields = (object: IntObject): unknown[] => {
  const keysValues = Object.entries(object);
  const empty: unknown[] = [];

  keysValues.forEach(item => {
    if (isEmpty(item[1])) {
      empty.push(item[0]);
    }
  });

  return empty;
};
