import Dropdown from '@/components/Dropdown';
import DropdownItem from '@/components/DropdownItem';
import Modal, { ModalProps } from '@/components/Modal/Modal';
import FlowBlockHelper from '@/utils/flows/editor/FlowBlockHelper';
import { TextInput } from '@tjallingf/react-utils';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import Select from '@/components/Select';

export interface FlowEditorModalProps extends React.PropsWithChildren, ModalProps {
    block?: FlowBlockHelper,
    isOpen: boolean
}

const FlowEditorModal: React.FunctionComponent<FlowEditorModalProps> = ({
    block, ...rest
}) => {
    const [ format, setFormat ] = useState<FlowBlockHelper['format']>();
    const { formatMessage } = useIntl();

    useEffect(() => block && setFormat(block.format), [block]);

    function renderValueInput(input: FlowBlockHelper['format']['inputs'][number]) {
        if(input.options) {
            return (
                <Select options={input.options.map(o => ({ value: o.value, label: o.label ?? o.value+'' }))} />
            )
        }

        return <TextInput />
    }

    if(!block || !format) return null;

    return (
        <Modal {...rest} title={block.formatTitle(formatMessage)}>
            <div className="w-100">
                {format.inputs.map(input => {
                    return (
                        <div className="FlowEditorModal__input">
                            <h6 className="text-muted">
                                {block.formatInputName(input.id, formatMessage)}
                            </h6>
                            <div className="FlowEditorModal__input-value">
                                {renderValueInput(input)}
                            </div>
                        </div>
                    )
                })}
            </div>
        </Modal>
    )
}

export default FlowEditorModal;