import classNames from 'classnames';
import { forwardRef, cloneElement, useState, useEffect } from 'react';
import './Page.scss';
import { Container, parseColor } from '@tjallingf/react-utils';
import { FormattedMessage } from 'react-intl';

export interface PageProps extends React.PropsWithChildren, Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    id: string;
    titleValues?: any;
}

const Page = forwardRef<HTMLDivElement, PageProps>(({
    id,
    children,
    titleValues,
    ...rest
}, ref) => {
    return (
        <div className="Page d-flex flex-column h-100" id={id}>
            <Container className="my-4 mt-md-3">
                <h1 className="Page__title">
                    <FormattedMessage id={`@main.${id}.page.title`} defaultMessage={" "} values={titleValues} />
                </h1>
            </Container>
            <main className="Page__content h-100">
                {children}
            </main>
        </div>
    )
})

export default Page;