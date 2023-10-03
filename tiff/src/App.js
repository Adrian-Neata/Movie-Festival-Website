import HeaderMenu from './components/HeaderMenu.js'
import Footer from './components/Footer.js'
import Footer2 from './components/Footer2.js'
import ImageSlideshow from './components/ImageSlideshow.js'
import SignInMenu from './components/SignInMenu.js'
import SignUpMenu from './components/SignUpMenu.js'
import ProfilePage from './components/ProfilePage.js'
import MoviesPage from './components/MoviesPage.js'
import SchedulePage from './components/SchedulePage.js'
import TicketsPage from './components/TicketsPage.js'
import SingleMoviePage from './components/SingleMoviePage.js'
import SingleVenuePage from './components/SingleVenuePage.js'
import SingleThreadPage from './components/SingleThreadPage.js'
import ConfirmEmailPage from './components/ConfirmEmailPage.js'
import EmailConfirmedPage from './components/EmailConfirmedPage.js'
import Forum from './components/Forum.js'
import NotFound from './components/NotFound.js'
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import React from 'react';

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false)

  React.useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      setLoggedIn(true)
    }
  }, [0])

  return (
    <SnackbarProvider maxSnack={3}>
    <Router>
    <HeaderMenu/>
    <Switch>
      <Route exact path="/">
        <ImageSlideshow/>
        <Footer/>
      </Route>

      <Route exact path="/ro">
        <ImageSlideshow/>
        <Footer/>
      </Route>

      <Route exact path="/de">
        <ImageSlideshow/>
        <Footer/>
      </Route>

      <Route exact path="/confirm">
        <ImageSlideshow style={{position: 'relative'}}/>
        <ConfirmEmailPage style={{position: 'absolute'}}/>
        <Footer/>
      </Route>

      <Route path="/confirm/:confirm_id" children={<EmailConfirmedPage/>}/>

      <Route path="/movies/:movie_id" children={<SingleMoviePage/>}/>

      <Route path="/venues/:venue_id" children={<SingleVenuePage/>}/>

      <Route path="/movies">
        <MoviesPage/>
        <Footer2/>
      </Route>

      <Route path="/profile">
        {!loggedIn ? (<><Redirect to="/login"/></>) : (<><ProfilePage setLoggedIn={setLoggedIn}/><Footer2/></>)}
      </Route>

      <Route path="/schedule">
        <SchedulePage/>
        <Footer2/>
      </Route>

      <Route path="/tickets">
        <TicketsPage/>
        <Footer/>
      </Route>

      <Route path="/forum/:thread_id" children={<SingleThreadPage/>}/>
      
      <Route path="/forum">
        <Forum/>
        <Footer/>
      </Route>

      <Route path="/login">
        {!loggedIn ? (<><ImageSlideshow style={{position: 'relative'}}/><SignInMenu setLoggedIn={setLoggedIn} style={{position: 'absolute'}}/><Footer/></>) : (<><Redirect to="/profile"/></>)}
      </Route>

      <Route path="/register">
        {!loggedIn ? (<><ImageSlideshow style={{position: 'relative'}}/><SignUpMenu style={{position: 'absolute'}}/><Footer/></>) : (<><Redirect to="/profile"/></>)}
      </Route>

      <Route component={NotFound} />

    </Switch>

    </Router>
    </SnackbarProvider>
  );
}

export default App;
