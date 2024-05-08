import { isValidElement, cloneElement } from 'react';

export interface IFormInputWrapperProps {
  children?: React.ReactNode;
  ref?: any;
  overrideProps: object;
}

const FormInputWrapper: React.FunctionComponent<IFormInputWrapperProps> = ({ children, overrideProps }) => {
  if (!isValidElement(children)) return null;

  return cloneElement(children, overrideProps as React.Attributes);
};

export default FormInputWrapper;
