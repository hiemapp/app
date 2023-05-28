import React from 'react';

export interface IErrorBoundaryState {
    hasError: boolean;
}

export interface IErrorBoundary {
    fallback?: React.ReactNode;
    children?: React.ReactNode;
}

export default class ErrorBoundary<T> extends React.Component {
    declare state: IErrorBoundaryState;
    declare props: any;

    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || null;
        }

        return this.props.children;
    }
}
