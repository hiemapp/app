import React, { useRef, useEffect } from 'react';
// import * as Blockly from 'blockly';
import Blockly from 'blockly/core';
import classNames from 'classnames';
import './BlocklyWorkspace.scss';

Blockly.dialog.setPrompt((p1, p2) => {
    console.log(p1, p2);
})

export interface IBlocklyWorkspaceProps extends React.HTMLAttributes<HTMLDivElement> {
    injectOptions?: Blockly.BlocklyOptions;
    onInject?: (workspace: Blockly.WorkspaceSvg) => void;
}

const BlocklyWorkspace: React.FunctionComponent<IBlocklyWorkspaceProps> = ({
    injectOptions,
    className,
    onInject,
    ...rest
}) => {
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current) {
            throw new Error('Failed to inject Blockly, ref.current is invalid.');
        }

        const workspace = Blockly.inject(ref.current, injectOptions);
        onInject?.(workspace);
    }, []);

    return <div {...rest} ref={ref} className={classNames('BlocklyWorkspace', className)}></div>;
};

export default BlocklyWorkspace;
