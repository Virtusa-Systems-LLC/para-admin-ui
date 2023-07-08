import React, { useEffect, useState } from 'react'
import { fetchAPI } from '../../services';
import { ToastContainer, toast } from 'react-toastify';
import LinkingTable from './LinkingTable';


function getJWT(appid, secret) {
    var now = Math.round(new Date().getTime() / 1000);
    var sClaim = JSON.stringify({
        exp: now + 7 * 24 * 60 * 60, // expires at
        iat: now, // issued at
        nbf: now, // not valid before
        appid: appid, // app id must be present
    });
    var sHeader = JSON.stringify({ alg: "HS256", typ: "JWT" });
    return window.KJUR.jws.JWS.sign(null, sHeader, sClaim, secret);
}

const ObjectLinking = () => {
    const [bearerToken, setBearerToken] = useState(null);
    const [objectTypes, setObjectTypes] = useState(null);
    const [objectList1, setObjectList1] = useState(null);
    const [objectList2, setObjectList2] = useState(null);
    const [selectedObject1childrens, setSelectedObject1Childrens] = useState(null);
    const [selectedObject2childrens, setSelectedObject2Childrens] = useState(null);
    const [parentObjectName, setParentObjectName] = useState(null);
    const [childrenObjectName, setChildrenObjectName] = useState(null);
    const [parent, setParent] = useState(null);
    const [children, setChildren] = useState([]);
    const [linkedChildren, setLinkedChildren] = useState([]);
    const [deLinkedChildren, setDeLinkedChildren] = useState([]);

    useEffect(() => {
        let token = getJWT(
            "app:vcp-elearning-test",
            "1SN9dYSHcdjuDQz3+LrKD0ASDppzgsjXENW9U5s+FFv940VXiIHSyg=="
        );
        setBearerToken(token)
        let myHeaders = {

            "Authorization": `Bearer ${token}`
        }
        fetch("https://auth.virtusasystems.com/v1/_types", {
            method: "GET",
            headers: myHeaders
        })
            .then(res => res.json())
            .then((json) => {
                let otypes = [];
                console.log(json)
                Object.keys(json).forEach((e) => {
                    if (e !== 'votes' && e !== 'sysprops' && e !== 'webhooks' && e !== 'linkers' && e !== 'webhooks' && e !== 'translations' && e !== 'apps') {
                        otypes.push(json[e]);
                    }
                    else {
                    }
                })
                setObjectList1(otypes)
                setObjectTypes(otypes)
            });

    }, [])


    const firstObjectSelect = async (e) => {
        setParentObjectName(e.target.value)
        setParent(null);
        let otypes = objectTypes.filter((elem) => elem !== e.target.value)
        setObjectList2(otypes)
        const res = await fetchAPI(bearerToken, `https://auth.virtusasystems.com/v1/${e.target.value}`);
        const json = await res.json();
        setSelectedObject1Childrens(json.items);
        // let elements = document.querySelectorAll('.parent');
        // elements.forEach((e) => {
        //     e.classList.remove('text-success', 'border-success')
        // })
        setChildren([])

    }
    const secondObjectSelect = async (e) => {
        setChildrenObjectName(e.target.value)
        setChildren([])
        let otypes = objectTypes.filter((item) => item.name !== e.target.value)
        setObjectList1(otypes)
        const res = await fetchAPI(bearerToken, `https://auth.virtusasystems.com/v1/${e.target.value}`);
        const json = await res.json();
        setSelectedObject2Childrens(json.items);

        // let elements = document.querySelectorAll('.children');
        // elements.forEach((e) => {
        //     e.classList.remove('text-success', 'border-success')
        // })
    }

    // const onClickParent = (e, item) => {
    //     setParent(item);
    //     let elements = document.querySelectorAll('.parent');
    //     elements.forEach((e) => {
    //         e.classList.remove('text-success', 'border-success')
    //     })
    //     e.target.classList.toggle('text-success')
    //     e.target.classList.toggle('border-success')
    // }
    // const onClickChildren = (e, item) => {
    //     e.target.classList.toggle('text-success');
    //     e.target.classList.toggle('border-success');
    //     let isLinkedChild = false;
    //     linkedChildren.forEach((lc) => {
    //         let flag;
    //         if (lc.id === item.id) {
    //             isLinkedChild = true;
    //             flag = e.target.classList.contains('text-success', 'border-success');
    //             if (!flag) {
    //                 setDeLinkedChildren((prev) => (
    //                     [
    //                         ...prev,
    //                         item
    //                     ]
    //                 ))

    //             }
    //             else {
    //                 let dchl = deLinkedChildren.filter((ch) => {
    //                     return ch.id !== item.id
    //                 })
    //                 setDeLinkedChildren(dchl);


    //             }
    //         }
    //     })
    //     if (!isLinkedChild) {

    //         setChildren((prev) => (
    //             [...prev,
    //                 item]
    //         ))
    //     }
    // }

    const onClickLink = () => {
        let linkedCount = 0, unlinkedCount = 0;
        if (children && children.length && parent && parentObjectName) {
            children.forEach(async (e) => {
                linkedCount++;
                await fetchAPI(bearerToken, `https://auth.virtusasystems.com/v1/${parentObjectName}/${parent.id}/links/${e.id}`, 'POST');

            })

        }
        if (deLinkedChildren && deLinkedChildren.length && parent && parentObjectName) {
            deLinkedChildren.forEach(async (e) => {
                unlinkedCount++;
                await fetchAPI(bearerToken, `https://auth.virtusasystems.com/v1/${parentObjectName}/${parent.id}/links/${childrenObjectName}/${e.id}`, 'DELETE');
            })
        }
        if (linkedCount || unlinkedCount) {
            toast.success(`${linkedCount} objects linked, ${unlinkedCount} objects unlinked successfully!`)
            setTimeout(() => {
                window.location.reload();
            }, 3000);

        }
        else {
            toast.error(`please select parent and childrens`)
        }
    }

    useEffect(() => {
        const getChildren = async () => {
            if (parent) {
                const res = await fetchAPI(bearerToken, `https://auth.virtusasystems.com/v1/${parentObjectName}/${parent.id}/links/${childrenObjectName}?all linked/child objects`);
                const json = await res.json();
                setLinkedChildren(json.items)
                let elements = document.querySelectorAll('.children');
                json.items.forEach((child) => {
                    elements.forEach((e) => {
                        let id = e.getAttribute('data-key')
                        if (id === child.id) {
                            e.classList.add('text-success', 'border-success')
                        }
                    })
                })
            }
            else {
                setLinkedChildren([])
            }
        }
        getChildren();
    }, [parent, bearerToken, childrenObjectName, parentObjectName])


    return (
        <>
            {
                <>
                    <div className="container-fluid p-1">
                        <div className="row p-3  mx-3 rounded  mb-4">
                            <div className="col-6 ">
                                <select class="form-select" onChange={firstObjectSelect}>
                                    {
                                        objectList1 && objectList1.map((name) => (
                                            <option key={name} value={name}>{name}</option>
                                        ))
                                    }

                                </select>
                                {/* <div className="row p-3">
                                    {
                                        selectedObject1childrens && selectedObject1childrens.map((item, i) => (
                                            <div key={item.id} onClick={(e) => { onClickParent(e, item) }} style={{ cursor: "pointer" }} className="parent col-3 bg-light border rounded shadow-sm p-2 m-2 text-center">
                                                {item.name}
                                            </div>
                                        ))

                                    }
                                </div> */}
                            </div>
                            <div className="col-6 ">
                                <select class="form-select" onChange={secondObjectSelect}>
                                    {
                                        objectList2 && objectList2.map((name) => (
                                            <option key={name} value={name}>{name}</option>
                                        ))
                                    }

                                </select>
                                {/* <div className="row p-3">
                                    {
                                        selectedObject2childrens && selectedObject2childrens.map((item, i) => (
                                            <div key={item.id} data-key={item.id} onClick={(e) => { onClickChildren(e, item) }} style={{ cursor: "pointer" }} className="children col-3 bg-light border rounded shadow-sm p-2 m-2 text-center">
                                                {item.name}
                                            </div>
                                        ))


                                    }
                                </div> */}
                            </div>


                        </div>
                        {
                            <LinkingTable selectedObject1childrens={selectedObject1childrens} selectedObject2childrens={selectedObject2childrens} setParent={setParent} setChildren={setChildren} children={children} parent={parent} linkedChildren={linkedChildren} setDeLinkedChildren={setDeLinkedChildren} deLinkedChildren={deLinkedChildren} />
                        }
                        <div className="row justify-content-center my-3">
                            <div className="col-3 p-3 shadow-sm rounded d-block">
                                <button className="btn btn-success w-100" onClick={onClickLink}>
                                    link / Unlink
                                </button>

                            </div>
                        </div>
                    </div>

                </>
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
        </>
    )
}

export default ObjectLinking
