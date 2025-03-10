import Modal from '@/components/Modal';
import { ModalProps } from '@/components/Modal/Modal';
import { Box, Button } from '@tjallingf/react-utils';

export interface FlowWorkspaceMenuProps extends React.PropsWithChildren, Omit<ModalProps, 'content'|'isOpen'> {
    content: FlowWorkspaceMenuContent
}

export interface FlowWorkspaceMenuContent {
    options: any[];
    show: boolean;
}

const FlowWorkspaceMenu: React.FunctionComponent<FlowWorkspaceMenuProps> = ({
    content,
    ...rest
}) => {
    return (
        <Modal {...rest} isOpen={content?.show}>
            {Array.isArray(content?.options) && (
                <Box direction="column" className="w-100">
                    {content?.options.map(opt => {
                        return (
                            <Button variant="secondary"></Button>
                        )
                    })}
                </Box>
            )}
        </Modal>
    )
}

export default FlowWorkspaceMenu;