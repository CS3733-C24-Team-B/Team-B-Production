import React, {useState, useContext, createContext} from "react";
import Button from '@mui/material/Button';
import SanitizerIcon from '@mui/icons-material/Sanitizer';
import MedicationIcon from '@mui/icons-material/Medication';

const ServiceRequestContext = createContext<{
    requestType: string;
    setRequestType: React.Dispatch<React.SetStateAction<string>>;
}>({
    requestType: "",
    setRequestType: () => {
    },
});

const ServiceRequestButtons = () => {
    const [requestType, setRequestType] = useState("");

    const [sanPressed, setSanPressed] = useState(false);
    const [medPressed, setMedPressed] = useState(false);

    return (
        <ServiceRequestContext.Provider value={{requestType, setRequestType}}>

            <div className="button-container">
                {/*Sanitation Button*/}
                <Button
                    variant="outlined"
                    onClick={() => {
                        if (requestType === "sanitation") {
                            setRequestType("");
                        } else {
                            setRequestType("sanitation");
                        }

                        setSanPressed(!sanPressed);
                        setMedPressed(false);
                    }}
                    className={requestType === "sanitation" ? "selected" : ""}
                    sx={{height: '15vh'}}
                    style={{backgroundColor: sanPressed ? "lightcyan" : "white"}}
                    startIcon={<SanitizerIcon/>}
                >
                    Sanitization Request
                </Button>

                {/*Medicine Button*/}
                <Button
                    variant="outlined"
                    onClick={() => {
                        if (requestType === "medicine") {
                            setRequestType("");
                        } else {
                            setRequestType("medicine");
                        }

                        setMedPressed(!medPressed);
                        setSanPressed(false);
                    }}
                    className={requestType === "medicine" ? "selected" : ""}
                    sx={{height: '15vh'}}
                    style={{backgroundColor: medPressed ? "lightgreen" : "white"}}
                    startIcon={<MedicationIcon/>}
                >
                    Medicine Delivery
                </Button>
            </div>
        </ServiceRequestContext.Provider>
    );
};

const useServiceRequest = () => useContext(ServiceRequestContext);

export { useServiceRequest };
export default ServiceRequestButtons;

