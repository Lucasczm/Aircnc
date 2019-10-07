import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Login from './pages/Login';
import Register from './pages/Register';
import RecoverPassword from './pages/RecoverPassword';
import List from './pages/List';
import Book from './pages/Book';
import Bookings from './pages/Bookings';

const Routes = createAppContainer(
  createSwitchNavigator({
    Login,
    Register,
    RecoverPassword,
    List,
    Book,
    Bookings,
  }),
);

export default Routes;
