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
    let startText = 0;
    const doc: JsPDF = new JsPDF("portrait", "in", [8.5, 11]);
    for (let i = 0; i < map.children.length; i++) {
      doc.setFont("Helvetica");
      doc.setFontSize(24);
      doc.setLineWidth(600);
      doc.text(textDirections[startText], 1, 1);
      doc.setFontSize(12);
      doc.setLineWidth(25);
      const logo = new Image();
      logo.src = "src/images/Brigham_and_Womens_Hospital_horiz_rgb.png";
      doc.addImage(logo, "png", 7.5 - 2.175, 0.75, 2.175, 0.25);
      const mapImage: HTMLCanvasElement = await HTML2Canvas(
        map.children.item(i) as HTMLElement,
      );
      doc.addImage(
        mapImage,
        1,
        1.2,
        6.5,
        mapImage.height * (6.5 / mapImage.width),
      );
      let cursorY = mapImage.height * (6.5 / mapImage.width) + 1.45;
      for (let j = startText; j < textDirections.length; j++) {
        if (textDirections[j].startsWith("Floor") && j !== startText) {
          startText = j;
          j = textDirections.length;
        } else if (!textDirections[j].startsWith("Floor")) {
          const textDirection: string = j - i + ". " + textDirections[j];
          const directionLines: string[] = doc.splitTextToSize(
            textDirection,
            6.5,
          ); // Split the text into lines
          directionLines.map((str) => {
            doc.text(str, 1, cursorY);
            cursorY += 0.25;
          });
        }
      }
      if (i < map.children.length - 1) {
        doc.addPage();
      }
    }

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
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
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
    </div>
  );
};
