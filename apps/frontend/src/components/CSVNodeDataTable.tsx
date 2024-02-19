import React, {useEffect, useState} from "react";
import axios from "axios";
import {Button} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {useAuth0} from "@auth0/auth0-react";
import {styled} from "@mui/material/styles";


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


export default function CSVNodeDataTable(){

    function uploadToDB() {
        console.log("Running Upload to DB");

        try {
            const formData = new FormData();
            const csvFile = document.querySelector('#myFile') as HTMLInputElement;
            if (csvFile == null) {
                console.log("imagefile should not be null...");
                return;
            }

            formData.append("csvFile", csvFile.files![0]); // Update based on backend

            getAccessTokenSilently().then((accessToken: string) => {
                axios.post('/api/nodes', formData, {
                    headers: {
                        Authorization: "Bearer " + accessToken,
                        'Content-Type': 'multipart/form-data'
                    }
                }).then();
            });
        } catch (exception) {
            console.log("post error: " + exception);
        }
    }

    const {getAccessTokenSilently} = useAuth0();
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
        <div className={"AD-TwoColumns2"}>
            <div className={"AD-TestCard2"}>
                <br/>
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
            </div>
            <div className={"AD-Card3"}>
                <p>Heading</p>
                <Button component="label" variant="contained" startIcon={<UploadFileIcon/>}
                       style={{backgroundColor: "#34AD84", margin: "8%"}}
                >
                    Upload file
                    <VisuallyHiddenInput id="myFile" type="file" onChange={uploadToDB}/>
                </Button>

            </div>

        </div>


    )
        ;
}

