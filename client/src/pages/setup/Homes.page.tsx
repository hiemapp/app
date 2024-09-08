import { Box, Button, TextInput, Tile } from '@tjallingf/react-utils';
import Page from '@/components/Page';
import { useState } from 'react';
import Modal from '@/components/Modal';
import Form from '@/components/forms/Form';
import { Link, useNavigate } from 'react-router-dom';
import HomeController from '@/utils/homes/HomeController';
import Home from '@/utils/homes/Home';
import { v4 as uuidv4 } from 'uuid';
import queryClient from '@/utils/queryClient';
import appState from '@/utils/appState';
import { FormattedMessage, useIntl } from 'react-intl';
import useNotifications from '@/hooks/useNotifications';
import useAuth from '@/hooks/useAuth';

const Homes: React.FunctionComponent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();
    const { formatMessage } = useIntl();
    const notifications = useNotifications();
    const auth = useAuth();

    const handleConnect = (home: Home) => {
        // Clear all query data
        queryClient.removeQueries();

        // Navigate to the home
        navigate(`/homes/${home.id}/`);

        // Refetch user data
        auth.refetch();
        
        // Store the new current home in storage for when the app restarts
        appState.setStorage('user.currentHome', home.id);
    }

    const addHome = async (data: any) => {
        setIsLoading(true);

        const home = new Home({ id: uuidv4(), baseUrl: data.baseUrl, userdata: {} });
        setTimeout(() => {
            home.fetchMetadata()
            .finally(() => {
                setIsLoading(false);
            })
            .then(() => {
                HomeController.store(home);
                setModalVisible(false);
            })
            .catch(err => {
                notifications.show({
                    message: {
                        id: '@setup.homes.addHome.connectionError.message',
                        values: {
                            baseUrl: home.baseUrl
                        }
                    }
                })
            })
        }, 600);
    }

    const homes = HomeController.index().filter(home => home.id !== 'local');

    return (
        <Page id="homes">
            <Box direction="column" align="center" justify="center" className="h-100 w-100" gutterY={3}>
                <h1><FormattedMessage id="@setup.homes.page.title"/></h1>
                <Tile className="p-4">
                    <Box direction="column" align="center">
                        <Box direction="column">
                            {homes.length > 0
                                ? (
                                    <Box direction="column" gutterY={3}>
                                        {homes.map(home => (
                                            <Box direction="row" align="center" className="w-100" key={home.id}>
                                                <Box direction="column" className="me-5">
                                                    <h6>{home.metadata.displayName}</h6>
                                                    <span className="text-muted">{home.baseUrl}</span>
                                                </Box>
                                                <Button className="ms-auto" onClick={() => handleConnect(home)}>
                                                    <FormattedMessage id="@setup.homes.actions.connect.label" />
                                                </Button>
                                            </Box>
                                        ))}
                                    </Box>
                                )
                                : (
                                    <p className="my-2">
                                        <FormattedMessage id="@setup.homes.noHomes.message" />
                                    </p>
                                )
                            }               
                            </Box>
                    </Box>     
                </Tile>
                <Link to={null!} onClick={() => setModalVisible(true)}>
                    <FormattedMessage id="@setup.homes.addHome.link"/>
                </Link>
            </Box>
            <Modal 
                isOpen={modalVisible} 
                title={formatMessage({ id: "@setup.homes.addHome.title" })}
                onRequestClose={() => setModalVisible(false)} 
                align="stretch">
                <Form onSubmit={addHome}>
                    <Box direction="column" gutterY={3}>
                        <div className="w-100">
                            <p className="mb-1">
                                <FormattedMessage id="@setup.homes.addHome.form.serverUrl.label" />
                            </p>
                            <TextInput 
                                placeholder={formatMessage({ id:"@setup.homes.addHome.form.serverUrl.placeholder" })} 
                                name="baseUrl" 
                                autoComplete="off" 
                                autoCorrect="off" 
                                autoCapitalize="off" 
                                spellCheck="false"
                                required></TextInput>
                        </div>
                        <div>
                            <Button loading={isLoading}>
                                <FormattedMessage id="@setup.homes.addHome.form.submit.label" />
                            </Button>
                        </div>
                    </Box>
                </Form>
            </Modal>
        </Page>
    )
}

export default Homes;