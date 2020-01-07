import React,{Component} from 'react';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';



import './StatusComponent.css';

// import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
// import { FranchiseDetails }  from '/imports/admin/companySetting/api/CompanySettingMaster.js';
// import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

export default class StatusComponent extends Component{
  
  constructor(props) {
   super(props);
    this.state = {

    }
    // console.log('props = ',this.props);
  }
   
  componentDidMount(){
 
}

    
  render(){
    // console.log(thi s.props.stats);
    return(
        <main className="col-lg-3">
{/*      <div className="emptyclass"></div>
*/}         <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mainicon NOpadding" >
            <div className="row">
              <div className="col-lg-4 ccon1" style={{backgroundColor:this.props.stats.color}} >
                <div className="row"><i className={"fa fa-"+this.props.stats.icon}></i></div>
              </div>
              <div className="col-lg-7 statusBox">
              {
                this.props.stats.multipleValues ?  
                <React.Fragment>
                  <div> <strong> Centers </strong>: {this.props.stats.centerCount}   </div>
                   {this.props.stats.centerData && this.props.stats.centerData.length > 0 ?
                    this.props.stats.centerData.map((center,i)=>{
                      return(  
                        <div className="dashboardHeading1" key={i}> <strong>{center.typeOfCenter.split(' ')[0]} </strong>  :{center.count}</div>
                      )
                    })
                    : null
                  }
                </React.Fragment>
              
              :
                <div>
                  <div className="dashboardHeading"><strong>{this.props.stats.heading1}</strong></div>
                  <div className="per">{this.props.stats.value1}</div>
                  <div className="dashboardHeading"><strong>{this.props.stats.heading2}</strong></div>
                  <div className="per">{this.props.stats.value2}</div>
                </div>
              }
              </div>
            </div>
          </div>
        </main>   
        );
  }
}
