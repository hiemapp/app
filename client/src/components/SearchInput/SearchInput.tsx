import InputGroup from '@/Forms/InputGroup';
import './SearchInput.scss';
import { FormEvent, useRef } from 'react';
import { Button, Icon, TextInput, Tile, palettes } from '@tjallingf/react-utils';
import { throttle } from 'lodash';
import { TextInputProps } from '@tjallingf/react-utils/dist/TextInput/TextInput';

export type SearchInputProps = TextInputProps & React.HTMLAttributes<HTMLInputElement> & {
    className?: string;
    onInput?: (value: string) => unknown;
    onSearch?: (value: string) => unknown;
    suggestions?: string[],
    inputThrottle?: number;
}

const SearchInput: React.FunctionComponent<SearchInputProps> = ({
    children,
    onInput,
    onSearch,
    inputThrottle = 400,
    suggestions,
    ...rest
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const onInputThrottled = throttle(() => {
        if(typeof onInput === 'function' && inputRef.current) {
            onInput(inputRef.current.value);
        }
    }, inputThrottle);

    const handleInput = (e: FormEvent<HTMLInputElement>) => {
        onInputThrottled();
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if(typeof onSearch === 'function' && inputRef.current) {
            onSearch(inputRef.current.value);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="SearchInput">
            <InputGroup>
                <TextInput {...rest} onInput={handleInput} forwardRef={inputRef} suffix={(
                    <Button>
                        <Icon id="magnifying-glass" size={14} />
                    </Button>
                )} />
                <Tile className="SearchInput__suggestions">
                    {suggestions && suggestions.map((sug, i) => (
                        <Button key={i} className="SearchInput__suggestion" size="sm" variant="secondary">{sug}</Button>
                    ))}
                </Tile>
            </InputGroup>
        </form>
    )
}

export default SearchInput;