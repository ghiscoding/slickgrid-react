import { ExcelExportService } from '@slickgrid-universal/excel-export';
import { type Column, type GridOption, SlickgridReact, toCamelCase } from '../../slickgrid-react';
import { useState } from 'react';

export default function Example43() {
  const [gridCreated, setGridCreated] = useState(false);
  const [gridOptions, setGridOptions] = useState<GridOption>();
  const [columnDefinitions, setColumnDefinitions] = useState<Column[]>([]);
  const [dataset, setDataset] = useState<any[]>([]);
  const templateUrl = new URL('./data/users.csv', import.meta.url).href;
  const [uploadFileRef, setUploadFileRef] = useState('');
  const [showSubTitle, setShowSubTitle] = useState(true);

  function destroyGrid() {
    setGridCreated(false);
  }

  function handleFileImport(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const content = e.target.result;
        dynamicallyCreateGrid(content);
      };
      reader.readAsText(file);
    }
  }

  function handleDefaultCsv() {
    const staticDataCsv = `First Name,Last Name,Age,Type\nBob,Smith,33,Teacher\nJohn,Doe,20,Student\nJane,Doe,21,Student`;
    dynamicallyCreateGrid(staticDataCsv);
    setUploadFileRef('');
  }

  function dynamicallyCreateGrid(csvContent: string) {
    // dispose of any previous grid before creating a new one
    setGridCreated(false);

    const dataRows = csvContent?.split('\n');
    const colDefs: Column[] = [];
    const outputData: any[] = [];

    // create column definitions
    dataRows.forEach((dataRow, rowIndex) => {
      const cellValues = dataRow.split(',');
      const dataEntryObj: any = {};

      if (rowIndex === 0) {
        // the 1st row is considered to be the header titles, we can create the column definitions from it
        for (const cellVal of cellValues) {
          const camelFieldName = toCamelCase(cellVal);
          colDefs.push({
            id: camelFieldName,
            name: cellVal,
            field: camelFieldName,
            filterable: true,
            sortable: true,
          });
        }
      } else {
        // at this point all column defs were created and we can loop through them and
        // we can now start adding data as an object and then simply push it to the dataset array
        cellValues.forEach((cellVal, colIndex) => {
          dataEntryObj[colDefs[colIndex].id] = cellVal;
        });

        // a unique "id" must be provided, if not found then use the row index and push it to the dataset
        if ('id' in dataEntryObj) {
          outputData.push(dataEntryObj);
        } else {
          outputData.push({ ...dataEntryObj, id: rowIndex });
        }
      }
    });

    setGridOptions({
      gridHeight: 300,
      gridWidth: 800,
      enableFiltering: true,
      enableExcelExport: true,
      externalResources: [new ExcelExportService()],
      headerRowHeight: 35,
      rowHeight: 33,
    });

    setDataset(outputData);
    setColumnDefinitions(colDefs);
    setGridCreated(true);
  }

  function toggleSubTitle() {
    setShowSubTitle(!showSubTitle);
    const action = !showSubTitle ? 'remove' : 'add';
    document.querySelector('.subtitle')?.classList[action]('hidden');
  }

  return (
    <div id="demo-container" className="container-fluid">
      <h2>
        Example 43: Dynamically Create Grid from CSV / Excel import
        <span className="float-end font18">
          see&nbsp;
          <a target="_blank"
            href="https://github.com/ghiscoding/slickgrid-react/blob/master/src/examples/slickgrid/Example43.tsx">
            <span className="mdi mdi-link-variant"></span> code
          </a>
        </span>
        <button
          className="ms-2 btn btn-outline-secondary btn-sm btn-icon"
          type="button"
          data-test="toggle-subtitle"
          onClick={() => toggleSubTitle()}
        >
          <span className="mdi mdi-information-outline" title="Toggle example sub-title details"></span>
        </button>
      </h2>

      {showSubTitle && <div className="subtitle">
        Allow creating a grid dynamically by importing an external CSV or Excel file. This script demo will read the CSV file and will
        consider the first row as the column header and create the column definitions accordingly, while the next few rows will be
        considered the dataset. Note that this example is demoing a CSV file import but in your application you could easily implemnt
        an Excel file uploading.
      </div>}

      <div>A default CSV file can be download <a id="template-dl" href={templateUrl}>here</a>.</div>

      <div className="d-flex mt-5 align-items-end">
        <div className="file-upload" style={{ maxWidth: '300px' }}>
          <label htmlFor="formFile" className="form-label">Choose a CSV file…</label>
          <input className="form-control" type="file" data-test="file-upload-input" value={uploadFileRef} onChange={($event) => handleFileImport($event)} />
        </div>
        <span className="mx-3">or</span>
        <div>
          <button id="uploadBtn" data-test="static-data-btn" className="btn btn-outline-secondary" onClick={() => handleDefaultCsv()}>
            Use default CSV data
          </button>
          <button className="btn btn-outline-danger ms-1" onClick={() => destroyGrid()}>Destroy Grid</button>
        </div>
      </div>

      <hr />

      <div className="grid-container-zone">
        {gridCreated &&
          <SlickgridReact
            gridId="grid43"
            columnDefinitions={columnDefinitions}
            gridOptions={gridOptions}
            dataset={dataset}
          />}
      </div>
    </div >
  )
}
