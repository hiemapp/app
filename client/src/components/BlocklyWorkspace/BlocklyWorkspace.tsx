import React, { useRef, useEffect } from 'react';
import * as Blockly from 'blockly';
import classNames from 'classnames';
import { memo } from 'react';
import './BlocklyWorkspace.scss';

// Blockly.dialog.setPrompt((p1, p2) => {
//     console.log(p1, p2);
// })

export interface IBlocklyWorkspaceProps extends React.HTMLAttributes<HTMLDivElement> {
    injectOptions?: Blockly.BlocklyOptions;
    onInject?: (workspace: Blockly.WorkspaceSvg) => void;
}

const BlocklyWorkspace: React.FunctionComponent<IBlocklyWorkspaceProps> = memo(({
    injectOptions,
    className,
    onInject,
    ...rest
}) => {
    const divRef = useRef(null);

    useEffect(() => {
        if (!divRef.current) {
            throw new Error('Failed to inject Blockly, ref is invalid..');
        }

        try {
            const workspace = Blockly.inject(divRef.current, injectOptions);
            onInject?.(workspace);
        } catch(err) {
            console.error(err);
        }
    }, []);
    
    return <div {...rest} ref={divRef} className={classNames('BlocklyWorkspace', className)}></div>;
}, () => true);

export default BlocklyWorkspace;
