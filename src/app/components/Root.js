import React from "react";
import Request from "superagent";
import {Card, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';
import { browserHistory, Link } from "react-router";
import moment from 'moment';

let FB_ACCESS_TOKEN = "CAAbiZCqFSoHsBAC2ZBWiDTJ9q9q3gPfN1RxEjUGK7LcO80ZBQ4i804fQ5X6aZAmYa6tpHNJkuyI8lXLKzfZCgLNOaJNTi4GqWEKZAn4rZBaWrvnAkUJsLoWpwlktDhSUKMMDBjyfgrgGyjK5TzbmvZBAugvwReVzh7ZC3nwANFSJG1IrsI2aFe5upkeiv8sZCO4ZAAZD";
let FB_RATINGS_URL = "https://graph.facebook.com/v2.5/truskapp/ratings";

let Star = <FontAwesome className="fa fa-star" name="" style={{color: '#5890FF'}}/>;

let Rating = ({ ratingData }) => {
  let AVATAR_URL = `https://graph.facebook.com/${ratingData.reviewer.id}/picture?type=square`;
  return (
    <div className="col-sm-12" key={ratingData.reviewer.id}>
        {/* displays a nice card */}
        <Card style={{marginBottom: '30px'}}>
            <CardHeader
                title={<div>{ratingData.reviewer.name} {ratingData.rating} {Star} </div>}
                subtitle={moment(ratingData.created_time).format('DD MMMM YYYY')}
                avatar={AVATAR_URL}
            />
            <CardText>
                {ratingData.review_text}
            </CardText>
        </Card>
      </div>
  );
}

export class Root extends React.Component {

    constructor() {
        super();
        this.state = {
          ratings: [],
        };
    }

    componentWillMount() {
      this.getRatings(this.props.params.next || "");
    }

    // Gets the new url and sends the param "next" to request next ratings
    componentWillReceiveProps(nextProps) {
      this.getRatings(nextProps.params.next || "");
    }

    componentDidUpdate() {
        // This is for scrolling back to the top after every page change.
        window.scrollTo(0, 0)
    }

    getRatings(next) {
        let queryParameters = {
          access_token: FB_ACCESS_TOKEN,
          format: 'json',
          limit: 25,
        };

        // adds an "after" param to the url
        if (next) {
          queryParameters.after = next;
        }

        Request.get(FB_RATINGS_URL).query(queryParameters).then((response) => {
            console.log(response);
            this.setState({
                // store all the ratings
                ratings: response.body.data,
                // store the cursor to the next load of ratings
                after: response.body.paging.cursors.after
            });
        });
    }

    nextPage() {
        browserHistory.push("/?url=" + this.state.next);
    }

    render() {
        // this will loop on the ratings
        var ratings = this.state.ratings.map((rating) => <Rating ratingData={rating} key={rating.created_time} />);
        return (
            <div className="container">
                <Link to={"/"}>
                    <h1>Trusk Facebook Reviews</h1>
                </Link>
                <hr />
                <br />
                <div className="row">
                    {ratings}
                </div>
                <div className="text-center">
                    <Link to={"/" + this.state.after}>
                        <FlatButton label="Next"/>
                    </Link>
                </div>
            </div>
        )
    };
}
