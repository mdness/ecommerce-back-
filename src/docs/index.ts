import basicInfo from './mainInfo';
import components from './components';
import products from './products';
import servers from './server';
import tags from './tags';
import login from './login';
import cart from './cart';
import users from './users';
import orders from './orders';
import chat from './chat';
import info from './info';

export default {
  ...basicInfo,
  ...servers,
  ...tags,
  ...components,
  paths: {
    ...products,
    ...cart,
    ...login,
    ...users,
    ...orders,
    ...chat,
    ...info,
  },
};
