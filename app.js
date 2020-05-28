const { Component } = React
const { render } = ReactDOM
const { Switch, Link, Route, HashRouter, Redirect } = ReactRouterDOM
const URL_companies = "https://acme-users-api-rev.herokuapp.com/api/companies"

class Nav extends Component {
	render() {
		return (
			<nav>
				<Link to={'/Home'}>Acme Company Profits with React Route</Link>
				<Link to={'/Companies/'}>Companies {this.props.companies.length}</Link>
			</nav>
		)
	}
}




class Home extends Component {
	render() {
		return (
			<h1>
				Welcome!!
			</h1>
		)
	}

}

class Companies extends Component {
	state = {
		profits: []
	}
	componentDidUpdate(prevProps) {
		const newID = this.props.match.params.id
		const prevID = prevProps.match.params.id
		if (newID == prevID) {
			return
		}
		else {
			const profitsURL = `https://acme-users-api-rev.herokuapp.com/api/companies/${newID}/companyProfits`
			axios.get(profitsURL)
				.then(res => {
					const profits = res.data
					this.setState({ profits })
				})
		}
	}
	render() {
		console.log(this.state.profits)
		return (
			<div>
				<ul>
					{this.props.companies.map((currV, index) => { return <li key={currV.id} > <Link to={`/Companies/${currV.id}`}> {currV.name}</Link></li> })}
				</ul>
				<ul>
					{this.state.profits.map((currV, index) => { return <li key={currV.id}>{currV.amount}</li> })}
				</ul>
			</div>
		)

	}
}

class Profits extends Component {

}

class App extends Component {
	state = {
		companies: []
	}
	componentDidMount() {
		axios.get(URL_companies)
			.then(res => {
				this.setState({ companies: res.data })
			})
	}
	render() {
		const { companies } = this.state
		return (
			<HashRouter>
				<Route
					render={() => <Nav companies={companies} />}
				/>
				<Switch>
					<Route
						path={'/'}
						exact
						component={Home}
					/>
					<Route
						path={'/Companies/:id?'}
						render={(props) => <Companies companies={companies} {...props} />}
					/>
					<Redirect to={'/'} />
				</Switch>
			</HashRouter>
		)
	}
}


const root = document.querySelector("#root")
render(<App />, root)
