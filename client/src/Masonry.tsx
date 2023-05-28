import { ReactNode, FunctionComponent } from 'react';
import ReactMasonry from 'react-masonry-css';
import '@/styles/components/Masonry.scss';

export interface IMasonryProps {
  children?: ReactNode;
  className?: string;
  breakpointCols?: number | { default: number; [key: number]: number } | { [key: number]: number };
  columnClassName?: string;
}

const Masonry: FunctionComponent<IMasonryProps> = ({ children, ...rest }) => {
  return (
    <ReactMasonry {...rest} className="Masonry d-flex flex-row align-items-start g-2" columnClassName="Masonry__column">
      {children}
    </ReactMasonry>
  );
};

export default Masonry;
