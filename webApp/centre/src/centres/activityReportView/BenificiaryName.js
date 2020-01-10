import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import "./ActivityReportView.css";

class BenificiaryName extends Component{
  constructor(props){
    super(props); 
   
    this.state = {
      "beniName" : '-',
    }
  }
  componentDidMount(){
    axios({
      method: 'get',
      url: '/api/beneficiaries/'+this.props.beni_ID,
    }).then((response)=> {
      if (response.data && response.data[0]) {
        this.setState({
          "beniName" :  response.data[0].firstNameOfBeneficiary+" "+response.data[0].middleNameOfBeneficiary+" "+response.data[0].surnameOfBeneficiary
        })
      }
    }).catch((error)=> {
      console.log("error = ",error);
    });

  }
  render(){
  	return(
  		 <React.Fragment>
  		 	{this.state.beniName}
  		 </React.Fragment>
  		)
  }
}
export default BenificiaryName;