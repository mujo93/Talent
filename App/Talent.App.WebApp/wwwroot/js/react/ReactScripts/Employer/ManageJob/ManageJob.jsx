import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 3,
            activeIndex: 2,
            totalCount:null
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //this.nextPage=this.nextPage.bind(this);
        //this.updateWithoutSave = this.updateWithoutSave.bind(this);
        //your functions go here
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this
        console.log("loaderData",loaderData);
        //set loaderData.isLoading to false after getting data
        //this.loadData(() =>
        //    this.setState({ loaderData })
        //)
        
        //console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.loadData();
        this.init();   
    };

    loadData(callback) {
       /* var param = {activePage: activePage, sortbyDate: sortBy.date,showActive:filter.showActive,
            showClosed:filter.showClosed,showExpired:filter.showExpired,
            showUnexpired:filter.showUnexpired,limit:activeIndex};*/
        const { activePage, sortBy, filter,activeIndex } = this.state;
        var link = 'https://talentservicestalent20200210033124.azurewebsites.net/listing/listing/getSortedEmployerJobs?'+'activePage='+activePage+
        '&sortbyDate='+sortBy.date+'&showActive='+filter.showActive+'&showClosed='+filter.showClosed+
        '&showExpired='+filter.showExpired+'&showUnexpired='+filter.showUnexpired+'&limit='+activeIndex;
        var cookies = Cookies.get('talentAuthToken');
        
        $.ajax({
            
            url: link,
            //data:param,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json',   
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                console.log(res)
                let Jobs = null;
                let totalCount=null;
                if (res.myJobs) {
                    
                    Jobs = res.myJobs
                    totalCount=res.totalCount

                }
                this.updateWithoutSave(Jobs,totalCount)
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        }) 
        this.init()

       // your ajax call and other logic goes here
    }


    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    updateWithoutSave(newData,numberOfJob) {
        this.setState({
            loadJobs: newData,
            totalCount:numberOfJob
        })
    }

    createCards(data){
        const divStyle = {
            display: "inline-block"
          };
        if (data.length > 0) {
            console.log(data)
           return data.map((item) =><div key={item.id} style={divStyle} className="cards"><JobSummaryCard key={item.id} item={item} /></div>);
          }
    }

    nextPage(pageNumber=this.state.activePage,date=this.state.sortBy.date,filters=this.state.filter){
        //const pageNo=this.props.match.params.id ? this.props.match.params.id : "";
        //const date=this.props.match.params.id ? this.props.match.params.id : "";
        console.log(typeof pageNumber)
        const { sortBy, filter,activeIndex } = this.state;
        var link = 'https://talentservicestalent20200210033124.azurewebsites.net/listing/listing/getSortedEmployerJobs?'+'activePage='+pageNumber+
        '&sortbyDate='+date+'&showActive='+filter.showActive+'&showClosed='+filter.showClosed+
        '&showExpired='+filter.showExpired+'&showUnexpired='+filter.showUnexpired+'&limit='+activeIndex;
        var cookies = Cookies.get('talentAuthToken');
       
        var param = {activePage: pageNumber, sortbyDate: date,showActive:filter.showActive,
            showClosed:filter.showClosed,showExpired:filter.showExpired,
            showUnexpired:filter.showUnexpired,limit:activeIndex};
        $.ajax({
            url: link,
            data:param,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json',
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                console.log(res)
                let Jobs = null;
                let totalCount=null;
                if (res.myJobs) {
                    Jobs = res.myJobs
                    totalCount=res.totalCount
                }
                this.updateWithoutSave(Jobs,totalCount)
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        }) 
        this.init()
    }

    filterChoice(filter){
        console.log(filter)
        switch(filter){
            case "Expired":
                this.setState({
                    filter: {
                        showActive: false,
                        showClosed: false,
                        showDraft: false,
                        showExpired: true,
                        showUnexpired: false
                    }
                })
                break;
            case "Unexpired":
                this.setState({
                    filter: {
                        showActive: false,
                        showClosed: false,
                        showDraft: false,
                        showExpired: false,
                        showUnexpired: true
                    }
                })
                break;
            
            case "Active":
                this.setState({
                    filter: {
                        showActive: true,
                        showClosed: false,
                        showDraft: false,
                        showExpired: false,
                        showUnexpired: false
                    }
                })
                break;
            
            case "Closed":
                this.setState({
                    filter: {
                        showActive: false,
                        showClosed: true,
                        showDraft: false,
                        showExpired: false,
                        showUnexpired: false
                    }
                })
                break;
            
            case "Choose filter":
                this.setState({
                    filter: {
                        showActive: true,
                        showClosed: false,
                        showDraft: true,
                        showExpired: true,
                        showUnexpired: true
                    }
                })
                break;

                default:
                    alert("Something went wrong.");       

        }

        console.log(this.state.filter)
        this.nextPage(undefined,undefined,this.state.filter)
    }

    render() {
        const{loadJobs,activePage,activeIndex,totalCount}=this.state
        const numberPages=Math.ceil(totalCount/activeIndex);
        const orderBy = [
            {
              key: 'descending',
              text: 'Newest First',
              value: 'desc'
            },
            {
              key: 'ascending',
              text: 'Latest First',
              value: 'asc'
            }]
        
        const filter=[
            {
                key: '0',
                text: 'Choose filter',
                value: 'default'
              },
            {
                key: '1',
                text: 'Expired',
                value: 'Expired'
              },
              {
                key: '2',
                text: 'Unexpired',
                value: 'Unexpired'
              },
              {
                key: '3',
                text: 'Active',
                value: 'Active'
              },
              {
                key: '4',
                text: 'Closed',
                value: 'Closed'
              }
            ]
        
        
        const paginationSytle={     
            display:"flex",
            justifyContent:"center",
            marginBottom:"10px" }

        return (     
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
               <div className ="ui container">
                   <h1>List of Jobs</h1>
                   <div className="dropdowns">
                    <Icon name='filter' />Filter:{' '}
                        <Dropdown
                            inline
                            options={filter}
                            defaultValue={filter[0].value}
                            onChange={(e,data) => this.filterChoice(data.value)}/>
                    <Icon name='calendar alternate' /> Sort by date:{' '}
                        <Dropdown
                            inline
                            options={orderBy}
                            defaultValue={orderBy[0].value}
                            onChange={(e,data) => this.nextPage(undefined,data.value)}/>
                    </div>

                    <br></br>
                   <React.Fragment>
                        {loadJobs.length===0 ?"No Jobs Found." :this.createCards(loadJobs)}
                    </React.Fragment>
                    
                <div style={paginationSytle} className="text-center">
                    <Pagination
                                 
                                defaultActivePage={activePage}
                                ellipsisItem={null}
                                totalPages={numberPages}
                                onPageChange={(event, data) => this.nextPage(Number(data.activePage),undefined)}/>
                </div>
               </div >
            </BodyWrapper>
        )
    }
}