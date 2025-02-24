import './Page.scss';
import { Container, parseColor } from '@tjallingf/react-utils';
import { FormattedMessage } from 'react-intl';
import { UseTRPCQueryResult } from '@trpc/react-query/shared';
import classNames from 'classnames';
import HomeController from '@/utils/homes/HomeController';
import { Link } from 'react-router-dom';
import VoidSvg from '@/assets/svg/undraw/void.svg?react';
import { useIntl } from 'react-intl';
import useAuth from '@/hooks/useAuth';

export interface PageProps extends React.PropsWithChildren, Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    id: string;
    titleValues?: any;
    query?: UseTRPCQueryResult<any, any>;
    plain?: boolean;
}

const Page: React.FunctionComponent<PageProps> = ({
    id,
    children,
    titleValues,
    query,
    className,
    plain = false,
    ...rest
}) => {
    const currentHome = HomeController.findCurrent();
    const { formatMessage } = useIntl();
    const { user } = useAuth();

    const renderNoDataMessage = () => {
        if(query?.data?.length) return null;

        return (
            <div className="Page__no-data-message">
                <div className="d-flex flex-column align-items-center">
                     <VoidSvg className="Page__no-data-message__svg" />
                    <h4 className="mb-1"><FormattedMessage id={`$page.${id}.noData.title`} defaultMessage={formatMessage({ id: "$page.generic.noData.title"} )} /></h4>
                    <p>
                        <FormattedMessage id={`$page.${id}.noData.message`} defaultMessage={formatMessage({ id: "$page.generic.noData.message"} )} />
                    </p>
                    {!user.isAuthenticated() && (
                        <p className="text-muted">
                            <FormattedMessage id="$page.generic.notSignedIn.message" values={{
                                signInLink: (
                                    <Link to={currentHome.scopePath('/login')}>
                                        <FormattedMessage id="$page.generic.signIn.link" />
                                    </Link>
                                )
                            }} />
                        </p>
                    )}
                </div>
            </div>
        )
    }

    const renderContent = () => {
        if(plain) return children;

        return (
            <>
                <Container className="my-4 mt-md-3">
                    <h1 className="Page__title">
                        <FormattedMessage id={`$page.${id}.title`} defaultMessage={" "} values={titleValues} />
                    </h1>
                </Container>
                <main className="Page__content h-100">
                    {children}
                    {query && !query.isLoading && renderNoDataMessage()}
                </main>
            </>
        )
    }

    return (
        <div {...rest} 
            className={classNames('Page d-flex flex-column h-100', className, { 'p-0': plain })}
            id={id}>
            {renderContent()}
        </div>
    )
}

export default Page;