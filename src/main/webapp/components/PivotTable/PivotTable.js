import React, { Component } from 'react'
import * as WebDataRocksReact from './webdatarocks.react';
import {Card, CardContent} from '@material-ui/core';
import Page from 'components/Page';
import './PivotTable.css';

export class PivotTable extends Component {
  render() {
    return (
        <div className="PivotTable">
          <Page title="Report Builder" >
            <Card >
              <CardContent>
                <h4>Create Report</h4>
                <hr />
                <div>
                  <WebDataRocksReact.Pivot
                      toolbar={true}
                      report="https://cdn.webdatarocks.com/reports/report.json"/>
                </div>
              </CardContent>
            </Card>
          </Page>
        </div>
    );
  }
}
export default PivotTable;

