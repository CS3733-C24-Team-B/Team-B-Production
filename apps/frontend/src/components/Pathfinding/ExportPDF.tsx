import JsPDF from "jspdf";
import HTML2Canvas from "html2canvas";
import { Button } from "@mui/material";

/*
// code adapted from https://stackoverflow.com/questions/24272058/word-wrap-in-generated-pdf-using-jspdf
function addWrappedText(textDirections: string[], doc: JsPDF, textWidth: number = 6.5, fontSize: number = 12, lineSpacing: number = 0.25,
                        xPosition: number = 1, initialYPosition: number = 1, pageWrapInitialYPosition: number = 1, pageWrapMaxYPosition: number = 10) {
    doc.setFontSize(fontSize);

    let textLines: string[] = ["Text Directions", ""];

    for (let i: number = 0; i < textDirections.length; i++) {
        const textDirection: string = (i+1) + ". " + textDirections[i];
        const directionLines: string[] = doc.splitTextToSize(textDirection, textWidth);  // Split the text into lines
        textLines = textLines.concat(directionLines);
    }

    const pageHeight: number = doc.internal.pageSize.height;        // Get page height, well use this for auto-paging
    console.log(pageHeight);

    let cursorY: number = initialYPosition;

    textLines.forEach((lineText: string) => {
        if (cursorY > pageWrapMaxYPosition) { // Auto-paging
            doc.addPage();
            cursorY = pageWrapInitialYPosition;
        }
        doc.text(lineText, xPosition, cursorY);
        cursorY += lineSpacing;
    });
}*/

async function exportPDF(
  map: HTMLElement,
  textDirections: string[],
): Promise<void> {
  try {
    console.log(map);
    console.log(textDirections);
    const mapImage: HTMLCanvasElement = await HTML2Canvas(map);
    const doc: JsPDF = new JsPDF("portrait", "in", [8.5, 11]);
    doc.setFont("Helvetica");
    doc.addImage(mapImage, 0, 0, 10, 6.8);

    // addWrappedText(textDirections, doc);

    doc.save("HospitalKioskDirections.pdf");
  } catch (error) {
    console.error(error);
  }
}

export const ExportPDF = (data: {
  map: HTMLElement;
  textDirections: string[];
}) => {
  return (
    <Button
      size="small"
      variant="outlined"
      onClick={() => exportPDF(data.map, data.textDirections)}
      style={{
        color: "#012D5A",
        borderColor: "#012D5A",
        fontSize: "1.5vh",
        width: "100%",
      }}
    >
      Export Directions
    </Button>
  );
};
