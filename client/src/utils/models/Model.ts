export interface SerializedProps {
    id: number;
    [key: string]: any;
}

export default class Model<TSerializedProps extends SerializedProps = SerializedProps> {
    id: number;
    props: TSerializedProps;

    constructor(props: TSerializedProps) {
        this.props = props;
        this.id = props.id;

        return this;
    }

    getProps(): TSerializedProps {
        return this.props;
    }

    getProp(key: string): any {
        return this.getProps()[key];
    }

    exists() {
        return this.props != undefined;
    }
}
