import React, { useEffect, useState, useCallback, useContext } from 'react';
import AWS from "aws-sdk";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.css'
import Modal1 from '../Modal/Modal1';
import CredentialsContext from '../../context/CredentialsContext';
// import ProviderModal from '../Modal/ProviderModal';
import { fetchAuthServer } from '../../services';
// import { ColumnDirective, ColumnsDirective, TreeGridComponent } from '@syncfusion/ej2-react-treegrid';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import ObjectTable from '../ObjectTable/ObjectTable';

// import json from './data'

//aws config
const awsConfig = (accessKey, secretKey) => {
    AWS.config.update({
        region: 'us-east-1',
        credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
        },
    });

}

//only root user can set
// let localProvidersJSON = [
//     { name: 'Google', idKeyName: 'gp_app_id', secretKeyName: 'gp_secret', serviceName: 'Google' },
//     { name: 'AWS', idKeyName: 'aws_access_key', secretKeyName: 'aws_secrete_key', serviceName: 'AWS' },
//     { name: 'Microsoft', idKeyName: 'ms_id', secretKeyName: 'ms_secret', serviceName: 'Microsoft' }
// ]

const Dashboard = () => {
    const [apps, setApps] = useState([]);
    const [appData, setAppData] = useState([]);
    const [selectedAppId, setSelectedAppId] = useState('');
    const [selectedAppSecret, setSelectedAppSecret] = useState('');
    const [showAppDataFlag, setShowAppDataFlag] = useState(false);
    const [providers, setProviders] = useState([]);
    const [appDataBuffer, setAppDataBuffer] = useState(null);
    const [editAppDataFlag, setEditAppDataFlag] = useState(false);
    const [modal1Flag, setModal1Flag] = useState(false);
    const [createAppName, setCreateAppName] = useState('');
    const [loading, setLoading] = useState(false)
    const { aws, app } = useContext(CredentialsContext);
    //get parameter from aws
    const fetchProviders = useCallback(async () => {
        const response = await fetchAuthServer(selectedAppId, selectedAppSecret, 'https://auth.virtusasystems.com/v1/providers')
        // const response = await fetchAuthServer('app:para', 'Z8O6DXSTrY0Yyhgvs3lPbytFTprijIUIPXAndJbLUWnaUYWG/B81xw==', 'https://auth.virtusasystems.com/v1/providers')
        const json = await response.json();
        if (response.ok) {
            setProviders(json.items[0].value)
        }
        else {

        }
    }, [selectedAppId, selectedAppSecret])
    // [app.accessKey, app.secretKey]

    useEffect(() => {
        awsConfig(aws.accessKey, aws.secretKey)
        fetchProviders();
    }, [aws.accessKey, aws.secretKey, fetchProviders])

    let ssm = new AWS.SSM();

    //fetch all apps
    const fetchApps = useCallback(async () => {
        setLoading(true);
        if (app.accessKey === 'app:para') {
            const response = await fetchAuthServer(app.accessKey, app.secretKey, 'https://auth.virtusasystems.com/v1/apps')
            const json = await response.json();
            if (response.ok) {
                let appsArray = json.items;
                setApps(appsArray);
                console.log(json.items)
            }
            else {
            }
        }
        else {
            setApps([{ id: app.accessKey }])
        }
        setLoading(false);

    }, [app.accessKey, app.secretKey])

    //create app handler
    const createAppHandler = async (e) => {
        e.preventDefault();
        if (createAppName === '') {
            toast.error("App name can't be empty")
            return;
        }
        setLoading(true);
        const response = await fetchAuthServer(app.accessKey, app.secretKey, `https://auth.virtusasystems.com/v1/_setup/${createAppName}`)
        const json = await response.json();
        if (response.ok) {
            console.log(json)
            setLoading(false);
            toast.success(`App Created Successfully`);
            fetchApps();
            //add token in parameter store
            let params = {
                Name: `auth-${json.accessKey.split(':')[1]}-token`,
                Value: json.secretKey,
                Type: "SecureString",
                Overwrite: true,
            };
            ssm.putParameter(params, function (err, data) {
                if (err) {
                    toast.error(`${err.message}`);
                    setLoading(false);
                    return;
                }
                else console.log(data);
            });
            setCreateAppName('');
        }
        else {
            setLoading(false);
            toast.error('Error Occurred')
            console.log(response)
        }
    }

    const copyAppSecretKey = async (e, id) => {
        let name = `auth-${id.split(':')[1]}-token`;
        const params = {
            Names: [name],
            WithDecryption: true || false,
        };
        ssm.getParameters(params, async (err, result) => {
            if (result) {
                if (result.InvalidParameters.length) {
                    setLoading(false);
                    toast.error(`This key doesn't exist 'auth-${id.split(':')[1]}-token' in aws parameter store`);
                    return;
                }
                navigator.clipboard.writeText(result.Parameters[0].Value);
                toast.success("secret key copied successfully")
            }
            else {

                toast.error(err.message)
            }

        }
        );
    }


    //add data 
    const addAppDataHandler = async (e, id) => {
        setLoading(true);
        e.preventDefault();
        setAppDataBuffer(null)
        setAppData([])
        setSelectedAppId(id);
        let name = `auth-${id.split(':')[1]}-token`;
        const params = {
            Names: [name],
            WithDecryption: true || false,
        };
        ssm.getParameters(params, async (err, result) => {
            if (result) {
                if (result.InvalidParameters.length) {
                    setLoading(false);
                    toast.error(`This key doesn't exist 'auth-${id.split(':')[1]}-token' in aws parameter store`);
                    return;
                }
                setSelectedAppSecret(result.Parameters[0].Value);
                const response = await fetchAuthServer(id, result.Parameters[0].Value, 'https://auth.virtusasystems.com/v1/_settings/')
                const json = await response.json();
                if (response.ok) {
                    setLoading(false);
                    if (Object.keys(json).length === 0) {
                        setAppData([])
                        setSelectedAppSecret(result.Parameters[0].Value)
                        fetchProviders();
                        setModal1Flag(true);
                        setShowAppDataFlag(true);
                    }
                    else {
                        if (!json.value || Object.keys(json).length > 1) {
                            toast.info("Can't add data, Previous app data is in wrong format");
                            return;

                        }
                        setAppData(json.value);
                        setShowAppDataFlag(true);

                        setSelectedAppSecret(result.Parameters[0].Value)
                        fetchProviders();
                        setModal1Flag(true);

                    }
                }
                else {
                    setLoading(false)
                    toast.error(`Wrong Token Value 'auth-${id.split(':')[1]}-token' in aws parameter store`);
                }
            }
            else {

                toast.error(err.message)
            }

        }
        );
    }

    //show data
    const showAppDataHandler = async (e, id) => {
        if (selectedAppId === id) {
            if (showAppDataFlag) {
                setShowAppDataFlag(false);
                return;
            }
        }
        setLoading(true);
        e.preventDefault();
        console.log(id)
        let name = `auth-${id.split(':')[1]}-token`;
        const params = {
            Names: [name],
            WithDecryption: true || false,
        };
        ssm.getParameters(params, async (err, result) => {
            if (result) {
                console.log(result)
                if (result.InvalidParameters.length) {
                    setLoading(false);
                    toast.error(`This key 'auth-${id.split(':')[1]}-token' doesn't exist  in aws parameter store`);
                    return;
                }
                const response = await fetchAuthServer(id, result.Parameters[0].Value, 'https://auth.virtusasystems.com/v1/_settings/')
                const json = await response.json();
                if (response.ok) {
                    setLoading(false);
                    console.log(json)
                    if (Object.keys(json).length === 0) {
                        toast.info("Nothing To Show")
                        return;
                    }
                    if (!json.value || Object.keys(json).length > 1) {
                        toast.error("Can't show data, app data is in wrong format")
                        return;
                    }
                    if (!json.value.length) {
                        toast.info(`Nothing To Show`);
                    }
                    setAppData(json.value);
                    setSelectedAppId(id)
                    setShowAppDataFlag(true)
                }
                else {
                    toast.error(`Wrong Token Value auth-${id.split(':')[1]}-token in aws parameter store`);
                    setLoading(false);
                    // setModifiedAppData([])
                }
            }
            else {
                console.log(err)
                toast.error(err.message)
                setLoading(false)
            }
        })
    }

    //update app data with buffer
    const updateData = (newData, providerName) => {
        if (editAppDataFlag) {
            let updatedAppData = appData.filter((item) => item !== appDataBuffer)
            setAppData([
                ...updatedAppData, newData
            ])
            setEditAppDataFlag(false);
        }
        else {
            setAppData([
                ...appData, newData
            ])
        }
        newData.awsParamStoreAccessKey = `auth-${selectedAppId.split(':')[1]}-${providerName}-accesskey`
        newData.awsParamStoreSecretKey = `auth-${selectedAppId.split(':')[1]}-${providerName}-secretKey`
        setAppDataBuffer(newData);
        setModal1Flag(false);
        console.log(appData)
    }

    //save data
    const saveAppDataHandler = async (e, id) => {
        setLoading(true);
        e.preventDefault();
        if (selectedAppId !== id || !appDataBuffer) {
            toast.info("Please add something to save changes")
            setLoading(false);
            return;
        }
        let parameters = [];
        parameters.push({ name: appDataBuffer['awsParamStoreAccessKey'], value: appDataBuffer['access_key'] },);
        parameters.push({ name: appDataBuffer['awsParamStoreSecretKey'], value: appDataBuffer['secret_key'] });
        let flag = false;
        if (parameters) {
            parameters.forEach((parameter, index) => {
                let params = {
                    Name: parameter.name,
                    Value: parameter.value,
                    Type: "SecureString",
                    Overwrite: true
                };
                ssm.putParameter(params, async function (err, data) {
                    if (err) {
                        flag = true;
                        toast.error(`${err.message}`)
                        setLoading(false);
                        return;
                    }
                    else {
                        console.log(data)
                        if (index === parameters.length - 1) {
                            if (!flag) {
                                const response = await fetchAuthServer(selectedAppId, selectedAppSecret, 'https://auth.virtusasystems.com/v1/_settings/', 'PUT', { value: appData });
                                if (response.ok) {
                                    toast.success(`Changes Saved Successfully`);
                                    setAppDataBuffer(null)
                                    setLoading(false);
                                    console.log(response)
                                }
                                else {
                                    // toast.error(`${json.message}`);
                                    setLoading(false);
                                }
                            }

                        }
                    }
                });
            })
        }

    }

    //edit data
    const editAppDataHandler = async (e, id) => {
        e.preventDefault();
        let item = appData.find((e) => e.id === id)
        // setSelectedAppId(id);
        setEditAppDataFlag(true);
        setAppDataBuffer(item);
        console.log(item)
        setModal1Flag(true);

        let name = `auth-${selectedAppId.split(':')[1]}-token`;
        const params = {
            Names: [name],
            WithDecryption: true || false,
        };
        ssm.getParameters(params, async (err, result) => {
            if (result) {
                setSelectedAppSecret(result.Parameters[0].Value)
            }
        }
        )
    }

    //delete data
    const deleteAppDataHandler = async (e, id) => {
        setLoading(true);
        e.preventDefault();
        let item = appData.find((e) => e.id === id);
        let updatedAppData = appData.filter((e) => e !== item);
        setAppData(updatedAppData);
        let name = `auth-${selectedAppId.split(':')[1]}-token`;
        const params = {
            Names: [name],
            WithDecryption: true || false,
        };
        ssm.getParameters(params, async (err, result) => {
            if (result) {
                let secretkey = result.Parameters[0].Value
                var params = {
                    Names: [
                        item['awsParamStoreAccessKey'],
                        item['awsParamStoreSecretKey']
                    ]
                };
                ssm.deleteParameters(params, async function (err, data) {
                    if (err) {
                        toast.error(err.message)
                    }// an error occurred
                    else {
                        const response = await fetchAuthServer(selectedAppId, secretkey, 'https://auth.virtusasystems.com/v1/_settings/', 'PUT', { value: updatedAppData });
                        setLoading(false);
                        if (response.ok) {
                            toast.success(`Changes Saved Successfully`);
                            setAppDataBuffer(null)
                            console.log(response)
                        }
                        else {
                            // toast.error(`${json.message}`);

                        }



                    }
                });
            }
        }
        )
    }

    useEffect(() => {
        fetchApps();
    }, [fetchApps])

    useEffect(() => {
        console.log(appData)
    }, [appData])

    return (
        <>
            {/* syncfusion code */}
            {
                app.accessKey === 'app:para' &&
                <div className="row container mb-4 mt-4 text-center">
                    <div>
                        <input className="e-input me-3 ms-5" type="text" style={{ width: '500px' }} placeholder="Please enter app name" value={createAppName} onChange={(e) => { setCreateAppName(e.target.value) }} />
                        <ButtonComponent style={{ width: 'auto' }} cssClass='e-outline' onClick={createAppHandler}>Create App</ButtonComponent>
                    </div>
                </div>
            }

            {
                apps && apps.map((app) => (
                    <div key={app.id} className='row m-2 py-2 '>
                        <div className={app.id === 'app:para' ? 'root-app col-3' : 'col-3'}>
                            {app.id.split(':')[1]}
                        </div>
                        <div className="col-9 text-end">
                            <ButtonComponent style={{ marginRight: '20px' }} onClick={(e) => { copyAppSecretKey(e, app.id) }}><i class="fa-regular fa-copy"></i></ButtonComponent>
                            <ButtonComponent style={{ marginRight: '20px' }} onClick={(e) => { addAppDataHandler(e, app.id) }}>Add Data</ButtonComponent>
                            <ButtonComponent style={{ marginRight: '20px' }} onClick={(e) => { showAppDataHandler(e, app.id) }}>Show Data</ButtonComponent>
                            <ButtonComponent onClick={(e) => { saveAppDataHandler(e, app.id) }}>Save Data</ButtonComponent>
                        </div>

                        {
                            showAppDataFlag &&
                            appData && appData.length > 0 &&
                            selectedAppId === app.id &&
                            <>
                                <div className="table-div p-3">
                                    <table className="table border" >
                                        <thead>
                                            <tr>
                                                <th>Domain Name</th>
                                                <th>Provider</th>
                                                <th>Access Key</th>
                                                <th>Secret Key</th>
                                                <th>awsParamStoreAccessKey</th>
                                                <th>awsParamStoreSecretKey</th>
                                                <th>Authority</th>
                                                <th>Signin Success</th>
                                                <th>Signin Failure</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                appData.map((item) => (
                                                    <tr>
                                                        <td>{item.domain_name}</td>
                                                        <td>{item.provider}</td>
                                                        <td>{item.access_key}</td>
                                                        <td>{item.secret_key}</td>
                                                        <td>{item.awsParamStoreAccessKey}</td>
                                                        <td>{item.awsParamStoreSecretKey}</td>
                                                        <td>{item.authority}</td>
                                                        <td>{item.signin_success}</td>
                                                        <td>{item.signin_failure}</td>
                                                        <td>
                                                            <ButtonComponent style={{ marginRight: '8px' }} onClick={(e) => { editAppDataHandler(e, item.id) }}><i class="fa-solid fa-pen-to-square"></i></ButtonComponent>
                                                            <ButtonComponent onClick={(e) => { deleteAppDataHandler(e, item.id) }}><i class="fa-solid fa-trash-can"></i></ButtonComponent>
                                                        </td>
                                                    </tr>
                                                ))
                                            }

                                        </tbody>
                                    </table>
                                </div>

                            </>
                        }

                        <ObjectTable appId={app.id} ssm={ssm} toast={toast} setLoading={setLoading} />

                    </div>
                ))

            }

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            {
                loading &&
                <div className="spinner">
                    <div className="spinner-border text-secondary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            }
            {modal1Flag && <Modal1 providers={providers} updateData={updateData} flag={modal1Flag} setFlag={setModal1Flag} data={appDataBuffer} />}

            {/* {
                ProviderModalFlag && <ProviderModal flag={ProviderModalFlag} setFlag={setProviderModalFlag} providers={providers} handleSubmit={saveProviderLocally} />
            } */}

        </>
    )
}

export default Dashboard;
