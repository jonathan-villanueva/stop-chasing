import React from 'react';

class Info extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ticker: '',
            isSubmitted: false,
            price: 0,
            percentChange: 0,
            name: '',
            monthlyAvg: 0
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({
            ticker: this.element.value,
            isSubmitted: true
        })
        this.updatePrice(this.element.value);
    }

    updatePrice(ticker) {
        let API_URL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + ticker.toUpperCase() + "&apikey=" + process.env.REACT_APP_ALPHA_KEY
        fetch(API_URL)
        .then(response => response.json())
        .then((jsonData) => {
            // jsonData is parsed json object received from url
            let percent = jsonData["Global Quote"]["10. change percent"]
            percent = percent.substring(0, percent.length - 1)
            percent = parseFloat(percent)

            this.setState({
                price: jsonData["Global Quote"]["05. price"],
                percentChange: percent
            })
            
        })
        .catch((error) => {
            // handle your errors here
            console.error(error)
        })

        let API_URL_2 = "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=" + ticker.toUpperCase() + "&apikey=" + process.env.REACT_APP_ALPHA_KEY
        fetch(API_URL_2)
        .then(response => response.json())
        .then((jsonData) => {
            // jsonData is parsed json object received from url
            let lastRefreshed = jsonData["Meta Data"]["3. Last Refreshed"]
            let high = parseFloat(jsonData["Monthly Adjusted Time Series"][lastRefreshed]["2. high"])
            let low = parseFloat(jsonData["Monthly Adjusted Time Series"][lastRefreshed]["3. low"])
            let avg = (high + low) / 2

            this.setState({
                monthlyAvg: avg
            })
            
        })
        .catch((error) => {
            // handle your errors here
            console.error(error)
        })
    }

    render() {

        return (
            <div>
                <form className="AppForm" onSubmit={this.handleSubmit}>
                    <h3>Ticker Symbol: </h3>
                    <input type="text" ref={el => this.element = el} />
                    <input className="button" type="submit" />
                </form>

                {this.state.isSubmitted && <div className="StockInfo">
                    <h2>{this.state.ticker.toUpperCase()}: {this.state.name}</h2>
                    {this.state.isSubmitted && this.state.ticker && <h3>Current price: ${this.state.price}</h3>}
                    {this.state.isSubmitted &&  <h3>Monthly average price: ${this.state.monthlyAvg}</h3>}
                    {this.state.isSubmitted && <h3 style={{color: this.state.percentChange < 0 ? '#ff3b3b' : '#66ff00'}}>The stock moved {this.state.percentChange}% since the previous trading day.</h3>}
                    
                    {this.state.isSubmitted && this.state.price > this.state.monthlyAvg ? <h3>You might be chasing</h3> : <h3> This could be a good buy opportunity</h3>}
                </div>
                }
            </div>
        )
    }
}

export default Info