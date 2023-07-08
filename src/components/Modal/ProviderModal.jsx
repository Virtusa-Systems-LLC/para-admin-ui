import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
// import { DialogComponent } from '@syncfusion/ej2-react-popups';


const ProviderModal = ({ flag, setFlag, providers, handleSubmit }) => {
    const [formFields, setFormFields] = useState([]);
    const [formData, setFormData] = useState()
    useEffect(() => {
        let temp = [];
        for (let key in providers[0]) {
            temp.push({ label: key, placeholder: providers[0][key] })
        }
        setFormFields(temp);
    }, [providers])

    const onChange = (e) => {
        setFormData((prev) => (
            {
                ...prev,
                [e.target.name]: e.target.value
            }
        ))
    }
    useEffect(() => {
        console.log(formData)
    }, [formData])
    // const dialogClose = () => {
    //     setFlag(false)
    // }
    // const buttons = [
    //     {
    //         buttonModel: {
    //             content: 'ok',
    //             cssClass: 'e-flat',
    //             isPrimary: true,
    //         },
    //         click: () => {
    //             handleSubmit(formData)
    //         },
    //     },
    //     {
    //         buttonModel: {
    //             content: 'Cancel',
    //             cssClass: 'e-flat',
    //         },
    //         click: () => {
    //             setFlag(false)
    //         },
    //     },
    // ];
    return (
        <Modal show={flag} onHide={() => { setFlag(false) }}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <Form autoComplete='off'>
                    {
                        formFields &&
                        formFields.map((item, index) => (
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" key={index}>
                                <Form.Label>{item.label}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder={`e.g  ${item.placeholder}`}
                                    autoFocus
                                    name={item.label}
                                    onChange={onChange}
                                />
                            </Form.Group>
                        ))}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => { handleSubmit(formData) }}>
                    Save Local Changes
                </Button>
            </Modal.Footer>
        </Modal >

        // <DialogComponent width="400px" close={dialogClose} position={{ X: 'center', Y: '100' }} header='Set Provider' visible={flag} showCloseIcon={true} buttons={buttons}>
        //     <form autoComplete='off'>
        //         {
        //             formFields &&
        //             formFields.map((item, index) => (
        //                 // <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" key={index}>
        //                 //     <label>{item.label}</label>
        //                 //     <Form.Control
        //                 //         type="text"
        //                 //         placeholder={`e.g  ${item.placeholder}`}
        //                 //         autoFocus
        //                 //         name={item.label}
        //                 //         onChange={onChange}
        //                 //     />
        //                 // </Form.Group>
        //                 <div className="mb-3" key={index}>
        //                     <label>{item.label}</label>
        //                     <input type="text" className="e-input mt-2" name={item.label} onChange={onChange} />
        //                 </div>

        //             ))}
        //     </form>
        // </DialogComponent >
    )
}

export default ProviderModal
