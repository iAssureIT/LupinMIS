import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import validate               from 'jquery-validation';
import {withRouter}           from 'react-router-dom';
// import _                      from 'underscore';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';

import IAssureTable             from "../../../IAssureTable/IAssureTable.jsx";
import "./nameOfGoal.css";
 
class nameOfGoal extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      "typeofGoal"          :"",
      "goalName"            :"",
      "user_ID"             :"",  
      "goalID"              :"",  
      "typeofGoal_id"       :"",
      "typeofGoalRegx"       :"",
      fields                : {},
      errors                : {},
      "tableHeading"        : {
        typeofGoal          : "Goal Type",
        goalName            : "Goal Name",
        actions             : 'Action',
      },
      "tableObjects"        : {
        deleteMethod        : 'delete',
        apiLink             : '/api/typeofgoals/',
        editUrl             : '/type-goal/',
        paginationApply     : false,
        searchApply         : false,
      },
      "dataCount"           : 0,
      "startRange"          : 0,
      "limitRange"          : 10000,
      "editId"              : props.match.params ? props.match.params.typeofGoalId : ''

    }
  }
 
  handleChange(event){
    event.preventDefault();
  

    this.setState({
     "goalName"     : this.refs.goalName.value,  
    });
  
  }

  handleChangeSelect(event){
    event.preventDefault();
    var goalID = event.target.value.split('|');
    console.log("goalID",goalID[1]);

    this.setState({
     "typeofGoal"   : this.refs.typeofGoal.value,  
     "goalID"       : goalID[1]
    });
  
  }

  isTextKey(evt) {
   var charCode = (evt.which) ? evt.which : evt.keyCode
   if (charCode!==189 && charCode > 32 && (charCode < 65 || charCode > 90) )
   {
    evt.preventDefault();
      return false;
    }
    else{
      return true;
    }
 
  }

  SubmitType_Goal(event){
    event.preventDefault();
    if($("#typeofNameDetails").valid()){
      var typeofGoalValues= {
      "ID"               :this.state.goalID,
      "goalName"         :this.refs.goalName.value,
      };
      console.log("typeofGoalValues",typeofGoalValues);
      axios.patch('/api/typeofgoals/goalName',typeofGoalValues)
      .then((response)=>{
        this.getData(this.state.startRange, this.state.limitRange);
        console.log("nameGoalValues",response );
        swal({
          title : response.data.message,
          text  : response.data.message
        });
      })
      .catch(function(error){
        console.log("error = ",error);
      });

       
        this.setState({
          "goalName"       : "",
          "typeofGoal"     : "",
        });
     
    } 
  }


  updateType_Goal(event){
    event.preventDefault();
    if($("#typeofNameDetails").valid()){
      var typeofGoalValues= {
        "ID"              :this.refs.typeofGoal.value.split('|')[1],
        "typeofGoal"      :this.refs.typeofGoal.value.split('|')[0],
        "goalName"        :this.refs.goalName.value,
        "user_ID"         : this.state.user_ID,
      };
      axios.patch('/api/typeofgoals/goalName/update',typeofGoalValues, this.state.editId)
        .then((response)=>{
          console.log("response",response );
          this.getData(this.state.startRange, this.state.limitRange);
          swal({
            title : response.data.message,
            text  : response.data.message
          });
          this.setState({
            editId : ''
          })
        })
        .catch(function(error){
          console.log("error = ",error);
        });
      this.setState({
        "typeofGoal"  :"",
      });
          this.props.history.push('/type-goal');
    }     
  }
 

  componentWillReceiveProps(nextProps){
  // console.log('componentWillReceiveProps');
    var editId = nextProps.match.params.typeofGoalId;
    if(nextProps.match.params.typeofGoalId){
      this.setState({
        editId : editId
      },()=>{
        this.edit(this.state.editId);

      })
    }
    if(nextProps){
      this.getLength();
    }
  }
  
  componentDidMount(){
  axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
  // console.log('componentDidMount', this.state.tableData);
    var editId = this.props.match.params.typeofGoalId;
    if(editId){      
      this.edit(editId);
    }
    this.getAvailableGoalType();
    this.getLength();
    this.getData(this.state.startRange, this.state.limitRange);
    $.validator.addMethod("regxnameofGoal", function(value, element, regexpr) {         
      return regexpr.test(value);
    }, "Please enter valid Goal Name.");

    $("#typeofNameDetails").validate({
      rules: {
        goalNameErr: {
          required: true,
          regxnameofGoal: /^[_A-z]*((-|\s)*[_A-z])*$|^$/,
        },
        typeofGoalErr: {
          required: true,
        },
      },
      errorPlacement: function(error, element) {
        if (element.attr("name") == "typeofGoalErr"){
          error.insertAfter("#typeofGoalErr");
        }
        if (element.attr("name") == "goalNameErr"){
          error.insertAfter("#goalNameErr");
        }
      }
    });
  }

  edit(id){
    axios({
      method: 'get',
      url: '/api/typeofgoals/'+id,
    }).then((response)=> {
      var editData = response.data[0];      
      this.setState({
        "typeofGoal"     :editData.typeofGoal,
      },()=>{
      });
    }).catch(function (error) {
        console.log("error = ",error);
       
      });
  }
  
  getData(startRange, limitRange){
    var data = {
      limitRange : limitRange,
      startRange : startRange,
    }
    console.log('data', data);
     axios.post('/api/typeofgoals/goalName/list',data)
    .then((response)=>{
       console.log('tableData==================', response);
      this.setState({
        tableData : response.data
      })
    })
    .catch(function(error){
      console.log("error = ",error);
    });
  }
  getLength(){
    // axios.get('/api/typeofgoals/count')
    // .then((response)=>{
    //   // console.log('response', response.data);
    //   this.setState({
    //     dataCount : response.data.dataLength
    //   },()=>{
    //     // console.log('dataCount', this.state.dataCount);
    //   })
    // })
    // .catch(function(error){
      
    // });
  }
  componentWillMount(){
    console.log('componentWillMount');
    this.getLength();
  }
  getSearchText(searchText, startRange, limitRange){
    this.setState({
        tableData : []
    });
  }
  componentWillUnmount(){
    this.setState({
      "typeofGoal" :"",
      "editId"      : ""
    })
  }
  getAvailableGoalType(){
    axios({
      method: 'get',
      url: '/api/typeofgoals/list',
    }).then((response)=> {
        console.log("typeofgoals = ",response);
        
        this.setState({
          availableGoalType: response.data
        })
    }).catch(function (error) {
        console.log("error = ",error);
      });
  }

  render() {
  // console.log('render');
    return (
          <div>
           <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable marginT50 " id="typeofNameDetails">
              <div className="row">
                <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
                    <label className="formLable"> Type of Goal</label><span className="asterix">*</span>
                    <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="typeofGoalErr" >
                      <select className="custom-select form-control inputBox" ref="typeofGoal" name="typeofGoalErr" value={this.state.typeofGoal} disabled={this.state.editId?true:false} onChange={this.handleChangeSelect.bind(this)}>
                        <option  className="hidden" value="" >-- Select Goal--</option>
                        {
                          this.state.availableGoalType && this.state.availableGoalType.length >0 ?
                          this.state.availableGoalType.map((data, index)=>{
                            return(
                              <option key={data._id} value={data.typeofGoal+'|'+data._id} goalID={data._id}>{data.typeofGoal}</option>
                            );
                          })
                          :
                          null
                        }
                        
                      </select>                     
                    </div>
                    <div className="errorMsg">{this.state.errors.typeofGoalRegx}</div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
                    <label className="formLable"> Name of Goal</label><span className="asterix">*</span>
                    <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="goalNameErr" >
                      <input type="text" className="form-control inputBox"  placeholder="" ref="goalName" name="goalNameErr" value={this.state.goalName} onKeyDown={this.isTextKey.bind(this)} onChange={this.handleChange.bind(this)} />
                    </div>
                    <div className="errorMsg">{this.state.errors.goalNameRegx}</div>
                  </div>
                  <div className="col-lg-12 col-md-6 col-sm-6 col-xs-12">
                    {
                      this.state.editId ? 
                      <button className=" col-lg-3 btn submit pull-right marginT18" onClick={this.updateType_Goal.bind(this)}> Update</button>
                      :
                      <button className=" col-lg-3 btn submit pull-right marginT18" onClick={this.SubmitType_Goal.bind(this)}> Submit</button>
                    }
                  </div> 
                </div> 
              </div><br/>
            </form>    
            <div className="col-lg-12 ">
               <hr className="marginT50"/>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
              <IAssureTable 
                tableHeading={this.state.tableHeading}
                dataCount={this.state.dataCount}
                tableData={this.state.tableData}
                getData={this.getData.bind(this)}
                tableObjects={this.state.tableObjects}
                // getSearchText={this.getSearchText.bind(this)}
              />
            </div> 
            </div>             
                 
    );

  }

}
export default withRouter(nameOfGoal);