import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import moment                 from "moment";
import "./CaseStudy.css";

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
                    <div className="col-lg-10 col-lg-offset-1 col-md-12 col-xs-12 col-sm-12 noPadding">
                    <a href ="/caseStudy" className="pageSubHeader">
                      <i class="fa fa-arrow-circle-left" aria-hidden="true"></i> &nbsp;
                       Back</a>
                    </div>
                    <div className="col-lg-10 col-lg-offset-1 col-md-12 col-xs-12 col-sm-12 mt outerForm">
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 actDetails">
                        <h4 className="pageSubHeader">Title : {this.state.caseStudy ? this.state.caseStudy.title : "-"}</h4>
                      </div>
                    <hr className="container-fluid row"/>
                      <div className="row">
                        <div className=""> 
                          <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12"> 
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                              <div className="formLable"><i className="fa fa-calendar"></i><b>&nbsp; Date</b></div>
                              <p className="formLable">&nbsp; &nbsp; {this.state.caseStudy  ? moment(this.state.caseStudy.date).format('DD-MM-YYYY') : "-"}</p>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12"> 
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                              <div className="formLable"><i className="fa fa-user"></i><b>&nbsp; Author</b></div>
                              <p className="formLable">&nbsp; &nbsp; {this.state.caseStudy  ? this.state.caseStudy.author : "-"}</p>
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12"> 
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                              <div className="formLable"><i className="fa fa-crosshairs"></i> <b>&nbsp;Sector</b></div>
                              <p className="formLable">&nbsp; &nbsp; {this.state.caseStudy  ? this.state.caseStudy.sectorName : "-"}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-6 col-sm-12 col-xs-12 mt"> 
                          <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable"><i className="fa fa-files-o"></i>&nbsp;<b>Files</b></p>
                          {
                            this.state.caseStudy_File.length > 0? 
                            this.state.caseStudy_File.map((file, i)=> {
                              return(
                                <div key= {i} className="col-lg-3 col-md-12 col-sm-12 col-xs-12"> 
                                  <div className="">
                                    {
                                      (file && (file.fileName.split('.').pop()==="XLS" || file.fileName.split('.').pop() ==="XLSX"||file.fileName.split('.').pop() ==="xls" || file.fileName.split('.').pop() ==="xlsx"))
                                      ?
                                      <a href={file.filePath} className="mt"><img className="fileExt" alt="icon" src="/images/DownloadDoc.svg"/> </a>
                                      :
                                       ""
                                    }
                                    {
                                      (file && (file.fileName.split('.').pop() ==="PPT" || file.fileName.split('.').pop() === "PPTX" || file.fileName.split('.').pop() === "ppt" || file.fileName.split('.').pop() ==="pptx"))
                                      ? 
                                      <a href={file.filePath} className="mt"><img className="fileExt" alt="icon" src="/images/Dwldppt.png"/></a> 
                                      :""
                                    }
                                    {
                                      (file && (file.fileName.split('.').pop() ==="pdf" ||file.fileName.split('.').pop() === "PDF"))
                                      ? 
                                      <a href={file.filePath} className="mt"><img className="fileExt" alt="icon" src="/images/dwldpdf.png"/> </a>
                                      :
                                      ""
                                    }
                                    {
                                      (file && (file.fileName.split('.').pop() ==="doc" || file.fileName.split('.').pop() === "docx" || file.fileName.split('.').pop() === "DOC" || file.fileName.split('.').pop() ==="DOCX"|| file.fileName.split('.').pop() ==="txt" || file.fileName.split('.').pop() === "TXT") )
                                      ? 
                                      <a href={file.filePath} className="mt"><img className="fileExt" alt="icon" src="/images/DownloadDoc.svg"/> </a>
                                      : ""
                                    }                                             
                                    <a href={file.filePath} className="mt">
                                        <p className="formLable"><b>{file.fileName}</b></p>
                                    </a>
                                  </div>
                                  
                                </div>
                                )
                            })
                            : 
                            null
                          }
                        </div>
                        <hr className="container-fluid"/>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <p className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formLable"><i className="fa fa-image"></i>&nbsp;<b>Images</b></p>
                          {
                            this.state.caseStudy_Image.length > 0? 
                            this.state.caseStudy_Image.map((img, i)=> {
                              return(
                                <div key= {i} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt"> 
                                    <img className="caseStudy_Image col-lg-12 col-md-12 col-xs-12 col-sm-12" alt="caseStudy" src={img.imgPath} />
                                </div>
                                )
                            })
                            : 
                            null
                          }
                        </div>
                      </div>



                                           
                    </div>
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