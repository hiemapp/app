import classNames from 'classnames';
import React from 'react';
import OriginalSelect from 'react-select';
import './Select.scss';
import { TextInput } from '@tjallingf/react-utils';

export interface SelectProps extends React.PropsWithChildren, React.ComponentProps<OriginalSelect> {
    
}

const Select: React.FunctionComponent<SelectProps> = ({
    ...rest
}) => {
    return (
        <OriginalSelect
            unstyled
            className="Select"
            classNamePrefix="Select"   
            defaultValue={rest.options?.[0]}  
            classNames={{
                option: state => classNames(
                    'Button Button--variant-secondary Button--size-md',
                    { 'Button--active': state.isFocused }
                ),
                menu: () => 'rounded'
            }} 
            {...rest} />
    )
}

export default Select;