import { useState, FunctionComponent } from 'react';
import { Container, Button, TextInput, PasswordInput, Box, Page } from '@tjallingf/react-utils';
import FormField from '@/components/forms/FormField';
import Form from '@/components/forms/Form';
import { FormattedMessage, useIntl } from 'react-intl';
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router';
import { trpc } from '@/utils/trpc/trpc';
import HomeController from '@/utils/homes/HomeController';
import { Link } from 'react-router-dom';

const Login: FunctionComponent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const login = trpc.auth.login.useMutation();
    const home = HomeController.findCurrent();

    const auth = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (data: any) => {
        setIsLoading(true);
        login.mutate(data, {
            onSuccess: body => {
                if(typeof body?.auth?.token === 'string') {
                    HomeController.findCurrent().userdata.token = body.auth.token;
                    HomeController.writeHomesToStorage();
                }

                auth.refetch().then(() => {
                    setIsLoading(false);
                    navigate(home.scopePath('/devices'));
                });
            },
            onError: (err: any) => {
                setIsLoading(false);
            }
        });
    };

    return (
        <Page id="Login">
            <Container>
                {HomeController.isNativeApp() && (
                    <p>
                        <FormattedMessage id="@main.login.home.currentHome.message" values={home.metadata as any} tagName="span" />
                        <span> </span> 
                        <Link to="/setup/homes">
                            <FormattedMessage id="@main.login.home.changeHome.link" values={home.metadata as any} tagName="span" />
                        </Link>
                    </p>
                )}
                <Form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <FormField name="username" label={<FormattedMessage id="@main.login.form.username.label" />} optional>
                            <TextInput autoComplete="username" />
                        </FormField>
                        <FormField name="password" label={<FormattedMessage id="@main.login.form.password.label" />} optional>
                            <PasswordInput autoComplete="current-password" revealable />
                        </FormField>
                    </div>
                    <Box align="center" gutterX={3}>
                        <Button size="lg" loading={isLoading}>
                            <FormattedMessage id="@main.login.form.submit.label" />
                        </Button>
                        <Link to={home.scopePath('/login/reset-password')}>
                            <FormattedMessage id="@main.login.resetPassword.link" />
                        </Link>
                    </Box>
                </Form>
            </Container>
        </Page>
    );
};

export default Login;
