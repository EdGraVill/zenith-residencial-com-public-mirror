import assert from '@/utils/assert';
import type { Attributes, ComponentType, ReactNode } from 'react';
import { Children, cloneElement, isValidElement } from 'react';
import { getEnvSafe } from './safe';

export function filterChildrenOfType(
  children: ReactNode,
  validTypes: (ComponentType | [type: ComponentType, typeName: string])[],
  safe = getEnvSafe(),
) {
  const validTypesArray: ComponentType[] = validTypes.map((type) => (Array.isArray(type) ? type[0] : type));

  return Children.toArray(children).filter((child) => {
    try {
      assert(isValidElement(child), () => new Error('Invalid child'));

      if (validTypesArray.some((type) => child.type === type)) {
        return true;
      } else {
        throw new Error('Invalid child type');
      }
    } catch (error) {
      if (safe) {
        console.log(error);
        return false;
      }

      throw error;
    }
  });
}

export function filterOnlyOneChildrenOfType(
  children: ReactNode,
  validTypes: (ComponentType | [type: ComponentType, typeName: string])[],
  safe = getEnvSafe(),
) {
  const finds = Array.from({ length: validTypes.length }, () => false);

  const allowedChildren = filterChildrenOfType(children, validTypes, safe).filter((child) => {
    try {
      assert(isValidElement(child), () => new Error('Invalid child'));

      const typeIx = validTypes.findIndex((type) =>
        Array.isArray(type) ? child.type === type[0] : child.type === type,
      );
      const validType = validTypes[typeIx];
      const typeName = Array.isArray(validType) ? validType[1] : validType.name;

      if (finds[typeIx]) {
        throw new Error(`Only one child of type ${typeName} is allowed`);
      }

      finds[typeIx] = true;
      return true;
    } catch (error) {
      if (safe) {
        console.log(error);
        return false;
      }

      throw error;
    }
  });

  return allowedChildren;
}

export function injectPropsToAllValidChildren<P extends Partial<P> & Attributes>(children: ReactNode, props: P) {
  return Children.map(children, (child) => {
    try {
      assert(isValidElement<P>(child));

      return cloneElement(child, props);
    } catch (error) {}
  });
}
