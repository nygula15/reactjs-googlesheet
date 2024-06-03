import { useEffect, useState } from 'react'
import axios from 'axios'; // Import Axios
import { gapi } from 'gapi-script'; //commit: third commit
//import { initializeGapiClient } from './gapiLoader';  // Adjust the import path as necessary

export default function FetchCSVData(props) {
    const [csvData, setCsvData] = useState([]);

    useEffect(() => {
        fetchCSVData();    // Fetch the CSV data when the component mounts
    }, []); // The empty array ensures that this effect runs only once, like componentDidMount

    const fetchCSVData = () => {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS2xaH_v44rwohOiw4ShUbaItfOIoZA9amSZ6lnFSopZZLyWgQR6oXELBeG9FJPL7G3hhjaO54_tVE7/pub?output=csv'; // Replace with your Google Sheets CSV file URL

        axios.get(csvUrl)    // Use Axios to fetch the CSV data
            .then((response) => {
                const parsedCsvData = parseCSV(response.data);        // Parse the CSV data into an array of objects
                setCsvData(parsedCsvData);        // Set the fetched data in the component's state
                console.log(parsedCsvData);        // Now you can work with 'csvData' in your component's state.
            })
            .catch((error) => {
                console.error('Error fetching CSV data:', error);
            });
    }

    function parseCSV(csvText) {
        const rows = csvText.split(/\r?\n/);        // Use a regular expression to split the CSV text into rows while handling '\r'
        const headers = rows[0].split(',');        // Extract headers (assumes the first row is the header row)
        const data = [];        // Initialize an array to store the parsed data
        for (let i = 1; i < rows.length; i++) {
            const rowData = rows[i].split(',');          // Use the regular expression to split the row while handling '\r'
            const rowObject = {};
            for (let j = 0; j < headers.length; j++) {
                rowObject[headers[j]] = rowData[j];
            }
            data.push(rowObject);
        }
        return data;
    }
//commit: third commit
    const handleAddRow = () => { 
        const newRow = ["6/3/2024", "Card", "145000", "Gas filled", "210", "40", "28", "23"];
        addRowToSheet(newRow);
    };
//commit: third commit
    const addRowToSheet = (newRow) => { 
        const CLIENT_ID = '1008874820082-o7vl9hs3scn7hmmrc9oj10bd8kvltt3c.apps.googleusercontent.com'; // Replace with your client ID
        const API_KEY = 'AIzaSyCqngldmrXRLz06TN9Vd7bFpGUsYfESbOM'; // Replace with your API key
        const SPREADSHEET_ID = '1JLI7TD-YlPWhPojBiDim9vg7ct8tgAFQV7XPh_rb2-0'; // Replace with your spreadsheet ID
        const RANGE = 'Sheet1'; // Replace with your sheet name

        const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
        const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

        gapi.load('client:auth2', () => {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            }).then(() => {
                gapi.auth2.getAuthInstance().signIn().then(() => {
                    const params = {
                        spreadsheetId: SPREADSHEET_ID,
                        range: RANGE,
                        valueInputOption: 'RAW',
                    };
                    const valueRangeBody = {
                        range: RANGE,
                        majorDimension: "ROWS",
                        values: [newRow],
                    };
                    gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody).then((response) => {
                        console.log(response);
                        // Refresh the data after adding the new row
                        fetchCSVData();
                    });
                });
            });
        });
    };

    return (
        <div>
            {csvData.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            {Object.keys(csvData[0]).map((key) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {csvData.map((row, index) => (
                            <tr key={index}>
                                {Object.values(row).map((value, idx) => (
                                    <td key={idx}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Loading...</p>
            )}
            <button onClick={handleAddRow}>Add Row</button> {/* commit: third commit */}
        </div>
    );
}