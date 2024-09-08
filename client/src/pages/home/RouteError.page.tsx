import { Container } from '@tjallingf/react-utils';
import Page from '@/components/Page';
import React from 'react';

export interface IRouteErrorProps {}

const RouteError: React.FunctionComponent<IRouteErrorProps> = ({}) => {
    return (
        <Page id="error">
            <Container>
                <span>An error occured while rendering this page. See the console for details.</span>
            </Container>
        </Page>
    );
};

export default RouteError;
