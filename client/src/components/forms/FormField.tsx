import useComponentId from '@/hooks/useComponentId';
import FormLabel from './FormLabel';
import FormInputWrapper from '@/components/forms/FormInputWrapper';
import classNames from 'classnames';
import '@/styles/components/FormField.scss';

export interface IFormFieldProps {
  name?: string;
  label?: string | React.ReactNode;
  animatedLabel?: boolean;
  children?: React.ReactNode;
  className?: string;
  optional?: boolean;
}

const FormField: React.FunctionComponent<IFormFieldProps> = ({
  name,
  label,
  children,
  className,
  animatedLabel,
  optional = false,
}) => {
  const id = useComponentId('input');

  return (
    <div
      className={classNames(
        'FormField',
        { 'FormField--has-animated-label': animatedLabel },
        'd-flex',
        'flex-column-reverse',
        'mb-3',
        className,
      )}
    >
      <FormInputWrapper
        overrideProps={{
          id,
          name,
          className: classNames('Form__Input'),
          required: !optional,
        }}
      >
        {children}
      </FormInputWrapper>
      {label && <FormLabel htmlFor={id}>{label}</FormLabel>}
    </div>
  );
};

export default FormField;
