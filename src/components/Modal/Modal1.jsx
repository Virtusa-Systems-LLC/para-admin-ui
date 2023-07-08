import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

function Modal1({ updateData, flag, setFlag, providers, data }) {
    const handleClose = () => setFlag(false);
    const [domainName, setDomainName] = useState('');
    const [accessKey, setAccessKey] = useState('');
    const [providerName, setProviderName] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [modalData, setModalData] = useState(null);
    const [authority, setAuthority] = useState('');
    const [signinSuccess, setSigninSuccess] = useState('');
    const [signinFailure, setSigninFailure] = useState('');

    const onChangeProviderHandler = (e) => {
        providers.forEach((provider) => {
            if (e.target.value === provider.name) {
                setProviderName(provider.name);
            }
        })
    }

    const handleSubmit = () => {
        setModalData({
            domain_name: domainName,
            access_key: accessKey,
            secret_key: secretKey,
            provider: providerName,
            authority: authority,
            signin_success: signinSuccess,
            signin_failure: signinFailure,
            id: Date.now()
        })
    }

    useEffect(() => {
        if (data) {

            setProviderName(data.provider);
            setDomainName(data.domain_name);
            setAccessKey(data.access_key);
            setSecretKey(data.secret_key);
            setAuthority(data.authority);
            setSigninSuccess(data.signin_success)
            setSigninFailure(data.signin_failure)
        }
        else {
            if (providers.length)
                setProviderName(providers[0].name)
        }
    }, [providers, data])

    useEffect(() => {
        if (modalData !== null) {
            updateData(modalData, providerName);
        }
    }, [modalData, updateData, providerName])

    return (
        <>
            <Modal show={flag} onHide={handleClose}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="mb-3">
                            <label>Domain Name</label>
                            <input type="text" className="form-control mt-1" name="domain_name" value={domainName} onChange={(e) => { setDomainName(e.target.value) }} />
                        </div>
                        <div className='mb-3'>
                            <label >Provider</label>
                            <select className="form-select mt-1" onChange={onChangeProviderHandler}>
                                {
                                    providers &&
                                    providers.map((provider) => (
                                        <option value={provider.name}>{provider.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="mb-3">
                            <label>Access Key / Client ID</label>
                            <input type="text" className="form-control mt-1" value={accessKey} onChange={(e) => { setAccessKey(e.target.value) }} />
                        </div>
                        <div className="mb-3">
                            <label>Secret Key</label>
                            <input type="text" className="form-control mt-1" value={secretKey} onChange={(e) => { setSecretKey(e.target.value) }} />
                        </div>
                        <div className="mb-3">
                            <label>Authority</label>
                            <input type="text" className="form-control mt-1" value={authority} onChange={(e) => { setAuthority(e.target.value) }} />
                        </div>
                        <div className="mb-3">
                            <label>Sigin Success</label>
                            <input type="text" className="form-control mt-1" value={signinSuccess} onChange={(e) => { setSigninSuccess(e.target.value) }} />
                        </div>
                        <div className="mb-3">
                            <label>Sigin Failure</label>
                            <input type="text" className="form-control mt-1" value={signinFailure} onChange={(e) => { setSigninFailure(e.target.value) }} />
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleSubmit}>
                        Save Local Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Modal1;