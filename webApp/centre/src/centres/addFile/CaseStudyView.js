import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactHTMLTableToExcel        from 'react-html-table-to-excel';
import ReactTable             from "react-table";
import moment                 from "moment";

import 'react-table/react-table.css';

class CaseStudyView extends Component{
  
  constructor(props){
    super(props); 
   
    this.state = {
      "caseStudy" : [],
      "caseStudy_Image" : [],
      "caseStudy_File" : [],
      "caseStudy_ID" : this.props.match.params.id 
     
    }
  }
 
  handleChange(event){
    event.preventDefault();
 
  }
  componentDidMount(){
    $("html,body").scrollTop(0)
    axios({
      method: 'get',
      url: '/api/caseStudies/'+this.state.caseStudy_ID,
    }).then((response)=> {
      console.log("response",response.data);
      if (response.data) {
        this.setState({
          "caseStudy"       :  response.data[0],
          "caseStudy_Image" :  response.data[0].caseStudy_Image,
          "caseStudy_File"  :  response.data[0].caseStudy_File
        })
      }
    }).catch((error)=> {
      console.log("error = ",error);
    });

  }

  componentWillUnmount(){
      $("script[src='/js/adminLte.js']").remove();
      $("link[href='/css/dashboard.css']").remove();
  }
  toglehidden()
  {
   this.setState({
       shown: !this.state.shown
      });
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="formWrapper">
            <section className="content">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent ">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 titleaddcontact">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdeilsmg pageHeader">
                      Case Study View
                    </div>
                    <hr className="hr-head container-fluid row"/>
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails">
                        <h4 className="pageSubHeader">Title : {this.state.caseStudy ? this.state.caseStudy.title : "-"}</h4>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12"> 
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                          <p className="formLable"><b>Date</b></p>
                        </div>
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                           <p className="formLable">{this.state.caseStudy  ? moment(this.state.caseStudy.date).format('DD-MM-YYYY') : "-"}</p>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12"> 
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                          <p className="formLable"><b>Author</b></p>
                        </div>
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                           <p className="formLable">{this.state.caseStudy  ? this.state.caseStudy.author : "-"}</p>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12"> 
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                          <p className="formLable"><b>Sector</b></p>
                        </div>
                        <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                           <p className="formLable">{this.state.caseStudy  ? this.state.caseStudy.sectorName : "-"}</p>
                        </div>
                      </div>
                     {console.log('this.state.caseStudy.caseStudy_Image',this.state.caseStudy_File)}
                      {
                        this.state.caseStudy_Image.length > 0? 
                        this.state.caseStudy_Image.map((img, i)=> {
                          return(
                            <div key= {i} className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                                <p className="formLable"><b>Images</b></p>
                                <img className="caseStudy_Image col-lg-4 col-md-6 col-xs-12 col-sm-12" alt="caseStudy" src={img.imgPath} />
                            </div>
                            )
                        })
                        : 
                        null
                      }
                      {
                        this.state.caseStudy_File.length > 0? 
                        this.state.caseStudy_File.map((file, i)=> {
                          return(
                            <div key= {i} className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                               { /* <embed src={file.filePath}/>
                             <object width="400" height="400" data={file.filePath}></object>*/}
                            <a href={file.filePath}>
                                <p className="formLable"><b>{file.fileName}</b></p>
                            </a>
                            </div>
                            )
                        })
                        : 
                        null
                      }
                     
                    </div>
                  </div>
                </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
export default CaseStudyView;