import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import "./ActivityReportView.css";

class FamilyName extends Component{
  constructor(props){
    super(props); 
   
    this.state = {
      "familyName" : '-',
    }
  }
  componentDidMount(){
    axios({
      method: 'get',
      url: '/api/families/'+this.props.family_ID,
    }).then((response)=> {
      if (response.data && response.data[0]) {
        this.setState({
          "familyName" :  response.data[0].firstNameOfFH+" "+response.data[0].middleNameOfFH
        })
      }
    }).catch((error)=> {
      console.log("error = ",error);
    });

  }
  render(){
  	return(
  		 <React.Fragment>
  		 	{this.state.familyName}
  		 </React.Fragment>
  		)
  }
}
export default FamilyName;