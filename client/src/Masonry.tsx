import { ReactNode, FunctionComponent } from 'react';
import ReactMasonry from 'react-masonry-css';
import classNames from 'classnames';
import '@/styles/components/Masonry.scss';

export interface MasonryProps {
  children?: ReactNode;
  className?: string;
  breakpointCols?: number | { default: number; [key: number]: number } | { [key: number]: number };
  columnClassName?: string;
}

const Masonry: FunctionComponent<MasonryProps> = ({ children, className, ...rest }) => {
  return (
    <ReactMasonry {...rest} className={classNames('Masonry row g-2', className)} columnClassName="Masonry__column">
      {children}
    </ReactMasonry>
  );
};

export default Masonry;
