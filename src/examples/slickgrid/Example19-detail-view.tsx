import React from 'react';
import type { RowDetailViewProps } from 'slickgrid-react';

import './example19-detail-view.scss';

interface Item {
  assignee: string;
  duration: Date;
  percentComplete: number;
  reporter: string;
  start: Date;
  finish: Date;
  effortDriven: boolean;
  title: string;
  rowId: number;
}

interface State {
  assignee: string;
}

export class Example19DetailView extends React.Component<RowDetailViewProps<Item>, State> {
  constructor(public readonly props: RowDetailViewProps<Item>) {
    super(props);
    this.state = {
      assignee: props.model?.assignee || ''
    }
  }

  assigneeChanged(newAssignee: string) {
    this.setState((props: RowDetailViewProps<Item>, state: State) => {
      return { ...state, assignee: newAssignee }
    });
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
      this.props.addon.collapseAll();

      // then you can delete the item from the dataView
      this.props.dataView.deleteItem(model.rowId);

      this.props.parent!.showFlashMessage(`Deleted row with ${model.title}`, 'danger');
    }
  }

  callParentMethod(model: any) {
    this.props.parent!.showFlashMessage(`We just called Parent Method from the Row Detail Child Component on ${model.title}`);
  }

  render() {
    return (
      <div className="container-fluid" style={{ marginTop: '10px' }}>
        <h3>{this.props.model.title}</h3>
        <div className="row">
          <div className="col-3 detail-label"><label>Assignee:</label> <input className="form-control" value={this.state.assignee} onInput={($event) => this.assigneeChanged(($event.target as HTMLInputElement).value)} /></div>
          <div className="col-3 detail-label"><label>Reporter:</label> <span>{this.props.model.reporter}</span></div>
          <div className="col-3 detail-label"><label>Duration:</label> <span>{this.props.model.duration?.toISOString?.()}</span></div>
          <div className="col-3 detail-label"><label>% Complete:</label> <span>{this.props.model.percentComplete}</span></div>
        </div>

        <div className="row">
          <div className="col-3 detail-label"><label>Start:</label> <span>{this.props.model.start?.toISOString()}</span></div>
          <div className="col-3 detail-label"><label>Finish:</label> <span>{this.props.model.finish?.toISOString()}</span></div>
          <div className="col-3 detail-label"><label>Effort Driven:</label> <i className={this.props.model.effortDriven ? 'mdi mdi-check' : ''}></i>
          </div>
        </div>

        <hr />

        <div className="col-sm-8">
          <h4>
            Find out who is the Assignee
            <small>
              <button className="btn btn-primary btn-sm" onClick={() => this.alertAssignee(this.props.model.assignee)} data-test="assignee-btn">
                Click Me
              </button>
            </small>
          </h4>
        </div>

        <div className="col-sm-4">
          <button className="btn btn-primary btn-danger btn-sm" onClick={() => this.deleteRow(this.props.model)} data-test="delete-btn">
            Delete Row
          </button>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => this.callParentMethod(this.props.model)} data-test="parent-btn">
            Call Parent Method
          </button>
        </div>
      </div>
    );
  }
}
