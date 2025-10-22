'use client';

import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridOptions } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import { LicenseManager } from 'ag-grid-enterprise';
import { useMemo } from 'react';
import { ExcelData } from '../types/excel';

// Set license key for AG Grid Enterprise - trial key for evaluation
// Replace with your own license key for production use
LicenseManager.setLicenseKey('Using_this_AG_Grid_Enterprise_key_( AG-064434 )_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_( legal@ag-grid.com )___For_help_with_changing_this_key_please_contact_( info@ag-grid.com )___( basouzars )_is_granted_a_( Single_Application )_Developer_License_for_the_application_( nextjs-charts )_only_for_( 1 )_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_working_on_( nextjs-charts )_need_to_be_licensed___( nextjs-charts )_has_been_granted_a_Deployment_License_Add-on_for_( 1 )_Production_Environment___This_key_works_with_AG_Grid_Enterprise_versions_released_before_( 21 April 2025 )____[v3]_[01]_4Qjw1gDN2QzY0gTN0EjN5kjM5EjM3IjOiAHdwIzN3MDMyAjM9MTO0gDOxADM3gDM5MjM1MzM0YjN6EjM6czM8cDM9MDO0QDMiojIklkIs4nIzIiOiEmTis4W0YiOiI7ckJye');

interface AGGridViewProps {
  data: ExcelData;
  headers: string[];
}

export default function AGGridView({ data, headers }: AGGridViewProps) {
  const columnDefs: ColDef[] = useMemo(() => {
    return headers.map(header => ({
      field: header,
      filter: true,
      sortable: true,
      resizable: true,
      editable: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
    }));
  }, [headers]);

  const defaultColDef: ColDef = useMemo(() => ({
    flex: 1,
    minWidth: 100,
    filter: true,
    sortable: true,
    resizable: true,
  }), []);

  const gridOptions: GridOptions = useMemo(() => ({
    rowGroupPanelShow: 'always',
    pivotPanelShow: 'always',
    sideBar: {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
        },
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
        },
      ],
    },
    statusBar: {
      statusPanels: [
        { statusPanel: 'agTotalAndFilteredRowCountComponent' },
        { statusPanel: 'agTotalRowCountComponent' },
        { statusPanel: 'agFilteredRowCountComponent' },
        { statusPanel: 'agSelectedRowCountComponent' },
        { statusPanel: 'agAggregationComponent' },
      ],
    },
    rowSelection: 'multiple',
    enableRangeSelection: true,
    enableCharts: true,
    pagination: true,
    paginationPageSize: 20,
  }), []);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">AG Grid Enterprise</h2>
      <div className="ag-theme-quartz" style={{ height: 600, width: '100%' }}>
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          gridOptions={gridOptions}
        />
      </div>
    </div>
  );
}
