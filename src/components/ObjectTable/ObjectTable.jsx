import React, { useEffect, useState, useRef } from 'react'
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

import { fetchAuthServer } from '../../services';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';


const ObjectTable = ({ appId, ssm, setLoading, toast }) => {
    const [objectName, setObjectName] = useState(null);
    const [objectValue, setObjectValue] = useState(null);
    const [appSecret, setAppSecret] = useState(null);
    const [errorFlag, setErrorFlag] = useState(false)
    const jsonEditor = useRef(null);
    const onChange = async (value) => {
        setObjectName(value);
        if (value === 'none') {
            setObjectValue(null)
            return;
        }
        const response = await fetchAuthServer(appId, appSecret, `https://auth.virtusasystems.com/v1/${value}`)
        const json = await response.json();
        if (response.ok) {
            console.log(json)
            if (json.items.length > 0) {
                if (json.items[0].value) {
                    setObjectValue(json.items[0].value)
                }
            }
            else {
                setObjectValue([])
            }
        }
    }

    const saveObjectHandler = async () => {
        if (!errorFlag) {
            setLoading(true);
            if (!objectValue && !objectName)
                return;
            const response = await fetchAuthServer(appId, appSecret, `https://auth.virtusasystems.com/v1/${objectName}`, 'POST', { value: objectValue })
            const json = await response.json();
            setLoading(false);
            if (response.ok) {
                toast.success("object updated successfully");
            }
            else {
                toast.error(json.message);
                console.log(json)
            }
        }

    }

    const updateObj = (e) => {
        console.log(e)
        if (e.error) {
            setErrorFlag(true);
            toast.error(`line no. ${e.error.line} ${e.error.reason}`);
        }
        else if (Array.isArray(e.jsObject)) {
            setErrorFlag(false);
            setObjectValue(e.jsObject)
        }
        else if (typeof e.jsObject === 'object' &&
            !Array.isArray(e.jsObject)
        ) {
            setErrorFlag(true);
            toast.error(`json must be an array of objects`);
        }
        else {
            setErrorFlag(false);
            setObjectValue([])
        }

    }

    useEffect(() => {
        console.log(objectValue)
    }, [objectValue])

    useEffect(() => {
        if (appId) {
            let name = `auth-${appId.split(':')[1]}-token`;
            const params = {
                Names: [name],
                WithDecryption: true || false,
            };
            ssm.getParameters(params, async (err, result) => {
                if (result) {
                    setAppSecret(result.Parameters[0].Value);
                }
            })
        }
    }, [appId, ssm])

    return (
        <div className="row">
            <table className="table p-5 border m-3" >
                <thead>
                    <tr>
                        <th >Object Name</th>
                        <th>Object Value</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ width: '200px' }}>
                            <select className='mt-2' style={{ display: 'block', position: 'relative', width: '100%', padding: '5px' }} onChange={(e) => { onChange(e.target.value) }}>
                                <option value='none'>select object</option>
                                <option value='provider'>Provider</option>
                                <option value='scope'>Scope</option>
                                <option value='elastic'>Elastic</option>
                                <option value='dashboard'>Dashboard</option>
                                <option value='leftmenu'>Leftmenu</option>
                                <option value='topmenu'>Topmenu</option>
                                <option value='footer'>Footer</option>
                            </select>
                        </td>
                        <td>
                            {
                                objectValue &&
                                <JSONInput
                                    placeholder={objectValue}
                                    ref={jsonEditor}
                                    locale={locale}
                                    confirmGood={false}
                                    height='550px'
                                    onBlur={updateObj}
                                />
                            }
                        </td>
                        <td style={{ width: '300px' }}>


                            {
                                objectValue &&
                                <>
                                    <ButtonComponent>Format</ButtonComponent>
                                    <ButtonComponent onClick={() => { saveObjectHandler() }}>save</ButtonComponent>


                                </>
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default ObjectTable
