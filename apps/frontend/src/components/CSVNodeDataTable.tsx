import React, {useEffect, useState} from "react";
import axios from "axios";
export default function CSVNodeDataTable(){

    const [nodeData, setNodeData] = useState([]);
    useEffect(() => {
        async function fetch() {
            const res = await axios.get("/api/nodes/read");
            console.log(res.data);
            setNodeData(res.data);
        }

        fetch().then();
    }, []);

    const arrayNode = nodeData.map(({floor, building, longName}, i) =>
        <tr key={i}>
            <td>{longName}</td>
            <td>{floor}</td>
            <td>{building}</td>
        </tr>
    );


    return (
        <table className={"tables"}>
            <thead>
            <tr>
                <th>Room Name</th>
                <th>Floor</th>
                <th>Building Name</th>
            </tr>
            </thead>
            <tbody>
            {arrayNode}
            </tbody>
        </table>
)
    ;
}

