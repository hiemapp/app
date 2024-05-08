import classNames from 'classnames';
import '@/styles/components/InputGroup.scss';

export interface IInputGroupProps {
  className?: string;
  children: React.ReactNode;
}

const InputGroup: React.FunctionComponent<IInputGroupProps> = ({ children, className }) => {
  return (
    <div className={classNames('InputGroup', 'd-flex', 'flex-row', 'flex-nowrap', 'w-100', className)}>{children}</div>
  );
};

export default InputGroup;
