import { useState, FunctionComponent } from 'react';
import { Container, Button, TextInput, PasswordInput, Box, Page } from '@tjallingf/react-utils';
import FormField from '@/Forms/FormField';
import Form from '@/Forms/Form';
import { FormattedMessage } from 'react-intl';
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router';
import { trpc } from '@/utils/trpc';

const Login: FunctionComponent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const login = trpc.auth.login.useMutation();

    const { refresh } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (data: any) => {
        setIsLoading(true);
        login.mutate(data, {
            onSuccess: () => {
                refresh().then(() => {
                    setIsLoading(false);
                    navigate('/devices');
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
                <Form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <FormField name="username" label={<FormattedMessage id="@global.auth.username" />} optional>
                            <TextInput autoComplete="username" />
                        </FormField>
                        <FormField name="password" label={<FormattedMessage id="@global.auth.password" />} optional>
                            <PasswordInput autoComplete="current-password" revealable />
                        </FormField>
                    </div>
                    <Box align="center" gutterX={3}>
                        <Button size="lg" loading={isLoading}>
                            <FormattedMessage id="@global.actions.login" />
                        </Button>
                        <FormattedMessage id="login.page.forgotPasswordButton.label" />
                    </Box>
                </Form>
            </Container>
        </Page>
    );
};

export default Login;
