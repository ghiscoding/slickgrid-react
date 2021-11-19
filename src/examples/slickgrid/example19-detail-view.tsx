import Example19 from './example19';
import { SlickDataView, SlickGrid, ViewModelBindableData } from '../../slickgrid-react';

export class DetailViewCustomElement {
  model!: {
    duration: Date;
    percentComplete: number;
    reporter: string;
    start: Date;
    finish: Date;
    effortDriven: boolean;
    assignee: string;
    title: string;
  };

  // you also have access to the following objects (it must match the exact property names shown below)
  addon: any; // row detail addon instance
  grid!: SlickGrid;
  dataView!: SlickDataView;

  // you can also optionally use the Parent Component reference
  // NOTE that you MUST provide it through the "parent" property in your "rowDetail" grid options
  parent?: Example19;

  bind(_bindingContext: any, overrideContext: any) {
    if (overrideContext && overrideContext.parentOverrideContext && overrideContext.parentOverrideContext.bindingContext && overrideContext.parentOverrideContext.bindingContext.model) {
      this.bindReferences(overrideContext.parentOverrideContext.bindingContext);
    }
  }

  bindReferences(data: ViewModelBindableData) {
    if (data) {
      this.model = data.model;
      this.addon = data.addon;
      this.grid = data.grid;
      this.dataView = data.dataView;
      this.parent = data.parent;
    }
  }

  alertAssignee(name: string) {
    if (typeof name === 'string') {
      alert(`Assignee on this task is: ${name.toUpperCase()}`);
    } else {
      alert('No one is assigned to this task.');
    }
  }

  deleteRow(model: any) {
    if (confirm(`Are you sure that you want to delete ${model.title}?`)) {
      // you first need to collapse all rows (via the 3rd party addon instance)
      this.addon.collapseAll();

      // then you can delete the item from the dataView
      this.dataView.deleteItem(model.rowId);

      this.parent!.showFlashMessage(`Deleted row with ${model.title}`, 'danger');
    }
  }

  callParentMethod(model: any) {
    this.parent!.showFlashMessage(`We just called Parent Method from the Row Detail Child Component on ${model.title}`);
  }

  render() {
    return (
      <div id="demo-container" className="container-fluid">
        <h3>{this.model.title}</h3>
        <div className="row">
          <div className="col-3"><label>Assignee:</label> <input className="form-control" value="model.assignee" /></div>
          <div className="col-3"><label>Reporter:</label> <span>{this.model.reporter}</span></div>
          <div className="col-2"><label>Duration:</label> <span>{this.model.duration}</span></div>
          <div className="col-2"><label>% Complete:</label> <span>{this.model.percentComplete}</span></div>
        </div>

        <div className="row">
          <div className="col-3"><label>Start:</label> <span>{this.model.start}</span></div>
          <div className="col-3"><label>Finish:</label> <span>{this.model.finish}</span></div>
          <div className="col-2"><label>Effort Driven:</label> <i className="model.effortDriven ? 'fa fa-check' : ''"></i>
          </div>
        </div>

        <hr />

        <div className="col-sm-8">
          <h4>
            Find out who is the Assignee
            <small>
              <button className="btn btn-primary btn-sm" onClick={() => this.alertAssignee(this.model.assignee)}
                data-test="assignee-btn">
                Click Me
              </button>
            </small>
          </h4>
        </div>

        <div className="col-sm-4">
          <button className="btn btn-primary btn-danger btn-sm" onClick={() => this.deleteRow(this.model)} data-test="delete-btn">
            Delete Row
          </button>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => this.callParentMethod(this.model)} data-test="parent-btn">
            Call Parent Method
          </button>
        </div>
      </div>
    );
  }
}
