import { ReactNode, FunctionComponent, FormEvent, useState } from 'react';
import classNames from 'classnames';

export interface IFormProps {
  children?: ReactNode;
  onSubmit?: (data: object) => any;
  onValidateFail?: () => any;
}

const Form: FunctionComponent<IFormProps> = ({ children, onSubmit, onValidateFail }) => {
  const [isValidated, setIsValidated] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    if (!form.checkValidity()) {
      setIsValidated(true);
      onValidateFail?.apply(null);
      return;
    }

    const formdata = new FormData(form);
    const data = Object.fromEntries(formdata);

    onSubmit?.apply(null, [data]);

    return false;
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={classNames('Form', { 'Form--is-validated': isValidated })}>
      {children}
    </form>
  );
};

export default Form;
