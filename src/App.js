import React from "react";

import RadioGroup from "devextreme-react/radio-group";
import CheckBox from "devextreme-react/check-box";
import SelectBox from "devextreme-react/select-box";

import DataGrid, {
  Column,
  Editing,
  Selection,
  RowDragging,
  ColumnChooser,
  ColumnFixing,
  Grouping,
  GroupPanel,
  Scrolling,
  LoadPanel,
  Pager,
  Paging,
  RequiredRule,
  PatternRule,
  SearchPanel,
  Sorting,
  FilterRow,
  HeaderFilter,
  Summary,
  TotalItem
} from "devextreme-react/data-grid";
import service from "./data.js";
// import { formatDate } from 'devextreme/localization';

const themes = ["Blue", "Green", "Yellow", "Red"];
const themeColors = [
  { id: 0, name: "Blue", primary: [212, 83, 23], secondary: [202, 79, 52] },
  { id: 1, name: "Green", primary: [183, 97, 12], secondary: [169, 52, 52] },
  { id: 2, name: "Yellow", primary: [45, 61, 21], secondary: [55, 96, 35] },
  { id: 3, name: "Red", primary: [346, 100, 20], secondary: [353, 82, 52] }
];
const allowedPageSizes = [10, 20, 50, 100];
const saleAmountEditorOptions = { format: "currency", showClearButton: true };
const resizingModes = ["widget", "nextColumn"];
const selectingModes = ["single", "multiple"];
const editModes = ["cell", "row", "batch", "form", "popup"];
const startEditActions = ["click", "dblClick"];
const startupSelectedKeys = [1];
const filterTypes = [
  {
    key: "auto",
    name: "Immediately"
  },
  {
    key: "onClick",
    name: "On Button Click"
  }
];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.orders = service.getOrders();
    this.applyFilterTypes = filterTypes["auto"];
    this.saleAmountHeaderFilter = [
      {
        text: "Less than $3000",
        value: ["SaleAmount", "<", 3000]
      },
      {
        text: "$3000 - $5000",
        value: [
          ["SaleAmount", ">=", 3000],
          ["SaleAmount", "<", 5000]
        ]
      },
      {
        text: "$5000 - $10000",
        value: [
          ["SaleAmount", ">=", 5000],
          ["SaleAmount", "<", 10000]
        ]
      },
      {
        text: "$10000 - $20000",
        value: [
          ["SaleAmount", ">=", 10000],
          ["SaleAmount", "<", 20000]
        ]
      },
      {
        text: "Greater than $20000",
        value: ["SaleAmount", ">=", 20000]
      }
    ];

    //this.scrollingModes = ["infinite", "standard", "virtual"]

    this.state = {
      showGroupPanel: true,
      showSearchPanel: true,
      autoExpandAll: true,
      showColumnLines: true,
      showDragIcons: true,
      showRowLines: false,
      showBorders: true,
      rowAlternationEnabled: true,
      scrollingMode: "standard",
      showFilterRow: true,
      showHeaderFilter: true,
      colResizeMode: resizingModes[0],
      columnChooser: true,
      columnFixing: true,
      allowColumnResizing: true,
      allowColumnReordering: true,
      selectingMode: selectingModes[1],
      currentFilter: filterTypes[0].key,
      selectTextOnEditStart: true,
      startEditAction: "click",
      editingMode: editModes[1]
    };

    this.dataGrid = null;

    this.onValueChanged = this.onValueChanged.bind(this);

    this.orderHeaderFilter = this.orderHeaderFilter.bind(this);
    this.onShowFilterRowChanged = this.onShowFilterRowChanged.bind(this);
    this.onShowHeaderFilterChanged = this.onShowHeaderFilterChanged.bind(this);
    this.onCurrentFilterChanged = this.onCurrentFilterChanged.bind(this);

    this.changeResizingMode = this.changeResizingMode.bind(this);
    this.changeSelectingMode = this.changeSelectingMode.bind(this);
    this.changeEditingMode = this.changeEditingMode.bind(this);

    this.onReorder = this.onReorder.bind(this);
    this.onShowDragIconsChanged = this.onShowDragIconsChanged.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <DataGrid
            id="gridContainer"
            ref={(ref) => (this.dataGrid = ref)}
            dataSource={this.orders}
            height={640}
            keyExpr="ID"
            defaultSelectedRowKeys={startupSelectedKeys}
            onSelectionChanged={this.onSelectionChanged}
            allowColumnResizing={this.state.allowColumnResizing}
            columnResizingMode={this.state.colResizeMode}
            columnMinWidth={40}
            columnAutoWidth={true}
            columnHidingEnabled={false}
            allowColumnReordering={this.state.allowColumnReordering}
            showBorders={this.state.showBorders}
            showColumnLines={this.state.showColumnLines}
            showRowLines={this.state.showRowLines}
            rowAlternationEnabled={this.state.rowAlternationEnabled}
          >
            <Editing
              allowAdding={true}
              allowUpdating={true}
              allowDeleting={true}
              mode={this.state.editingMode}
              useIcons={true}
              selectTextOnEditStart={this.state.selectTextOnEditStart}
              startEditAction={this.state.startEditAction}
            />
            <RowDragging
              allowReordering={false}
              onReorder={this.onReorder}
              showDragIcons={this.state.showDragIcons}
            />
            <Grouping autoExpandAll={this.state.autoExpandAll} />
            <GroupPanel visible={this.state.showGroupPanel} />
            <Scrolling mode={this.state.scrollingMode} />
            <LoadPanel enabled={true} />
            <Pager
              allowedPageSizes={allowedPageSizes}
              showInfo={true}
              showNavigationButtons={true}
              showPageSizeSelector={true}
              visible={true}
            />
            <Paging defaultPageSize={20} />
            <Sorting mode="multiple" />
            <Selection mode={this.state.selectingMode} />
            <FilterRow
              visible={this.state.showFilterRow}
              applyFilter={this.state.currentFilter}
            />
            <HeaderFilter visible={this.state.showHeaderFilter} />
            <SearchPanel
              visible={this.state.showSearchPanel}
              width={240}
              placeholder="Search..."
            />
            <ColumnChooser enabled={this.state.columnChooser} />
            <ColumnFixing enabled={this.state.columnFixing} />
            <Column
              dataField="OrderNumber"
              width={140}
              caption="Invoice Number"
            >
              <HeaderFilter groupInterval={10000} />
            </Column>
            <Column
              dataField="OrderDate"
              alignment="right"
              dataType="date"
              width={120}
              calculateFilterExpression={this.calculateFilterExpression}
            >
              <HeaderFilter dataSource={this.orderHeaderFilter} />
            </Column>
            <Column
              dataField="DeliveryDate"
              alignment="right"
              dataType="datetime"
              format="M/d/yyyy, HH:mm"
              width={180}
            />
            <Column dataField="Employee" />
            <Column dataField="CustomerStoreCity" caption="City">
              <HeaderFilter allowSearch={true} />
            </Column>
            <Column dataField="Phone">
              <RequiredRule />
              <PatternRule
                message={'Your phone must have "(+40) 722-283.444" format!'}
                pattern={/^\(\+\d{2}\) \d{3}-\d{3}.\d{3}$/i}
              />
            </Column>
            <Column
              dataField="SaleAmount"
              alignment="right"
              dataType="number"
              format="currency"
              editorOptions={saleAmountEditorOptions}
            >
              <HeaderFilter dataSource={this.saleAmountHeaderFilter} />
            </Column>
            <Summary calculateCustomSummary={this.calculateSelectedRow}>
              <TotalItem
                name="SelectedRowsSummary"
                summaryType="custom"
                valueFormat="currency"
                displayFormat="Sum: {0}"
                showInColumn="SaleAmount"
              />
            </Summary>
          </DataGrid>
        </div>

        <div className="options">
          <div className="caption no-border">Theme chooser</div>
          <div className="option">
            <RadioGroup
              items={themes}
              defaultValue={themes[0]}
              layout="horizontal"
            />
          </div>

          <div className="caption">Panels</div>
          <div className="option">
            <CheckBox
              text="Show Group Panel"
              value={this.state.showGroupPanel}
              onValueChanged={this.onValueChanged}
            />
          </div>
          <div className="option">
            <CheckBox
              text="Show Search Panel"
              value={this.state.showSearchPanel}
              onValueChanged={this.onValueChanged}
            />
          </div>
          <div className="option">
            <CheckBox
              text="Column Chooser"
              value={this.state.columnChooser}
              onValueChanged={this.onValueChanged}
            />
          </div>

          <div className="caption">Filtering</div>
          <div className="option">
            <span class="dx-field-item-label-text">Filtering mode:</span>
            <SelectBox
              items={filterTypes}
              valueExpr="key"
              displayExpr="name"
              value={this.state.currentFilter}
              onValueChanged={this.onCurrentFilterChanged}
              disabled={!this.state.showFilterRow}
            />
          </div>
          <div className="option down">
            <CheckBox
              text="Header Filter"
              value={this.state.showHeaderFilter}
              onValueChanged={this.onShowHeaderFilterChanged}
            />
          </div>
          <div className="option down">
            <CheckBox
              text="Filter Row"
              value={this.state.showFilterRow}
              onValueChanged={this.onShowFilterRowChanged}
            />
          </div>

          <div className="caption">Resize Columns</div>
          <div className="option">
            <span class="dx-field-item-label-text">Resizing mode:</span>
            <SelectBox
              items={resizingModes}
              value={this.state.colResizeMode}
              onValueChanged={this.changeResizingMode}
            />
          </div>
          <div className="option down">
            <CheckBox
              text="Column Fixing"
              value={this.state.columnFixing}
              onValueChanged={this.onValueChanged}
            />
          </div>
          <div className="option down">
            <CheckBox
              text="Allow Column Reordering"
              value={this.state.allowColumnReordering}
              onValueChanged={this.onValueChanged}
            />
          </div>
          <div className="option down">
            <CheckBox
              text="Allow Column Resizing"
              value={this.state.allowColumnResizing}
              onValueChanged={this.onValueChanged}
            />
          </div>

          <div className="caption">Grouping</div>
          <div className="option">
            <CheckBox
              text="Expand All Groups"
              value={this.state.autoExpandAll}
              onValueChanged={this.onValueChanged}
            />
          </div>

          <div className="caption up">Select Rows</div>
          <div className="option selector">
            <span class="dx-field-item-label-text">Selecting mode:</span>
            <SelectBox
              items={selectingModes}
              value={this.state.selectingMode}
              onValueChanged={this.changeSelectingMode}
            />
          </div>

          <div className="caption">Editing</div>
          <div className="option">
            <span class="dx-field-item-label-text">Edit Mode:</span>
            <SelectBox
              items={editModes}
              value={this.state.editingMode}
              onValueChanged={this.changeEditingMode}
            />
          </div>
          <div className="option">
            <span class="dx-field-item-label-text">Start Edit Action:</span>
            <SelectBox
              items={startEditActions}
              value={this.state.startEditAction}
              onValueChanged={this.onStartEditActionChanged}
            />
          </div>
          <div className="option down">
            <CheckBox
              value={this.state.selectTextOnEditStart}
              text="Select Text on Edit Start"
              onValueChanged={this.onSelectTextOnEditStartChanged}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
  onSelectTextOnEditStartChanged(args) {
    this.setState({
      selectTextOnEditStart: args.value
    });
  }

  onStartEditActionChanged(args) {
    this.setState({
      startEditAction: args.value
    });
  }

  calculateSelectedRow(options) {
    if (options.name === "SelectedRowsSummary") {
      if (options.summaryProcess === "start") {
        options.totalValue = 0;
      } else if (options.summaryProcess === "calculate") {
        if (options.component.isRowSelected(options.value.ID)) {
          options.totalValue = options.totalValue + options.value.SaleAmount;
        }
      }
    }
  }
  onSelectionChanged(e) {
    e.component.refresh(true);
  }
  onValueChanged(e) {
    let optionName = null;
    switch (e.component.option("text")) {
      case "Show Column Lines": {
        optionName = "showColumnLines";
        break;
      }
      case "Show Group Panel": {
        optionName = "showGroupPanel";
        break;
      }
      case "Show Search Panel": {
        optionName = "showSearchPanel";
        break;
      }
      case "Show Row Lines": {
        optionName = "showRowLines";
        break;
      }
      case "Show Borders": {
        optionName = "showBorders";
        break;
      }
      case "Alternating Row Color": {
        optionName = "rowAlternationEnabled";
        break;
      }
      case "Column Chooser": {
        optionName = "columnChooser";
        break;
      }
      case "Column Fixing": {
        optionName = "columnFixing";
        break;
      }
      case "Allow Column Resizing": {
        optionName = "allowColumnResizing";
        break;
      }
      case "Allow Column Reordering": {
        optionName = "allowColumnReordering";
        break;
      }
      default: {
        optionName = "autoExpandAll";
        break;
      }
    }

    this.setState({ [optionName]: e.value });
  }
  changeResizingMode(e) {
    this.setState({ colResizeMode: e.value });
  }
  changeSelectingMode(e) {
    this.setState({ selectingMode: e.value });
  }
  changeEditingMode(e) {
    this.setState({ editingMode: e.value });
  }

  calculateFilterExpression(value, selectedFilterOperations, target) {
    let column = this;
    if (target === "headerFilter" && value === "weekends") {
      return [[getOrderDay, "=", 0], "or", [getOrderDay, "=", 6]];
    }
    return column.defaultCalculateFilterExpression.apply(this, arguments);
  }

  orderHeaderFilter(data) {
    data.dataSource.postProcess = (results) => {
      results.push({
        text: "Weekends",
        value: "weekends"
      });
      return results;
    };
  }
  onShowFilterRowChanged(e) {
    this.setState({
      showFilterRow: e.value
    });
    this.clearFilter();
  }
  onShowHeaderFilterChanged(e) {
    this.setState({
      showHeaderFilter: e.value
    });
    this.clearFilter();
  }
  onCurrentFilterChanged(e) {
    this.setState({
      currentFilter: e.value
    });
  }
  clearFilter() {
    this.dataGrid.instance.clearFilter();
  }

  onReorder(e) {
    const visibleRows = e.component.getVisibleRows();
    const newTasks = [...this.state.tasks];
    const toIndex = newTasks.indexOf(visibleRows[e.toIndex].data);
    const fromIndex = newTasks.indexOf(e.itemData);

    newTasks.splice(fromIndex, 1);
    newTasks.splice(toIndex, 0, e.itemData);

    this.setState({
      tasks: newTasks
    });
  }

  onShowDragIconsChanged(args) {
    this.setState({
      showDragIcons: args.value
    });
  }
}

function getOrderDay(rowData) {
  return new Date(rowData.OrderDate).getDay();
}

export default App;
