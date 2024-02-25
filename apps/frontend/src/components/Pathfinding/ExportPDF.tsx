import JsPDF from "jspdf";
import {Button} from "@mui/material";

async function exportPDF(textDirections: HTMLElement): Promise<void> {
    try {
        const newPDF = new JsPDF("portrait", "pt", "a4");
        await newPDF.html(textDirections);
        newPDF.save("HospitalKioskDirections.pdf");
    } catch (error) {
        console.error(error);
    }
}

export const ExportPDF = (data: {component: HTMLElement}) => {

    return (
        <Button size="small" variant="outlined" onClick={() => exportPDF(data.component)}
                style={{color:'#012D5A', borderColor: '#012D5A', fontSize: '1.5vh', width: '100%' }}>
            Export Directions
        </Button>
    );
};
