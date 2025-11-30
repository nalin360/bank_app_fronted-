import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuthHook';
import { use } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    console.log(user);
    
    return (
        <div className="navbar bg-primary text-primary-content shadow-lg sticky top-0 z-50">


            <div className="flex-1">
                <Link to={user ? "/dashboard" : "/"} className="btn btn-ghost text-xl">
                    🏦 Digital Bank
                </Link>
            </div>


            <div className="flex-none">
                {user ? (

                    <ul className="menu menu-horizontal px-1">
                        {user.isAdmin && (
                        <li>
                            <Link to="/admin/dashboard" className="text-warning font-bold">
                                🛡️ Admin Dashboard
                            </Link>
                        </li>
                    )}
                        <li>
                            <Link to="/dashboard">Dashboard</Link>
                        </li>
                        <li tabIndex={0}>
                            <details>
                                <summary>Banking</summary>
                                <ul className="p-2 bg-base-100 text-base-content rounded-t-none z-50">
                                    <li><Link to="/transactions">Deposit/Withdraw</Link></li>
                                    <li><Link to="/transfer">Transfer Funds</Link></li>  
                                    <li><Link to="/account/new">New Account</Link></li>
                                </ul>
                            </details>
                        </li>
                        <li><Link to="/profile">Profile</Link></li> 
                        <li className="ml-2">
                            <button onClick={logout} className="btn btn-warning btn-sm">
                                Logout
                            </button>
                        </li>
                    </ul>
                ) : (

                    <ul className="menu menu-horizontal px-1">
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Navbar;