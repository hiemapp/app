import { useRef, useState, FunctionComponent, PropsWithChildren, HTMLProps } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import './Tooltip.scss';

export interface TooltipProps extends PropsWithChildren, HTMLProps<HTMLDivElement> {
  as?: any;
  id?: string;
  message: any;
  delay?: number;
}

const Tooltip: FunctionComponent<TooltipProps> = ({ 
  as: Element = 'span', 
  id, 
  message, 
  children, 
  className, 
  delay = 750,
  ...rest 
}) => {
  let timer = useRef<any>(null);
  const [ show, setShow ] = useState(false);
  
  function handleMouseEnter() {
    timer.current = setTimeout(() => {
      setShow(true);
    }, delay);
  }

  function handleMouseLeave() {
    if(timer.current) {
      setShow(false);
      clearTimeout(timer.current);
    }
  }
  
  return (
    <Element {...rest} 
      className={classNames('Tooltip', className)} 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}>
        <span 
          className={classNames('Tooltip__message', { 'Tooltip__message--show': show })}>
            <FormattedMessage id={message} />
        </span>
      {children}
    </Element>
  );
};

export default Tooltip;
