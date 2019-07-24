import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
// import { RFSdetails } from '/imports/sourcingManagement/RFSManagement/createRFS/apiCreateRequest.js';
import Form from 'react-validation/build/form';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';


class Monthwise extends TrackerReact(Component) {
    constructor(props) {
      super(props);
    
      this.state = {
        monthlyState      : '--',
        // newDateOne      : '',
      };

        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: event.target.value
        });   
    }
    componentDidMount(){
        if ( !$('body').hasClass('adminLte')) {
          var adminLte = document.createElement("script");
          adminLte.type="text/javascript";
          adminLte.src = "/js/adminLte.js";
          $("body").append(adminLte);
        }
        $("html,body").scrollTop(0);
   
        var today = moment().startOf('month');
        var yyyy = moment(today).format("YYYY");
        var monthNum = moment(today).format("MM");
        var currentMonth = yyyy+"-"+monthNum;
         this.setState({
          monthlyState:currentMonth,
      });
      
    }

    componentWillUnmount(){
        $("script[src='/js/adminLte.js']").remove();
        $("link[href='/css/dashboard.css']").remove();
    }
    nextDate(event){
      event.preventDefault();
      var selectedMonth = $("input#monthlyValue").val();
      var newMonthDt = moment(selectedMonth).add(1, 'months').format("YYYY-MM-DD");
      var newMonthNumber = moment(newMonthDt).format("MM");
      //Construct the WeekNumber string as 'YYYY-MM'
      var yearNum=moment(newMonthDt).format("YYYY");
      var newMonth = yearNum+"-"+newMonthNumber;
      this.setState({
          monthlyState:newMonth,
      });
    }

    previousDate(event){
      event.preventDefault();
      var selectedMonth = $("input#monthlyValue").val();

      var newMonthDt = moment(selectedMonth).subtract(1, 'months').format("YYYY-MM-DD");
      var newMonthNumber = moment(newMonthDt).format("MM");
      //Construct the WeekNumber string as 'YYYY-MM'
      var yearNum=moment(newMonthDt).format("YYYY");
      var newMonth = yearNum+"-"+newMonthNumber;
      this.setState({
          monthlyState:newMonth,
      });
    }

    RFSdetails(){
      var monthlySelected = this.state.monthlyState;
      // var roleSelected   = this.state.selectrole;

      if (monthlySelected) {
        var monthDateStart = new Date(moment(monthlySelected).month("YYYY-MM"));//Find out first day of month with selectedMonth
        var monthDateToSess = new Date(moment(monthlySelected).add(1,"M"));
        var RFSdetail = RFSdetails.find({'createdAt':{$gte: monthDateStart,$lt: monthDateToSess}}).fetch();  
      }
      var RFSdetailArr = [];

      if (RFSdetail) {
        for (var i = 0; i < RFSdetail.length; i++) {
          if (RFSdetail[i].quotationDetails) {
            var SupplierName = RFSdetail[i].quotationDetails[0].supplierName;
          }else{
            var SupplierName = 'N/A';
          }

          if (RFSdetail[i].MaterialDeliveryDetails) {
            var deliverydate = RFSdetail[i].MaterialDeliveryDetails[0].deliverydate;
          }else{
            var deliverydate = 'N/A';
          }
          var da = RFSdetail[i].dueDate;
          var dat = da.split(' ');
          var date = dat[0];
          var dateformate = date.split('/');
          var dd = dateformate[0];
          var mm = dateformate[1];
          var yyyy = dateformate[2];
          var dateNew = yyyy +'-'+ mm +'-'+ dd ;
          var date1 = new Date(dateNew);
          if(RFSdetail[i].MaterialDeliveryDetails){
            var date2 = new Date(RFSdetail[i].MaterialDeliveryDetails[0].deliverydate);
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
          }else{
            var date2 = 'N/A';
            var timeDiff = 'N/A';
            var diffDays = 'N/A';
          }
          RFSdetailArr.push({
                    'RFSNo'           : RFSdetail[i].rfsNumber,
                    'CostCenter'      : RFSdetail[i].costCenter,
                    'Product'         : RFSdetail[i].productName,
                    'PartDesc'        : RFSdetail[i].productDescription,
                    'Requestor'       : RFSdetail[i].raisedByName,
                    'Supplier'        : SupplierName,
                    'RFSDate'         : RFSdetail[i].raisedDate,
                    'DueDate'         : RFSdetail[i].dueDate,
                    'status'          : RFSdetail[i].status,
                    'ActualDate'      : deliverydate,
                    'VarienceInDays'  : diffDays,
                    'Performance'     : '20 %',
                  });
        }
      }
      return RFSdetailArr;
    }


    render() {
       return (
            <div>
              
                <div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12">
                          <div className="box-header with-border col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 BudgetMasterTitle">
                               <h4 className="MasterBudgetTitle">Monthly RFS List</h4>
                            </div>
                                
                           
                          </div>
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                           
                              <div className="col-lg-6 col-lg-offset-4 col-md-6 col-sm-12 col-xs-12  searchBoxBugt  margintopReport">
                                <div className="input-group-addon HRMSAddon col-lg-2 col-md-2 col-sm-2 col-xs-2" id="previousDate" onClick={this.previousDate.bind(this)}>
                                  <span className="fa fa-caret-left nextarrow"></span>
                                </div>
                                
                                <input type="month" className="todaysdate col-lg-8 col-md-8 col-sm-8 col-xs-8" name="monthlyValue" id="monthlyValue" value={this.state.monthlyState} />
                                
                                <div className="input-group-addon HRMSAddon nextAddon col-lg-2 col-md-2 col-sm-2 col-xs-2" id="nextDate" onClick={this.nextDate.bind(this)}>
                                  <span className="fa fa-caret-right nextarrow"></span>
                                </div>
                              </div>
                            {/*  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                { this.RFSdetails().length != 0 ?
                                   <ReactHTMLTableToExcel
                                        id="test-table-xls-button"
                                        className="pull-right dwnldAsExcel fa fa-download download-table-xls-button btn report-list-downloadXLXS"
                                        table="MonthlyRFSData"
                                        filename="MonthlyRFSData"
                                        sheet="tablexls"
                                        buttonText=""/>
                                        :

                                    <div className="pull-right"></div>
                                  }
                                </div>
                                <div className="table-responsive col-lg-12">
                                <table id="MonthlyRFSData" className="table table-striped table-hover myTable table-bordered">
                                    <thead>
                                    <tr className="tempTableHeader">
                                      <th>SR No</th>
                                      <th>RFS No</th>
                                      <th>RFS Date</th>
                                      <th>Cost Center</th>
                                      <th>Product</th>
                                      <th>Part Desc</th>
                                      <th>Requestor</th>
                                      <th>Supplier</th>
                                      <th>Due Date</th>
                                      <th>Actual Date</th>
                                      <th>Status</th>
                                    </tr>
                                  </thead>
                                    <tbody>
                                      {this.RFSdetails() && this.RFSdetails().length >0?
                                          this.RFSdetails().map((data,index)=>{
                                            return(
                                              <tr key={index}>
                                                <td>{index+1}</td>
                                                <td>RFS-{data.RFSNo}</td>
                                                <td>{data.RFSDate}</td>
                                                <td>{data.CostCenter}</td>
                                                <td>{data.Product}</td>
                                                <td>{data.PartDesc}</td>
                                                <td>{data.Requestor}</td>
                                                <td>{data.Supplier}</td>
                                                <td>{moment(data.DueDate,'YYYY-MM-DD').format('DD/MM/YYYY')}</td>
                                                <td>{(data.ActualDate != 'N/A') ? (moment(data.ActualDate,'YYYY-MM-DD').format('DD/MM/YYYY')) : 'N/A'}</td>
                                                <td>{data.status}</td>
                                              </tr>
                                            );
                                          })
                                        :
                                              <tr >
                                                <td className="txtcentr" colSpan="10">No Data Found</td>
                                              </tr>
                                        }
                                        
                                        
                                    </tbody>
                                </table>
                                </div>*/}
                          </div>
                     </div>
          </div>
        );

    } 

}

export default MonthwiseContainer = withTracker(props => {
  // Do all your reactive data access in this method.
  // Note that this subscription will get cleaned up when your component is unmounted

    var id = FlowRouter.getParam("id");

    const postHandle = Meteor.subscribe('allRFSdetails');
    const loading    = !postHandle.ready();
    const post = RFSdetails.find({}).fetch() || [];
    const postHandleRole  = Meteor.subscribe('rolefunction');
    const loading1        = !postHandleRole.ready();
    
    return {
        loading1,
        loading,
        post,
        id
    };    
})(Monthwise);
