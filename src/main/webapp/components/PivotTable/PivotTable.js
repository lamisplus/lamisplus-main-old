import React, { Component } from 'react'
import * as WebDataRocksReact from './webdatarocks.react';
import {Card, CardContent} from '@material-ui/core';
import Page from 'components/Page';
import "webdatarocks/webdatarocks.highcharts";
import './PivotTable.css';

export class PivotTable extends Component {
  render() {
    return (
        <div className="PivotTable">
          <Page title="Pivot Table Report" >
            <Card >
              <CardContent>
                <h4>Pivot Table</h4>
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

