import '../stylesheets/HeaderMenu.scss'
import clapperboard from "../resources/clapperboard.svg";
import calendar from "../resources/calendar.svg";
import tickets from "../resources/tickets.svg";
import profile from "../resources/profile.svg";
import store from "../resources/store.svg";
import cart from "../resources/cart.svg";
import magnifier from "../resources/magnifier.svg";
import downarrow from "../resources/down-arrow.svg";
import list from "../resources/list.svg";
import tiff_logo from "../resources/tiff_menu.svg";
import { Link } from 'react-router-dom';

const HeaderMenu = () => {

    const dropdownMenu = (
        <ul className="column-links">
            <li><p>Festival</p>
                <ul>
                    <li><Link to="/about-tiff">About TIFF</Link></li>
                    <li><Link to="/about-cluj">About Cluj-Napoca</Link></li>
                    <li><Link to="/official-app">TIFF Official App</Link></li>
                    <li><Link to="/team">Team</Link></li>
                    <li><Link to="/forum">Forum</Link></li>
                </ul>
            </li>
            <li><p>Tiff Unlimited</p>
                <ul>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/subscriptions">Subscriptions</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>
            </li>
            <li><p>Press</p>
                <ul>
                    <li><Link to="/press">Press Releases</Link></li>
                    <li><Link to="/gallery">Gallery</Link></li>
                    <li><Link to="/accreditations">Accreditations</Link></li>
                    <li><Link to="/annual-report">Annual Report</Link></li>
                </ul>
            </li>
        </ul>
        )

    return (
            <nav className="navbar">
                <div className="logo">
                    <Link to="/">
                        <img alt="tiff_logo" className="tiff_logo" src={tiff_logo}/>
                    </Link>
                </div>
                <div className="date-location">
                    <div>23-JUL    01-AUG</div>
                    <div>Cluj-Napoca 2021</div>
                </div>
                <a href="#" className="toggle-button">
                    <img alt="list" className="list" src={list}/>
                </a>
                {dropdownMenu}
                <div className="navbar-links">
                    <ul>
                        <li><Link to="/movies"><div className="link-title">Movies</div>
                        <img alt="clapperboard" className="navIcons" src={clapperboard}/>
                        </Link></li>
                        <li><div className="hr-line"></div></li>
                        <li><Link to="/schedule"><div className="link-title">Schedule</div>
                        <img alt="calendar" className="navIcons" src={calendar}/>
                        </Link></li>
                        <li><div className="hr-line"></div></li>
                        <li><Link to="/tickets"><div className="link-title">Tickets</div>
                        <img alt="tickets" className="navIcons" src={tickets}/>
                        </Link></li>
                        <li><div className="hr-line"></div></li>
                        <li><Link to="/profile"><div className="link-title">Profile</div>
                        <img alt="profile" className="navIcons" src={profile}/>
                        </Link></li>
                        <li><div className="hr-line"></div></li>
                        <li><Link to="/shop"><div className="link-title">Shop</div>
                        <img alt="store" className="navIcons" src={store}/>
                        </Link></li>
                        <li><div className="hr-line"></div></li>
                        <li><Link to="/cart">
                        <img alt="cart" className="navIcons" src={cart}/>
                        </Link></li>
                        <li><a href="#">
                        <img alt="magnifier" className="navIcons" src={magnifier}/>
                        </a></li>
                        <li><a> 
                        <span className="link-title">EN</span>
                        <img alt="downarrow" className="navIcons" src={downarrow}/>
                        </a>
                        </li>
                        <ul className="dropdown-language">
                            <li><Link to="/ro"><span className="link-title">RO</span><img alt="downarrow" className="navIcons" id="navIconsInvisible" src={downarrow}/></Link></li>
                            <li><Link to="/de"><span className="link-title">DE</span><img alt="downarrow" className="navIcons" id="navIconsInvisible" src={downarrow}/></Link></li>
                        </ul>
                        <li><a href="#">
                        <img alt="list" className="list" src={list}/>
                        </a></li>
                        {dropdownMenu}
                    </ul>
                </div>
            </nav>
    )
}

export default HeaderMenu