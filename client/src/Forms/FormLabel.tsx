import { ReactNode, FunctionComponent } from 'react';
import '@/styles/components/FormLabel.scss';

export interface IFormLabelProps {
  children?: ReactNode;
  htmlFor?: string;
}

const FormLabel: FunctionComponent<IFormLabelProps> = ({ children, htmlFor }) => {
  return (
    <label className="FormLabel mb-1" htmlFor={htmlFor}>
      {children}
    </label>
  );
};

export default FormLabel;
