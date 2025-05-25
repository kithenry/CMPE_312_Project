
export const loadPage = (path) => {
    const app = document.getElementById('app');
    let page = '';
    switch (path) {
        case '/login':
		page = '/login';
		break;
	case '/register':
		page = '/registration';
		break;
	case '/logout':
		page = '/logout';
		break;
	case '/registration':
		page = '/registration';
		break;
	case '/profile':
		page = '/profile';
		break;
	case '/transactions':
		page = '/transactions';
		break;
	case '/transaction-create':
		page = '/transaction-create';
		break;
	case '/search':
		page = '/search';
		break;
	case '/chat':
		page = '/chat';
		break;
	case '/book-add':
		page = '/book-add';
		break;
	case '/book-view':
		page = '/book-view';
		break;
	case '/active-transactions':
		page = '/active-transactions';
		break;
	case '/about':
		page = '/about';
		break;
	case '/toc':
		page = '/toc';
		break;
	case '/tos':
		page = '/tos';
		break;
	default:
		page = '/home';
	
    }

    //if (path === '/login') page = 'login';
    //else if (path === '/register') page = 'registration';
    //else if (path === '/logout') page = 'logout';
    import(/* @vite-ignore */`./${page}.js`).then(module => {
        app.innerHTML = '';
        if (typeof module.default === 'function') {
            module.default(app);
        } else {
            app.innerHTML = '<div>Error: Invalid page module</div>';
        }
    }).catch(err => {
        console.error('Page load error:', err);
        app.innerHTML = `<div>Error: Page not found ${err}</div>`;
    });
};
