import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import swal                   from 'sweetalert';
import validate               from 'jquery-validation';
import {withRouter}           from 'react-router-dom';
// import _                      from 'underscore';

import Loader                 from "../../../../common/Loader.js";
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
        deleteMethod        : 'patch',
        apiLink             : '/api/typeofgoals/goalName/delete/',
        editUrl             : '/type-goal/',
        paginationApply     : false,
        searchApply         : false,
      },
      "dataCount"           : 0,
      "startRange"          : 0,
      "limitRange"          : 10000,
      "edittypeofGoalId"    : props.match.params ? props.match.params.typeofGoalId : '',
      "editId"              : props.match.params ? props.match.params.goalNameId : '',
      "role"                : localStorage.getItem("role")
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

  SubmitType_Goal(event){
    event.preventDefault();
    if($("#typeofNameDetails").valid()){
      var typeofGoalValues= {
      "ID"               :this.state.goalID,
      "typeofGoal"       :this.refs.typeofGoal.value.split('|')[0],
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
      "typeofGoal"        :this.refs.typeofGoal.value.split('|')[0],
        "goalName"        :this.refs.goalName.value,
        "goal_ID"         :this.state.editId,
      };
      axios.patch('/api/typeofgoals/goalName/update',typeofGoalValues)
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
        "goalName"    :"",
      });
          this.props.history.push('/type-goal');
    }     
  }


  componentWillReceiveProps(nextProps){
  // console.log('componentWillReceiveProps');
    var editId = nextProps.match.params.goalNameId;
    console.log("editId",editId);
    if(nextProps.match.params.goalNameId){
      this.setState({
        editId : editId,
        edittypeofGoalId : nextProps.match.params.typeofGoalId,

      },()=>{
        this.edit(this.state.edittypeofGoalId);

      })
    }
    if(nextProps){
      this.getLength();
    }
  }
  
  componentDidMount(){
  axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("token");
     if(this.state.editId){      
      this.edit(this.state.edittypeofGoalId);
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
          regxnameofGoal:/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*( [a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+)*$/,
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
    var goal_id =this.props.match.params.goalNameId;
    if(id){
    console.log('editId',id);
      axios({
        method: 'get',
        url: '/api/typeofgoals/'+id,
      }).then((response)=> {

        var editData = response.data[0];  
        console.log("editData==",editData,goal_id);  
/*        console.log("editData==",(editData.goal.filter((a)=>{return a._id == goal_id ? a.goalName : ''}))[0]);  
        console.log("editData==",editData.typeofGoal+'|'+editData._id);  
*/        if(editData)
        { 
         this.setState({
          "typeofGoal"        : editData ? editData.typeofGoal+'|'+editData._id: "",
          "goalName"          : editData.goal.find((a)=>{return a._id == goal_id }).goalName,
          // "activityName"      :_.first(editData.activity.map((a, i)=>{console.log( a._id +"=="+ activity_id)})),
        },()=>{
          console.log('this.state', this.state.typeofGoal, this.state.goalName )
        });         
      } 
        
      }).catch(function (error) {
          console.log("error = ",error);
      });
    }
  }
  
  getData(startRange, limitRange){
    var data = {
      limitRange : limitRange,
      startRange : startRange,
    }
    console.log('data', data);
    $(".fullpageloader").show();
    axios.post('/api/typeofgoals/goalName/list',data)
    .then((response)=>{
      $(".fullpageloader").hide();
       // console.log('tableData==================', response);
      var tableData = response.data.map((a, i)=>{
          return {
            _id           : a._id,
            typeofGoal    : a.typeofGoal,
            goalName      : a.goalName,
          }
        })
      this.setState({
        tableData : tableData
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
        {this.state.role !== "viewer" ?
          <React.Fragment>
            <Loader type="fullpageloader" />
            <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable marginT50 " id="typeofNameDetails">
                <div className="row">
                  <div className=" col-lg-12 col-sm-12 col-xs-12 formLable valid_box ">
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
                      <label className="formLable"> Type of Goal</label><span className="asterix">*</span>
                      <div className="col-lg-12 col-sm-12 col-xs-12 input-group inputBox-main " id="typeofGoalErr" >
                      {console.log("typeofGoal",this.state.typeofGoal)}
                        <select className="custom-select form-control inputBox" ref="typeofGoal" name="typeofGoalErr" value={this.state.typeofGoal} disabled={this.state.editId?true:false} onChange={this.handleChangeSelect.bind(this)}>
                          <option  className="hidden" value="" >-- Select --</option>
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
                        <input type="text" className="form-control inputBox"  placeholder="" ref="goalName" name="goalNameErr" value={this.state.goalName} onChange={this.handleChange.bind(this)} />
                      </div>
                      <div className="errorMsg">{this.state.errors.goalNameRegx}</div>
                    </div>
                  </div> 
                    <div className="col-lg-12 col-md-6 col-sm-6 col-xs-12">
                      {
                        this.state.editId ? 
                        <button className=" col-lg-2 btn submit pull-right marginT18" onClick={this.updateType_Goal.bind(this)}> Update</button>
                        :
                        <button className=" col-lg-2 btn submit pull-right marginT18" onClick={this.SubmitType_Goal.bind(this)}> Submit</button>
                      }
                    </div> 
                </div><br/>
            </form>    
            <div className="col-lg-12 ">
               <hr className="marginT50"/>
            </div>
          </React.Fragment>
          :null
        }

        <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 mt">
          <IAssureTable 
            tableName = "name of Goal"
            id = "nameOfGoal" 
            tableHeading={this.state.tableHeading}
            dataCount={this.state.dataCount}
            tableData={this.state.tableData}
            getData={this.getData.bind(this)}
            tableObjects={this.state.tableObjects}
            deleteMethod = 'patch'
            />
        </div> 
      </div>                            
    );

  }

}
export default withRouter(nameOfGoal);