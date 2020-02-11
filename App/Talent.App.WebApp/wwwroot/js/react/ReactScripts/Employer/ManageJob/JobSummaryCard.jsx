import React from 'react';
import Cookies from 'js-cookie';
import { Popup,Card,Button,Icon } from 'semantic-ui-react';
import { CreateJob } from '../../Employer/CreateJob/CreateJob.jsx';
import moment from 'moment';
import { Router, Route, IndexRoute, Redirect } from "react-router";
import {Link} from 'react-router-dom';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.close = this.close.bind(this);

    }

    close(id) {
        var cookies = Cookies.get('talentAuthToken');
        var closed= 'https://talentservicestalent20200210033124.azurewebsites.net/listing/listing/closeJob';

        $.ajax({
            url: closed,
            type: 'POST',
            data: JSON.stringify(id),
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            contentType: 'application/json',
            dataType: 'json',
            success: function (response) {
                if (response) {
                            console.log(response)} 
                else {
                    TalentUtil.notification.show(response.message, "error");}
            }.bind(this),
            fail: function () {
                TalentUtil.notification.show("Error", "error");
            }.bind(this)
        });
        window.location.reload();
    }

    render() {
            const{id,title,summary,location:{country,city}}=this.props.item
            const Sty1={
                display: "inline-block",
                margin: "20px 10px 20px 10px",
                height: "320px",
                width: "320px",
                }
            const text={color:"rgb(178, 179, 191)"}

            const content ={height: "70%"}
            const header  ={height: "15%"}
            const extra   ={height: "15%"}
            
            let path=`/PostJob/${id}`;
            
            
        return(
            <Card style={Sty1}>
                <Card.Content style={header} header={title} />
                <Card.Content style={content} description={<div><h4 style={text}>{city},  {country}</h4><p>{summary}</p></div>} />
                <Card.Content style={extra} extra>
                    <button className="mini ui red button left floated">Expired</button>
                    <div className="mini ui buttons right floated">
                        <Button className=" ui blue basic button"  onClick={() => this.close(id)}><Icon name='ban'/>Close</Button>
                        <Link to={path}><Button className=" ui blue basic button"><Icon name='edit outline'/>Edit</Button></Link>
                        <Button className=" ui blue basic button" ><Icon name='copy outline' />Copy</Button>
                    </div>
                </Card.Content>
          </Card>

        )
    }
}