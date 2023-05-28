export interface MessageProps {
    id?: string,
    icon?: React.ReactElement,
    title?: React.ReactNode,
    content?: React.ReactNode
}

const Message: React.FunctionComponent<MessageProps> = ({
    icon, title, content
}) => {
    return (
        <div className="Message">
            <h3 className="Message__title">
                {title}
            </h3>
        </div>
    )
}

export default Message;