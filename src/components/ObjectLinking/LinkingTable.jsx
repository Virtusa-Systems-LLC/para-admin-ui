import React, { useEffect, useState } from 'react'

const LinkingTable = ({ selectedObject1childrens, selectedObject2childrens, setParent, setChildren, children, parent, linkedChildren, setDeLinkedChildren, deLinkedChildren }) => {
    const [table1Header, settable1Header] = useState(null);
    const [table2Header, settable2Header] = useState(null);
    useEffect(() => {
        if (selectedObject1childrens && selectedObject1childrens.length) {
            let h = Object.keys(selectedObject1childrens[0]);
            let uh = [];
            h.forEach((e) => {
                if (e === 'name' || e === 'email' || e === 'id') {
                    uh.push(e)
                }
                else {
                }
            })
            settable1Header(uh);

        }

    }, [selectedObject1childrens])


    useEffect(() => {
        if (selectedObject2childrens && selectedObject2childrens.length) {
            let h = Object.keys(selectedObject2childrens[0]);
            let uh = [];
            h.forEach((e) => {
                if (e === 'name' || e === 'email' || e === 'id') {
                    uh.push(e)
                }
                else {
                }
            })
            settable2Header(uh);
        }
    }, [selectedObject2childrens])


    const selectChildren = (e, item) => {

        let isLinkedChild = false;

        linkedChildren.forEach((lc) => {

            if (lc.id === item.id) {
                isLinkedChild = true;
                if (!e.target.checked) {
                    console.log('delinked+')
                    setDeLinkedChildren((prev) => (
                        [
                            ...prev,
                            item
                        ]
                    ))

                }
                else {
                    let dchl = deLinkedChildren.filter((ch) => {
                        return ch.id !== item.id
                    })
                    setDeLinkedChildren(dchl);


                }
            }
        })
        if (!isLinkedChild) {
            if (e.target.checked) {
                setChildren((prev) => (
                    [
                        ...prev,
                        item
                    ]
                ))
            }
            else {
                let uc = children.filter((child) => {
                    return child.id !== item.id
                })
                setChildren(uc);
            }
        }
    }

    const selectParent = (e, item) => {
        setChildren([]);
        let elem = document.getElementById(item.id);
        document.querySelectorAll('.parent').forEach((e) => {
            if (e !== elem)
                e.classList.remove('table-light')
        });

        elem.classList.toggle('table-light')
        if (elem.classList.contains('table-light')) {
            setParent(item);
        }
        else {
            setParent(null);
        }
    }

    useEffect(() => {
        console.log(parent)
        console.log(children)
        console.log(linkedChildren, 'lc')
        console.log(deLinkedChildren, 'dc')

    }, [parent, children, linkedChildren, deLinkedChildren])

    useEffect(() => {
        document.querySelectorAll('.children').forEach((e) => {
            e.checked = false;
        })
        linkedChildren.forEach((child) => {
            let elem = document.getElementById(child.id);
            if (elem)
                elem.checked = true;
        })
    }, [linkedChildren])

    return (
        <>
            <div className="container-fluid">
                <div className="row" >
                    <div className="col-6">
                        <div className="p-3 rounded shadow-sm border" style={{ height: '400px', overflow: 'auto' }} >
                            <table class="table " >
                                <thead>
                                    <tr>
                                        {
                                            table1Header && table1Header.map((name) => (
                                                <th>{name}</th>
                                            ))
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        selectedObject1childrens && selectedObject1childrens.map((item) => {
                                            return <>
                                                <tr className='parent' key={item.id} onClick={(e) => { selectParent(e, item) }} id={item.id}>
                                                    {item.id && <td>{item.id}</td>}
                                                    {item.name && <td>{item.name}</td>}
                                                    {item.email && <td>{item.email}</td>}
                                                </tr>
                                            </>

                                        })
                                    }

                                </tbody>
                            </table>

                        </div>
                    </div>
                    <div className="col-6">
                        <div className='shadow-sm border p-3 rounded' style={{ height: '400px', overflow: 'auto' }}>
                            <table class="table ">
                                <thead>
                                    <tr>
                                        {
                                            table2Header && table2Header.map((name) => (
                                                <th>{name}</th>
                                            ))
                                        }
                                        < th> checkbox</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        selectedObject2childrens && selectedObject2childrens.map((item) => (
                                            <tr key={item.id}>
                                                {item.id && <td>{item.id}</td>}
                                                {item.name && <td>{item.name}</td>}
                                                {item.email && <td>{item.email}</td>}
                                                <td className='text-center ' > <input className='children' id={item.id} type="checkbox" style={{ cursor: 'pointer' }} onChange={(e) => { selectChildren(e, item) }} /></td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default LinkingTable
