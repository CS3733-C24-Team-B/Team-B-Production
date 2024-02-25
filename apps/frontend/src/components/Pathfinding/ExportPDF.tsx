import JsPDF from "jspdf";
// import HTML2Canvas from "html2canvas";
import {Button} from "@mui/material";

// code adapted from https://stackoverflow.com/questions/24272058/word-wrap-in-generated-pdf-using-jspdf
function addWrappedText(textDirections: string[], doc: JsPDF, textWidth: number = 468, fontSize: number = 14, lineSpacing: number = 20,
                        xPosition: number = 72, initialYPosition: number = 72, pageWrapInitialYPosition: number = 72) {
    doc.setFontSize(fontSize);

    let textLines: string[] = [];

    textDirections.forEach((textDirection: string) => {
        const directionLines: string[] = doc.splitTextToSize(textDirection, textWidth);  // Split the text into lines
        textLines = textLines.concat(directionLines);
    });

    const pageHeight: number = doc.internal.pageSize.height;        // Get page height, well use this for auto-paging

    let cursorY: number = initialYPosition;

    textLines.forEach((lineText: string) => {
        if (cursorY > pageHeight) { // Auto-paging
            doc.addPage();
            cursorY = pageWrapInitialYPosition;
        }
        doc.text(lineText, xPosition, cursorY);
        cursorY += lineSpacing;
    });
}

async function exportPDF(textDirections: string[]): Promise<void> {
    try {
        console.log(textDirections);
        // const textDirectionsImage: HTMLCanvasElement = await HTML2Canvas(textDirections);
        const doc: JsPDF = new JsPDF("portrait", "pt", "a4");
        doc.setFont("Helvetica");
        // doc.addImage(textDirectionsImage, 72, 72, 288, 360);
        console.log(textDirections);

        addWrappedText(textDirections, doc);

        // const text: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
        // addWrappedText(text, doc);
        doc.save("HospitalKioskDirections.pdf");
    } catch (error) {
        console.error(error);
    }
}

export const ExportPDF = (data: {textDirections: string[]}) => {

    return (
        <Button size="small" variant="outlined" onClick={() => exportPDF(data.textDirections)}
                style={{color:'#012D5A', borderColor: '#012D5A', fontSize: '1.5vh', width: '100%' }}>
            Export Directions
        </Button>
    );
};
