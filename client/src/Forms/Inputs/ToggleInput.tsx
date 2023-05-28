import { FunctionComponent, useState } from 'react';
import classNames from 'classnames';
import '@/styles/components/Inputs/ToggleInput.scss';

export interface IToggleInputProps {
  value?: boolean;
  onChange?(value: boolean): void;
}

const ToggleInput: FunctionComponent<IToggleInputProps> = ({ value: defaultValue, onChange }) => {
  const [value, setValue] = useState(!!defaultValue);

  const handleClick = () => {
    setValue((cur) => {
      onChange?.apply(null, [!cur]);
      return !cur;
    });
  };

  return (
    <div
      className={classNames('ToggleInput', { 'ToggleInput--enabled': value })}
      onClick={handleClick}
      role="checkbox"
      aria-checked={value}
    >
      <div className="ToggleInput__track"></div>
      <div className="ToggleInput__thumb"></div>
    </div>
  );
};

export default ToggleInput;
