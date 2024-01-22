
function readCSV(){

    const {readFile}="";
    readFile("myFile.txt", "utf8", (error, textContent) => {
        if(error){ throw error; }
        const parsedData = [];
        for(let row of textContent.split("\n")){
            const rowItems = row.split(",");
            parsedData.push(rowItems[0].toString() + rowItems[1].toString());
        }
    })
    return readFile;
}
